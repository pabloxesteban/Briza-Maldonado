# Concepto A' — SAFE VIRAL: "El comercial de la vaca" (grilla fiel, 53,8 s)

> La plantilla de V2 bien hecha: el footage de VIDEO_1, intacto, usado como "comercial oficial" de un estudio de tattoo tradicional vegano. La mecánica es la misma que V2 (rubro de nicho + producto que se acumula + CTA de flyer). La capa es toda propia: flashes de Briza, copy de aviso porteño, gag "stencil → se tatúa" y tarjeta de turno.

**Idea (1 frase):** la señora del saco rojo protagoniza sin saberlo la publicidad más seria del mundo de la vaca "vive y deja vivir", mientras los flashes de Briza la van rodeando cada vez más.

## Fuente y mapeo (regla del cliente)
- Video: `work/video1.mp4` escalado a 1080x1920, con su audio original sin tocar. Sin freezes, sin cortes y sin punch-ins sobre el footage.
- Rango: **src 5,00 → 58,80** continuo. **out = src − 5,00.** Drop (src 15,0) en **out 10,00**. Fin en **out 53,80**, antes de que se caiga la cámara.
- Grilla: 1 beat = 0,488 s. Compases post-drop: 10,00 · 11,95 · 13,90 · 15,86 · 17,81 · 19,76 · 21,71 · 23,66 · 25,62 · 27,57 · 29,52 · 31,47 · 33,42 · 35,37 · 37,33 · 39,28 · 41,23 · 43,18 · 45,13 · 47,09 · 49,04 · 50,99 · 52,94.
- End card en **49,53–53,80**, igual que V2.
- La cámara deriva desde ≈25 s (el horizonte baja ≈40 px) y el bloque se corre en 51–53. Todo lo que vaya "pegado" a la escena necesita tracking.

## Hook (frame 1)
- Footage en src 5,00: ella de espaldas, el mar y el velero de fondo.
- **"¿querés tatuarte una vaca?"** en Liberation Sans Bold condensada (X al 80 %), negra, al 85 % del ancho, cap-height ≥ 110 px, en el cielo (y≈450). Sin fade.
- Debajo, el sticker de la vaca grande. Marca de agua desde el frame 0.

## Estructura
| out (s) | src (s) | Capa |
|---|---|---|
| 0,00 | 5,00 | Hook + vaca + marca de agua (ícono IG + @brizamaldonado, ≈40 px, arriba a la derecha) |
| 2,20 | 7,20 | Se va la vaca y queda el texto |
| 4,15 | 9,15 | Primera tanda al estilo V2: 4 vacas en **stencil** (solo línea) |
| 4,63 | 9,63 | Las 4 "se tatúan" y pasan en seco a **sticker** |
| 5,61 | 10,61 | Se van |
| 6,10–8,05 | 11,1–13,05 | **"tradicional vegano"** en negro al 100 % (cumple el rol del "vení a mi taller" de V2) |
| 8,05–10,00 | 13,05–15,0 | Limpio. Ella de frente acomodándose el saco (**hueco de retención conocido**) |
| **10,00** | **15,00** | **DROP.** Entran 8–10 stickers desde los bordes en 1 beat |
| 10,98–17,81 | 16–22,8 | Tandas on/off cada 2 beats (frutilla → gallo → mariposa → corazón Vegan) |
| 13,90 | 18,90 | **"turnos por MD"** |
| 17,81 | 22,81 | Las piezas ya no se van. La marca de agua salta a media izquierda |
| 19,76 | 24,76 | "zona: bs as (consultar)", casi ilegible, sobre cielo limpio |
| 21,71 | 26,71 | **"no hacemos envíos (es un tatuaje)"** |
| 23,66 | 28,66 | **"¿duele? consultá por privado"** |
| 25,62–39,28 | 30,6–44,3 | Saturación: 1 pieza por beat, hasta ≈25 |
| 27,57 | 32,57 | **"3 cuotas sin interés en la vaca"** |
| 31,47 | 36,47 | **"seña por alias"** |
| 33,42 | 38,42 | **"consultá promo vaca + chancho"** + chancho-y-vaca gigante durante 1 compás |
| 37,33 | 42,33 | **"compartan que me ayuda un montón"** (2 compases) |
| 41,23–45,13 | 46,2–50,1 | Entran torcidas las hojas completas (`originales/`), en el tercio inferior. La marca de agua vuelve a su lugar. **Hay poco material nuevo: es el segundo hueco conocido** |
| 45,13–47,09 | 50,1–52,1 | Los stickers se van, varios por beat |
| 47,09–49,53 | 52,1–54,5 | Tarjeta de turno crema: "TURNO · día: ___ · hora: ___ · diseño: LA VACA" |
| 49,53–53,80 | 54,5–58,8 | **End card V2:** video al 45 %, ella visible, ícono IG que cambia de color en cada beat y @brizamaldonado grande (cap-height ≥ 80 px, y≈950) |

## Texto en pantalla (exacto)
¿querés tatuarte una vaca? · tradicional vegano · turnos por MD · zona: bs as (consultar) · no hacemos envíos (es un tatuaje) · ¿duele? consultá por privado · 3 cuotas sin interés en la vaca · seña por alias · consultá promo vaca + chancho · compartan que me ayuda un montón · TURNO · día: ___ · hora: ___ · diseño: LA VACA

## Audio
Pista original de src 5,0 a 58,8, sin tocar. Cero SFX.

## Integración tattoo / Briza / CTA
- Los 10 flashes son el producto acumulado.
- Briza aparece como "la voz del aviso", con la marca de agua y el end card.
- CTAs dentro del chiste: "turnos por MD", "seña por alias" y la tarjeta.

## Producción
100 % producible ahora: trim con ffmpeg, overlays en PIL frame por frame con `engine.py`, y assets `stickers/`, `stencils/` y `originales/`. Riesgo técnico bajo.

## Debilidades conocidas (según retention y conversion)
- Entre 0 y 10 s hay poco juego y se pierde gente.
- En 41–45 s se repite.
- Nunca se ve un tatuaje en piel.
- Briza es anónima como persona.

Las resuelve el híbrido de `selection.md`.
