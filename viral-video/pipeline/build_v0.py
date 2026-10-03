"""Borrador v0 (dirección A sobre footage de VIDEO_1). Sirve de preview antes del guion final."""
import math
import random
import sys
from pathlib import Path

from PIL import Image

import audio
from engine import W, H, FPS, ROOT, load, paste, text, punch, crunch, render
from footage import Footage, Seg
from props import ig_watermark

HANDLE = "@brizamaldonado"
BEAT = 60 / 123
SRC_IN = 7.2            # recorte de intro: drop fuente 15,0 → salida 7,8
DUR = 35.1
DROP = 15.0 - SRC_IN

fx = Footage([Seg(SRC_IN, SRC_IN + DUR)])
STICKERS = ["corazon-vegan-v1", "frutilla", "gallo", "mariposa-daga", "chancho-y-vaca", "pajaro-flores",
            "corazon-vegan-v2", "flor-alambre-puas", "vaca-vive-y-deja-vivir", "flor-hojas"]
FACE = (540, 930)  # zona aprox. de la cara de la señora en 1080x1920

rnd = random.Random(14)


def spot():
    # posiciones que evitan tapar la cara (ventana 360x300 alrededor de FACE)
    while True:
        x, y = rnd.randint(80, 1000), rnd.randint(300, 1650)
        if abs(x - FACE[0]) > 230 or abs(y - FACE[1]) > 200:
            return x, y


# Tandas de producto: (t_entrada, t_salida or None, [piezas])
pieces = []
def burst(t, n, life=None, pool=None, scale=(0.35, 0.6)):
    for _ in range(n):
        name = rnd.choice(pool or STICKERS)
        x, y = spot()
        pieces.append(dict(t0=t, t1=(t + life) if life else None, name=name, x=x, y=y,
                           s=rnd.uniform(*scale), r=rnd.uniform(-15, 15)))

burst(8 * BEAT, 4, life=2 * BEAT, pool=["corazon-vegan-v1", "corazon-vegan-v2"])
burst(DROP, 6, life=2 * BEAT)
for k, pool in enumerate([["frutilla"], ["gallo"], ["mariposa-daga"], ["chancho-y-vaca"]]):
    burst(DROP + (k + 1) * 2 * BEAT, 3, life=2 * BEAT, pool=pool)
t = DROP + 16 * BEAT
while t < 23.4:
    burst(t, 1, life=None)
    t += 2 * BEAT
while t < 31.2:
    burst(t, 1, life=None, scale=(0.4, 0.75))
    t += BEAT
# hojas enteras de flash en la saturación
for i, t_ in enumerate([25.37, 27.32]):
    pieces.append(dict(t0=t_, t1=None, name=f"../originales/hoja_{i + 1}", x=[250, 830][i], y=[520, 1450][i],
                       s=0.33, r=[-9, 7][i], sheet=True))

TEXTS = [  # (t0, t1, texto, y, size, color, alpha)
    (0.0, 3.9, "¿querés tatuarte una vaca?", 560, 120, (0, 0, 0, 255), 1),
    (5.85, 7.8, "tradicional vegano", 520, 110, (255, 255, 255, 255), 0.6),
    (11.71, 15.6, "turnos por MD", 520, 140, (0, 0, 0, 255), 1),
    (17.56, 19.5, "zona: bs as (consultar)", 640, 90, (255, 255, 255, 255), 0.3),
    (19.51, 23.4, "no hacemos envíos (es un tatuaje)", 520, 110, (0, 0, 0, 255), 1),
    (25.37, 29.2, "3 cuotas sin interés en la vaca", 560, 120, (0, 0, 0, 255), 1),
    (29.27, 31.2, "seña por alias", 560, 140, (0, 0, 0, 255), 1),
]

WM = ig_watermark(HANDLE, 30)


def sprite(p):
    if p.get("sheet"):
        return load("originales/" + p["name"].split("/")[-1] + ".jpg", width=int(1284 * p["s"]))
    return load(f"stickers/{p['name']}.png", height=int(600 * p["s"]))


def frame(t):
    c = fx.frame(t)
    end = t >= 31.22
    for p in pieces:
        if p["t0"] <= t and (p["t1"] is None or t < p["t1"]):
            paste(c, sprite(p), p["x"], p["y"], rot=p["r"])
    for t0, t1, s, y, size, col, a in TEXTS:
        if t0 <= t < t1:
            text(c, s, W / 2, y, size, "sans-bold", fill=col, squeeze=0.8, max_w=880, alpha=a)
    if not end:
        wx, wy = (660, 300) if not (15.61 <= t < 19.51) else (70, 1000)
        c.alpha_composite(WM, (wx, wy))
    if DROP <= t < DROP + 2 / FPS:
        c = punch(c, 1.15, 540, 1000)
    if end:
        dark = Image.new("RGBA", (W, H), (0, 0, 0, 150))
        c.alpha_composite(dark)
        big = ig_watermark(HANDLE, 64)
        c.alpha_composite(big, ((W - big.width) // 2, 900))
    return c


def post(img, t):
    return crunch(img, 45)


if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "viral-video/build/v0.mp4")
    out.parent.mkdir(parents=True, exist_ok=True)
    wav = out.with_suffix(".wav")
    audio.write_wav(wav, audio.mix(DUR, DROP, [], base=fx.audio()))
    render(frame, DUR, wav, out, post=post)
    print(out)
