"""Pre-generate responsive WebP variants for next/image (the site is a static export, so there is no image server).

Run after adding or changing images in public/:  python3 tools/optimize_images.py
Writes public/_img/<same path>-<width>.webp and src/lib/imageManifest.json.
"""
import json, os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..')
PUBLIC = os.path.join(ROOT, 'public')
OUT = os.path.join(PUBLIC, '_img')
WIDTHS = [320, 480, 640, 828, 1080, 1284]
SOURCES = ['portfolio', 'flash', 'briza-portrait.jpg']

manifest = {}
for src in SOURCES:
    base = os.path.join(PUBLIC, src)
    files = [base] if os.path.isfile(base) else [os.path.join(base, f) for f in sorted(os.listdir(base))]
    for path in files:
        if not path.lower().endswith(('.jpg', '.jpeg', '.png')) or '/_img/' in path:
            continue
        # flash PNGs: only the cut-paper versions are shown; the originals are sources for them
        if '/flash/' in path.replace(os.sep, '/') and path.endswith('.png') and not path.endswith('-paper.png'):
            continue
        rel = os.path.relpath(path, PUBLIC).replace(os.sep, '/')
        im = Image.open(path)
        alpha = im.mode in ('RGBA', 'LA', 'P')
        im = im.convert('RGBA' if alpha else 'RGB')
        widths = [w for w in WIDTHS if w < im.width] + [im.width]
        stem = os.path.splitext(rel)[0]
        for w in widths:
            out = os.path.join(OUT, f'{stem}-{w}.webp')
            os.makedirs(os.path.dirname(out), exist_ok=True)
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=80 if not alpha else 85, method=6)
        manifest['/' + rel] = widths

with open(os.path.join(ROOT, 'src', 'lib', 'imageManifest.json'), 'w') as f:
    json.dump(manifest, f, indent=0, sort_keys=True)
print(len(manifest), 'images')
