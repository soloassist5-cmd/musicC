"""Word-level forced alignment of input/lyrics.txt to input/demo.mp3.

  1. Demucs isolates the vocals (the beat makes aligners drift late).
  2. torchaudio MMS_FA (CTC) aligns the known text -> primary timings.
  3. stable-ts (whisper) aligns the same text -> cross-check only.
  4. Writes timings.json, audio.json (BPM + 60 fps RMS) and build/suspicious.txt.

Usage:  python scripts/align.py [--model medium]
"""
import argparse, json, re, subprocess, sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
INP = ROOT / "input"
BUILD = ROOT / "build"

TR = dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
              ["a", "b", "v", "g", "d", "e", "yo", "zh", "z", "i", "y", "k", "l", "m", "n", "o", "p", "r", "s", "t",
               "u", "f", "h", "ts", "ch", "sh", "shch", "", "y", "", "e", "yu", "ya"]))


def parse_lyrics(path):
    """Tokens in order: {text, line, mark, words:[plain words]}; a token is one on-screen unit."""
    lines = [l.strip() for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]
    tokens = []
    for li, line in enumerate(lines):
        for raw in line.split():
            mark, t = "normal", raw
            if re.search(r"\*[^*]+\*", t):
                mark, t = "accent", t.replace("*", "")
            if re.match(r"^[«\"(]*#", t):
                mark, t = "wall", t.replace("#", "")
            parts = t.split("_")
            if len(parts) > 1 and mark == "normal":
                mark = "pair"
            plain = [p for p in (re.sub(r"[^\w\-ёЁ]", "", p) for p in parts) if p]
            if not plain:  # pure punctuation like "—"
                continue
            tokens.append({"text": " ".join(parts), "line": li, "mark": mark, "words": plain})
    return lines, tokens


def roman(w):
    return "".join(TR.get(c, c if c.isascii() and c.isalpha() else "") for c in w.lower()) or "a"


def separate(audio):
    sep = BUILD / "sep"
    voc = sep / "htdemucs" / audio.stem / "vocals.wav"
    if not voc.exists() or voc.stat().st_mtime < audio.stat().st_mtime:
        subprocess.run([sys.executable, "-m", "demucs", "--two-stems", "vocals", "-n", "htdemucs",
                        "-o", str(sep), str(audio)], check=True)
    return voc


def align_ctc(voc, tokens):
    import soundfile as sf
    import torch, torchaudio
    data, sr = sf.read(str(voc), dtype="float32", always_2d=True)
    wav = torchaudio.functional.resample(torch.from_numpy(data.T).mean(0, keepdim=True), sr, 16000)
    bundle = torchaudio.pipelines.MMS_FA
    model = bundle.get_model(with_star=False)
    words = [roman(w) for t in tokens for w in t["words"]]
    with torch.inference_mode():
        emission, _ = model(wav)
    spans = bundle.get_aligner()(emission[0], bundle.get_tokenizer()(words))
    ratio = wav.shape[1] / emission.shape[1] / 16000
    out, k = [], 0
    for t in tokens:
        ss = spans[k:k + len(t["words"])]
        k += len(t["words"])
        score = min(sum(s.score * len(s) for s in sp) / sum(len(s) for s in sp) for sp in ss)
        out.append((ss[0][0].start * ratio, ss[-1][-1].end * ratio, float(score)))
    return out


def align_stablets(voc, tokens, model_name):
    import stable_whisper
    model = stable_whisper.load_model(model_name, device="cpu")
    flat = [w for t in tokens for w in t["words"]]
    res = model.align(str(voc), " ".join(flat), language="ru", original_split=False)
    aw = res.all_words()
    out, k = [], 0
    for t in tokens:
        ws = aw[k:k + len(t["words"])] or aw[-1:]
        k += len(t["words"])
        out.append((float(ws[0].start), float(ws[-1].end)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="medium", help="whisper model for the stable-ts cross-check")
    args = ap.parse_args()

    audio, lyr = INP / "demo.mp3", INP / "lyrics.txt"
    for f in (audio, lyr):
        if not f.exists():
            sys.exit(f"missing {f}")
    BUILD.mkdir(exist_ok=True)

    lines, tokens = parse_lyrics(lyr)
    voc = separate(audio)
    ctc = align_ctc(voc, tokens)
    st = align_stablets(voc, tokens, args.model)

    import librosa
    y, sr = librosa.load(str(voc), sr=22050)
    onsets = librosa.onset.onset_detect(y=y, sr=sr, units="time", backtrack=True)

    out, sus = [], []
    for k, (t, (s, e, score), (s2, _)) in enumerate(zip(tokens, ctc, st)):
        nxt = ctc[k + 1][0] if k + 1 < len(ctc) else e + 1
        e = max(e, min(s + 0.12, nxt))  # no zero-length words
        out.append({"text": t["text"], "line": t["line"], "mark": t["mark"],
                    "start": round(s, 3), "end": round(e, 3), "score": round(score, 3),
                    "stablets_start": round(s2, 3)})
        why = []
        if abs(s - s2) > 0.15:
            why.append(f"aligners disagree: ctc {s:.2f} vs stable-ts {s2:.2f}")
        if score < 0.03:
            why.append(f"low CTC score {score:.2f}")
        near = onsets[np.argmin(abs(onsets - s))] if len(onsets) else s
        if abs(near - s) > 0.12:
            why.append(f"no vocal onset nearby (closest {near:.2f})")
        if e - s > 1.0:
            why.append(f"stretched {e - s:.2f}s")
        if k and s < out[k - 1]["start"]:
            why.append("starts before previous word")
        if len(why) >= 2 or any(w.startswith(("aligners", "starts", "stretched")) for w in why):
            sus.append(f"#{k:02d} line {t['line'] + 1} {s:6.2f}s  {t['text']}: " + "; ".join(why))

    (ROOT / "timings.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    (BUILD / "suspicious.txt").write_text("\n".join(sus) + "\n", encoding="utf-8")
    print("\n".join(sus) or "no suspicious words")

    # BPM + per-frame RMS (60 fps) of the full mix
    y, sr = librosa.load(str(audio), sr=22050, mono=True)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    hop = sr // 60
    rms = librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0]
    rms = rms / (np.percentile(rms, 98) + 1e-9)
    (ROOT / "audio.json").write_text(json.dumps({
        "bpm": int(round(float(np.atleast_1d(tempo)[0]))), "duration": round(len(y) / sr, 3),
        "rms60": [round(float(min(v, 1.0)), 3) for v in rms],
    }), encoding="utf-8")
    print("BPM", round(float(np.atleast_1d(tempo)[0])))


if __name__ == "__main__":
    main()
