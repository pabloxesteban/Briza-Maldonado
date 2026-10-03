---
name: video-analysis
description: Extraer datos objetivos de un video corto (cortes, planos, texto, audio, tempo, drops, silencios) con ffmpeg/Python antes de cualquier interpretación creativa.
---
# Video analysis

1. `ffprobe` → duración, resolución, fps, audio.
2. Contact sheets 1 fps: `ffmpeg -i in.mp4 -vf "fps=1,scale=288:-1,tile=6x2" sheet_%02d.jpg` y leerlos en orden.
3. Cortes: `ffmpeg -i in.mp4 -vf "select='gt(scene,0.25)',showinfo" -f null -` (sin resultados = plano único).
4. Audio: RMS por ventanas de 0,5 s para encontrar intro/drop/silencios; autocorrelación de onsets para BPM; `silencedetect=n=-35dB:d=0.4`.
5. Voz: faster-whisper (`small`, int8) si hay habla; si sólo hay música, reportarlo.
6. Frames de detalle en momentos clave (`-ss t -frames:v 1`) para leer tipografía y overlays.

Salida: tabla de tiempos (s) → evento visual / texto / audio. Separar SIEMPRE "lo que se ve" de "la hipótesis de por qué funciona".
