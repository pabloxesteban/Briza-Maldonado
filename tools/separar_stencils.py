"""Separa cada diseño de una hoja de flash en PNGs con fondo transparente."""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


def separar(src, out_dir, prefix, merge_px=10, margin=12, min_area=4000, trim=14):
    img = Image.open(src).convert("RGB")
    rgb = np.asarray(img).astype(np.float32)
    gray = rgb.mean(axis=2)

    # Ignorar bordes (marcos negros de captura)
    work = gray.copy()
    work[:trim, :] = work[-trim:, :] = 255
    work[:, :trim] = work[:, -trim:] = 255

    # Fondo papel ≈ mediana; tinta = píxeles claramente más oscuros
    bg = np.median(work)
    ink = work < bg - 45
    blobs = ndimage.binary_dilation(ink, iterations=merge_px)
    raw, n = ndimage.label(blobs)
    sizes = ndimage.sum(ink, raw, range(1, n + 1))
    seeds = [i + 1 for i, sz in enumerate(sizes) if sz >= min_area]

    # Piezas sueltas (letras, puntos, gotas) se asignan al diseño más cercano
    seed_map = np.zeros_like(raw)
    for k, lab in enumerate(seeds, 1):
        seed_map[raw == lab] = k
    # Se agregan de a una, la más cercana primero, para que el texto se encadene
    labels = seed_map.copy()
    pending = [lab for lab in range(1, n + 1) if lab not in seeds]
    while pending:
        dist, (iy, ix) = ndimage.distance_transform_edt(labels == 0, return_indices=True)
        best = min(pending, key=lambda lab: dist[raw == lab].min())
        piece = raw == best
        j = np.argmin(np.where(piece, dist, np.inf))
        labels[piece] = labels[iy.flat[j], ix.flat[j]]
        pending.remove(best)

    # Transparencia proporcional a la oscuridad (conserva sombreado)
    alpha = np.clip((bg - 12 - gray) / (bg - 12 - 25), 0, 1)
    alpha[gray > bg - 12] = 0

    found = [(lab, sl) for lab, sl in enumerate(ndimage.find_objects(labels), 1) if sl]

    # Orden de lectura: filas de arriba a abajo, luego izquierda a derecha
    found.sort(key=lambda t: (round(t[1][0].start / 250), t[1][1].start))
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = []
    for k, (lab, sl) in enumerate(found, 1):
        y0 = max(sl[0].start - margin, 0); y1 = min(sl[0].stop + margin, gray.shape[0])
        x0 = max(sl[1].start - margin, 0); x1 = min(sl[1].stop + margin, gray.shape[1])
        a = alpha[y0:y1, x0:x1] * (labels[y0:y1, x0:x1] == lab)
        out = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
        out[..., :3] = (20, 32, 30)  # tinta verde-negra del original
        out[..., 3] = (a * 255).astype(np.uint8)
        p = out_dir / f"{prefix}_{k:02d}.png"
        Image.fromarray(out, "RGBA").save(p, optimize=True)
        paths.append(p)
    return paths


if __name__ == "__main__":
    for p in separar(Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]):
        print(p)
