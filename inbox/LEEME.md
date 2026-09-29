# Subir contenido nuevo

1. Guardá las fotos que te manda Briza así:
   - **Galería** → `inbox/galeria/`  nombre: `Título - Estilo - Zona.jpg`
     (Estilo: Traditional, Black & white o Color) · ej. `Golondrina - Traditional - Antebrazo.jpg`
   - **Flashes** → `inbox/flashes/`  nombre: `Nombre - cm - precio.jpg` · ej. `Golondrina - 7 - 45000.jpg`
     Foto del dibujo sobre papel blanco, derecha y con buena luz.
2. Corré `python3 tools/publicar.py` y revisá los recortes en `public/flash/`.
3. Si está todo bien: `python3 tools/publicar.py --push` (o `git push`). La web se actualiza en 1–2 minutos.

Los flashes reservados y tatuados se marcan solos desde el Google Calendar de Briza.
