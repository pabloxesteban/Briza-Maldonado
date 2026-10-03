"""Render v4: versión Briza del trend, sincronizada al bombo real.

Footage y audio originales de VIDEO_1 intactos (out = src − 5,0; 53,80 s).
Beats reales detectados del audio (viral-video/build/beats.json, ≈125,7 BPM; drop = beat 0 ≈ 9,96 s).
Capa:
  - subtítulos estilo reel de Briza (Montserrat ExtraBold blanca + palabra en amarillo), entran en beat
    y laten sutilmente con el bombo;
  - tatuajes terminados del portfolio (tatuajes/portfolio) como pop-ups que se acumulan hasta el final;
  - pocos flashes (stickers);
  - stencils semitransparentes desparramados por toda la pantalla, pulsando con el bombo (capa "techno").
Sin handle, sin ícono de IG, sin chat, sin chistes en el texto.

  python3 build_v4.py                       → output/final/briza-viral-final.mp4
  python3 build_v4.py --hook a|b|c --from-master MASTER OUT
  python3 build_v4.py --frames 0.5,10.2      → viral-video/build/v4_frames_<hook>.jpg
"""
import argparse
import bisect
import json
import math
import random
import subprocess
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import audio
from engine import W, H, FPS, ROOT, load, paste, render
from footage import Footage, Seg

SRC_OFF, DUR = 5.0, 53.80
YELLOW, WHITE = (255, 212, 0, 255), (255, 255, 255, 255)
FONT = Path(__file__).with_name("Montserrat.ttf")
BUILD = ROOT / "viral-video" / "build"
TRACK = {int(k): v for k, v in json.load(open(BUILD / "track.json")).items()}
BEATS = json.load(open(BUILD / "beats.json"))
DROP_I = min(range(len(BEATS)), key=lambda i: abs(BEATS[i] - 9.94))
DROP = BEATS[DROP_I]

footage = Footage([Seg(SRC_OFF, SRC_OFF + DUR)])


def b(n):
    """Tiempo del beat n (0 = drop). Admite fracciones (n + 0,5 = corchea)."""
    i = DROP_I + math.floor(n)
    f = n - math.floor(n)
    i = max(0, min(i, len(BEATS) - 2))
    return BEATS[i] + f * (BEATS[i + 1] - BEATS[i])


END = b(83)                    # end card (≈49,6 s, como VIDEO_2)


def beat_env(t, decay=0.13, sub=1):
    """Envolvente del bombo: 1 en el golpe, cae exponencial. sub=2 → corcheas."""
    k = bisect.bisect_right(BEATS, t) - 1
    if k < 0:
        return 0.0
    last = BEATS[k]
    if sub == 2 and k + 1 < len(BEATS):
        mid = (BEATS[k] + BEATS[k + 1]) / 2
        if t >= mid:
            last = mid
    return math.exp(-(t - last) / decay)


def beat_index(t):
    return bisect.bisect_right(BEATS, t) - 1 - DROP_I


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
    """'texto con [palabra]' → RGBA. Blanco + palabra entre [] en amarillo, sombra suave.
    '~' = espacio duro (no corta línea)."""
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
        ww = f.getlength(w.replace("~", " "))
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
            w = w.replace("~", " ")
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


def put_caption(c, s, t, t0, y=585, size=96, pulse=True):
    im = caption(s, size)
    k = int((t - t0) * FPS)
    sc = {0: 1.10, 1: 1.04}.get(k, 1.0)                 # entrada en el beat
    if pulse and t >= DROP:
        sc *= 1 + 0.022 * beat_env(t, 0.11)              # late sutil con el bombo
    if sc != 1.0:
        im = im.resize((int(im.width * sc), int(im.height * sc)), Image.BILINEAR)
    c.alpha_composite(im, (int((W - im.width) / 2), int(y - im.height / 2)))


