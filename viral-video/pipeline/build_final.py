"""Render final: "agendá tu turnito" — versión Briza del trend (footage + audio originales intactos).

Implementa output/production/final-script.md (ver editing-notes.md para specs visuales).
Uso:
  python3 build_final.py                      → output/final/briza-viral-final.mp4
  python3 build_final.py --hook a|b|c OUT     → variantes de los primeros segundos
  python3 build_final.py --frames 0,10,22     → sólo exporta frames de control a viral-video/build/
"""
import argparse
import json
import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import audio
from engine import W, H, FPS, ROOT, font, load, paste, text, render, crunch
from footage import Footage, Seg
from fx import transfer, with_alpha
from props import IG_COLORS, ig_icon, watermark, arrow, pinterest_thumb

HANDLE = "@brizamaldonado"          # placeholder: confirmar handle real
SRC_OFF = 5.0                        # out = src − 5,0  (drop src 15,0 → out 10,0)
DUR = 53.80
BEAT = 60 / 123
DROP = 10.0
VIOLET = (107, 63, 160)
RED = (224, 16, 26, 255)
DESIGNS = ["mariposa-daga", "frutilla", "gallo", "pajaro-flores", "flor-alambre-puas"]

BUILD = ROOT / "viral-video" / "build"
TRACK = {int(k): v for k, v in json.load(open(BUILD / "track.json")).items()}
LAND = {n: {int(k): v for k, v in d.items()} for n, d in json.load(open(BUILD / "landtrack.json")).items()}

fx_footage = Footage([Seg(SRC_OFF, SRC_OFF + DUR)])


def b(n):
    """Tiempo del beat n contado desde el drop (n negativo = antes)."""
    return round(DROP + n * BEAT, 3)


def src_idx(t):
    return int((t + SRC_OFF) * 30) + 1


def box(t):
    return TRACK[min(max(src_idx(t), 1), 1809)]


def land(name, t):
    d = LAND[name]
    i = min(max(src_idx(t), min(d)), max(d))
    return d[i]


# ---------------------------------------------------------------- ghosts (stencils de calco violeta)
rnd = random.Random(2026)
GHOSTS = []


def forbidden(cx, cy, t):
    """Cara/torso: mitad superior del box, ampliado ×1,2."""
    x0, y0, x1, y1 = box(t)
    w, h = x1 - x0, y1 - y0
    mx, my = 0.1 * w, 0.1 * h
    return x0 - mx < cx < x1 + mx and y0 - my < cy < y0 + 0.5 * h + my


def ghost(t0, t1, name, cx=None, cy=None, h=None, rot=None, a=0.42, blink=None, region=None, mirror=False):
    if cx is None:
        for _ in range(200):
            x0, y0, x1, y1 = region or (60, 250, 1020, 1750)
            cx, cy = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
            if not any(forbidden(cx, cy, t0 + k * 0.5) for k in range(int((min(t1, t0 + 3) - t0) / 0.5) + 1)):
                break
    GHOSTS.append(dict(t0=t0, t1=t1, name=name, cx=cx, cy=cy, h=int(h or rnd.uniform(500, 900)),
                       rot=rot if rot is not None else rnd.uniform(-20, 20), a=a, blink=blink, mirror=mirror))


def ghost_on(g, t):
    if not (g["t0"] <= t < g["t1"]):
        return False
    if g["blink"]:
        per, duty = g["blink"]
        return ((t - g["t0"]) % per) < duty
    return True


# hook (0 – 1,71)
ghost(0, b(-17), "mariposa-daga", 560, 520, 900, -10, 0.45)
ghost(b(-19), b(-17), "frutilla", 850, 740, 480, 14, 0.40)
HOOK_FLICKER = (1.22, 1.46)
# pre-drop: acumulan mientras habla el chat
ghost(b(-13), b(-1), "gallo", 860, 430, 540, 8, 0.36, blink=(4 * BEAT, 2 * BEAT))
ghost(b(-9), b(-1), "pajaro-flores", 860, 800, 420, -6, 0.36)
ghost(b(-5), b(-1), "flor-alambre-puas", 900, 1540, 380, 0, 0.36)
# drop: ráfaga de 8 gigantes desde los bordes
for k, (n, cx, cy, h) in enumerate([("mariposa-daga", 180, 420, 1150), ("frutilla", 930, 330, 800),
                                    ("gallo", 120, 1350, 1250), ("pajaro-flores", 960, 1500, 1000),
                                    ("mariposa-daga", 900, 900, 950), ("frutilla", 160, 900, 700),
                                    ("flor-alambre-puas", 560, 1720, 900), ("pajaro-flores", 560, 260, 800)]):
    ghost(b(0) if k < 4 else b(0.5), b(2), n, cx, cy, h, rnd.uniform(-20, 20), rnd.uniform(0.40, 0.55))
