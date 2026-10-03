# Editing notes: dirección visual

> **Inputs**
> - `viral-video/briefs/00-source-observations.md`: REGLA #1 (footage y audio intactos, solo capa) y **REGLA #2** (sin vaca, sin vegan, genérico "agendá tu turnito", pocos flashes, efectos abstractos tipo trend).
> - `output/concepts/selection.md` y `output/review/retention-concepts.md`: grilla de beats, fixes de legibilidad de v0 y gags de paisaje.
> - `.claude/skills/shitpost-editing`.
> - Frames de `work/video1.mp4` verificados con grilla y `viral-video/build/track.json`.
>
> **Prototipos validados** (scratchpad, no entregables): saturación, fase media, flash de color y end card. Los valores de abajo salen de ahí.
>
> **Qué queda afuera por REGLA #2:** de `selection.md` se cae todo lo de vaca y vegan: el hook de la vaca, el chat "haceme la vaca", los sellos de vaca, "promo vaca + chancho" y el "diseño: LA VACA" de la tarjeta. **Se mantienen:**
> - la grilla
> - el formato fiel
> - el carril de texto
> - los gags de paisaje (bloque, velero, el que filma)
> - "compartan que me ayuda un montón"
> - la tarjeta de turno
> - la end card
>
> El copy que aparece acá es **provisional**: lo cierra el guion. Lo que fija este documento es el **estilo** de cada slot.

---

## 0. Principio rector

**La capa tiene que parecer el aviso de una tatuadora de barrio hecho en el celular. No puede parecer un video roto.**

| Feo diseñado (SÍ) | Feo mal hecho (NO) |
|---|---|
| Arial/Liberation estirada en X, centrada, sin kerning cuidado | Texto ilegible: bajo contraste, tapado, < 64 px de x-height |
| Calcos violetas gigantes que se pisan y tapan medio cuadro | Calcos sobre la cara de la señora |
| Entradas por corte seco en el beat | Entradas 3 frames antes o después del beat (se siente "lag", no estilo) |
| Rectángulo de papel visible alrededor del calco, como la carpetita de V2 | Un agujero rectangular recortado alrededor de la cara (se ve como bug) |
| JPEG crunch en los stickers | Crunch sobre el footage o sobre el texto |
| Flash de color de 2 frames en el punchline | Strobo continuo o flashes rojos (fotosensibilidad) |
| Sticker con borde blanco torcido 9° | Sticker con drop-shadow + glow + bevel (eso es Canva "lindo", no shitpost) |
| Marca de agua chiquita pero legible (40 px) | Marca de agua de 22 px (v0): invisible en el celular |
| Paleta chillona y limitada (violeta calco + 4 neones) | Cualquier color de cualquier cosa; gradientes |
| Ícono de IG dibujado con 3 primitivas | Logo de IG oficial con gradiente perfecto (se ve "agencia") |

**Prohibido sobre el footage:** punch-in, shake, filtros, LUT, crunch, freeze, velocidad. Todo lo de abajo es una capa RGBA que se compone **encima** del frame escalado a 1080x1920. Las dos únicas capas "full-frame" (el flash de color y el oscurecido de la end card) son overlays sólidos con alfa: el footage de abajo no se toca.

---

## 1. Lienzo, safe zones y mapa de la señora

- **Render:** 1080x1920, 30 fps, H.264 yuv420p, CRF 18, AAC 44,1 kHz, `+faststart`. Fuente: `work/video1.mp4` (576x1024 → escala x1,875, LANCZOS), desde src 5,00. **out = src − 5,00**.
- **Índice del track:** `key = round((out + 5) * 30) + 1`. Las cajas son `[x0, y0, x1, y1]` en 1080x1920, de la cabeza a los pies; `y0` es la cabeza estimada.

**Zonas de UI (TikTok + IG Reels, el peor caso de cada una)**

| Zona | Rect (px) | Uso |
|---|---|---|
| Barra superior (tabs/búsqueda/"Reels") | y 0–200 | Nada legible. Pueden entrar calcos cortados |
| Botonera derecha | x 940–1080, y 950–1700 | Nada legible ni stickers chicos. Pueden pasar calcos gigantes |
| Caption + handle + audio | y 1550–1920 (todo el ancho) | Nada legible. Solo calcos, piernas, puntas de flecha |
| **Zona segura de texto** | **x 60–940, y 250–1350** | Todo texto crítico |
| **Carril de texto (lane)** | **x 90–990 (contenido ≤ 900 px de ancho), y 330–880** | Hook, líneas, ghost text de cielo, tarjeta de turno |

