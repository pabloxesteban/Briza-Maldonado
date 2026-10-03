"""Render v3: versión Briza del trend con su voz y tipografía (regla del cliente #3).

Footage y audio originales de VIDEO_1 intactos (out = src − 5,0, drop en 10,00, 53,80 s).
Capa: subtítulos estilo reel de Briza (blanco + palabra en amarillo), flashes como stickers,
fotos de tatuajes reales como pop-ups, stencils fantasma blancos (equivalente a las carpetitas).
Sin handle, sin chat, sin chistes en el texto.

  python3 build_v3.py                       → output/final/briza-viral-final.mp4
  python3 build_v3.py --hook a|b|c --from-master MASTER OUT
  python3 build_v3.py --frames 0.5,10.2,...  → viral-video/build/v3_frames_<hook>.jpg
"""
import argparse
import json
import random
import subprocess
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import audio
from engine import W, H, FPS, ROOT, load, paste, render
from footage import Footage, Seg
from props import IG_COLORS, ig_icon

SRC_OFF, DUR, DROP = 5.0, 53.80, 10.0
BEAT = 60 / 123
YELLOW = (255, 212, 0, 255)
WHITE = (255, 255, 255, 255)
FONT = Path(__file__).with_name("Montserrat.ttf")
BUILD = ROOT / "viral-video" / "build"
TRACK = {int(k): v for k, v in json.load(open(BUILD / "track.json")).items()}

footage = Footage([Seg(SRC_OFF, SRC_OFF + DUR)])


def b(n):
    return round(DROP + n * BEAT, 3)


def box(t):
    return TRACK[min(max(int((t + SRC_OFF) * 30) + 1, 1), 1809)]


# ------------------------------------------------------------------ tipografía estilo Briza
@lru_cache(maxsize=16)
def mfont(size, weight="ExtraBold"):
    f = ImageFont.truetype(str(FONT), size)
    f.set_variation_by_name(weight)
    return f


