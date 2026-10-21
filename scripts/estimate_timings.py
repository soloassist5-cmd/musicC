"""Rough timings WITHOUT audio: pace words by syllable count. Not synced to any real recording.

Usage: TRACK=right-now python scripts/estimate_timings.py [--sps 5.5] [--line-gap 0.3]
Replace with real timings later:  python scripts/align.py  (needs input/demo.mp3)
"""
import argparse, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from align import BASE, INP, parse_lyrics  # noqa: E402

VOWELS = re.compile(r"[аеёиоуыэюяaeiouy]", re.I)


def syllables(w):
    return max(1, len(VOWELS.findall(w)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sps", type=float, default=5.5, help="syllables per second of the main vocal")
    ap.add_argument("--line-gap", type=float, default=0.3, help="pause between lines, s")
    ap.add_argument("--start", type=float, default=0.5, help="first word, s")
    args = ap.parse_args()

    _, tokens = parse_lyrics(INP / "lyrics.txt")
    t, line, depth = args.start, 0, 0
    out = []
    for tk in tokens:
        if tk["line"] != line:
            t += args.line_gap
            line, depth = tk["line"], 0
        adlib = depth > 0 or "(" in tk["text"]
        depth += tk["text"].count("(") - tk["text"].count(")")
        dur = 0.22 if adlib else sum(syllables(w) for w in tk["words"]) / args.sps
        out.append({"text": tk["text"], "line": tk["line"], "mark": tk["mark"],
                    "start": round(t, 3), "end": round(t + dur, 3), "estimated": True})
        t += dur
    (BASE / "timings.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    total = t + 1.5
    (BASE / "audio.json").write_text(json.dumps({"bpm": 0, "duration": round(total, 3), "rms60": [0.5] * int(total * 60 + 60)}), encoding="utf-8")
    print(f"{len(out)} words, last ends at {t:.2f}s (ESTIMATED, no audio)")


if __name__ == "__main__":
    main()