**El cielo es tu pizarrón.** En todo el video el horizonte está en y ≈ 880–1065. La cabeza de la señora nunca sube de y ≈ 730 (pre-drop) ni de y ≈ 880 (post-drop). Por eso el carril y 330–880 es cielo liso el 100 % del tiempo.

**Zonas de la señora, por frame, calculadas del track**

Sea `h = y1 − y0`.
- **F (cara):** `[x0 − 40, y0 − 60, x1 + 40, y0 + 0,30·h]`.
  - Unión de F sobre toda la vida del sprite, + 20 px.
  - El 0,30 cubre el caso en que se agacha hacia adelante y la cabeza baja al nivel de los hombros (out 18, 26, 33–34, 41).
- **T (torso):** `[x0, F.y1, x1, y0 + 0,62·h]`.
- **B (cuerpo bajo):** `[x0, y0 + 0,62·h, x1, y1]`, es decir piernas y tacos.
- **Suavizado:** mediana móvil de ±3 frames sobre las 4 coordenadas antes de usarlas. El track salta 1–2 frames cuando pierde rojo.

---

## 2. Tipografía

Fuentes del sistema (verificadas con `fc-list`): Liberation Sans Regular/Bold, Liberation Serif (Regular/Bold/Italic/BoldItalic), DejaVu Sans/Serif (Bold).

**Trampa en `engine.py`:** las keys `narrow`, `narrow-bold` y `dejavu-cond-bold` apuntan a archivos **que no existen**. `fc-match` las resuelve en silencio a `DejaVuSans.ttf`. **No las uses:** el condensado se hace siempre con `squeeze` sobre `sans` o `sans-bold`.

**Métricas medidas (Liberation Sans):**
- cap-height = 0,686 em
- x-height = 0,53 em
- A 130 px: cap 89 y x-height 69, que cumple el mínimo de 64 de la skill.

| Rol | Fuente (key engine) | Size | squeeze | line_gap | Color | Stroke | Notas |
|---|---|---|---|---|---|---|---|
| **Hook** (0–3,17) | `sans` (Regular, como el "¿querés aprender filet crochet?" de V2) | **300** | **0,64** | 0,84 | #000000 100 % | 0 | 2 líneas, ≈ 75 % del ancho ("tatuarte?" = 1184 × 0,64 = 758 px). Cap 206 px. Centro (540, 600) |
| **Línea de carril** (punchlines/CTAs) | `sans-bold` | **130** | **0,80** | 0,92 | #000000 100 % | 0 sobre cielo limpio; **6 px #FFFFFF** si hay calco o mar detrás | `max_w=900` (efectivos 1125 sin squeeze). Máximo 2 líneas y 6 palabras. Centro y 560 (1 línea) o 600 (2) |
| **Ghost text** (equivalente al "escribime para + info") | `sans` | **320** | **0,62** | 0,84 | #FFFFFF al **55 %** | 0 | 2 líneas. Ver §5 |
| **Letra chica legible** (gag opcional "zona: consultar") | `sans` | **44** | 1,0 | — | #000000 100 % | 0 | Solo sobre cielo limpio, nunca en saturación |
| **Marca de agua** | `props.ig_watermark(handle, size=40)` | 40 | — | — | #FFFFFF, α 235 | — | Ver §8 |
| **Handle de la end card** | `sans-bold` | **110** | **0,85** | — | #FFFFFF 100 % | 0 | Cap 75 px. Centro (540, 860) |
| **Etiquetas de flecha** | `sans-bold` | 110 | 0,80 | — | #000000 | 6 px #FFFFFF | En el carril. La flecha arranca debajo |
| **Tarjeta de turno**: campos impresos | `sans` | 64 | 0,9 | — | #111111 | — | §11 |
| **Tarjeta de turno**: "lapicera" | `serif-bold` con italic → usar el path `/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf` | 70 | 1,0 | — | **#1A3FD6** (birome azul) | — | Rotación −2° independiente de la tarjeta |
| **Sello de goma** | `sans-bold` | 96 | 0,78 | — | #D7263D | — | §10 |
| **Burbujas de chat** (si el guion las usa) | `sans` | 54 | 1,0 | — | #111111 | — | §9 |

