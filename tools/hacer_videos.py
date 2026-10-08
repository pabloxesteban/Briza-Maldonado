"""Genera videos verticales "Ruleta de flash" (1080x1920, 30 fps) a partir de los stickers.

Uso:
    python3 tools/hacer_videos.py stickers videos            # un video por diseño
    python3 tools/hacer_videos.py stickers videos gallo      # solo el que cae en gallo
"""
import math
import random
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
FUENTE = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

NOMBRES = {
    "chancho-y-vaca": "Chancho y vaca",
    "corazon-vegan-v1": "Corazón vegan",
    "corazon-vegan-v2": "Corazón vegan",
    "flor-alambre-puas": "Flor y alambre de púas",
    "flor-hojas": "Flor con hojas",
    "frutilla": "Frutilla",
    "gallo": "Gallo",
    "mariposa-daga": "Mariposa con daga",
    "pajaro-flores": "Pájaro con flores",
    "vaca-vive-y-deja-vivir": "Vaca vive y deja vivir",
}

# Fondos saturados para que el borde blanco del sticker resalte
FONDOS = [(184, 52, 43), (58, 92, 74), (196, 140, 38), (52, 78, 112), (166, 84, 54)]


def fuente(tam):
    return ImageFont.truetype(FUENTE, tam)


def texto(draw, y, s, tam, relleno=(255, 255, 255), borde=(20, 16, 14), ancho_max=880):
    f = fuente(tam)
    while draw.textlength(s, font=f) > ancho_max and tam > 30:
        tam -= 4
        f = fuente(tam)
    draw.text((W / 2, y), s, font=f, fill=relleno, anchor="mm",
              stroke_width=max(4, tam // 12), stroke_fill=borde)


def ease_out(t):
    return 1 - (1 - t) ** 3


def cronograma(n_disenos, objetivo, rng):
    """Lista de (frame_inicio, indice): rápido al principio, frena y cae en objetivo."""
    gaps = [2] * 14
    g = 2.0
    while g < 16:
        g *= 1.16
        gaps.append(round(g))
    orden = []
    prev = None
    for _ in gaps:
        i = rng.randrange(n_disenos)
        while i == prev:
            i = rng.randrange(n_disenos)
        orden.append(i)
        prev = i
    if orden[-2] == objetivo:
        orden[-2] = (objetivo + 1) % n_disenos
    orden[-1] = objetivo
    pasos, f = [], 0
    for gap, i in zip(gaps, orden):
        pasos.append((f, i))
        f += gap
    return pasos, pasos[-1][0]


def preparar(img, alto=740, ancho=820):
    esc = min(alto / img.height, ancho / img.width)
    return img.resize((round(img.width * esc), round(img.height * esc)), Image.LANCZOS)


def pegar(lienzo, img, escala, angulo, cy=960):
    im = img
    if escala != 1:
        im = im.resize((max(1, round(im.width * escala)), max(1, round(im.height * escala))), Image.BILINEAR)
    if angulo:
        im = im.rotate(angulo, resample=Image.BICUBIC, expand=True)
    lienzo.alpha_composite(im, (round(W / 2 - im.width / 2), round(cy - im.height / 2)))


def rayos(draw, t, color):
    """Destello de rayos detrás del diseño ganador."""
    r1, r2 = 300 + 380 * ease_out(t), 520 + 600 * ease_out(t)
    for k in range(16):
        a = k * math.pi / 8 + t * 0.4
        da = 0.07
        pts = [(W / 2 + r1 * math.cos(a - da), 960 + r1 * math.sin(a - da)),
               (W / 2 + r2 * math.cos(a), 960 + r2 * math.sin(a)),
               (W / 2 + r1 * math.cos(a + da), 960 + r1 * math.sin(a + da))]
        draw.polygon(pts, fill=color)


def video(stickers, objetivo, salida, seed):
    rng = random.Random(seed)
    nombres = [p.stem for p in stickers]
    imgs = [preparar(Image.open(p).convert("RGBA")) for p in stickers]
    fondo = FONDOS[seed % len(FONDOS)]
    claro = tuple(min(255, c + 40) for c in fondo)
    pasos, f_cae = cronograma(len(imgs), objetivo, rng)
    angulos = {f: rng.uniform(-7, 7) for f, _ in pasos}
    f_cta = f_cae + int(2.6 * FPS)
    total = f_cta + int(3.2 * FPS)
    nombre = NOMBRES.get(nombres[objetivo], nombres[objetivo].replace("-", " ").capitalize())

    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", str(salida)],
        stdin=subprocess.PIPE)

    for f in range(total):
        lienzo = Image.new("RGBA", (W, H), fondo + (255,))
        d = ImageDraw.Draw(lienzo)

        if f < f_cae:
            inicio, idx = max((p for p in pasos if p[0] <= f), key=lambda p: p[0])
            pop = 1 + 0.07 * max(0, 1 - (f - inicio) / 4)
            pegar(lienzo, imgs[idx], pop, angulos[inicio])
        else:
            t = (f - f_cae) / FPS
            rayos(d, min(1, t / 0.6) + t * 0.05, claro)
            rebote = 1 + 0.28 * math.exp(-6 * t) * math.cos(14 * t)
            lento = 1 + 0.04 * min(1, t / 6)
            ang = angulos[f_cae] * math.exp(-5 * t)
            pegar(lienzo, imgs[objetivo], rebote * lento, ang)
            if f < f_cae + 4:  # flash blanco al caer
                a = int(200 * (1 - (f - f_cae) / 4))
                lienzo.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, a)))
                d = ImageDraw.Draw(lienzo)

        if f < f_cta:
            texto(d, 300, "RULETA DE FLASH", 104)
            texto(d, 410, "lo que salga, te lo tatuás", 56)
        else:
            texto(d, 300, "¿TE LO HARÍAS?", 104, relleno=(255, 236, 160))
            texto(d, 410, "Comentá SÍ o NO", 60)

        if f >= f_cae:
            aparece = min(1, (f - f_cae) / 6)
            texto(d, 1430, "TE TOCÓ:", round(54 * aparece) or 1, relleno=(255, 236, 160))
            texto(d, 1510, nombre.upper(), round(78 * aparece) or 1)
        if f >= f_cta:
            texto(d, 1610, "Turnos: escribime TURNO por MD", 46, relleno=(255, 236, 160))

        ff.stdin.write(lienzo.convert("RGB").tobytes())

    ff.stdin.close()
    if ff.wait() != 0:
        raise RuntimeError(f"ffmpeg falló con {salida}")


if __name__ == "__main__":
    src_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    stickers = sorted(src_dir.glob("*.png"))
    elegidos = sys.argv[3:] or [p.stem for p in stickers]
    for n, stem in enumerate(elegidos):
        objetivo = [p.stem for p in stickers].index(stem)
        salida = out_dir / f"ruleta-{stem}.mp4"
        video(stickers, objetivo, salida, seed=objetivo)
        print(salida)
