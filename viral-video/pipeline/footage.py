"""Capa de footage: VIDEO_1 como base, con lista de edición (EDL) compartida por imagen y audio.

EDL = [Seg(src_in, src_out, speed=1.0, freeze=None), ...]
- freeze=s  → congela el frame src_in durante s segundos (audio: silencio o lo que pida el mix).
Los tiempos de salida se calculan concatenando segmentos.
"""
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
import subprocess
import wave

import numpy as np
from PIL import Image

from engine import ROOT, W, H

SRC_FPS = 30
FRAMES = ROOT / "work" / "frames1"
SRC_VIDEO = ROOT / "work" / "video1.mp4"
SR = 44100


def ensure_frames():
    if not FRAMES.exists() or not any(FRAMES.iterdir()):
        FRAMES.mkdir(parents=True, exist_ok=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC_VIDEO), "-q:v", "2", str(FRAMES / "%05d.jpg")], check=True)


@dataclass
class Seg:
    src_in: float
    src_out: float = None
    speed: float = 1.0
    freeze: float = None  # duración del freeze (usa src_in)
    mute: bool = False

    @property
    def dur(self):
        return self.freeze if self.freeze is not None else (self.src_out - self.src_in) / self.speed


@lru_cache(maxsize=96)
def src_frame(idx):
    idx = max(1, min(idx, 1809))
    im = Image.open(FRAMES / f"{idx:05d}.jpg").convert("RGB")
    return im.resize((W, H), Image.BICUBIC).convert("RGBA")


class Footage:
    def __init__(self, edl):
        ensure_frames()
        self.edl = edl
        self.starts = np.cumsum([0] + [s.dur for s in edl])
        self.duration = float(self.starts[-1])

    def locate(self, t):
        """t de salida → (segmento, tiempo de fuente)."""
        i = int(np.searchsorted(self.starts, t, side="right") - 1)
        i = max(0, min(i, len(self.edl) - 1))
        seg = self.edl[i]
        local = t - self.starts[i]
        src_t = seg.src_in if seg.freeze is not None else seg.src_in + local * seg.speed
        return seg, src_t

    def src_time(self, t):
        return self.locate(t)[1]

    def frame(self, t):
        return src_frame(int(self.src_time(t) * SRC_FPS) + 1).copy()

    def audio(self):
        """Pista original re-editada según la EDL."""
        with wave.open(str(ROOT / "work" / "video1_audio.wav")) as w:
            sr, ch = w.getframerate(), w.getnchannels()
            x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        x = x.reshape(-1, ch).mean(1)
        if sr != SR:
            x = np.interp(np.arange(0, len(x), sr / SR), np.arange(len(x)), x)
        out = []
        for s in self.edl:
            n = int(round(s.dur * SR))
            if s.freeze is not None or s.mute:
                out.append(np.zeros(n, np.float32))
                continue
            a, b = int(s.src_in * SR), int(s.src_out * SR)
            seg = x[a:b]
            if s.speed != 1:
                seg = np.interp(np.linspace(0, len(seg) - 1, n), np.arange(len(seg)), seg)
            seg = seg[:n]
            if len(seg) < n:
                seg = np.pad(seg, (0, n - len(seg)))
            # micro fades para evitar clicks en cortes
            f = min(220, n // 2)
            if f:
                seg = seg.copy()
                seg[:f] *= np.linspace(0, 1, f)
                seg[-f:] *= np.linspace(1, 0, f)
            out.append(seg.astype(np.float32))
        return np.concatenate(out)