**Reglas de texto**
- Todo texto va **siempre en la capa de más arriba**, por encima de calcos, stickers y flashes.
- **Nunca hay texto de carril y ghost text a la vez.** El prototipo con los dos superpuestos en el cielo no se lee.
- **Prohibido:**
  - texto blanco sin stroke sobre cielo (v0, 6,3 s);
  - texto con 25–60 % de opacidad, salvo el ghost text, que es un efecto y no información;
  - texto sobre recortes crema;
  - texto con más de 6 palabras.
- **Duración mínima** de una línea de carril: **3 beats (1,46 s)**. Sale 1 beat antes del slot siguiente, para que siempre haya un beat de aire.

---

## 3. Efecto principal: calcos violetas ("papel de transfer")

Es el equivalente directo de las carpetitas translúcidas de V2: blancos y calados allá, violetas y de línea acá.

**Diseños (REGLA #2, máximo 5):** `mariposa-daga`, `frutilla`, `gallo`, `pajaro-flores`, `flor-alambre-puas`, desde `stencils/*.png`.
- `flor-hojas` queda de reserva y no se usa en el master.
- **No se usan** `originales/hoja_*.jpg`: tienen vacas y "vegan", y además son crema.

**Construcción de cada "hoja de calco"** (sprite RGBA, se cachea por diseño y tamaño):
1. Escalar el stencil a la altura objetivo H (LANCZOS). El alfa del PNG es la "tinta" (incluye el sombreado parcial).
2. **Papel:** rectángulo de (ancho + 16 % de H) × (H × 1,16), color **#EEEAF6** con α **0,15** (rango 0,12–0,18). Su borde recto visible es la silueta de "carpetita". **No se le pone sombra.**
3. **Sangrado:** el alfa de la tinta con GaussianBlur **6 px**, color de tinta, α = 0,35 × opacidad.
4. **Línea:** el alfa de la tinta con GaussianBlur **1,6 px** (rango 1,2–2,0), ×1,3 con clip 255, color de tinta, α = opacidad.
5. **Grano:** opcional y **estático** por hoja. Se multiplica el alfa de la tinta por ruido uniforme 0,85–1,0. **Nunca** regenerar el ruido por frame: "hierve" y parece un filtro.

**Valores**

| Parámetro | Valor |
|---|---|
| Tinta | **#5B3FA8** (70 % de las hojas) / **#6A4BC4** (30 %) |
| Opacidad de la línea | **0,35–0,70**. Pre-drop 0,40–0,50, post-drop 0,45–0,60, pico 0,55–0,70 |
| Blend | **Normal (alpha over)**. No multiply: multiply sobre el mar da un negro azulado que mata el violeta |
| Altura H | **800–1400 px**. Gallo hasta 1500. Upscale máximo ×2,6 del PNG (aceptable por el blur) |
| Recorte por borde | Hasta el 40 % de la hoja fuera de cuadro (V2 lo hace todo el tiempo) |
| Rotación | 60 % a 0°, 25 % a ±4–8°, **15 % a 45°** (el "rombo" de las carpetitas de V2) |
| Espejo | Flip horizontal permitido (duplica la variedad con 5 diseños) |
| Crunch | JPEG q **45** sobre la hoja ya construida, preservando el alfa (§7) |

**Entrada, salida y titileo** (beat = 0,4878 s ≈ 14,6 frames; cuantizar al frame más cercano de la grilla anclada en out 10,00)
- **Entrada y salida por corte seco, en el frame del beat.** Cero fade, cero scale-in, cero easing.
- **Vida:** 2–4 beats en fases normales. En acumulación (§12, P3) **no se van**.
- **Hipo:** con probabilidad 0,3, una hoja viva se **apaga 2 frames** en el medio beat (+7 frames). Es el "parpadeo de app barata".
- **Titileo** (máximo **1 hoja** a la vez, solo hojas que ocupen ≤ 25 % del cuadro): durante 1 beat alterna 4 frames ON / 3 OFF (≈ 4 Hz). Nunca coincide con un flash de color.
- **Reemplazo en el beat:** en cada downbeat se cambian 1–2 hojas (sale una y entra otra en el mismo frame). Así el cuadro "late" con la música aunque la cantidad no cambie.

**Cuántas a la vez y cobertura**
Cobertura = % de píxeles del cuadro con alfa de la capa de calcos > 0,15.

| Fase (out) | Hojas simultáneas | Cobertura objetivo |
|---|---|---|
| 1,22–9,51 | 1–2 | 10–20 % |
| Ráfaga 10,00–10,98 | **7–8** | 50–60 % |
| 10,98–25,62 | 2–4 | 20–35 % |
| 25,62–41,23 (acumulación, +1 por beat) | 4 → 10 | 35 → 60 % |
| Pico 41,23–45,13 | 10–12 (tope **12**) | 60–70 % (V2 en el pico ≈ 70 %) |
| 45,13–47,09 (limpieza) | 12 → 0 (2–3 menos por beat) | → 0 |
| 47,09–53,80 | 0 | 0 |

---

## 4. Colocación respecto de la señora (algoritmo)

Prioridad: **cara intocable > texto legible > torso visible > composición.**

**Calcos (hojas)**
1. Candidato: diseño, H, rotación, flip y centro al azar con semilla fija. El centro se sortea con 70 % de probabilidad en los laterales (x < cx − 250 o x > cx + 250) y 30 % libre.
2. **Test de cara:** se calcula la tinta (alfa de la línea > 0,08) que cae dentro de **F∪** (unión de F sobre la vida de la hoja). Si supera el **1 % del área de F∪**, se rechaza y se reintenta (hasta 40 intentos, después se baja H un 15 %). El **papel** sí puede pasar sobre la cara con α ≤ 0,15: es la "bruma" de la carpetita de V2 y no tapa.
   - **No usar máscara rectangular de recorte sobre la cara.** El prototipo lo probó: deja un agujero rectangular que grita "bug".
   - Si hace falta un fallback, máscara con feather de **40 px** y solo sobre la tinta.
3. **Torso (permitido, tope):** sobre **T** se limita el alfa combinado de toda la capa de calcos a **0,30**, con un feather de 40 px en el borde de T. Es un tope, no un cero, así que no deja agujero. El saco rojo tiene que seguir leyéndose rojo: a 0,45 se ve rosa, como pasó en el prototipo.
4. **Cuerpo bajo (B):** libre, tapar las piernas está bien (V2 lo hace).
5. **Carril de texto:** mientras haya texto de carril en pantalla, el alfa de la capa de calcos dentro del bbox del texto + 30 px se limita a **0,20**.

**Stickers de flash reales** (opacos, `stickers/*.png`)
- El bbox rotado **no toca F∪ ni T** (ampliados ×1,2). Puede pisar B.
- Centro en x 140–880. Evitar x > 880 entre y 950–1700 (botonera).
- No cruzan el carril mientras haya texto.

**Ghost text:** ver §5.

**Flechas:** la punta puede llegar a B o al borde inferior. El cuerpo de la flecha no cruza F∪.

**Lado libre por tramo** (del track): 16–23 s ella está corrida a la derecha (cx 690–760), así que el lado libre es el **izquierdo**. 37–47 s está a la izquierda (cx 470–500), así que el lado libre es el **derecho**. Detalle en `shot-list.md`.

---

## 5. Ghost text (texto fantasma gigante)

- **Estilo:** `sans` Regular, 320 px, squeeze 0,62, line_gap 0,84, **#FFFFFF al 55 %**, sin stroke.
  - Es el "escribime para + info" de V2: delgado, enorme, lavado.
  - Copy provisional: "agendá / tu turnito". Siempre 2 líneas de ≤ 10 caracteres ("tu turnito" = 1400 × 0,62 × 320/360 ≈ 770 px).
- **Posición CIELO:** centro (540, 600), ocupa y ≈ 330–870. Default.
- **Posición CUERPO** (la de V2, sobre ella): centro y = centro de T∪B. Solo si el borde superior del bloque queda ≥ 20 px por **debajo** de F∪.y1. Si no entra, se usa CIELO.
- **Entrada:** corte seco en el beat. **Vida:** 4–6 beats. **Hipo:** 1 apagón de 2 frames a mitad de vida.
- **Nunca convive con texto de carril** ni con la tarjeta de turno.
- **Variante violeta** (opcional, máximo 1 vez): #5B3FA8 al 40 %, para una palabra suelta ("turnito"), 420 px.

---

## 6. Flashes de color full-frame

- **Implementación:** overlay sólido 1080x1920 encima de calcos y stickers y **debajo del texto**.
  - **Frame 1:** α **0,55**.
  - **Frame 2:** α **0,25**.
  - **Frame 3:** 0.
  - Duración total 66 ms.
- **Paleta:** #FF2BD6 (magenta), #FFE600 (amarillo), #00E5FF (cian), #FFFFFF (blanco, α 0,45/0,20).
  - **Nunca rojo saturado:** es el más riesgoso por fotosensibilidad y además se come el saco.
  - Nunca dos seguidos del mismo color.
- **Cuándo** (solo en compases con punchline): **10,00** (#FF2BD6, el drop) · 13,90 · 17,81 · 23,66 · 27,57 · 31,47 (rotando amarillo/cian/magenta) · **41,23** (#FFE600) · **47,09** (#FFFFFF).
  - Separación mínima **1,95 s**, muy lejos del límite de 3 flashes/s.
- El texto del slot aparece **en el mismo frame** que el flash, por encima. La marca de agua queda debajo del flash (en el prototipo se lava 2 frames y está bien).

---

## 7. Stickers de flash (apariciones puntuales)

- **Diseños:** los mismos 5 de §3. **Máximo 2 en pantalla. 8–10 apariciones en todo el video.**
- **Tamaño:** **300–420 px** de alto (el PNG mide 506–913 de alto, así que escala 0,4–0,8). Rotación **±6–15°**, nunca 0° (torcido = pegado a mano).
- **Entrada:** corte seco en el beat, con un "thunk" opcional: frame 1 a escala 1,08, frame 2 en adelante a 1,00. Son 2 frames, no easing. **Vida:** 2 beats. **Salida:** corte seco.
- **Sombra:** los PNG de `stickers/` ya traen borde blanco + sombra suave. Se dejan tal cual. **No agregar** más sombra ni glow.
- **Crunch con alfa:** `engine.crunch()` **pierde el alfa** (convierte a RGB). Sobre un sprite RGBA hay que hacer así:

  ```python
  base = Image.new("RGBA", s.size, (255, 255, 255, 255)); base.alpha_composite(s)
  rgb = crunch(base, quality=35).convert("RGB"); rgb.putalpha(s.getchannel("A")); s = rgb
  ```

  - El fondo blanco evita que el borde se oscurezca.
  - Calidad: **35** en stickers, **45** en calcos.
  - **Nunca** se aplica a texto, marca de agua, end card ni footage.

---

## 8. Marca de agua (publicidad casera)

- `ig_watermark("@brizamaldonado", size=40)`, blanco α 235, borde derecho en **x = 940**, centro **y = 250**.
- **Desde el frame 0 hasta 49,51**, siempre visible, encima de calcos y stickers.
- **Saltos** (corte seco):
  - 15,86 → borde izquierdo en x = 70, y = 1180;
  - 29,52 → borde derecho en x = 930, y = 1380;
  - 41,23 → vuelve a casa.
  - Es el chiste de "la plantilla del celu que se mueve sola".
- **Si queda sobre una hoja de calco o un flash:** se deja. Si queda sobre el papel de una hoja, sigue leyéndose (validado en el prototipo).

---

## 9. Burbujas de chat (secundario, solo si el guion conserva un chat genérico)

Look WhatsApp barato, dibujado con PIL sin assets:
- **Header:** barra #075E54 de 900 × 96 px, en (90, 330).
  - Texto `sans-bold` 44 px blanco: "@brizamaldonado".
  - **Sin** avatar, flecha atrás ni íconos.
- **Burbuja de la clienta:** `rounded_rectangle` radio 28, #FFFFFF, borde 2 px #D0D0D0, alineada a la izquierda (x 110), ancho = texto + 56, máximo 640.
- **Burbuja de Briza:** igual, pero **#DCF8C6**, alineada a la derecha (borde derecho en 970).
- **Texto:** `sans` 54 px #111111. Hora "14:07" en `sans` 26 px #8A8A8A, abajo a la derecha de la burbuja, **sin** tildes de leído.
- **Feo diseñado:**
  - la colita de la burbuja es un triángulo de 24 px **un poco desalineado** (4 px corrido);
  - sombra cero;
  - las burbujas **se apilan** hacia abajo y la de más arriba se corta por el header (scroll falso de 1 burbuja por beat, por corte, sin animar).
- **Zona:** solo el carril (y 330–880). Máximo 4 burbujas visibles. El chat cuenta como **el** texto de carril: con chat no hay ghost ni otra línea.

---

## 10. Sello de goma (reemplaza al sello de vaca)

- **Uso:** "AGENDADO" o "SEÑADO" sobre la tarjeta de turno (47,58). Opcional sobre una burbuja de chat.
- **Forma:** doble rectángulo con borde exterior 8 px e interior 3 px, 24 px entre bordes. Texto `sans-bold` 96 px, squeeze 0,78, en mayúsculas.
- **Color:** **#D7263D**, α 0,85.
- **Textura:** al alfa del sello se le multiplica una máscara de erosión: ruido binario con el 18 % de píxeles en 0, con blur 1,2 px. Así parece goma gastada. Es estático.
- **Rotación:** −8° a −14°.
- **Entrada:** "golpe" en 2 frames.
  - Frame 1: escala 1,15, α 0,6.
  - Frame 2 en adelante: 1,00, α 0,85.
  - Sin SFX (regla de audio).

---

## 11. Tarjeta de turno (47,09–49,51)

- **Tarjeta:** 820 × 520 px, #FFFFFF, borde 6 px #000000, **rotación −3°**, centro **(540, 600)**. Ocupa y ≈ 340–860; la cabeza está en y ≥ 946 en ese tramo.
- **Header:** banda superior de 110 px en **#5B3FA8** (el violeta del calco une la tarjeta con el resto), con "TURNO" en `sans-bold` 90 px, squeeze 0,8, #FFFFFF.
- **Campos:** `sans` 64 px #111111, renglones con subrayado de 4 px #111111 a 30 px de la base. Copy provisional:
  - "día: ______"
  - "hora: ______"
  - "diseño: ______"
- **La "birome":** el valor de "diseño" (provisional "el que elijas") en LiberationSerif-BoldItalic 70 px **#1A3FD6**, desplazado +6 px fuera del renglón. Día y hora quedan **vacíos a propósito**: el CTA es completarlos por MD.
- **Secuencia:**
  - **47,09:** la tarjeta entra por corte, con flash blanco.
  - **47,58:** sello "AGENDADO" en la esquina inferior derecha, pisando 40 px fuera de la tarjeta.
  - **49,51:** sale por corte.
- No hay calcos en este tramo. Como mucho, 1 sticker chico (300 px) en el lado libre.

---

## 12. Línea de tiempo de la capa (out, s; copy provisional)

| out | Capa |
|---|---|
| **0,00** | Hook "¿querés / tatuarte?" + marca de agua. Ella está de espaldas: el hook puede pisar la nuca, no hay cara |
| 1,22 | 1ª hoja de calco (H 1100, abajo a la izquierda, op 0,45), detrás del hook. Algo cambia antes de 1,5 s |
| 2,20 | 2ª hoja (rombo a 45°, arriba a la derecha, recortada por el borde). Sale la 1ª |
| 3,17 | Sale el hook. Línea de carril L1 |
| 4,15 | 1er sticker real (mariposa-daga, 380 px, −10°), lado izquierdo, 2 beats |
| 5,12 | L2. Ella gira a cámara (5,0–5,6): las hojas evitan F |
| 6,10–9,02 | **Ghost CIELO "agendá / tu turnito"** (el "vení a mi taller" de V2), a **260 px, centro y 520** porque la cabeza pre-drop está más alta (F.y0 ≈ 739). Calcos 1–2 titilando |
| **9,51** | **Beat limpio:** solo marca de agua |
| **10,00** | **DROP:** flash #FF2BD6 + **ráfaga de 7–8 hojas** en el mismo frame. Sin texto |
| 10,98 | Quedan 2 hojas y ella en el hueco |
| 11,95 | L "turnos por MD" |
| 13,90 | Flash + L "no hacemos envíos (es un tatuaje)" |
| 15,86 | Salta la marca de agua. Sticker frutilla (lado libre: izquierdo) |
| 17,81 | Flash + L "¿duele? consultá por privado". Ella se agacha fuerte en 18,0: F baja a y ≈ 1000 |
| 19,76 | Ghost CUERPO (si entra) o CIELO |
| 21,71 | Gag opcional calco → piel: hoja frutilla chica (H 260, op 0,7) sobre la pantorrilla (centro x0 + 0,35w, y0 + 0,80h, siguiendo el track frame a frame) 1 beat → en 22,20 el sticker frutilla en el mismo lugar 1 beat → sale en 22,68 |
| 23,66 | Flash + L slot |
| **25,62** | **Acumulación:** +1 hoja por beat, ya no se van |
| 27,57 | Flash + L "seña por alias" |
| 29,52 | **Bloque:** salta la marca de agua + flecha + "el bloque (de prueba)" + 3 stickers pegados al bloque (§13) |
| 31,47 | Flash + L slot |
| 33,42–34,40 | **Velero** (solo 2 beats, §13) |
| 35,37 | L slot o ghost |
| 37,33 | **El que filma** (§13) |
| 39,28 | Saturación 8–10 hojas, sin texto (1 compás de "ruido puro") |
| **41,23–45,13** | Flash #FFE600 + **"compartan que me ayuda un montón"** (2 compases, 2 líneas). Pico de 10–12 hojas. Vuelve la marca de agua |
| 45,13–47,09 | Limpieza: −2/3 hojas por beat. Ella queda sola bailando |
| 47,09–49,51 | Tarjeta de turno + sello (§11) |
| **49,51–53,80** | End card (§14) |

---

## 13. Flechas y escalada al paisaje

- **Estilo de flecha:**
  - Polilínea de 3 puntos con una curva leve (el punto medio corrido 40–60 px del eje), trazo **14 px #FF1E1E**, extremos redondeados.
  - Contorno blanco de 5 px dibujado debajo (la misma línea a 24 px #FFFFFF).
  - Punta: triángulo relleno de 64 px de base y 70 de alto.
  - Entra **entera por corte**. **No** se "dibuja" animada.
- **Etiqueta:** en el carril (§2), negra con stroke blanco de 6 px. La flecha sale de debajo de la etiqueta.
- **Tracking:** **no existe** un track del paisaje en el repo (solo `track.json` de la señora).
  - Opción 1: template matching SSD en gris, sobre un crop de 200 × 160 alrededor de la referencia, con búsqueda de ±120 px por frame y mediana de 5 frames.
  - Opción 2: como cada gag dura ≤ 2 compases y la deriva dentro de cada uno es < 30 px, alcanza con coordenadas fijas por gag, medidas a mano sobre frames con grilla (tabla de abajo, en 1080x1920).

| Gag | Ventana out | Referencia medida | Colocación |
|---|---|---|---|
| **"el bloque (de prueba)"** | 29,52–31,47 | Bloque x ≈ 180–1050, cara frontal y ≈ 1450–1680. Piernas de ella en x ≈ 480–700 | Etiqueta centrada en y 560. Flecha de (300, 700) a (300, 1430). 3 stickers de **220 px** pegados a la cara del bloque: (300, 1560, −8°), (400, 1600, +6°), (840, 1570, −5°). Rotación chica: "pegado", no "volando" |
| **"el velero"** | **33,42–34,40** (2 beats) | Velero ≈ (555, 1000–1030). Ella agachada: F∪.y0 ≈ 976 | Un sticker de **150 px** como **vela nueva**, anclado abajo (`anchor="bottom"`) en (555, 985), 0°. Fuera de esa ventana el velero queda pegado a la cabeza de ella: **no estirar el gag** |
| **"el que filma"** | 37,33–39,28 | El borde inferior es el camarógrafo (su sombra se ve en out 2–3,5: callback para el que la notó) | Flecha de (180, 760) a (180, 1880): por el lado izquierdo, sobre el bloque, lejos de ella (cx ≈ 520). La punta queda en la zona de caption: es el chiste, no info |

---

## 14. End card (49,51–53,80)

- **Oscurecido:** overlay #000000 al **55 %** (footage al 45 %). Es un overlay: no se toca la luminancia del video. Ella tiene que verse bailando.
- **Ícono IG dibujado:**
  - Cuadrado redondeado de **300 px**, radio 78, trazo **26 px**.
  - Círculo interior al 27–73 % del lado, trazo 26.
  - Punto relleno en (0,70–0,82, 0,15–0,27).
  - Centro **(540, 620)**.
- **Ciclo de color por beat:** cambio por corte en cada beat desde 49,51, unos 9 cambios: **#FF2BD6 → #FFE600 → #00E5FF → #FF7A00 → #7CFF4F → #FFFFFF → #6A4BC4 → #FF2BD6 → #FFE600**.
- **Handle:** "@brizamaldonado", `sans-bold` 110 px, squeeze 0,85, #FFFFFF, centro **(540, 860)**.
  - Lo bajo de y 950 (como pedía selection) a 860 porque en 49–53 la cabeza está en y ≈ 925–962 y el handle la pisaba (verificado en el prototipo).
  - Fijo, sin ciclar color: lo que se lee no parpadea.
- **Sin** calcos, stickers ni marca de agua, y nada más de texto. Opcional en el último beat (52,94–53,80): ghost "¿querés tatuarte?" 140 px blanco al 40 % en y 1250, como puente al loop.

---

## 15. Orden de capas (de abajo hacia arriba)

1. Footage (intacto)
2. Overlay de oscurecido (solo end card)
3. Hojas de calco (con los topes de §4)
4. Stickers de flash / stickers del bloque / vela
5. Flechas
6. Flash de color
7. Marca de agua
8. Ghost text / tarjeta de turno / sello / chat
9. Texto de carril
10. Ícono IG y handle (end card)

**Checklist de QA por render:**
- Frames en cada slot de texto: ¿se lee en 1 s en el celular a 50 % de brillo?
- Ningún píxel de tinta con α > 0,08 dentro de F.
- Saco todavía rojo en el pico (41–45).
- Entradas en el frame exacto del beat (±1 frame).
- Nada legible bajo y 1550 ni en x > 940 entre y 950–1700.

---

## Implementación (video-editor) — desvíos documentados y fixes de QC

Pipeline: `viral-video/pipeline/build_final.py` (footage `footage.py` + capa PIL + ffmpeg). Re-render: `python3 viral-video/pipeline/build_final.py`. Variantes de hook: `--hook a|b|c --from-master output/final/briza-viral-final.mp4 output/variants/hook-X.mp4` (re-renderiza sólo los primeros 3 s y empalma con el master, mismo audio).

Desvíos respecto del guion (decididos por el editor):
- Pre-drop: 5 intercambios de chat en vez de 7 (se cortaron "¿cuánto sale uno chiquito?" y "¿me hacés precio?") para que cada pregunta + respuesta dure ≥2 beats y se lea en celular. Burbujas a 40 px (no 30).
- Slot de fotos en piel: no hay fotos en el repo → sin slot.
- Cara: además del rechazo de posiciones, la capa de calcos lleva una máscara suave (óvalo cara alfa 0, torso alfa ×0,3) calculada por frame desde `track.json`.
- Tracking del paisaje: `viral-video/build/landtrack.json` (template matching del faro y la esquina del bloque, `landtrack.py`). Se usa para la flecha "acá también".

Fixes de QC ronda 1 aplicados: 1 ("jueves 17 hs." 2 beats), 2 ("bueno, agendame" hasta 10,49 s; TATUAJES corrido), 3 (gag stencil 2+2 beats, 300 px, tobillo, sin papel), 4 (watermark fuera de la botonera; stickers x≤760), 5 (sello AGENDADO reubicado y a 0,7), 6 (torso alfa ×0,3, óvalo de cara ampliado, alfa máx. 0,62), 7 (se quitaron "turnos por MD" y "diseños propios" → compases de aire), 8 ("zona: consultar" en la tarjeta), 10 ("no te rasques"), 11 (ghost text a alfa 0,31), 12 (thumbnail de Pinterest con "P" roja y más contraste). Fix 9 → variantes de hook (output/variants/).