@lru_cache(maxsize=64)
def caption(s, size=96, max_w=960):
    """'texto con [palabra] destacada' → imagen RGBA. Blanco, palabra entre [] en amarillo, sombra suave."""
    f = mfont(size)
    tokens = []
    for part in s.replace("[", "|[").replace("]", "]|").split("|"):
        if not part:
            continue
        hl = part.startswith("[")
        glue = part[0] in ",.?!:;"
        for i, w in enumerate(part.strip("[]").split()):
            if i == 0 and glue and tokens:
                tokens[-1] = (tokens[-1][0] + w, tokens[-1][1], tokens[-1][2] + [(len(tokens[-1][0]), hl)])
            else:
                tokens.append((w, hl, []))
    space = f.getlength(" ")
    lines, cur, cw = [], [], 0
    for w, hl, segs in tokens:
        ww = f.getlength(w)
        if cur and cw + space + ww > max_w:
            lines.append(cur)
            cur, cw = [], 0
        cur.append((w, hl, ww, segs))
        cw += (space if cw else 0) + ww
    if cur:
        lines.append(cur)
    lh = int(size * 1.18)
    width = int(max(sum(x[2] for x in l) + space * (len(l) - 1) for l in lines)) + 60
    im = Image.new("RGBA", (width, lh * len(lines) + 60), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for i, l in enumerate(lines):
        lw = sum(x[2] for x in l) + space * (len(l) - 1)
        x = (width - lw) / 2
        for w, hl, ww, segs in l:
            cuts = [(0, hl)] + segs
            for j, (k, h_) in enumerate(cuts):
                piece = w[k:cuts[j + 1][0]] if j + 1 < len(cuts) else w[k:]
                d.text((x + f.getlength(w[:k]), 20 + i * lh), piece, font=f, fill=YELLOW if h_ else WHITE)
            x += ww + space
    a = im.getchannel("A")
    shadow = Image.new("RGBA", im.size, (0, 0, 0, 0))
    shadow.putalpha(a.filter(ImageFilter.GaussianBlur(9)).point(lambda v: min(255, int(v * 1.6))))
    edge = Image.new("RGBA", im.size, (0, 0, 0, 0))
    edge.putalpha(a.filter(ImageFilter.MaxFilter(5)).point(lambda v: int(v * 0.55)))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.alpha_composite(shadow)
    out.alpha_composite(edge)
    out.alpha_composite(im)
    return out


def put_caption(c, s, y=560, size=96):
    im = caption(s, size)
    c.alpha_composite(im, ((W - im.width) // 2, int(y - im.height / 2)))


# ------------------------------------------------------------------ guion de textos
TEXTS = [
    (0.00, b(-12), "¿Querés [tatuarte]?"),
    (b(-12), b(-4), "Hago tatuajes [tradicionales]"),
    (b(-4), b(0), "en [Palermo]"),
    (b(0), b(8), "[agenda abierta]"),
    (b(8), b(16), "muchos [animalitos]"),
    (b(16), b(24), "flashes [disponibles]"),
    (b(24), b(32), "o traé tu [idea]"),
    (b(32), b(40), "del [stencil]"),
    (b(40), b(48), "a la [piel]"),
    (b(48), b(56), "chiquitos, medianos y [grandes]"),
    (b(56), b(64), "[Palermo], Buenos Aires"),
    (b(64), b(72), "[agenda abierta]"),
    (b(72), b(81), "turnos por [MD]"),
]
HOOKS = {
    "main": "¿Querés [tatuarte]?",
    "a": "Ella [ya sacó turno]",                         # más absurdo
    "b": "¿Querés [tatuarte] en Palermo?",               # más argentino / local
    "c": "¿Querés un [tatuaje tradicional]?",            # más tattoo
}

# ------------------------------------------------------------------ flashes (stickers) y fotos
rnd = random.Random(7)
STICKERS = [  # (t0, t1, diseño, cx, cy, alto, rot)
    (b(-10), b(-4), "pajaro-flores", 200, 1240, 320, -10),
    (b(-8), b(-4), "gallo", 880, 1200, 380, 8),
    (b(0), b(4), "mariposa-daga", 200, 1300, 360, -12),
    (b(0.5), b(4), "frutilla", 880, 1260, 300, 10),
    (b(8), b(16), "gallo", 180, 1260, 380, -6),
    (b(9), b(16), "pajaro-flores", 890, 1240, 330, 8),
    (b(10), b(16), "mariposa-daga", 230, 860, 260, 12),
    (b(16), b(24), "frutilla", 180, 1280, 290, -8),
    (b(17), b(24), "flor-alambre-puas", 880, 1250, 330, 6),
    (b(18), b(24), "flor-hojas", 860, 860, 260, -10),
    (b(64), b(72), "gallo", 170, 1280, 360, -8),
    (b(64.5), b(72), "pajaro-flores", 900, 1250, 320, 8),
    (b(65), b(72), "mariposa-daga", 880, 860, 260, 10),
    (b(65.5), b(72), "frutilla", 190, 880, 240, -10),
]
PHOTOS = [  # (t0, t1, archivo, cx, cy, ancho, rot)
    (b(32), b(40), "stencil-en-piel.jpg", 820, 1150, 360, 5),
    (b(40), b(44), "terminado-pierna.jpg", 200, 1150, 340, -5),
    (b(44), b(48), "terminado-cerca.jpg", 880, 1180, 340, 4),
    (b(56), b(64), "terminado-cerca.jpg", 200, 1180, 320, -4),
]


@lru_cache(maxsize=16)
def photo_card(name, width):
    """Foto con borde blanco y sombra, estilo pop-up del reel de Briza."""
    im = Image.open(ROOT / "tatuajes" / name).convert("RGBA")
    im = im.resize((width, int(im.height * width / im.width)), Image.LANCZOS)
    pad = 14
    card = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), WHITE)
    card.alpha_composite(im, (pad, pad))
    sh = Image.new("RGBA", (card.width + 40, card.height + 40), (0, 0, 0, 0))
    m = Image.new("L", sh.size, 0)
    ImageDraw.Draw(m).rectangle([20, 26, 20 + card.width, 26 + card.height], fill=110)
    sh.putalpha(m.filter(ImageFilter.GaussianBlur(10)))
    sh.alpha_composite(card, (20, 20))
    return sh


def free_x(cx, w, t0, t1):
    """Si la foto pisa a la señora durante su vida, la espeja al otro lado."""
    def overlap(x):
        worst = 0
        for k in range(int((t1 - t0) / 0.25) + 1):
            bx0, _, bx1, _ = box(t0 + k * 0.25)
            worst = max(worst, max(0, min(x + w / 2, bx1) - max(x - w / 2, bx0)) / w)
        return worst
    return cx if overlap(cx) <= overlap(1080 - cx) else 1080 - cx


def pop_scale(t, t0):
    """Entrada con rebote corto (3 frames): 1,18 → 0,96 → 1."""
    k = int((t - t0) * FPS)
    return {0: 1.18, 1: 0.96}.get(k, 1.0)


# ------------------------------------------------------------------ stencils fantasma blancos
GHOSTS = []
DESIGNS = ["mariposa-daga", "frutilla", "gallo", "pajaro-flores", "flor-alambre-puas", "flor-hojas"]


@lru_cache(maxsize=64)
def ghost_sprite(name, h):
    st = Image.open(ROOT / "stencils" / f"{name}.png").convert("RGBA")
    st = st.resize((int(st.width * h / st.height), h), Image.LANCZOS)
    a = st.getchannel("A")
    out = Image.new("RGBA", st.size, (255, 255, 255, 0))
    out.putalpha(a.filter(ImageFilter.GaussianBlur(1.2)))
    return out


def ghost(t0, t1, name, cx, cy, h, rot, a, blink=None):
    GHOSTS.append(dict(t0=t0, t1=t1, name=name, cx=cx, cy=cy, h=h, rot=rot, a=a, blink=blink))


ghost(0.0, b(-12), "mariposa-daga", 560, 470, 900, -8, 0.30, blink=(4 * BEAT, 3 * BEAT))
ghost(b(-6), b(0), "gallo", 820, 500, 800, 6, 0.28)
for k, (cx, cy, h) in enumerate([(200, 420, 1000), (900, 380, 900), (150, 1400, 1100), (930, 1450, 1000),
                                 (560, 260, 800), (880, 900, 800)]):
    ghost(b(0) if k < 3 else b(0.5), b(4), DESIGNS[k], cx, cy, h, rnd.uniform(-15, 15), 0.36)
for k in range(8):  # tandas que titilan durante el desarrollo
    t0 = b(24 + k * 2)
    ghost(t0, t0 + 2 * BEAT, DESIGNS[k % 6], rnd.choice([200, 880]), rnd.uniform(350, 1500), int(rnd.uniform(700, 1000)),
          rnd.uniform(-12, 12), 0.28)
for k in range(12):  # pico de "agenda abierta"
    ghost(b(64) + (k % 4) * BEAT / 2, b(72) - (k // 4) * BEAT, DESIGNS[k % 6], rnd.uniform(80, 1000),
          rnd.uniform(250, 1700), int(rnd.uniform(700, 1300)), rnd.uniform(-20, 20), 0.32,
          blink=(2 * BEAT, 1.5 * BEAT) if k % 3 == 0 else None)


def ghost_layer(t):
    layer = None
    for g in GHOSTS:
        if not (g["t0"] <= t < g["t1"]):
            continue
        if g["blink"] and ((t - g["t0"]) % g["blink"][0]) >= g["blink"][1]:
            continue
        if layer is None:
            layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        spr = ghost_sprite(g["name"], g["h"])
        spr = spr.copy()
        spr.putalpha(spr.getchannel("A").point(lambda v, a=g["a"]: int(v * a)))
        paste(layer, spr, g["cx"], g["cy"], rot=g["rot"])
    if layer is None:
        return None
    x0, y0, x1, y1 = box(t)
    w, h = x1 - x0, y1 - y0
    m = Image.new("L", (W, H), 255)
    ImageDraw.Draw(m).ellipse([x0, y0 - 0.06 * h, x1, y0 + 0.34 * h], fill=0)
    m = m.filter(ImageFilter.GaussianBlur(30))
    a = np.asarray(layer.getchannel("A"), np.float32) * np.asarray(m, np.float32) / 255
    layer.putalpha(Image.fromarray(a.astype(np.uint8)))
    return layer


FLASHES = [b(0), b(8), b(32), b(64), b(81)]


# ------------------------------------------------------------------ frame
def endcard(c, t):
    c.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 140)))
    k = int((t - b(81)) / BEAT)
    icon = ig_icon(260, IG_COLORS[k % len(IG_COLORS)] + (255,), 20)
    c.alpha_composite(icon, ((W - icon.width) // 2, 560 - icon.height // 2))
    put_caption(c, "[agenda abierta]", y=820, size=104)
    put_caption(c, "turnos por MD", y=950, size=72)


def frame(t, hook="main"):
    c = footage.frame(t)
    if t >= b(81):
        endcard(c, t)
    else:
        g = ghost_layer(t)
        if g is not None:
            c.alpha_composite(g)
        for t0, t1, n, cx, cy, h, r in STICKERS:
            if t0 <= t < t1:
                s = pop_scale(t, t0)
                paste(c, load(f"stickers/{n}.png", height=h), cx, cy, s, s, rot=r)
        for t0, t1, n, cx, cy, w, r in PHOTOS:
            if t0 <= t < t1:
                cx = free_x(cx, w, t0, t1)
                s = pop_scale(t, t0)
                paste(c, photo_card(n, w), cx, cy, s, s, rot=r)
        for t0, t1, s in TEXTS:
            if t0 <= t < t1:
                put_caption(c, HOOKS[hook] if t0 == 0 else s, size=104 if t0 == 0 else 96)
    for tf in FLASHES:
        if tf <= t < tf + 2 / FPS:
            c.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, 120 if t < tf + 1 / FPS else 50)))
    return c


