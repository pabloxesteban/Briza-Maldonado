"""Publish new gallery photos and flashes dropped in inbox/.

  inbox/galeria/   one photo per tattoo, named  "Título - Estilo - Zona.jpg"
                   Estilo: Traditional | Black & white | Color   (Estilo and Zona are optional)
                   e.g.  "Golondrina - Traditional - Antebrazo.jpg"
  inbox/flashes/   one photo/scan per flash, named  "Nombre - cm - precio.jpg"
                   e.g.  "Golondrina - 7 - 45000.jpg"   (drawing on white paper, well lit)

Run:   python3 tools/publicar.py            → processes, optimizes, builds
       python3 tools/publicar.py --push     → also commits and pushes (the site updates in ~2 min)

Processed files move to inbox/_publicados/. Review the flash cut-outs in public/flash/ before pushing.
"""
import os, re, shutil, subprocess, sys, unicodedata
import numpy as np
from PIL import Image, ImageFilter, ImageOps
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INBOX = os.path.join(ROOT, 'inbox')
DONE = os.path.join(INBOX, '_publicados')
PUB = os.path.join(ROOT, 'public')
EXTS = ('.jpg', '.jpeg', '.png', '.webp', '.heic')
STYLES = {'traditional': 'Traditional', 'black & white': 'Black & white', 'black and white': 'Black & white', 'bw': 'Black & white', 'color': 'Color'}


def slugify(t):
    t = unicodedata.normalize('NFD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t.replace('&', ' ')).strip('-')


def ars(n):
    return '$' + f'{int(n):,}'.replace(',', '.')


def open_image(path):
    if path.lower().endswith('.heic'):
        try:
            from pillow_heif import register_heif_opener
            register_heif_opener()
        except ImportError:
            sys.exit('Para fotos .heic instalá: pip install pillow-heif  (o exportalas como JPG)')
    return ImageOps.exif_transpose(Image.open(path))


def insert_into_array(file, marker, entry):
    """Insert `entry` as the last item of the array that starts at `marker`."""
    src = open(file, encoding='utf-8').read()
    start = src.index(marker)
    end = src.index('\n]', start)
    src = src[:end] + '\n' + entry + src[end:]
    open(file, 'w', encoding='utf-8').write(src)


# ─── Gallery ─────────────────────────────────────────────────────────────
def gallery(path):
    name = os.path.splitext(os.path.basename(path))[0]
    parts = [p.strip() for p in name.split(' - ')]
    title = parts[0]
    style = STYLES.get((parts[1] if len(parts) > 1 else 'traditional').lower(), 'Traditional')
    zone = parts[2] if len(parts) > 2 else ''
    slug = slugify(title)
    works = os.path.join(ROOT, 'src', 'data', 'works.ts')
    if f"slug: '{slug}'" in open(works, encoding='utf-8').read():
        slug = f'{slug}-{len(os.listdir(os.path.join(PUB, "portfolio")))}'
    im = open_image(path).convert('RGB')
    im.thumbnail((1600, 1600))
    im.save(os.path.join(PUB, 'portfolio', f'{slug}.jpg'), quality=88, optimize=True)
    esc = lambda t: t.replace("'", "\\'")
    # New pieces go first in the gallery
    src = open(works, encoding='utf-8').read()
    marker = 'export const WORKS: Work[] = ['
    entry = f"  {{ slug: '{slug}', title: '{esc(title)}', style: '{style}', zone: '{esc(zone)}', src: P + '{slug}.jpg' }},"
    src = src.replace(marker, marker + '\n' + entry, 1)
    open(works, 'w', encoding='utf-8').write(src)
    print(f'  ✓ Galería: {title} ({style}{", " + zone if zone else ""})')


# ─── Flashes ─────────────────────────────────────────────────────────────
def cut_flash(path, slug):
    """Photo of a drawing on white paper → die-cut sticker PNG + ink-only PNG for the try-on."""
    im = open_image(path).convert('RGB')
    im.thumbnail((1400, 1400))
    a = np.asarray(im).astype(float)
    lum = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2])
    # Even out uneven lighting on the paper
    paper = np.asarray(Image.fromarray(lum.astype('uint8')).filter(ImageFilter.GaussianBlur(40))).astype(float)
    norm = np.clip(lum / np.maximum(paper, 1), 0, 1)
    sat = a.max(-1) - a.min(-1)
    ink = (norm < 0.72) | (sat > 60)
    ink = ndimage.binary_opening(ink, iterations=1)
    lab, n = ndimage.label(ndimage.binary_dilation(ink, iterations=8))
    if not n:
        raise ValueError('no encontré el dibujo (¿foto muy oscura o sin contraste?)')
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.04])
    shape = ndimage.binary_fill_holes(keep)
    y, x = np.where(shape)
    y0, y1, x0, x1 = max(0, y.min() - 30), y.max() + 30, max(0, x.min() - 30), x.max() + 30
    crop = lambda arr: arr[y0:y1, x0:x1]
    rgb, shape, norm, ink = crop(a), crop(shape), crop(norm), crop(ink)
    # Whiten the paper, keep the drawing's colour
    clean = rgb.copy()
    white = (norm > 0.8) & (a[y0:y1, x0:x1].max(-1) - a[y0:y1, x0:x1].min(-1) < 50)
    clean[white] = 255
    border = ndimage.binary_dilation(shape, iterations=14)
    alpha = np.asarray(Image.fromarray((border * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5)))
    sticker = np.dstack([np.where(border[..., None], clean, 255), alpha]).astype('uint8')
    Image.fromarray(sticker).save(os.path.join(PUB, 'flash', f'{slug}.png'), optimize=True)
    shutil.copy(os.path.join(PUB, 'flash', f'{slug}.png'), os.path.join(PUB, 'flash', f'{slug}-paper.png'))
    # Ink only (no paper) for "Probalo en tu cuerpo"
    lum2 = (0.299 * clean[..., 0] + 0.587 * clean[..., 1] + 0.114 * clean[..., 2]) / 255
    inside = ndimage.binary_erosion(border, iterations=10)
    alpha2 = (np.clip((0.68 - lum2) / 0.5, 0, 1) ** 1.05 * inside * 255).astype('uint8')
    out = np.zeros((*alpha2.shape, 4), 'uint8'); out[..., 0], out[..., 1], out[..., 2], out[..., 3] = 26, 22, 32, alpha2
    ink_im = Image.fromarray(out)
    ink_im.crop(ink_im.getbbox()).save(os.path.join(PUB, 'flash', 'ink', f'{slug}.png'), optimize=True)
    # Neon dots like the stickers Briza uses: 3-4 points on the cut-out's edge, spread around it
    h, w = border.shape
    edge = border & ~ndimage.binary_erosion(border, iterations=6)
    ys, xs = np.where(edge)
    cy, cx = ys.mean(), xs.mean()
    angles = np.arctan2(ys - cy, xs - cx)
    dots = []
    for target in (-2.4, -0.3, 1.2, 2.6)[: 4 if w * h > 250000 else 3]:
        k = int(np.argmin(np.abs(np.angle(np.exp(1j * (angles - target))))))
        dots.append([round(float(xs[k]) / w, 3), round(float(ys[k]) / h, 3)])
    return round(float(h) / w, 3), dots