# ------------------------------------------------------------------ guion (en beats; 8 beats = 2 compases)
TEXTS = [
    (-21, -12, "¿Querés [tatuarte]?"),
    (-12, -4, "Hago tatuajes [tradicionales]"),
    (-4, 0, "en [Palermo]"),
    (0, 8, "[agenda abierta]"),
    (8, 16, "muchos [animalitos]"),
    (16, 24, "flashes [disponibles]"),
    (24, 32, "o traé tu [idea]"),
    (32, 40, "trabajos [recientes]"),
    (40, 48, "[Palermo], Buenos~Aires"),
    (48, 56, "[diseños] propios"),
    (56, 64, "[turnos] por MD"),
    (64, 83, "[agenda abierta]"),
]
HOOKS = {
    "main": "¿Querés [tatuarte]?",
    "a": "Ella ya [sacó turno]",                         # más absurdo
    "b": "¿Querés [tatuarte] en Palermo?",               # más argentino / local
    "c": "¿Querés un [tattoo tradicional]?",             # más tattoo
}

# ------------------------------------------------------------------ tatuajes terminados (pop-ups)
PORT = ROOT / "tatuajes" / "portfolio"
SLOTS = {"L1": (215, 1010), "R1": (765, 1010), "L2": (230, 1330), "R2": (750, 1330)}
# orden de aparición (sin repetir hasta agotar los 16)
SEQ = ["cocodrilo", "conejo", "elefante-skate", "pinguino", "lobo", "lockets-gatos", "garza", "polilla-esterno",
       "mariposas-rodillas", "daga-serpiente", "rosa-alambre", "mariposa-pierna", "patchwork-sleeve", "espinas",
       "alambre-daga-corazon", "mono-corazon"]
STICKERS = [  # pocos flashes: (beat entrada, beat salida, diseño, cx, cy, alto, rot)
    (0, 4, "mariposa-daga", 200, 1150, 330, -12),
    (0.5, 4, "frutilla", 210, 1420, 240, 10),
    (16, 19, "pajaro-flores", 200, 930, 290, -8),
    (17, 19, "flor-alambre-puas", 210, 1350, 260, 6),
    (19, 24, "chancho-y-vaca", 265, 1150, 450, -5),      # el más llamativo: solo y grande
]


@lru_cache(maxsize=48)
def photo_card(name, width):
    """Foto con borde blanco y sombra (pop-up estilo reel)."""
    p = PORT / f"{name}.jpg"
    im = Image.open(p).convert("RGBA")
    im = im.resize((width, int(im.height * width / im.width)), Image.LANCZOS)
    pad = 12
    card = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), WHITE)
    card.alpha_composite(im, (pad, pad))
    sh = Image.new("RGBA", (card.width + 40, card.height + 40), (0, 0, 0, 0))
    m = Image.new("L", sh.size, 0)
    ImageDraw.Draw(m).rectangle([20, 26, 20 + card.width, 26 + card.height], fill=120)
    sh.putalpha(m.filter(ImageFilter.GaussianBlur(10)))
    sh.alpha_composite(card, (20, 20))
    return sh


def face_rect(t, pad=0.0):
    x0, y0, x1, y1 = box(t)
    h = y1 - y0
    return x0 - pad, y0 - 0.06 * h, x1 + pad, y0 + 0.30 * h


def hits_face(cx, cy, w, h, t0, t1, torso=False):
    for k in range(int((t1 - t0) / 0.2) + 1):
        fx0, fy0, fx1, fy1 = face_rect(t0 + k * 0.2, 20)
        if torso:
            bx0, by0, bx1, by1 = box(t0 + k * 0.2)
            fy1 = by0 + 0.55 * (by1 - by0)
            fx0, fx1 = fx0 + 0.15 * (bx1 - bx0), fx1 - 0.15 * (bx1 - bx0)
        if cx + w / 2 > fx0 and cx - w / 2 < fx1 and cy + h / 2 > fy0 and cy - h / 2 < fy1:
            return True
    return False


def body_overlap(cx, w, t0, t1):
    worst = 0
    for k in range(int((t1 - t0) / 0.25) + 1):
        bx0, _, bx1, _ = box(t0 + k * 0.25)
        worst = max(worst, max(0, min(cx + w / 2, bx1) - max(cx - w / 2, bx0)) / w)
    return worst