# ------------------------------------------------------------------ build
def build(out):
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    wav = BUILD / (out.stem + ".wav")
    base = footage.audio()
    n = int(2 / FPS * audio.SR)
    base[-n:] *= np.linspace(1, 0, n)
    audio.write_wav(wav, audio.mix(DUR, DROP, [], base=base))
    render(frame, DUR, wav, out)
    return out


def build_hook_variant(master, out, hook, head=3.0):
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp, silent = BUILD / f"head3_{hook}.mp4", BUILD / "silence.wav"
    audio.write_wav(silent, np.zeros(int(head * audio.SR), np.float32))
    render(lambda t: frame(t, hook), head, silent, tmp)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-i", str(master), "-filter_complex",
                    f"[0:v]trim=0:{head},setpts=PTS-STARTPTS[a];[1:v]trim={head},setpts=PTS-STARTPTS[b];"
                    "[a][b]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-map", "1:a", "-c:v", "libx264", "-crf", "18",
                    "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", str(out)],
                   check=True)
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--hook", default="main")
    ap.add_argument("--frames")
    ap.add_argument("--from-master")
    ap.add_argument("out", nargs="?", default=str(ROOT / "output/final/briza-viral-final.mp4"))
    a = ap.parse_args()
    if a.frames:
        ims = [frame(float(x), a.hook).convert("RGB").resize((270, 480)) for x in a.frames.split(",")]
        strip = Image.new("RGB", (270 * len(ims), 480))
        for i, im in enumerate(ims):
            strip.paste(im, (270 * i, 0))
        p = BUILD / f"v3_frames_{a.hook}.jpg"
        strip.save(p)
        print(p)
    elif a.from_master:
        print(build_hook_variant(a.from_master, a.out, a.hook))
    else:
        print(build(a.out))
