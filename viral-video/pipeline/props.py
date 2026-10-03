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