# tandas A / B espejadas
for k, (n, cx, cy) in enumerate([("frutilla", 230, 580), ("gallo", 880, 560), ("pajaro-flores", 880, 1500)]):
    ghost(b(4), b(6), n, cx, cy, 620, -12 + 12 * k, 0.45)
for k, (n, cx, cy) in enumerate([("mariposa-daga", 850, 580), ("flor-alambre-puas", 200, 560), ("frutilla", 200, 1500)]):
    ghost(b(6), b(8), n, cx, cy, 620, 12 - 12 * k, 0.45)
ghost(b(8), b(12), "mariposa-daga", 230, 600, 640, -8, 0.40, blink=(2 * BEAT, 1.75 * BEAT))
ghost(b(8), b(12), "gallo", 880, 1450, 700, 10, 0.40, blink=(2 * BEAT, 1.75 * BEAT))
for k, (n, cx, cy) in enumerate([("pajaro-flores", 240, 520), ("flor-alambre-puas", 870, 1140), ("frutilla", 220, 1580)]):
    ghost(b(12 + k), b(16), n, cx, cy, 560, rnd.uniform(-15, 15), 0.40)
for k, (n, cx, cy) in enumerate([("gallo", 170, 700), ("gallo", 930, 700), ("mariposa-daga", 900, 1450)]):
    ghost(b(16), b(20), n, cx, cy, 700, rnd.uniform(-15, 15), 0.45, blink=(4 * BEAT, 2 * BEAT), mirror=(k == 1))
for k, h in enumerate([300, 650, 1100]):  # 'ya que estoy': la frutilla crece
    ghost(b(20 + 2 * k), b(24) if k == 2 else b(22 + 2 * k), "frutilla", 840, 640, h, -6, 0.42)
ghost(b(24), b(28), "pajaro-flores", 920, 360, 420, 6, 0.25)  # único ghost lejano durante el gag
for k in range(3):  # '3 cuotas': tres frutillas en cascada
    ghost(b(28 + k), b(32), "frutilla", 200, 520 + 430 * k, 420, -10 + 10 * k, 0.40)
# acumulación 1 por beat (25,61 – 39,27), máx 10 visibles
acc = []
for k in range(int((b(60) - b(32)) / BEAT)):
    t0 = b(32 + k)
    acc.append(t0)
    ghost(t0, b(60), DESIGNS[k % 5], h=rnd.uniform(480, 820), a=rnd.uniform(0.35, 0.50))
# el más viejo se apaga cuando hay > 10
alive = [g for g in GHOSTS if abs(g["t1"] - b(60)) < 1e-6 and g["t0"] >= b(32)]
for i, g in enumerate(alive):
    if i + 10 < len(alive):
        g["t1"] = alive[i + 10]["t0"]
ghost(b(48), b(52), "gallo", 260, 560, 620, -8, 0.50)
ghost(b(48), b(52), "gallo", 820, 560, 620, 8, 0.50, mirror=True)
# pico (41,22 – 45,12): 12 gigantes alternando por beat; limpieza 45,12 – 46,59
peak = []
for k in range(12):
    ghost(b(64), b(72), DESIGNS[k % 5], h=rnd.uniform(650, 1400), a=rnd.uniform(0.40, 0.55),
          blink=(2 * BEAT, BEAT) if k % 2 else None)
    peak.append(GHOSTS[-1])
