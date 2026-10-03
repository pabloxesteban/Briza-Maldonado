"""Efectos abstractos de la capa (equivalente tatuador de las carpetitas translúcidas de V2)."""
from functools import lru_cache
import numpy as np
from PIL import Image, ImageFilter

from engine import ROOT, W, H

VIOLET = (92, 62, 170)


@lru_cache(maxsize=64)
def transfer(name, height, tint=VIOLET, bleed=1.6):
    """Stencil como papel de calco: línea violeta con sangrado + hoja de papel translúcida."""
    st = Image.open(ROOT / "stencils" / f"{name}.png").convert("RGBA")
    st = st.resize((int(st.width * height / st.height), height), Image.LANCZOS)
    a = np.asarray(st.getchannel("A"), np.float32) / 255
    a = np.clip(a * 1.3, 0, 1)
    ink = Image.new("RGBA", st.size, tint + (0,))
    ink.putalpha(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(bleed)))
    pad = int(height * 0.12)
    sheet = Image.new("RGBA", (st.width + 2 * pad, st.height + 2 * pad), (250, 248, 255, 70))  # hoja de calco
    sheet.alpha_composite(ink, (pad, pad))
    return sheet


def with_alpha(im, k):
    im = im.copy()
    im.putalpha(im.getchannel("A").point(lambda v: int(v * k)))
    return im


def color_flash(canvas, color, k):
    canvas.alpha_composite(Image.new("RGBA", canvas.size, color + (int(255 * k),)))
