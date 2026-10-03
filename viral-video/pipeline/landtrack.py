"""Tracking de puntos fijos del paisaje (bloque, velero, horizonte) por template matching secuencial.
Uso: track_point(src_frame_start, (x, y) en coords 1080x1920, frames) → {idx: (x, y)}"""
import numpy as np
from PIL import Image
from engine import ROOT

FR = ROOT / "work" / "frames1"
SX = 1080 / 576


def gray(idx):
    return np.asarray(Image.open(FR / f"{idx:05d}.jpg").convert("L"), dtype=np.float32)


def track_point(start, xy, end, patch=24, search=14):
    x, y = xy[0] / SX, xy[1] / SX
    ref = gray(start)
    tpl = ref[int(y) - patch:int(y) + patch, int(x) - patch:int(x) + patch]
    out = {start: (xy[0], xy[1])}
    step = 1 if end >= start else -1
    for i in range(start + step, end + step, step):
        g = gray(i)
        best, bxy = -1e9, (x, y)
        t = (tpl - tpl.mean()) / (tpl.std() + 1e-6)
        for dy in range(-search, search + 1, 2):
            for dx in range(-search, search + 1, 2):
                cy, cx = int(y + dy), int(x + dx)
                win = g[cy - patch:cy + patch, cx - patch:cx + patch]
                if win.shape != tpl.shape:
                    continue
                s = np.sum(t * (win - win.mean()) / (win.std() + 1e-6))
                if s > best:
                    best, bxy = s, (cx, cy)
        x, y = bxy
        tpl = 0.9 * tpl + 0.1 * g[int(y) - patch:int(y) + patch, int(x) - patch:int(x) + patch]  # adaptación lenta
        out[i] = (x * SX, y * SX)
    return out