for k, g in enumerate(peak):
    g["t1"] = b(72) + (k // 3) * BEAT  # 3 se apagan por beat


def ghost_layer(t):
    layer = None
    for g in GHOSTS:
        if g["t0"] <= t < g["t1"] and ghost_on(g, t):
            if 0 <= t < 1.71 and HOOK_FLICKER[0] <= t < HOOK_FLICKER[1]:
                continue
            if layer is None:
                layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            spr = transfer(g["name"], g["h"], VIOLET)
            if g["mirror"]:
                spr = spr.transpose(Image.FLIP_LEFT_RIGHT)
            paste(layer, with_alpha(spr, min(1, g["a"] + 0.12)), g["cx"], g["cy"], rot=g["rot"])
    if layer is None:
        return None
    # agujero suave en la cara: nunca se tapa
    x0, y0, x1, y1 = box(t)
    w, h = x1 - x0, y1 - y0
    m = Image.new("L", (W, H), 255)
    dm = ImageDraw.Draw(m)
    dm.rectangle([x0, y0 + 0.2 * h, x1, y0 + 0.55 * h], fill=150)       # torso: tope de alfa ≈0,3
    dm.ellipse([x0 + 0.05 * w, y0 - 0.04 * h, x1 - 0.05 * w, y0 + 0.26 * h], fill=0)  # cara: limpia
    m = m.filter(ImageFilter.GaussianBlur(30))
    a = np.asarray(layer.getchannel("A"), np.float32) * np.asarray(m, np.float32) / 255
    layer.putalpha(Image.fromarray(a.astype(np.uint8)))
    return layer


# ---------------------------------------------------------------- textos
LANE_Y = 540
TEXTS = [  # (t0, t1, texto)
    (b(-16), b(-14), "un poquito."),
    (b(-13), b(-11), "tarde."),
    (b(-10), b(-8), "la tuneamos."),
    (b(-7), b(-5), "sí."),
    (b(-4), b(-3), "jueves 17 hs."),
    (b(-1), b(0), "“bueno, agendame”"),
    (b(8), b(12), "agendá tu turnito"),
    (b(12), b(16), "turnos por MD"),
    (b(16), b(20), "no hacemos envíos\n(es un tatuaje)"),
    (b(20), b(24), "chiquitos, medianos\ny “ya que estoy”"),
    (b(24), b(25), "1. el stencil"),
    (b(25), b(28), "2. así queda"),
    (b(28), b(32), "3 cuotas sin interés\nen la frutilla"),
    (b(32), b(36), "diseños propios\n(no de Pinterest)"),
    (b(36), b(40), "acá un tatuaje"),
    (b(40), b(44), "acá también"),
    (b(44), b(48), "seña por alias"),
    (b(48), b(52), "promo de a dos\n(traé a tu amiga)"),
    (b(52), b(56), "el que filma:\njueves 17 hs"),
    (b(56), b(60), "cuidados:\nno te toques"),
    (b(60), b(64), "flash disponible"),
    (b(64), b(72), "compartan que\nme ayuda un montón"),
]
GHOST_TEXT = [  # (t0, t1, texto, lado)
    (b(-7), b(-5), "SÍ", "L"),
    (b(0), b(2), "TATUAJES", "L"),
    (b(8), b(12), "TURNITO", "R"),
    (b(44), b(48), "ALIAS", "L"),
    (b(64), b(72), "COMPARTAN", "L"),
    (b(64), b(72), "COMPARTAN", "R"),
]
FLASHES = [(b(0), (255, 43, 214)), (b(8), (255, 230, 0)), (b(40), (0, 229, 255)), (b(64), (255, 43, 214)), (b(68), (255, 255, 255)), (b(81), (255, 230, 0))]

HOOKS = {
    # texto del hook (0 – 1,71) por variante
    "main": "¿querés tatuarte?",
}


def lane_text(c, s, size=138, y=LANE_Y):
    text(c, s, W / 2, y, size, "sans-bold", fill=(0, 0, 0, 255), stroke=6, stroke_fill=(255, 255, 255, 255),
         squeeze=0.80, max_w=940, line_gap=1.0)


def ghost_text(c, s, side):
    f = font("sans-bold", 300)
    tw = int(f.getlength(s))
    im = Image.new("RGBA", (tw + 20, 340), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((10, 0), s, font=f, fill=(255, 255, 255, 102))
    im = im.resize((int(im.width * 0.8), im.height)).rotate(90 if side == "L" else -90, expand=True)
    if im.height > 1500:
        im = im.resize((int(im.width * 1500 / im.height), 1500))
    x = 0 if side == "L" else W - im.width
    c.alpha_composite(im, (x, (H - im.height) // 2))


# ---------------------------------------------------------------- chat (pre-drop, secundario)
CHAT = [  # (t_entrada, texto, adjunto)
    (b(-17), "¿duele?", None),
    (b(-14), "¿y si me arrepiento?", None),
    (b(-11), "traje una foto de Pinterest", "pin"),
    (b(-8), "¿mi vieja se va a enterar?", None),
    (b(-5), "¿cuándo tenés?", None),
]
TYPING = (b(-3), b(-1))
PIN = pinterest_thumb(260, 200)


def bubble(s, attach=None):
    f = font("sans-bold", 40)
    lines = []
    d = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    cur = ""
    for w_ in s.split():
        if d.textlength((cur + " " + w_).strip(), font=f) > 330 and cur:
            lines.append(cur)
            cur = w_
        else:
            cur = (cur + " " + w_).strip()
    lines.append(cur)
    tw = max(d.textlength(l, font=f) for l in lines)
    ah = (PIN.height + 14) if attach else 0
    bw, bh = int(max(tw, PIN.width if attach else 0) + 44), int(len(lines) * 48 + 30 + ah)
    im = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    dd = ImageDraw.Draw(im)
    dd.rounded_rectangle([0, 0, bw - 1, bh - 1], radius=30, fill=(233, 233, 235, 240))
    if attach:
        im.alpha_composite(PIN, (22, 14))
    for i, l in enumerate(lines):
        dd.text((22, 12 + ah + i * 48), l, font=f, fill=(0, 0, 0, 255))
    return im


BUBBLES = {s: bubble(s, a) for _, s, a in CHAT}


def draw_chat(c, t):
    if not (b(-17) <= t < DROP):
        return
    head = font("sans-bold", 32)
    d = ImageDraw.Draw(c)
    d.rounded_rectangle([30, 780, 430, 836], radius=14, fill=(255, 255, 255, 235))
    d.text((48, 790), f"{HANDLE} · tatuajes", font=head, fill=(0, 0, 0, 255))
    shown = [(t0, s, a) for t0, s, a in CHAT if t0 <= t]
    items = [BUBBLES[s] for _, s, _ in shown]
    if TYPING[0] <= t < TYPING[1]:
        k = int((t - TYPING[0]) / (BEAT / 4)) % 4
        items.append(bubble("escribiendo" + "." * k))
    items = items[-3:]
    y = 850
    for im in items:
        c.alpha_composite(im, (34, y))
        y += im.height + 14


# ---------------------------------------------------------------- stickers a color (puntuales)
STICK = [  # (t0, t1, diseño, cx, cy, alto, rot)
    (b(0), b(2), "mariposa-daga", 180, 1450, 300, -12),
    (b(0), b(2), "flor-alambre-puas", 920, 410, 280, 10),
    (b(12), b(14), "frutilla", 920, 1440, 260, 8),
    (b(28), b(32), "frutilla", 820, 1150, 340, 10),
    (b(60), b(64), "gallo", 190, 1450, 330, -8),
    (b(61), b(64), "pajaro-flores", 900, 1450, 300, 8),
]


def calf(t):
    x0, y0, x1, y1 = box(t)
    return x0 + 0.33 * (x1 - x0), y0 + 0.80 * (y1 - y0)


# ---------------------------------------------------------------- tarjeta TURNITO y end card
def card(c, t):
    x0, y0, x1, y1 = 140, 290, 940, 860
    d = ImageDraw.Draw(c)
    d.rectangle([x0, y0, x1, y1], fill=(255, 255, 255, 255), outline=(0, 0, 0, 255), width=6)
    d.text((x0 + 40, y0 + 25), "TURNITO", font=font("sans-bold", 110), fill=(0, 0, 0, 255))
    fields = [("día:", "jueves", b(76)), ("hora:", "17 hs", b(77)), ("diseño:", "ya que estoy", b(78)),
              ("seña:", "por alias", None)]
    fb, hand = font("sans-bold", 62), font("/usr/share/fonts/truetype/liberation/LiberationSans-BoldItalic.ttf", 64)
    for i, (k, v, tv) in enumerate(fields):
        y = y0 + 175 + i * 92
        d.text((x0 + 40, y), k, font=fb, fill=(0, 0, 0, 255))
        kx = x0 + 40 + d.textlength(k, font=fb) + 20
        if tv is None:
            d.text((kx, y), v, font=fb, fill=(0, 0, 0, 255))
        elif t >= tv:
            d.text((kx, y - 4), v, font=hand, fill=RED)
        else:
            d.line([(kx, y + 62), (x1 - 40, y + 62)], fill=(0, 0, 0, 255), width=4)
    if t >= b(79):  # sello de goma
        f = font("sans-bold", 96)
        st = Image.new("RGBA", (640, 170), (0, 0, 0, 0))
        sd = ImageDraw.Draw(st)
        sd.rectangle([6, 6, 633, 163], outline=(215, 38, 61, 255), width=12)
        sd.text((34, 28), "AGENDADO", font=f, fill=(215, 38, 61, 255))
        rng = np.random.default_rng(1)
        a = np.asarray(st.getchannel("A"), np.float32) * (rng.random((170, 640)) > 0.18)
        st.putalpha(Image.fromarray(a.astype(np.uint8)))
        paste(c, st, 600, 700, rot=-14)


def endcard(c, t):
    c.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 140)))
    k = int((t - b(END_BEAT)) / BEAT)
    icon = ig_icon(300, IG_COLORS[k % len(IG_COLORS)] + (255,), 22)
    c.alpha_composite(icon, ((W - icon.width) // 2, 620 - icon.height // 2))
    text(c, HANDLE, W / 2, 860, 110, "sans-bold", fill=(255, 255, 255, 255), max_w=1000)


END_BEAT = 81  # end card en el beat 81 → 49,51 s


# ---------------------------------------------------------------- frame
WM_POS = [(0, b(12), (600, 250), (0, 0, 0, 255), 0), (b(12), b(40), (60, 880), (255, 255, 255, 255), 5),
          (b(40), b(64), (600, 1300), (255, 255, 255, 255), 5), (b(64), b(76), (600, 250), (0, 0, 0, 255), 0)]


def frame(t, hook="main"):
    c = fx_footage.frame(t)
    if t >= b(81):
        endcard(c, t)
        if t < b(81) + 2 / FPS:
            c.alpha_composite(Image.new("RGBA", (W, H), (255, 230, 0, 120)))
        return c
    g = ghost_layer(t)
    if g is not None:
        c.alpha_composite(g)
    for t0, t1, s, side in GHOST_TEXT:
        if t0 <= t < t1:
            ghost_text(c, s, side)
    for t0, t1, n, cx, cy, h, r in STICK:
        if t0 <= t < t1:
            paste(c, load(f"stickers/{n}.png", height=h), cx, cy, rot=r)
    # gag stencil → tatuaje (pantorrilla)
    if b(24) <= t < b(27):
        cx, cy = calf(t)
        spr = with_alpha(transfer("mariposa-daga", 190, VIOLET), 1.6) if t < b(25) else load("stickers/mariposa-daga.png", height=180)
        paste(c, spr, cx, cy)
        im, off = arrow((cx - 260, cy - 220), (cx - 70, cy - 60), seed=3)
        c.alpha_composite(im, off)
    # flechas de escalada
    if b(36) <= t < b(40):
        x0, y0, x1, y1 = box(t)
        tip = (x1 + 10, y0 + 0.42 * (y1 - y0))
        im, off = arrow((min(tip[0] + 260, 1010), 820), tip, seed=5)
        c.alpha_composite(im, off)
    if b(40) <= t < b(44):
        bx, by = land("bloque", t)
        tip = (max(bx + 60, 90), by + 40)
        im, off = arrow((tip[0] + 180, 840), tip, seed=7)
        c.alpha_composite(im, off)
    if b(52) <= t < b(56):
        im, off = arrow((960, 820), (960, 1880), seed=9)
        c.alpha_composite(im, off)
    draw_chat(c, t)
    # watermark
    for t0, t1, pos, col, st in WM_POS:
        if t0 <= t < t1:
            k = int((t - DROP) / (4 * BEAT)) if t >= DROP else 0
            wm = watermark(HANDLE, IG_COLORS[k % 5], 40, text_fill=col, stroke=st)
            c.alpha_composite(wm, pos)
    # textos
    if t < b(-17):
        text(c, HOOKS.get(hook, HOOKS["main"]), W / 2, 560, 250, "sans", fill=(0, 0, 0, 255), squeeze=0.64,
             max_w=900, line_gap=0.92, stroke=3, stroke_fill=(255, 255, 255, 255))
    for t0, t1, s in TEXTS:
        if t0 <= t < t1:
            lane_text(c, s)
    if b(78) - 2 * BEAT <= t < b(81):
        card(c, t)
    for tf, col in FLASHES:
        if tf <= t < tf + 2 / FPS:
            c.alpha_composite(Image.new("RGBA", (W, H), col + ((140,) if t < tf + 1 / FPS else (64,))))
    return c


def build(out, hook="main"):
    out = Path(out)
    wav = BUILD / (out.stem + ".wav")
    base = fx_footage.audio()
    n = int(2 / FPS * audio.SR)
    base[-n:] *= np.linspace(1, 0, n)
    audio.write_wav(wav, audio.mix(DUR, DROP, [], base=base))
    render(lambda t: frame(t, hook), DUR, wav, out)
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--hook", default="main")
    ap.add_argument("--frames")
    ap.add_argument("out", nargs="?", default=str(ROOT / "output/final/briza-viral-final.mp4"))
    a = ap.parse_args()
    if a.frames:
        ims = [frame(float(x), a.hook).convert("RGB").resize((270, 480)) for x in a.frames.split(",")]
        strip = Image.new("RGB", (270 * len(ims), 480))
        for i, im in enumerate(ims):
            strip.paste(im, (270 * i, 0))
        strip.save(BUILD / f"frames_{a.hook}.jpg")
        print(BUILD / f"frames_{a.hook}.jpg")
    else:
        print(build(a.out, a.hook))
