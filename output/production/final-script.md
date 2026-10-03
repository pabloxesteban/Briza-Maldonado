# Guion final: "agendá tu turnito" (versión Briza del trend VIDEO_2)

> Inputs: `viral-video/briefs/00-source-observations.md` (REGLA DEL CLIENTE #1 y **#2**), `output/concepts/selection.md` (esqueleto H y lecciones estructurales), `output/review/retention-concepts.md`, `output/review/conversion-concepts.md`, `output/analysis/argentina-adaptation.md`.
>
> **La REGLA #2 pisa el contenido de selection.md.** Quedan afuera la vaca, el chancho y todo lo vegano. El tono pasa a aviso de tatuadora de barrio y el objetivo es "agendar un turnito". Hay pocos flashes a color, en apariciones puntuales, y una capa abstracta de stencils violetas translúcidos (las "carpetitas" de V2), texto fantasma, flashes de color y el ícono de IG ciclando.
> **Se mantiene de selection.md:** pre-drop con chat que termina en la rendición de la clienta en 9,51, ráfaga en el drop, escalada, la línea "compartan que me ayuda un montón", tarjeta de turno antes del end card, reglas de legibilidad y la regla de no tapar nunca cara ni torso.

## HEADER

| Campo | Valor |
|---|---|
| DURATION | **53,80 s** (1614 frames) |
| ASPECT RATIO | 9:16, **1080x1920** (fuente 576x1024 escalada, sin crop) |
| FPS | **30** |
| SOURCE MAP | `work/video1.mp4`, **out = src − 5,00**. Out 0,00 = src 5,00. Out 53,80 = src 58,80 (en src 58,9 la cámara se cae). **Drop en 10,00 out / 15,00 src.** Frame out n = frame src n+150. `track.json` y `landtrack.json` están indexados en frames **src**. |
| FOOTAGE | Plano único continuo, intacto: sin cortes, sin freezes, sin punch-in, sin filtros. El único cambio es el oscurecido al 45 % del end card, que es formato V2. |
| AUDIO | Pista original de VIDEO_1 sin tocar: intro a ≈ −20 dB hasta 10,00 y drop a ≈ −14 dB hasta 53,80. Solo lleva un fade de 2 frames (53,73–53,80) para evitar el click del corte. |
| SFX | **Ninguno.** Motivos: regla del cliente ("mismo audio original"), V2 no tiene SFX, el deadpan depende de eso y los SFX se pierden si se sube con el sonido in-app. El "pop" lo marcan los bombos, porque todo entra en beat. |
| HOOK | Frame 0: **"¿querés tatuarte?"** gigante en negro sobre el cielo, con un stencil violeta gigante detrás y la @ ya visible. En 0,73 entra un segundo stencil y en 1,22 titilan. En 1,71 arranca el chat y en 2,20 cae el primer remate ("un poquito."). |
| GRILLA | 123 BPM, 1 beat = 60/123 = **0,4878 s**, compás = **1,9512 s**, anclada en 10,00. Pre-drop: 0,24 · 0,73 · 1,22 · 1,71 · 2,20 · 2,68 · 3,17 · 3,66 · 4,15 · 4,63 · 5,12 · 5,61 · 6,10 · 6,59 · 7,07 · 7,56 · 8,05 · 8,54 · 9,02 · 9,51. Compases post-drop: 10,00 · 11,95 · 13,90 · 15,85 · 17,80 · 19,76 · 21,71 · 23,66 · 25,61 · 27,56 · 29,51 · 31,46 · 33,41 · 35,37 · 37,32 · 39,27 · 41,22 · 43,17 · 45,12 · 47,07 · 49,02 · 50,98 · 52,93. Los tiempos salen del valor exacto. selection.md redondeaba con 0,488, así que hay diferencias de ≤ 0,02 s; por ejemplo, el end card arranca en 49,51 y no en 49,53. |

## SISTEMA VISUAL (vale para todos los beats)

- **CARRIL (lane):** y 300–800, x 60–1020, centrado. Es el **texto flyer** y siempre es lo más grande y legible del cuadro.
  - Fuente: Liberation Sans Bold escalada en X a 0,80 (Arial Narrow simulada), en minúsculas como V2.
  - **Negro 100 %** sobre el cielo, cap-height de 95–110 px. El hook va a ≥ 110 px y al 85 % del ancho.
  - Si hay un ghost detrás, lleva contorno blanco de 6 px.
  - Nunca hay 2 textos de carril a la vez.
- **CHAT (secundario):** solo en el pre-drop, en una columna angosta a la izquierda (x 40–430, y 820–1420), sobre el mar y al costado de ella.
  - Burbujas gris claro #E9E9EB con texto negro a cap 30 px. Encabezado chico: "@brizamaldonado · tatuajes".
  - Máximo 3 burbujas visibles: las viejas suben y se van.
  - **Las preguntas de la clienta van chicas en el chat. Las respuestas van gigantes en el carril.** La que habla en el flyer es la tatuadora.
- **GHOST STENCIL:** los PNG de `stencils/` recoloreados al violeta del papel de calco #6B3FA0.
  - 35–55 % de opacidad, en multiply, de 300 a 1400 px, con rotación de ±20°.
  - Entran y salen secos, en beat. Titilan y se acumulan.
  - Son el equivalente de las carpetitas de V2.
- **GHOST TEXT:** blanco al 40 %, gigante (cap ≈ 260–300 px), en vertical sobre los márgenes (x 0–300 o 780–1080), así no compite con el carril ni la tapa a ella.
  - Siempre es eco de algo legible. Nunca lleva información sola.
- **FLASH COLOR:** tinte de cuadro completo al 25–30 %, de **2 frames**. Hay 6 en todo el video (10,00 · 13,90 · 29,51 · 41,22 · 43,17 · 49,51) y nunca más de 1 por segundo (seguro para fotosensibilidad).
- **STICKERS a color (flashes de Briza):** solo 5 diseños (mariposa-daga, frutilla, gallo, pajaro-flores, flor-alambre-puas), en apariciones puntuales de 1 a 4 beats.
  - Los mismos 5 se usan como ghost stencils.
  - **Prohibidos:** vaca-vive-y-deja-vivir, chancho-y-vaca, corazon-vegan-v1/v2, flor-hojas y las hojas `originales/` (traen vaca y vegan).
- **WATERMARK:** ícono de IG + "@brizamaldonado" a cap 40 px desde el frame 0, con el ícono ciclando de color en cada compás.
  - Posición inicial arriba a la derecha (x 600–1020, y 250–300).
  - En 15,85 salta a media izquierda y en 29,51 abajo a la derecha (en blanco con contorno negro de 6 px).
  - En 41,22 vuelve a su lugar.
- **ZONA PROHIBIDA (la señora):** el box de `track.json` (por frame src) agrandado ×1,2. Ningún centro de ghost ni de sticker cae en la mitad superior (cara y torso). Las piernas solo se usan en el gag de 21,71. Los ghosts pueden rozar brazos y piernas al ≤ 40 %.
- **Safe zones:** lo crítico va en x 60–940 e y 250–1350. Debajo de y 1550 solo van decorado y el gag de la pantorrilla.
- **Capas (de abajo hacia arriba):** footage → flash color → ghost stencils → ghost text → stickers/flechas/skin → chat → texto de carril → watermark. El crunch JPEG, si se usa, va solo sobre la capa de overlays.

---

## BEATS

### BEAT 01: HOOK
- **TIME:** 0,00–1,71
- **VISUAL:** De espaldas, camina por la rambla mirando el mar, chiquita en el cuadro. Arriba hay un stencil violeta gigante de mariposa-daga (≈ 900 px, al 45 %) detrás del texto. En 0,73 entra el ghost de la frutilla a la derecha. En 1,22 los dos se apagan medio beat y vuelven en 1,46.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** `¿querés tatuarte?` (carril, centrado en y≈470, cap ≥ 110 px). Watermark arriba a la derecha.
- **AUDIO:** original, intro a −20 dB.
- **SFX:** ninguno.
- **EDIT:** Todo está en cuadro desde el frame 0, sin fade. El ghost de 0,73 entra en corte seco y el flicker de 1,22 dura 1/2 beat. Hook y ghosts salen en 1,71, en corte seco.
- **Función:** pregunta de flyer que se entiende en 1 s. El cuadro ya cambia a los 0,73 s.

### BEAT 02: chat 1
- **TIME:** 1,71–2,68
- **VISUAL:** Sigue de espaldas. A la izquierda aparece la columna de chat con encabezado y la burbuja "¿duele?". En 2,0–3,5 se ve la sombra del que filma (se usa en BEAT 25).
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat (columna izquierda, chico): `@brizamaldonado · tatuajes` / `¿duele?`
  - Carril, en 2,20: `un poquito.`
- **AUDIO:** original, a −20 dB.
- **SFX:** ninguno.
- **EDIT:** La burbuja entra en el beat 1,71 con un pop de escala de 2 frames, sin rebote. La respuesta entra seca en 2,20 y sale seca en 2,68.
- **Función:** arranca el motor del pre-drop: pregunta de clienta y respuesta seca.

### BEAT 03: chat 2
- **TIME:** 2,68–3,66
- **VISUAL:** Sigue de espaldas.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat: `¿y si me arrepiento?`
  - Carril, en 3,17: `tarde.`
- **AUDIO:** original, a −20 dB.
- **SFX:** ninguno.
- **EDIT:** La burbuja sube la anterior. Respuesta seca en 3,17, sale en 3,66.
- **Función:** risa 1 (el deadpan más corto).

### BEAT 04: chat 3
- **TIME:** 3,66–4,63
- **VISUAL:** Ella gira y se acerca al bloque. Entra el ghost del gallo arriba a la derecha (35 %), que titila cada 2 beats hasta 9,51.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat: `¿cuánto sale uno chiquito?`
  - Carril, en 4,15: `precio por privado.`
- **AUDIO:** original, a −20 dB.
- **SFX:** ninguno.
- **EDIT:** Corte seco en beat. La burbuja más vieja ("¿duele?") se va por arriba.
- **Función:** léxico de emprendimiento AR. Sembrar que hay turnos y precio.

### BEAT 05: chat 4
- **TIME:** 4,63–5,61
- **VISUAL:** Ella se agacha junto al bloque. En la burbuja aparece un adjunto: acuarela fea "de Pinterest", generada (manchones pastel y un lobo de triángulos, 270x220). En 5,12 le cae un tachón violeta de stencil 1 frame antes de la respuesta.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat: `traje una foto de Pinterest`
  - Carril, en 5,12: `la tuneamos.`
- **AUDIO:** original, a −20 dB.
- **SFX:** ninguno.
- **EDIT:** El thumbnail entra con la burbuja. El tachón es de 1 frame y sigue sin animación.
- **Función:** identificación ("yo hice eso"). Instala "diseño propio", que tiene callback en 25,61.

### BEAT 06: chat 5
- **TIME:** 5,61–6,59
- **VISUAL:** Ella se incorpora. Ghost de pajaro-flores a la derecha. En el margen izquierdo, el ghost text vertical "SÍ".
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat: `¿mi vieja se va a enterar?`
  - Carril, en 6,10: `sí.`
  - Ghost: `SÍ`
- **AUDIO:** original, a −20 dB.
- **SFX:** ninguno.
- **EDIT:** El ghost text entra con la burbuja (5,61) y sale con la respuesta (6,59).
- **Función:** risa más grande del pre-drop. Línea de share ("@ma mirá").

### BEAT 07: chat 6
- **TIME:** 6,59–7,56
- **VISUAL:** Ella queda de frente y se acomoda el saco.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat: `¿me hacés precio?`
  - Carril, en 7,07: `no.`
- **AUDIO:** original, a −20 dB.
- **SFX:** ninguno.
- **EDIT:** Corte seco.
- **Función:** acelera. Es la respuesta más corta del video.

### BEAT 08: chat 7
- **TIME:** 7,56–8,54
- **VISUAL:** De frente. Entra el ghost de flor-alambre-puas en el piso, a la derecha. Hay 3 ghosts acumulados.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat: `¿cuándo tenés?`
  - Carril, en 8,05: `jueves 17 hs.`
- **AUDIO:** original, a −20 dB.
- **SFX:** ninguno.
- **EDIT:** Corte seco.
- **Función:** gira la conversación hacia el turno. Siembra el callback de 35,37.

### BEAT 09: escribiendo… (DESCANSO deliberado)
- **TIME:** 8,54–9,51
- **VISUAL:** De frente, quieta, "esperando". En el chat, la burbuja de 3 puntos animados a 1/4 de beat.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Chat: `escribiendo…`
  - Carril: **vacío 2 beats.**
- **AUDIO:** original, a −20 dB (último compás antes del drop).
- **SFX:** ninguno.
- **EDIT:** Los ghosts siguen titilando. En 9,51 se apagan todos, en corte seco.
- **Función:** tensión antes del drop. El silencio del carril hace que se lea el próximo cartel.

### BEAT 10: la rendición
- **TIME:** 9,51–10,00
- **VISUAL:** Ella de frente, cielo limpio, sin ghosts.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril, cap 110 px, como cita de testimonio de aviso: `“bueno, agendame”`
- **AUDIO:** original, último beat a −20 dB.
- **SFX:** ninguno.
- **EDIT:** Entra seco en 9,51. En 10,00 salen juntos la cita y el chat completo.
- **Función:** remate. El drop pasa a ser el "sí" y el baile es la clienta feliz.

### BEAT 11: DROP / ráfaga
- **TIME:** 10,00–10,98
- **VISUAL:** Ella se da vuelta y empieza a bailar.
  - Flash violeta de 2 frames (10,00–10,07).
  - **Ráfaga de 8 ghost stencils gigantes** desde los bordes: 4 en 10,00 (arriba e izquierda) y 4 en 10,24 (derecha y abajo).
  - 2 stickers a color en las esquinas: mariposa-daga abajo a la izquierda y flor-alambre-puas arriba a la derecha.
  - Ghost text vertical a la izquierda: "TATUAJES".
  - Nada con centro en su cara o torso.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Carril: vacío (manda la ráfaga).
  - Ghost: `TATUAJES`
  - El ícono de la watermark cambia de color.
- **AUDIO:** **drop original**, a −14 dB desde acá hasta el final.
- **SFX:** ninguno (el bombo hace de golpe).
- **EDIT:** Todo entra seco en beat. Ningún ghost se mueve una vez que está en cuadro. Todo sale en 10,98.
- **Función:** golpe de audio y golpe visual juntos. Es el pico de "llamativo".

### BEAT 12: DESCANSO deliberado
- **TIME:** 10,98–11,95
- **VISUAL:** Ella sola bailando, con la watermark.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** ninguno.
- **AUDIO:** original, a −14 dB.
- **SFX:** ninguno.
- **EDIT:** Corte seco a cuadro limpio.
- **Función:** contraste después de la ráfaga, para que se vea el baile, que es el meme.

### BEAT 13: tandas on/off
- **TIME:** 11,95–13,90
- **VISUAL:** Ghosts en tandas de 3: tanda A (frutilla, gallo, pajaro-flores) en 11,95 y tanda B espejada (mariposa-daga, flor-alambre-puas, frutilla) en 12,93. Van a los costados y no tocan el centro.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** ninguno. El carril queda libre para el próximo cartel.
- **AUDIO:** original, a −14 dB.
- **SFX:** ninguno.
- **EDIT:** Cada tanda reemplaza a la anterior, seco, cada 2 beats.
- **Función:** instala el lenguaje "carpetitas que aparecen y desaparecen" de V2.

### BEAT 14: CTA 1
- **TIME:** 13,90–15,85
- **VISUAL:** Flash magenta de 2 frames. Ghost text "TURNITO" vertical a la derecha. Ghosts de mariposa-daga (arriba a la izquierda) y gallo (abajo a la derecha), con flicker en 14,88.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Carril: `agendá tu turnito`
  - Ghost: `TURNITO`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco. Sale en 15,85.
- **Función:** objetivo del video dicho como aviso de barrio. El chiste es el diminutivo.

### BEAT 15
- **TIME:** 15,85–17,80
- **VISUAL:** La watermark salta a media izquierda. Sticker de frutilla a color abajo a la derecha (15,85–16,83, 2 beats). Se acumulan 3 ghosts, 1 por beat (15,85 · 16,34 · 16,83).
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `turnos por MD`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Salto de watermark en corte seco, sin animación, como V2.
- **Función:** CTA-chiste: "ah, es una publicidad".

### BEAT 16
- **TIME:** 17,80–19,76
- **VISUAL:** Tanda de ghosts (gallo x2 y mariposa-daga) solo en los bordes, on/off cada 2 beats.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril, 2 líneas: `no hacemos envíos` / `(es un tatuaje)`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco.
- **Función:** copy de Marketplace llevado al absurdo.

### BEAT 17
- **TIME:** 19,76–21,71
- **VISUAL:** La misma frutilla ghost crece en 3 saltos de beat: 300 px (19,76), 650 px (20,73) y 1100 px (21,22). Va a la derecha, sin tocar el centro.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril, 2 líneas: `chiquitos, medianos` / `y “ya que estoy”`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Cada salto de tamaño es un reemplazo seco, sin zoom animado.
- **Función:** identificación ("vine por uno y salí con tres"). El gag visual ilustra el texto.

### BEAT 18: stencil → piel
- **TIME:** 21,71–23,66
- **VISUAL:**
  - En 21,71, stencil violeta lineal de mariposa-daga (≈ 170 px) sobre su pantorrilla, siguiendo la pierna por frame con `track.json` (x0+0,3w, y0+0,8h).
  - En 22,20 se reemplaza por el sticker a color en el mismo punto ("se tatuó").
  - El sticker sale en 23,17.
  - Una flecha roja corta apunta a la pierna (21,71–23,17).
  - Los ghosts quedan al mínimo.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `1. el stencil` (21,71–22,20), después `2. así queda` (22,20–23,66).
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Los dos cambios son secos en beat. 23,17–23,66 es 1 beat de texto solo, como cierre.
- **Función:** el único "tatuaje en una persona" que no depende de assets. Es el puente entre dibujo y piel.

### BEAT 19
- **TIME:** 23,66–25,61
- **VISUAL:** Sticker de frutilla a color, grande, a la derecha (1 compás). 3 ghosts de frutilla en cascada a la izquierda, uno por beat (23,66 · 24,15 · 24,63), que son las "3 cuotas".
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `3 cuotas sin interés` / `en la frutilla`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco.
- **Función:** chiste nacional con objeto absurdo. Va a disparar el comentario "¿en serio cuotas?".

### BEAT 20: slot en piel
- **TIME:** 25,61–27,56. La acumulación sigue hasta 35,37.
- **VISUAL:**
  - Ghosts acumulándose a 1 por beat, rotando los 5 diseños. Hay un máximo de 10 visibles: el más viejo titila y se apaga.
  - Slot de **2–4 fotos reales de tatuajes cicatrizados de Briza** (sin vaca ni vegan), recortadas a lo bruto y sin sombra, ≥ 2 beats cada una, en los huecos entre 25,61 y 35,37.
  - La cámara empieza a derivar (≈ 25 s): todo lo pegado al paisaje lleva tracking.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `trabajos reales` / `(no son de Pinterest)`. Callback de BEAT 05. **Si no llegan las fotos**, el texto pasa a `diseños propios` / `(no de Pinterest)` y el slot se llena solo con ghosts. El render no se frena.
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Las fotos entran y salen secas en beat.
- **Función:** deseo y prueba. **Bloqueado por assets:** hay que pedirle las fotos a Briza.

### BEAT 21: escalada 1/3
- **TIME:** 27,56–29,51
- **VISUAL:** Flecha roja a mano alzada desde el carril hasta su antebrazo. La punta sigue el lado externo del box (y0+0,45h) y queda afuera del torso.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `acá un tatuaje`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** La flecha aparece entera, sin trazo animado, y sale seca.
- **Función:** arranca la escalada "el aviso señala lugares para tatuar".

### BEAT 22: escalada 2/3
- **TIME:** 29,51–31,46
- **VISUAL:** Flash amarillo de 2 frames. La watermark salta abajo a la derecha. Flecha roja del carril al bloque blanco, con tracking de `landtrack.json["bloque"]`.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `acá también`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco.
- **Función:** escalada absurda (el bloque como cliente).

### BEAT 23
- **TIME:** 31,46–33,41
- **VISUAL:** Ghost text vertical a la izquierda: "ALIAS". Sigue la acumulación de ghosts.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Carril: `seña por alias`
  - Ghost: `ALIAS`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco. Ocupa el mismo slot que el "escribime para + info" de V2.
- **Función:** proceso real de reserva, dicho como chiste.

### BEAT 24
- **TIME:** 33,41–35,37
- **VISUAL:** Pareja de ghosts: un gallo y el mismo gallo espejado, simétricos arriba, al 50 %.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `promo de a dos` / `(traé a tu amiga)`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco.
- **Función:** convierte el tag en turno doble ("@x vamos"). Hay que confirmar con Briza que sea verdad.

### BEAT 25: escalada 3/3
- **TIME:** 35,37–37,32
- **VISUAL:** Flecha roja larga desde el carril hasta fuera de cuadro por abajo (x 960), apuntando al que filma, sin tocarla a ella.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `el que filma:` / `jueves 17 hs`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco.
- **Función:** remate de la escalada y callback de "jueves 17 hs." (BEAT 08).

### BEAT 26: sync con el footage
- **TIME:** 37,32–39,27
- **VISUAL:** En ≈ 37,3 **ella se toca el pelo**. Hay 8–10 ghosts titilando cada 2 beats.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `cuidados:` / `no te toques`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** El texto entra justo en el beat 37,32. Verificar en el render que el gesto caiga dentro de los primeros 2 beats; si cae antes, adelantar a 36,83.
- **Función:** chiste de timing: el aviso la reta.

### BEAT 27
- **TIME:** 39,27–41,22
- **VISUAL:** Flashes a color puntuales en el tercio inferior: gallo (abajo a la izquierda, 39,27) y pajaro-flores (abajo a la derecha, 39,76).
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril: `flash disponible`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Entran escalonados a 1 beat de distancia y salen juntos en 41,22.
- **Función:** producto concreto: estos diseños se pueden pedir.

### BEAT 28: SHARE / pico
- **TIME:** 41,22–45,12 (2 compases)
- **VISUAL:**
  - Flashes de 2 frames: violeta en 41,22 y magenta en 43,17.
  - **Pico de saturación:** 12 ghosts superpuestos de 600 a 1400 px, que se prenden y apagan alternados por beat. Ella siempre queda en un hueco.
  - Ghost text "COMPARTAN" en los dos márgenes.
  - La watermark vuelve arriba a la derecha.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:**
  - Carril: `compartan que` / `me ayuda un montón` (contorno blanco de 6 px, por los ghosts detrás)
  - Ghost: `COMPARTAN`
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Corte seco. El texto queda fijo 8 beats.
- **Función:** orden de compartir en personaje (el emprendimiento de la amiga), en el pico visual.

### BEAT 29: limpieza (DESCANSO deliberado del carril)
- **TIME:** 45,12–47,07
- **VISUAL:** Se apagan 3 ghosts por beat. En 46,59 no queda ninguno y ella baila sola.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** ninguno.
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** Bajas secas en beat.
- **Función:** respiro antes de la tarjeta. El vacío hace que se lea.

### BEAT 30: tarjeta TURNITO
- **TIME:** 47,07–49,51
- **VISUAL:** Tarjeta blanca con borde negro de 6 px en el carril (x 140–940, y 300–860). Los campos se completan "a mano" en rojo: `jueves` en 47,56, `17 hs` en 48,05 y `ya que estoy` en 48,54.
- **CAMERA:** plano único original, sin tocar.
- **TEXT:** carril/tarjeta: `TURNITO` (cap 90 px) / `día: ____` / `hora: ____` / `diseño: ____` / `seña: por alias` (cap 55 px).
- **AUDIO:** original.
- **SFX:** ninguno.
- **EDIT:** La tarjeta entra seca. Cada campo aparece en su beat. Sale seca en 49,51.
- **Función:** cierre con el turno como objeto. Junta los callbacks (jueves 17 hs y "ya que estoy").

### BEAT 31: END CARD (formato V2)
- **TIME:** 49,51–53,80
- **VISUAL:**
  - Flash de gradiente IG de 2 frames.
  - Video al **45 % de brillo**, ella visible bailando.
  - Ícono de IG centrado (y≈700, 300 px) que **cambia de color en cada beat**: 49,51 · 50,00 · 50,49 · 50,98 · 51,46 · 51,95 · 52,44 · 52,93 · 53,41 (9 cambios).
  - Sin ghosts ni stickers.
- **CAMERA:** plano único original, sin tocar. El oscurecido es formato V2 y no transforma el plano.
- **TEXT:** `@brizamaldonado` (centrado, y≈950, cap ≥ 80 px, blanco). Sin texto extra.
- **AUDIO:** original hasta 53,80, con fade de 2 frames al final.
- **SFX:** ninguno.
- **EDIT:** Oscurecido seco en 49,51 y corte final en 53,80 (src 58,80, antes de que se caiga la cámara).
- **Función:** "¿quién es?" → perfil.

---

## Notas de entrega
- **Caption:** "me dijeron que si no hago el trend no me ve nadie".
- **Comentario fijado:** "¿cuál te tatuás? (la frutilla tiene cuotas)".
- **Confirmar con Briza antes de publicar:**
  - el handle;
  - que "promo de a dos", "3 cuotas" y "seña por alias" sean reales;
  - que el turno de "jueves 17 hs" exista o que haya una respuesta en personaje lista;
  - las fotos en piel (BEAT 20).

## TIMELINE

Tiempos en segundos de salida. `pos` en coordenadas 1080x1920. `track.json` y `landtrack.json` se indexan en frame src = round(out×30) + 150.

```json
[
 {"t0": 0.0, "t1": 1.71, "type": "text", "content": "¿querés tatuarte?", "pos": "lane", "notes": "cap>=110px, 85% del ancho, negro 100%, Liberation Sans Bold escala X 0.80, centrado y~470"},
 {"t0": 0.0, "t1": 1.71, "type": "ghost_stencil", "content": "mariposa-daga", "pos": "x80-1000,y150-900", "notes": "violeta #6B3FA0 45%, multiply, rot -10, ~900px; DETRAS del texto"},
 {"t0": 0.0, "t1": 15.85, "type": "watermark", "content": "[IG] @brizamaldonado", "pos": "x600-1020,y250-300", "notes": "IG icon + @, 40px cap, negro 100%; el icono cambia de color en cada compas (10.00,11.95,13.90)"},
 {"t0": 0.73, "t1": 1.71, "type": "ghost_stencil", "content": "frutilla", "pos": "x620-1060,y520-960", "notes": "violeta 40%, rot +14, ~480px; entra de golpe en beat"},
 {"t0": 1.22, "t1": 1.46, "type": "clear", "content": "flicker ghosts hook", "pos": "x80-1060,y150-960", "notes": "los 2 ghosts se apagan 1/2 beat y vuelven en 1.46"},
 {"t0": 1.71, "t1": 10.0, "type": "chat", "content": "encabezado: @brizamaldonado · tatuajes", "pos": "x40-430,y820-1420 (header y820-860)", "notes": "header chico cap 30px; columna de chat secundaria; burbujas grises #E9E9EB, texto negro cap 30px, max 3 burbujas visibles (scroll hacia arriba); sale en corte seco en 10.00"},
 {"t0": 1.71, "t1": 10.0, "type": "chat", "content": "¿duele?", "pos": "x40-430,y820-1420", "notes": "burbuja clienta, entra en beat (pop de escala 100% en 2 frames, sin rebote); sube cuando entra la siguiente; desaparece del stack al quedar 4ta"},
 {"t0": 2.2, "t1": 2.68, "type": "text", "content": "un poquito.", "pos": "lane", "notes": "respuesta en tipografia flyer, cap 100-110px, negro 100%; corte seco de entrada y salida"},
 {"t0": 2.68, "t1": 10.0, "type": "chat", "content": "¿y si me arrepiento?", "pos": "x40-430,y820-1420", "notes": "burbuja clienta, entra en beat (pop de escala 100% en 2 frames, sin rebote); sube cuando entra la siguiente; desaparece del stack al quedar 4ta"},
 {"t0": 3.17, "t1": 3.66, "type": "text", "content": "tarde.", "pos": "lane", "notes": "respuesta en tipografia flyer, cap 100-110px, negro 100%; corte seco de entrada y salida"},
 {"t0": 3.66, "t1": 9.51, "type": "ghost_stencil", "content": "gallo", "pos": "x640-1060,y180-700", "notes": "violeta 35%, rot +8, ~420px; on/off cada 2 beats"},
 {"t0": 3.66, "t1": 10.0, "type": "chat", "content": "¿cuánto sale uno chiquito?", "pos": "x40-430,y820-1420", "notes": "burbuja clienta, entra en beat (pop de escala 100% en 2 frames, sin rebote); sube cuando entra la siguiente; desaparece del stack al quedar 4ta"},
 {"t0": 4.15, "t1": 4.63, "type": "text", "content": "precio por privado.", "pos": "lane", "notes": "respuesta en tipografia flyer, cap 100-110px, negro 100%; corte seco de entrada y salida"},
 {"t0": 4.63, "t1": 5.61, "type": "sticker", "content": "thumbnail 'foto de Pinterest' (acuarela fea generada: manchones pastel + lobo geometrico)", "pos": "x60-330,y1180-1400", "notes": "adjunto dentro de la burbuja, 270x220; en 5.12 le cae encima un tachon violeta (stencil-line) 1 frame antes del texto"},
 {"t0": 4.63, "t1": 10.0, "type": "chat", "content": "traje una foto de Pinterest", "pos": "x40-430,y820-1420", "notes": "burbuja clienta, entra en beat (pop de escala 100% en 2 frames, sin rebote); sube cuando entra la siguiente; desaparece del stack al quedar 4ta"},
 {"t0": 5.12, "t1": 5.61, "type": "text", "content": "la tuneamos.", "pos": "lane", "notes": "respuesta en tipografia flyer, cap 100-110px, negro 100%; corte seco de entrada y salida"},
 {"t0": 5.61, "t1": 6.59, "type": "ghost_text", "content": "SÍ", "pos": "x0-330,y300-1500 vertical", "notes": "blanco 40%, rot 90, cap ~260px, margen izquierdo; eco del 'sí.'"},
 {"t0": 5.61, "t1": 9.51, "type": "ghost_stencil", "content": "pajaro-flores", "pos": "x620-1060,y600-980", "notes": "violeta 35%, rot -6, ~380px; acumula"},
 {"t0": 5.61, "t1": 10.0, "type": "chat", "content": "¿mi vieja se va a enterar?", "pos": "x40-430,y820-1420", "notes": "burbuja clienta, entra en beat (pop de escala 100% en 2 frames, sin rebote); sube cuando entra la siguiente; desaparece del stack al quedar 4ta"},
 {"t0": 6.1, "t1": 6.59, "type": "text", "content": "sí.", "pos": "lane", "notes": "respuesta en tipografia flyer, cap 100-110px, negro 100%; corte seco de entrada y salida"},
 {"t0": 6.59, "t1": 10.0, "type": "chat", "content": "¿me hacés precio?", "pos": "x40-430,y820-1420", "notes": "burbuja clienta, entra en beat (pop de escala 100% en 2 frames, sin rebote); sube cuando entra la siguiente; desaparece del stack al quedar 4ta"},
 {"t0": 7.07, "t1": 7.56, "type": "text", "content": "no.", "pos": "lane", "notes": "respuesta en tipografia flyer, cap 100-110px, negro 100%; corte seco de entrada y salida"},
 {"t0": 7.56, "t1": 9.51, "type": "ghost_stencil", "content": "flor-alambre-puas", "pos": "x700-1070,y1350-1700", "notes": "violeta 35%, ~360px, sobre el piso a la derecha; acumula. En 9.51 se apagan todos (beat limpio para la cita)"},
 {"t0": 7.56, "t1": 10.0, "type": "chat", "content": "¿cuándo tenés?", "pos": "x40-430,y820-1420", "notes": "burbuja clienta, entra en beat (pop de escala 100% en 2 frames, sin rebote); sube cuando entra la siguiente; desaparece del stack al quedar 4ta"},
 {"t0": 8.05, "t1": 8.54, "type": "text", "content": "jueves 17 hs.", "pos": "lane", "notes": "respuesta en tipografia flyer, cap 100-110px, negro 100%; corte seco de entrada y salida"},
 {"t0": 8.54, "t1": 9.51, "type": "chat", "content": "escribiendo…", "pos": "x40-430,y820-1420", "notes": "burbuja con 3 puntos animados a 1/4 beat; DESCANSO deliberado del carril: lane vacio 2 beats"},
 {"t0": 9.51, "t1": 10.0, "type": "text", "content": "“bueno, agendame”", "pos": "lane", "notes": "cita de testimonio de aviso, cap 110px, negro 100%, comillas tipograficas; ella esta de frente"},
 {"t0": 10.0, "t1": 10.07, "type": "flash_color", "content": "violeta #6B3FA0 30% full-frame", "pos": "full", "notes": "2 frames exactos en el bombo del drop"},
 {"t0": 10.0, "t1": 10.98, "type": "burst", "content": "8 ghost stencils gigantes (mariposa-daga x2, frutilla x2, gallo, pajaro-flores x2, flor-alambre-puas) + 2 stickers color (mariposa-daga, flor-alambre-puas)", "pos": "bordes: 4 desde arriba/izq en 10.00, 4 desde der/abajo en 10.24; stickers en esquinas x60-300,y1350-1550 y x800-1040,y300-520", "notes": "violeta 40-55%, 600-1300px, rot +-20; ninguno con centro en cara/torso (track.json, mitad sup. del box x1.2); se quedan quietos hasta 10.98"},
 {"t0": 10.0, "t1": 10.98, "type": "ghost_text", "content": "TATUAJES", "pos": "x0-300,y200-1700 vertical", "notes": "blanco 40%, rot 90, cap ~300px, margen izq"},
 {"t0": 10.98, "t1": 11.95, "type": "clear", "content": "todo afuera", "pos": "full", "notes": "DESCANSO deliberado 2 beats: solo ella + watermark; corte seco en 10.98"},
 {"t0": 11.95, "t1": 12.93, "type": "ghost_stencil", "content": "tanda A: frutilla, gallo, pajaro-flores", "pos": "x60-400,y250-900 / x700-1060,y250-900 / x700-1060,y1300-1700", "notes": "violeta 45%, ~600px; on/off seco"},
 {"t0": 12.93, "t1": 13.9, "type": "ghost_stencil", "content": "tanda B: mariposa-daga, flor-alambre-puas, frutilla", "pos": "espejo de tanda A", "notes": "violeta 45%, rot opuesta"},
 {"t0": 13.9, "t1": 13.97, "type": "flash_color", "content": "magenta IG #DD2A7B 30%", "pos": "full", "notes": "2 frames"},
 {"t0": 13.9, "t1": 15.85, "type": "text", "content": "agendá tu turnito", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 13.9, "t1": 15.85, "type": "ghost_text", "content": "TURNITO", "pos": "x780-1080,y200-1700 vertical", "notes": "blanco 40%, rot -90, margen der"},
 {"t0": 13.9, "t1": 15.85, "type": "ghost_stencil", "content": "mariposa-daga, gallo", "pos": "x60-400,y300-900 / x700-1060,y1250-1650", "notes": "violeta 40%; on en 13.90, flicker off/on en 14.88"},
 {"t0": 15.85, "t1": 16.83, "type": "sticker", "content": "frutilla (color)", "pos": "x800-1040,y1330-1560", "notes": "flash puntual 2 beats, borde blanco; entra/sale seco"},
 {"t0": 15.85, "t1": 17.8, "type": "text", "content": "turnos por MD", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 15.85, "t1": 17.8, "type": "ghost_stencil", "content": "pajaro-flores, flor-alambre-puas, frutilla", "pos": "x60-420,y250-800 / x680-1060,y980-1300 / x60-380,y1400-1750", "notes": "violeta 40%; acumulan 1 por beat (15.85,16.34,16.83)"},
 {"t0": 15.85, "t1": 29.51, "type": "watermark", "content": "[IG] @brizamaldonado", "pos": "x60-500,y880-925", "notes": "salto 1 a media izquierda (corte seco); icono cicla color por compas"},
 {"t0": 17.8, "t1": 19.76, "type": "text", "content": "no hacemos envíos\n(es un tatuaje)", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 17.8, "t1": 19.76, "type": "ghost_stencil", "content": "gallo x2, mariposa-daga", "pos": "bordes izq/der fuera de x340-860", "notes": "violeta 45%; tanda on/off cada 2 beats"},
 {"t0": 19.76, "t1": 21.71, "type": "text", "content": "chiquitos, medianos\ny “ya que estoy”", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 19.76, "t1": 21.71, "type": "ghost_stencil", "content": "escalada de tamano: frutilla 300px (19.76) -> 650px (20.73) -> 1100px (21.22)", "pos": "x620-1080,y250-1000", "notes": "gag visual del 'ya que estoy': la misma frutilla crece en 3 saltos de beat, violeta 40%"},
 {"t0": 21.71, "t1": 22.2, "type": "text", "content": "1. el stencil", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 21.71, "t1": 22.2, "type": "skin_slot", "content": "stencil mariposa-daga violeta (lineal) sobre la pantorrilla", "pos": "track.json: (x0+0.3w, y0+0.80h), ~170px", "notes": "sigue la pierna por frame; 85% opacidad; solo piernas se usan para este gag"},
 {"t0": 21.71, "t1": 23.17, "type": "arrow", "content": "flecha roja corta apuntando a la pantorrilla", "pos": "al costado externo de la pierna, tip a 20px del stencil", "notes": "rojo #E0101A, trazo 14px, a mano alzada"},
 {"t0": 21.71, "t1": 23.66, "type": "clear", "content": "ghosts al minimo", "pos": "full", "notes": "solo 1 ghost lejano; foco en el gag"},
 {"t0": 22.2, "t1": 23.17, "type": "skin_slot", "content": "sticker mariposa-daga a color, mismo punto", "pos": "track.json: (x0+0.3w, y0+0.80h), ~170px", "notes": "reemplazo seco en beat = 'se tatuó'; sale en 23.17"},
 {"t0": 22.2, "t1": 23.66, "type": "text", "content": "2. así queda", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 23.66, "t1": 25.61, "type": "text", "content": "3 cuotas sin interés\nen la frutilla", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 23.66, "t1": 25.61, "type": "sticker", "content": "frutilla (color) grande", "pos": "x620-1000,y980-1330", "notes": "1 compas, rot +10"},
 {"t0": 23.66, "t1": 25.61, "type": "ghost_stencil", "content": "frutilla x3 en cascada", "pos": "x60-420,y250-1700", "notes": "violeta 40%; uno por beat (23.66,24.15,24.63) = las '3 cuotas'"},
 {"t0": 25.61, "t1": 27.56, "type": "text", "content": "trabajos reales\n(no son de Pinterest)", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 25.61, "t1": 35.37, "type": "ghost_stencil", "content": "acumulacion 1 por beat (rotan los 5 disenos)", "pos": "huecos alrededor del box de ella", "notes": "violeta 35-50%; maximo 10 visibles, el mas viejo titila y se apaga; nunca centro en cara/torso"},
 {"t0": 25.61, "t1": 35.37, "type": "skin_slot", "content": "2-4 fotos reales de tatuajes cicatrizados de Briza (sin vaca ni vegan)", "pos": "huecos x60-330 / x760-1040, y300-1350", "notes": "recorte a lo bruto, sin sombra, >=2 beats cada una; BLOQUEADO POR ASSETS: si no llegan, el slot queda solo con ghosts y la linea de 25.61 pasa a 'diseños propios\\n(no de Pinterest)'"},
 {"t0": 27.56, "t1": 29.51, "type": "text", "content": "acá un tatuaje", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 27.56, "t1": 29.51, "type": "arrow", "content": "flecha roja del carril al antebrazo de ella", "pos": "tip: lado externo del box track.json a y0+0.45h", "notes": "sigue el brazo por frame; la punta queda afuera del torso"},
 {"t0": 29.51, "t1": 29.58, "type": "flash_color", "content": "amarillo #FEDA75 25%", "pos": "full", "notes": "2 frames; marca el salto de la watermark"},
 {"t0": 29.51, "t1": 31.46, "type": "text", "content": "acá también", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 29.51, "t1": 31.46, "type": "arrow", "content": "flecha roja del carril al bloque", "pos": "tip: landtrack.json 'bloque'", "notes": "tracking del bloque (la camara deriva)"},
 {"t0": 29.51, "t1": 41.22, "type": "watermark", "content": "[IG] @brizamaldonado", "pos": "x600-1020,y1300-1345", "notes": "salto 2 abajo-derecha, blanco con contorno negro 6px (sobre mar)"},
 {"t0": 31.46, "t1": 33.41, "type": "text", "content": "seña por alias", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 31.46, "t1": 33.41, "type": "ghost_text", "content": "ALIAS", "pos": "x0-300,y200-1700 vertical", "notes": "blanco 40%, rot 90"},
 {"t0": 33.41, "t1": 35.37, "type": "text", "content": "promo de a dos\n(traé a tu amiga)", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 33.41, "t1": 35.37, "type": "ghost_stencil", "content": "pareja: gallo + gallo espejado", "pos": "x60-460,y280-820 / x620-1020,y280-820", "notes": "violeta 50%, gag 'de a dos'"},
 {"t0": 35.37, "t1": 37.32, "type": "text", "content": "el que filma:\njueves 17 hs", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 35.37, "t1": 37.32, "type": "arrow", "content": "flecha roja larga hacia el borde inferior", "pos": "de x960,y820 a x960,y1880 (sale de cuadro)", "notes": "apunta al que filma; callback 'jueves 17 hs.'"},
 {"t0": 37.32, "t1": 39.27, "type": "text", "content": "cuidados:\nno te toques", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 37.32, "t1": 39.27, "type": "ghost_stencil", "content": "acumulacion 8-10, titilando", "pos": "huecos", "notes": "violeta 40-50%; flicker cada 2 beats"},
 {"t0": 39.27, "t1": 41.22, "type": "text", "content": "flash disponible", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 39.27, "t1": 41.22, "type": "sticker", "content": "gallo (color) + pajaro-flores (color)", "pos": "x60-330,y1350-1550 / x780-1040,y1350-1550", "notes": "flash puntual en tercio inferior, entran 39.27 y 39.76, salen 41.22"},
 {"t0": 41.22, "t1": 41.29, "type": "flash_color", "content": "violeta #6B3FA0 30%", "pos": "full", "notes": "2 frames"},
 {"t0": 41.22, "t1": 45.12, "type": "text", "content": "compartan que\nme ayuda un montón", "pos": "lane", "notes": "cap 95-110px, negro 100%, contorno blanco 6px si hay ghost detras; corte seco"},
 {"t0": 41.22, "t1": 45.12, "type": "ghost_stencil", "content": "PICO: 12 ghosts superpuestos, 600-1400px", "pos": "todo el cuadro salvo cara/torso", "notes": "violeta 40-55%, se prenden y apagan alternando por beat; ella siempre en un hueco"},
 {"t0": 41.22, "t1": 45.12, "type": "ghost_text", "content": "COMPARTAN", "pos": "x0-300 y x780-1080 vertical, ambos margenes", "notes": "blanco 40%; izq rot 90, der rot -90"},
 {"t0": 41.22, "t1": 49.51, "type": "watermark", "content": "[IG] @brizamaldonado", "pos": "x600-1020,y250-300", "notes": "vuelve a su lugar; sale con el end card"},
 {"t0": 43.17, "t1": 43.24, "type": "flash_color", "content": "magenta IG #DD2A7B 30%", "pos": "full", "notes": "2 frames, cambio de compas dentro de la linea larga"},
 {"t0": 45.12, "t1": 47.07, "type": "clear", "content": "limpieza: 3 ghosts por beat se apagan", "pos": "full", "notes": "DESCANSO deliberado del carril (1 compas): ella sola bailando; en 46.59 queda 0"},
 {"t0": 47.07, "t1": 49.51, "type": "card", "content": "TURNITO\ndía: ____\nhora: ____\ndiseño: ____\nseña: por alias", "pos": "lane: card x140-940,y300-860", "notes": "tarjeta blanca #FFFFFF borde negro 6px, 'TURNITO' cap 90px, campos cap 55px; entra seca en 47.07; los guiones se 'completan' a mano en rojo: día 'jueves' (47.56), hora '17 hs' (48.05), diseño 'ya que estoy' (48.54); sale en 49.51"},
 {"t0": 49.51, "t1": 49.58, "type": "flash_color", "content": "IG gradiente 30%", "pos": "full", "notes": "2 frames, entrada del end card"},
 {"t0": 49.51, "t1": 53.8, "type": "endcard", "content": "icono IG + @brizamaldonado", "pos": "icono centrado y~700 (300px); @ centrado y~950 cap>=80px blanco", "notes": "video al 45% de brillo, ella visible; icono cambia de color en cada beat: 49.51,50.00,50.49,50.98,51.46,51.95,52.44,52.93,53.41 (9 cambios); sin texto extra"}
]
```
