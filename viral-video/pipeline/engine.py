"""Motor mínimo de render: escenas como funciones de t -> PIL.Image, salida por ffmpeg.

Uso: render(frame_fn, duration, wav_path, out_mp4)
Cada frame se genera en 1080x1920 (9:16) a 30 fps.
"""
import math
import subprocess
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

W, H, FPS = 1080, 1920, 30
ROOT = Path(__file__).resolve().parents[2]

FONTS = {
    "sans": "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "sans-bold": "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "narrow": "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Regular.ttf",
    "narrow-bold": "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Bold.ttf",
    "serif-bold": "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
    "dejavu-bold": "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "dejavu-cond-bold": "/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf",
}


def font_path(name):
    p = FONTS.get(name, name)
    if not Path(p).exists():
        out = subprocess.run(["fc-match", "-f", "%{file}", name], capture_output=True, text=True).stdout
        return out or FONTS["dejavu-bold"]
    return p


@lru_cache(maxsize=256)
def font(name, size):
    return ImageFont.truetype(font_path(name), size)


@lru_cache(maxsize=128)
def load(path, height=None, width=None):
    im = Image.open(ROOT / path).convert("RGBA")
    if height:
        im = im.resize((max(1, round(im.width * height / im.height)), height), Image.LANCZOS)
    elif width:
        im = im.resize((width, max(1, round(im.height * width / im.width))), Image.LANCZOS)
    return im


def paste(canvas, sprite, cx, cy, scale_x=1.0, scale_y=1.0, rot=0.0, anchor="center", alpha=1.0):
    """Pega sprite RGBA. anchor='center' o 'bottom' (cx,cy = punto de apoyo)."""
    sw, sh = max(1, int(sprite.width * scale_x)), max(1, int(sprite.height * scale_y))
    s = sprite.resize((sw, sh), Image.BILINEAR) if (sw, sh) != sprite.size else sprite
    if rot:
        if anchor == "bottom":
            # rotar alrededor de los pies: lienzo con pies en el centro
            pad = Image.new("RGBA", (sw, sh * 2), (0, 0, 0, 0))
            pad.paste(s, (0, 0))
            s = pad.rotate(rot, resample=Image.BICUBIC, expand=True)
            x, y = int(cx - s.width / 2), int(cy - s.height / 2)
        else:
            s = s.rotate(rot, resample=Image.BICUBIC, expand=True)
            x, y = int(cx - s.width / 2), int(cy - s.height / 2)
    else:
        x = int(cx - sw / 2)
        y = int(cy - sh) if anchor == "bottom" else int(cy - sh / 2)
    if alpha < 1:
        a = s.getchannel("A").point(lambda v: int(v * alpha))
        s = s.copy()
        s.putalpha(a)
    canvas.alpha_composite(s, (x, y)) if 0 <= x and 0 <= y and x + s.width <= canvas.width and y + s.height <= canvas.height \
        else _safe_composite(canvas, s, x, y)


def _safe_composite(canvas, s, x, y):
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(canvas.width, x + s.width), min(canvas.height, y + s.height)
    if x1 <= x0 or y1 <= y0:
        return
    canvas.alpha_composite(s.crop((x0 - x, y0 - y, x1 - x, y1 - y)), (x0, y0))


def wrap(text, fnt, max_w, draw):
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        test = (cur + " " + w_).strip()
        if draw.textlength(test, font=fnt) <= max_w or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = w_
    if cur:
        lines.append(cur)
    return lines


def text(canvas, txt, cx, cy, size, fname="sans-bold", fill=(0, 0, 0, 255), stroke=0,
         stroke_fill=(255, 255, 255, 255), max_w=900, line_gap=0.95, align="center", alpha=1.0,
         box=None, box_pad=24, squeeze=1.0):
    """Texto multilínea centrado en (cx, cy). squeeze<1 comprime en X (look 'condensada')."""
    fnt = font(fname, size)
    tmp = Image.new("RGBA", (W * 2, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(tmp)
    lines = []
    for para in txt.split("\n"):
        lines += wrap(para, fnt, max_w / squeeze, d)
    lh = int(size * line_gap)
    widths = [d.textlength(l, font=fnt) for l in lines]
    bw = int(max(widths) + stroke * 2 + 8)
    bh = int(lh * len(lines) + size * 0.3 + stroke * 2)
    layer = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    for i, (l, lw) in enumerate(zip(lines, widths)):
        x = (bw - lw) / 2 if align == "center" else stroke + 4
        ld.text((x, stroke + i * lh), l, font=fnt, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
    if squeeze != 1.0:
        layer = layer.resize((max(1, int(bw * squeeze)), bh), Image.LANCZOS)
    if box:
        bg = Image.new("RGBA", (layer.width + box_pad * 2, layer.height + box_pad), box)
        bg.alpha_composite(layer, (box_pad, box_pad // 2))
        layer = bg
    if alpha < 1:
        a = layer.getchannel("A").point(lambda v: int(v * alpha))
        layer.putalpha(a)
    _safe_composite(canvas, layer, int(cx - layer.width / 2), int(cy - layer.height / 2))
    return layer.size


def punch(img, zoom, cx=W / 2, cy=H / 2):
    """Zoom de cámara (punch-in) alrededor de (cx, cy)."""
    if zoom == 1:
        return img
    w, h = W / zoom, H / zoom
    box = (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)
    return img.resize((W, H), Image.BILINEAR, box=box)


def crunch(img, quality=22):
    """Degradación JPEG controlada (look repost de repost)."""
    import io
    buf = io.BytesIO()
    img.convert("RGB").save(buf, "JPEG", quality=quality)
    return Image.open(io.BytesIO(buf.getvalue())).convert("RGBA")


def shake(t, amp=6, freq=1.3, seed=0):
    """Temblor de 'cámara en mano' suave (no estable a propósito)."""
    return (amp * math.sin(t * freq * 2.1 + seed) + amp * 0.5 * math.sin(t * freq * 5.3 + seed * 2),
            amp * 0.7 * math.sin(t * freq * 1.7 + seed * 3) + amp * 0.4 * math.sin(t * freq * 4.1))


def render(frame_fn, duration, wav_path, out_path, crf=18, post=None):
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    n = int(round(duration * FPS))
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-i", str(wav_path), "-map", "0:v", "-map", "1:a",
           "-c:v", "libx264", "-preset", "medium", "-crf", str(crf), "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-shortest", "-movflags", "+faststart",
           str(out_path)]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        img = frame_fn(i / FPS)
        if post:
            img = post(img, i / FPS)
        p.stdin.write(img.convert("RGB").tobytes())
    p.stdin.close()
    p.wait()
    if p.returncode:
        raise RuntimeError("ffmpeg falló")
    return out_path