CARD_W = 250
GALLERY = [(200, 930), (200, 1320), (760, 930), (760, 1320)]   # 4 lugares que no se pisan entre sí
PLAN = []  # (t0, t1, nombre, cx, cy, ancho, rot)
rnd = random.Random(11)


def slot_ok(p, t0, t1):
    h = CARD_W * 1.45 + 30
    return not hits_face(p[0], p[1], CARD_W + 24, h, t0, t1, torso=True) and \
        body_overlap(p[0], CARD_W + 24, t0, t1) < 0.3


# entradas: cada 2 beats en el desarrollo (vive 4 beats → máx. 2 en pantalla),
# cada beat en el pico (vive 4 beats → galería de 4), sin fotos durante "flashes disponibles"
ENTRIES = [(e, min(4, 16 - e)) for e in range(8, 16, 2)] + [(e, 4) for e in range(24, 64, 2)] + [(e, 4) for e in range(64, 83)]
last_used = {p: -99 for p in GALLERY}
busy = []  # (t1, slot)
for k, (e0, life) in enumerate(ENTRIES):
    t0 = b(e0)
    t1 = b(min(e0 + life, 83)) if e0 + life < 83 else DUR + 1     # las últimas quedan bajo el end card
    busy = [(tb, p) for tb, p in busy if tb > t0 + 1e-3]
    free = [p for p in GALLERY if p not in [q for _, q in busy]]
    good = [p for p in free if slot_ok(p, t0, min(t1, END))] or free or GALLERY
    p = min(good, key=lambda q: last_used[q])
    last_used[p] = k
    busy.append((t1, p))
    PLAN.append((t0, t1, SEQ[k % len(SEQ)], p[0], p[1], CARD_W, rnd.uniform(-5, 5)))


def pop_scale(t, t0):
    """Entrada suave en el beat (0,92 → 1 en 3 frames) y después late con el bombo."""
    k = int((t - t0) * FPS)
    s = {0: 0.92, 1: 0.96, 2: 0.99}.get(k, 1.0)
    if t >= DROP:
        s *= 1 + 0.035 * beat_env(t, 0.12)
    return s


def sway(t):
    """Balanceo mínimo alternado por beat."""
    if t < DROP:
        return 0.0
    return (1.2 if beat_index(t) % 2 == 0 else -1.2) * beat_env(t, 0.2)


# ------------------------------------------------------------------ capa techno: stencils fantasma pulsando
GHOST_SRC = [ROOT / "stencils" / f"{n}.png" for n in
             ["mariposa-daga", "frutilla", "gallo", "pajaro-flores", "flor-alambre-puas", "flor-hojas"]] + \
            [ROOT / "tatuajes" / "flash-ink" / f"{n}.png" for n in ["gorrion", "rosa-alambre-flash", "cerdo-cabra"]]


@lru_cache(maxsize=96)
def ghost_sprite(i, h, rot, mirror):
    st = Image.open(GHOST_SRC[i]).convert("RGBA")
    st = st.resize((int(st.width * h / st.height), h), Image.LANCZOS)
    out = Image.new("RGBA", st.size, (255, 255, 255, 0))
    out.putalpha(st.getchannel("A").filter(ImageFilter.GaussianBlur(1.0)))
    if mirror:
        out = out.transpose(Image.FLIP_LEFT_RIGHT)
    return out.rotate(rot, resample=Image.BICUBIC, expand=True)