def flash(path):
    name = os.path.splitext(os.path.basename(path))[0]
    parts = [p.strip() for p in name.split(' - ')]
    if len(parts) < 3:
        print(f'  ✗ {os.path.basename(path)}: el nombre tiene que ser "Nombre - cm - precio"'); return False
    title, cm, price = parts[0], re.sub(r'\D', '', parts[1]), re.sub(r'\D', '', parts[2])
    slug = slugify(title)
    aspect, dots = cut_flash(path, slug)
    esc = title.replace("'", "\\'")
    insert_into_array(os.path.join(ROOT, 'src', 'components', 'Flash.tsx'), 'const FLASHES: FlashDef[] = [',
                      f"  {{ slug: '{slug}', name: '{esc}', price: '{ars(price)}', cm: {int(cm or 0)}, available: true, aspect: {aspect}, dots: {dots} }},")
    insert_into_array(os.path.join(ROOT, 'agent', 'src', 'flashes.ts'), 'export const FALLBACK: Flash[] = [',
                      f"  {{ name: '{esc}', cm: {int(cm or 0)}, price: '{ars(price)}', available: true }},")
    print(f'  ✓ Flash: {title} · {cm} cm · {ars(price)}   → revisá public/flash/{slug}.png')
    return True


def main():
    os.makedirs(DONE, exist_ok=True)
    for sub in ('galeria', 'flashes'):
        os.makedirs(os.path.join(INBOX, sub), exist_ok=True)
    jobs = [('galeria', gallery), ('flashes', flash)]
    done = 0
    for sub, fn in jobs:
        folder = os.path.join(INBOX, sub)
        for f in sorted(os.listdir(folder)):
            if not f.lower().endswith(EXTS):
                continue
            path = os.path.join(folder, f)
            try:
                if fn(path) is not False:
                    shutil.move(path, os.path.join(DONE, f)); done += 1
            except Exception as e:
                print(f'  ✗ {f}: {e}')
    if not done:
        print('No hay nada nuevo en inbox/galeria ni inbox/flashes.'); return
    print('Optimizando imágenes…')
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'optimize_images.py')], check=True, stdout=subprocess.DEVNULL)
    print('Compilando…')
    subprocess.run(['npx', 'next', 'build'], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    if '--push' in sys.argv:
        subprocess.run(['git', 'add', '-A', 'public', 'src', 'agent/src'], cwd=ROOT, check=True)
        subprocess.run(['git', 'commit', '-m', f'Contenido nuevo: {done} archivo(s)'], cwd=ROOT, check=True)
        subprocess.run(['git', 'push', 'origin', 'HEAD:main'], cwd=ROOT, check=True)
        print('✓ Publicado. La web se actualiza en 1–2 minutos.')
    else:
        print(f'✓ Listo ({done}). Revisá y publicá con:  python3 tools/publicar.py --push  (o git push)')


if __name__ == '__main__':
    main()
