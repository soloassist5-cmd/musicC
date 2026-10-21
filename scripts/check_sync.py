"""Find the frame where each checked word appears in output/perestan_silent.mp4 and compare to timings.

Usage: python scripts/check_sync.py [word_index ...]
"""
import json, subprocess, sys
from pathlib import Path

import numpy as np

import os

ROOT = Path(__file__).resolve().parent.parent
TRACK = os.environ.get("TRACK", "")
OUT = ROOT / "output" / TRACK if TRACK else ROOT / "output"
CFG = json.loads(((ROOT / "tracks" / TRACK if TRACK else ROOT) / "config.json").read_text(encoding="utf-8"))
VIDEO = OUT / f"{CFG.get('slug', 'perestan')}_silent.mp4"
data = json.loads((ROOT / "src/generated/data.json").read_text(encoding="utf-8"))
fps = data["fps"]
idx = [int(a) for a in sys.argv[1:]] or [2, 18, 34, 47]

W, H = 270, 120  # word area only, downscaled
for i in idx:
    w = data["words"][i]
    f0 = round(w["start"] * fps)
    a, b = max(0, f0 - 6), f0 + 6
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a / fps:.4f}", "-i", str(VIDEO),
                          "-frames:v", str(b - a), "-vf", f"crop=1080:480:0:280,scale={W}:{H},format=gray",
                          "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(float)
    diff = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    seen = a + 1 + int(np.argmax(diff))
    print(f"#{i:02d} {w['text']:<12} expected frame {f0:4d} ({w['start'] + data['startTime']:.3f}s in track)  "
          f"appears at {seen:4d}  delta {seen - f0:+d} frames")
