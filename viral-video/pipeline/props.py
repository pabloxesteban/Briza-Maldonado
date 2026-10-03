"""Props generados "feos a propósito": fondos tipo Paint/Canva, cuerpo de títere, marca de agua IG."""
import math
import random

from PIL import Image, ImageDraw, ImageFilter

from engine import W, H, font, load

INK = (22, 30, 28, 255)
CREAM = (246, 238, 222, 255)


def rambla_paint(seed=3):
    """Postal 'aspiracional' dibujada en Paint: cielo, mar, escollera, velero, bloque blanco.
    No es el footage original: es un fondo genérico de costanera."""
    rnd = random.Random(seed)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    d = ImageDraw.Draw(im)
    horizon = 980
    for y in range(horizon):  # degradé de cielo con bandas (banding = look barato)
        k = (y // 24) * 24 / horizon
        d.line([(0, y), (W, y)], fill=(int(40 + 120 * k), int(110 + 90 * k), int(205 + 40 * k), 255))
    d.rectangle([0, horizon, W, 1330], fill=(28, 70, 140, 255))
    for i in range(40):  # olitas en Paint
        x, y = rnd.randint(0, W), rnd.randint(horizon + 20, 1320)
        d.arc([x, y, x + 50, y + 18], 200, 340, fill=(80, 130, 200, 255), width=4)
    d.rectangle([0, horizon - 14, W, horizon + 2], fill=(235, 232, 220, 255))  # escollera
    # velero torpe
    bx, by = 330, horizon - 8
    d.polygon([(bx - 70, by), (bx + 70, by), (bx + 50, by + 22), (bx - 50, by + 22)], fill=(250, 250, 250, 255), outline=INK)
    d.line([(bx, by), (bx, by - 120)], fill=INK, width=4)
    d.polygon([(bx + 4, by - 115), (bx + 4, by - 8), (bx + 70, by - 8)], fill=(255, 255, 255, 255), outline=INK)
    # piso de rambla
    d.rectangle([0, 1330, W, H], fill=(196, 170, 132, 255))
    for i in range(500):
        x, y = rnd.randint(0, W), rnd.randint(1335, H)
        d.point((x, y), fill=(160, 135, 100, 255))
    # sol con rayitas
    d.ellipse([820, 140, 960, 280], fill=(255, 214, 40, 255), outline=(240, 150, 20, 255), width=5)
    for a in range(0, 360, 30):
        r = math.radians(a)
        d.line([(890 + 90 * math.cos(r), 210 + 90 * math.sin(r)), (890 + 130 * math.cos(r), 210 + 130 * math.sin(r))],
               fill=(240, 150, 20, 255), width=6)
    return im


def bench(width=620, height=150):
    im = Image.new("RGBA", (width + 40, height + 50), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.polygon([(0, 30), (width, 30), (width + 30, 0), (30, 0)], fill=(225, 225, 220, 255), outline=INK)
    d.rectangle([0, 30, width, 30 + height], fill=(248, 248, 244, 255), outline=INK, width=3)
    d.polygon([(width, 30), (width + 30, 0), (width + 30, height), (width, 30 + height)], fill=(205, 205, 200, 255), outline=INK)
    return im


def ig_watermark(handle, size=30, color=(255, 255, 255, 235)):
    f = font("sans-bold", size)
    tw = int(f.getlength(handle))
    im = Image.new("RGBA", (tw + size * 2, size * 2 + 6), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    s = size + 6
    d.rounded_rectangle([0, 0, s, s], radius=s // 4, outline=color, width=3)
    d.ellipse([s * 0.28, s * 0.28, s * 0.72, s * 0.72], outline=color, width=3)
    d.ellipse([s * 0.72, s * 0.14, s * 0.84, s * 0.26], fill=color)
    d.text((s + 10, (s - size) / 2 - 2), handle, font=f, fill=color)
    return im.crop(im.getbbox())


IG_COLORS = [(254, 218, 117), (250, 126, 30), (214, 41, 118), (150, 47, 191), (79, 91, 213), (255, 255, 255)]


def ig_icon(size, color, width=None):
    """Ícono IG de línea (rounded square + círculo + punto), dibujado a mano."""
    w = width or max(3, size // 11)
    im = Image.new("RGBA", (size + w * 2, size + w * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    o = w
    d.rounded_rectangle([o, o, o + size, o + size], radius=size // 4, outline=color, width=w)
    d.ellipse([o + size * 0.27, o + size * 0.27, o + size * 0.73, o + size * 0.73], outline=color, width=w)
    r = size * 0.065
    d.ellipse([o + size * 0.76 - r, o + size * 0.24 - r, o + size * 0.76 + r, o + size * 0.24 + r], fill=color)
    return im


def watermark(handle, color, size=40, text_fill=(0, 0, 0, 255), stroke=0, stroke_fill=(0, 0, 0, 255)):
    f = font("sans-bold", size)
    icon = ig_icon(int(size * 1.15), color + (255,), max(3, size // 10))
    tw = int(f.getlength(handle)) + stroke * 2 + 4
    im = Image.new("RGBA", (icon.width + 14 + tw, max(icon.height, int(size * 1.4)) + stroke * 2), (0, 0, 0, 0))
    im.alpha_composite(icon, (0, (im.height - icon.height) // 2))
    ImageDraw.Draw(im).text((icon.width + 14, (im.height - size) // 2 - size // 8), handle, font=f, fill=text_fill,
                            stroke_width=stroke, stroke_fill=stroke_fill)
    return im


def arrow(p0, p1, color=(224, 16, 26, 255), width=14, seed=0):
    """Flecha 'a mano alzada' de p0 a p1 (punta en p1). Devuelve (imagen, offset)."""
    rnd = random.Random(seed)
    x0, y0 = p0
    x1, y1 = p1
    minx, miny = min(x0, x1) - 80, min(y0, y1) - 80
    im = Image.new("RGBA", (int(abs(x1 - x0) + 160), int(abs(y1 - y0) + 160)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pts = []
    for k in range(9):
        t = k / 8
        j = 0 if k in (0, 8) else rnd.uniform(-6, 6)
        pts.append((x0 + (x1 - x0) * t - minx + j, y0 + (y1 - y0) * t - miny + j * 0.6 + 18 * math.sin(t * math.pi)))
    d.line(pts, fill=color, width=width, joint="curve")
    ang = math.atan2(pts[-1][1] - pts[-2][1], pts[-1][0] - pts[-2][0])
    tip = pts[-1]
    for da in (2.55, -2.55):
        d.line([tip, (tip[0] + 55 * math.cos(ang + da), tip[1] + 55 * math.sin(ang + da))], fill=color, width=width)
    return im, (int(minx), int(miny))


def pinterest_thumb(w=270, h=220, seed=4):
    """'Foto de Pinterest' fea: manchones pastel de acuarela + lobo geométrico."""
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w, h), (248, 244, 240, 255))
    for _ in range(9):
        c = rnd.choice([(255, 182, 193), (173, 216, 230), (221, 160, 221), (255, 228, 181)])
        x, y, r = rnd.randint(0, w), rnd.randint(0, h), rnd.randint(30, 80)
        blob = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(blob).ellipse([x - r, y - r, x + r, y + r], fill=c + (120,))
        im.alpha_composite(blob.filter(ImageFilter.GaussianBlur(14)))
    d = ImageDraw.Draw(im)
    cx, cy = w / 2, h / 2 + 10
    pts = [(cx - 60, cy - 70), (cx - 30, cy - 20), (cx + 30, cy - 20), (cx + 60, cy - 70), (cx + 45, cy + 20),
           (cx, cy + 70), (cx - 45, cy + 20)]
    d.polygon(pts, outline=(60, 60, 70, 255))
    for a in range(len(pts)):
        d.line([pts[a], (cx, cy)], fill=(60, 60, 70, 255), width=2)
    d.rectangle([0, 0, w - 1, h - 1], outline=(200, 200, 200, 255), width=2)
    return im
