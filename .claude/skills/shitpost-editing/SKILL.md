---
name: shitpost-editing
description: Lenguaje de edición shitpost "diseñado feo" (no mal hecho) para Reels/TikTok y cómo implementarlo con ffmpeg + PIL.
---
# Shitpost editing

**Feo a propósito ≠ mal hecho.** Lo feo es una elección consistente; lo legible y el timing son innegociables.

Recursos válidos (usar pocos y con intención):
- Tipografía default (Arial/Helvetica/Liberation Sans, Impact-like, Comic-like), texto con contorno negro/blanco, centrado torpe, a veces semi-transparente.
- Recortes de imagen pegados sin sombra o con borde blanco de sticker; aparecen de golpe (cut-in), sin easing.
- Zoom punch-in brusco (1.0 → 1.25 en 1–2 frames) en el beat/punchline.
- Degradación controlada: JPEG crunch, saturación subida, leve ruido. Nunca al punto de no leerse.
- Marca de agua de "publicidad casera" (ícono IG + @usuario chiquito).
- Acumulación: cantidad de elementos que crece con el tiempo = escalada visual.
- Corte seco a negro / freeze frame / "vine boom" como puntuación.

Reglas técnicas:
- 1080x1920, 30 fps, H.264 yuv420p, AAC 44.1 kHz, `-movflags +faststart`.
- Zona segura: texto importante entre y=250 y y=1450, x=60–960 (UI de TikTok/IG abajo y a la derecha).
- Texto: mín. 64 px de alto de x-height en 1080p para frases clave; máx. ~6 palabras en pantalla a la vez.
- Sincronizar entradas con el beat (a 123 BPM beat = 0,4878 s).
- Pipeline de referencia del proyecto: `viral-video/pipeline/render.py` (frames PIL → ffmpeg).
