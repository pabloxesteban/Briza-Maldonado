# Stencils

Cada diseño de las hojas de flash (`originales/`) separado en su propio PNG con fondo transparente.
El sombreado se conserva como transparencia parcial, así que se ven bien sobre cualquier fondo.

Para regenerarlos:

```sh
pip install pillow numpy scipy
python3 tools/separar_stencils.py originales/hoja_2.jpg salida/ hoja2
```

## Stickers

Versión con borde blanco y sombra suave en `stickers/`:

```sh
python3 tools/hacer_stickers.py stencils stickers
```

## Videos "Ruleta de flash"

Videos verticales para TikTok/Reels (1080x1920, 30 fps, ~10 s, sin audio) en `videos/`:
la ruleta gira entre los diseños, frena en uno y cierra con "¿Te lo harías?" y el llamado a turnos.
Hay uno por diseño (cada uno cae en un flash distinto y cambia el color de fondo).

```sh
python3 tools/hacer_videos.py stickers videos          # todos
python3 tools/hacer_videos.py stickers videos frutilla # uno solo
```