@lru_cache(maxsize=24)
def ghost_group(bar, group, n, hmin, hmax):
    """Capa con n stencils desparramados por todo el cuadro (posiciones nuevas cada compás)."""
    r = random.Random(bar * 7 + group * 1000)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cols = 3 if n <= 12 else 4
    for k in range(n):
        # repartir por celdas para cubrir toda la pantalla
        cx = (k % cols + r.uniform(0.1, 0.9)) * W / cols
        rows = max(4, math.ceil(n / cols))
        cy = ((k // cols) % rows + r.uniform(0.1, 0.9)) * H / rows
        spr = ghost_sprite(r.randrange(len(GHOST_SRC)), int(r.uniform(hmin, hmax)), int(r.uniform(-25, 25)),
                           r.random() < 0.5)
        paste(layer, spr, cx, cy)
    return np.asarray(layer.getchannel("A"), np.float32)


def ghost_alpha(t):
    """Alpha (H×W float 0..255) de la capa techno en el instante t, o None."""
    bi = beat_index(t)
    bar = (bi + 400) // 4
    if t < DROP:
        if t < b(-12):
            return None
        a = ghost_group(bar // 2, 0, 9, 450, 850) * (0.13 + 0.12 * beat_env(t, 0.35))
    elif t < END:
        peak = bi >= 64
        n, sub = (14, 2) if peak else (11, 1)
        ga = ghost_group(bar, 1, n, 420, 900)
        gb = ghost_group(bar, 2, n, 420, 900)
        on_a = bi % 2 == 0
        env = beat_env(t, 0.16 if not peak else 0.10, sub)
        base = 0.40 if not peak else 0.46
        a = ga * (base * (0.25 + 0.75 * env) if on_a else base * 0.18) + \
            gb * (base * 0.18 if on_a else base * (0.25 + 0.75 * env))
    else:
        a = ghost_group(bar, 3, 11, 500, 950) * (0.18 + 0.10 * beat_env(t, 0.2))
    return a


@lru_cache(maxsize=4)
def lane_mask():
    """Despeja la banda del subtítulo para que el amarillo contraste."""
    m = np.ones((H, W), np.float32)
    y = np.arange(H)[:, None]
    m *= 1 - 0.5 * np.exp(-((y - 585) / 110.0) ** 2)
    return m


def apply_ghosts(c, t):
    a = ghost_alpha(t)
    if a is None:
        return
    fm = Image.new("L", (W // 4, H // 4), 255)
    x0, y0, x1, y1 = face_rect(t)
    ImageDraw.Draw(fm).ellipse([x0 / 4, y0 / 4, x1 / 4, (y1 + 30) / 4], fill=0)
    fm = np.asarray(fm.filter(ImageFilter.GaussianBlur(7)).resize((W, H), Image.BILINEAR), np.float32) / 255
    a = np.clip(a * fm * lane_mask(), 0, 255).astype(np.uint8)
    layer = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    layer.putalpha(Image.fromarray(a))
    c.alpha_composite(layer)


FLASHES = [DROP, b(64), END]


# ------------------------------------------------------------------ frame
def frame(t, hook="main"):
    c = footage.frame(t)
    apply_ghosts(c, t)
    for e0, e1, n, cx, cy, h, r in STICKERS:
        t0, t1 = b(e0), b(e1)
        if t0 <= t < t1:
            s = pop_scale(t, t0)
            paste(c, load(f"stickers/{n}.png", height=h), cx, cy, s, s, rot=r - sway(t))
    for t0, t1, n, cx, cy, w, r in PLAN:
        if t0 <= t < t1:
            s = pop_scale(t, t0)
            paste(c, photo_card(n, w), cx, cy, s, s, rot=r + sway(t))
    if t >= END:
        c.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 150)))
        put_caption(c, "[agenda abierta]", t, END, y=700, size=110)
        put_caption(c, "Palermo · turnos por MD", t, END, y=830, size=66)
    else:
        for e0, e1, s in TEXTS:
            t0 = 0.0 if e0 == -21 else b(e0)
            if t0 <= t < b(e1):
                put_caption(c, HOOKS[hook] if e0 == -21 else s, t, t0, size=104 if e0 == -21 else 96)
    for tf in FLASHES:
        if tf <= t < tf + 2 / FPS:
            c.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, 115 if t < tf + 1 / FPS else 45)))
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


def build_hook_variant(master, out, hook, head=4.5):
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp, silent = BUILD / f"head4_{hook}.mp4", BUILD / "silence.wav"
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
        p = BUILD / f"v4_frames_{a.hook}.jpg"
        strip.save(p)
        print(p)
    elif a.from_master:
        print(build_hook_variant(a.from_master, a.out, a.hook))
    else:
        print(build(a.out))
