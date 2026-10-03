"""Tracking de la señora en VIDEO_1: segmenta el saco rojo y estima cabeza/cuerpo por frame.
Salida: viral-video/build/track.json  {frame_idx: [x0, y0, x1, y1]} en coords 1080x1920 (cabeza a pies)."""
import json
import numpy as np
from PIL import Image
from engine import ROOT

FR = ROOT / "work" / "frames1"
OUT = ROOT / "viral-video" / "build" / "track.json"


def box(idx):
    im = np.asarray(Image.open(FR / f"{idx:05d}.jpg").convert("RGB")).astype(int)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    red = (r > 150) & (r - g > 80) & (r - b > 40)
    ys, xs = np.nonzero(red)
    if len(xs) < 200:
        return None
    # recorte robusto (percentiles) para ignorar zapatos/ruido
    x0, x1 = np.percentile(xs, [2, 98]); y0, y1 = np.percentile(ys, [2, 90])
    h = y1 - y0
    head_top = y0 - 0.55 * h          # cabeza arriba del saco
    feet = y1 + 1.3 * h               # piernas y tacos
    sx, sy = 1080 / im.shape[1], 1920 / im.shape[0]
    pad = 0.15 * (x1 - x0)
    return [int((x0 - pad) * sx), int(head_top * sy), int((x1 + pad) * sx), int(min(feet, im.shape[0]) * sy)]


if __name__ == "__main__":
    n = len(list(FR.glob("*.jpg")))
    data, last = {}, None
    for i in range(1, n + 1):
        b = box(i) or last
        data[i] = b
        last = b
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data))
    print(n, data[1], data[600], data[1500])
