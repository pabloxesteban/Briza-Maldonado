# Output — video viral de Briza (versión Briza del trend de la señora bailando)

## Entregables
| Archivo | Qué es |
|---|---|
| `final/briza-viral-final.mp4` | Master 1080×1920, 30 fps, 53,8 s. Footage y audio original de la señora intactos + capa de Briza. |
| `final/briza-preview-liviana.mp4` | Preview 360p (4 MB) para ver rápido en el celular. |
| `variants/hook-a.mp4` | Hook "Ella ya **sacó turno**" (más absurdo). |
| `variants/hook-b.mp4` | Hook "¿Querés **tatuarte** en Palermo?" (más argentino/local). |
| `variants/hook-c.mp4` | Hook "¿Querés un **tattoo tradicional**?" (más tattoo). |
| `variants/hooks-preview.jpg` | Comparación de los 4 primeros frames. |
| `production/final-script.md` | Guion final por beats (vigente). |
| `production/editing-notes.md`, `shot-list.md` | Dirección visual y momentos del footage (incluye historial; lo vigente es lo que coincide con `build_v4.py`). |
| `social/captions.md`, `social/comments.md` | Captions IG/TikTok, comentario fijado, respuestas de Briza, datos a confirmar. |
| `analysis/` | Deconstrucción del trend, meme framework, adaptación argentina, integración tattoo. |
| `concepts/` | Los 3 conceptos y la selección (históricos: escritos antes de las reglas del cliente #1–#3). |
| `review/` | Retención, conversión y rondas de QC 1–3. |

## Cómo re-renderizar
```sh
python3 viral-video/pipeline/build_v4.py                     # master
python3 viral-video/pipeline/build_v4.py --hook a --from-master output/final/briza-viral-final.mp4 output/variants/hook-a.mp4
python3 viral-video/pipeline/build_v4.py --frames 10,20,30   # frames de control
```
Requiere `work/video1.mp4` (VIDEO_1 original) — no está versionado.

## Reglas del cliente aplicadas (resumen)
1. La señora y su audio, tal cual; estructura de VIDEO_2 (drop ≈10 s, cierre ≈49,5 s).
2. Sin handle ni logo de IG; sin chat; sin datos inventados ni chistes en los subtítulos.
3. Voz y tipografía del reel de Briza (blanco + palabra en amarillo); Palermo, muchos animalitos, agenda abierta.
4. Más tatuajes terminados (portfolio) que flashes; flashes pocos (sin gallo; chancho y vaca destacado).
5. Capa de stencils semitransparentes por toda la pantalla pulsando con el bombo; todo sincronizado a los beats reales (125,73 BPM).
