"""Convierte los stencils transparentes en stickers con borde blanco."""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


def disco(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]
    return x * x + y * y <= r * r


def sticker(src, dst, borde=22, suavizar=30, sombra=True):
    img = Image.open(src).convert("RGBA")
    pad = borde + suavizar + 20
    w, h = img.size
    lienzo = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    lienzo.paste(img, (pad, pad))

    a = np.asarray(lienzo)[..., 3] > 40
    # Silueta redondeada: cerrar huecos, rellenar interior y engordar
    forma = ndimage.binary_closing(a, structure=disco(suavizar))
    forma = ndimage.binary_fill_holes(forma | a)
    forma = ndimage.binary_dilation(forma, structure=disco(borde))
    mascara = Image.fromarray((forma * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))

    base = Image.new("RGBA", lienzo.size, (0, 0, 0, 0))
    if sombra:
        s = mascara.filter(ImageFilter.GaussianBlur(8)).point(lambda v: v * 0.35)
        base.paste(Image.new("RGBA", lienzo.size, (0, 0, 0, 255)), (4, 7), s)
    base.paste(Image.new("RGBA", lienzo.size, (255, 255, 255, 255)), (0, 0), mascara)
    base.alpha_composite(lienzo)
    base.crop(base.getbbox()).save(dst, optimize=True)


if __name__ == "__main__":
    src_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    for p in sorted(src_dir.glob("*.png")):
        sticker(p, out_dir / p.name)
        print(out_dir / p.name)
