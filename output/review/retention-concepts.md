# Retention review: conceptos A/B/C + v0

> Método: `.claude/skills/short-form-retention`. Simulamos a un usuario de 20–35 en un feed argentino, con el pulgar listo, que le da 1 s al video.
> Inputs: `viral-video/briefs/00-source-observations.md` (incluida la **REGLA DEL CLIENTE**), `output/analysis/*.md`, `output/concepts/concept-{a,b,c}.md`, `viral-video/build/v0.mp4` (35,1 s; frames extraídos cada ≈1 s) y frames de `work/video1.mp4` (src 5–58,8).

## 0. Cambio de marco (regla del cliente)

El formato es fijo: footage de la señora **continuo e intacto**, sin freezes ni cortes, y el audio original. Recorte desde src 5,0, así que **out = src − 5,0**. Drop en **out 10,00**, fin en **out ≈53,8** y end card (video oscurecido + ícono IG + @) en los **últimos ≈4 s, desde 49,53**.
- **B y C como están escritos quedan FUERA.** B depende de freezes y de cortes de música; C, de reemplazar el footage por la publicidad seria, del low-pass, de los tape stops y del mute. Abajo los simulo como **capas** (B' y C') sobre el formato fiel y separo qué ideas se pueden portar.
- **Grilla de beats para 53,8 s** (123 BPM, 1 beat = 0,488 s, anclada al drop en 10,00):
  - Pre-drop: 0,24 · 0,73 · 1,22 · 1,71 · 2,20 · 2,68 · 3,17 · 3,66 · 4,15 · 4,63 · 5,12 · 5,61 · 6,10 · 6,59 · 7,07 · 7,56 · 8,05 · 8,54 · 9,02 · 9,51.
  - Compases post-drop: 10,00 · 11,95 · 13,90 · 15,86 · 17,81 · 19,76 · 21,71 · 23,66 · 25,62 · 27,57 · 29,52 · 31,47 · 33,42 · 35,37 · 37,33 · 39,28 · 41,23 · 43,18 · 45,13 · 47,09 · 49,04 · 50,99 · 52,94.
- **Qué pasa en el footage, en tiempo out:**
  - 0–3,5: de espaldas, caminando. Se ve la sombra del que filma en 2–3,5.
  - 3,5–6: gira y se agacha junto al bloque.
  - 7–9,5: de frente, se acomoda el saco.
  - 10: drop.
  - 37,3: se toca el pelo.
  - **Desde ≈25 (src 30) la cámara deriva:** el horizonte baja unos 40 px y en 51–53 (src 56–58) el bloque se corre. Cualquier gráfico "pegado" al velero o al bloque necesita tracking.
- **El problema estructural nuevo:** A estaba pensado para 42,9 s y v0 dura 35,1. El formato fiel tiene **10 s de pre-drop** (2,2 s más que A) y **39,5 s de baile** (8 s más que A). Las dos zonas nuevas son justo las de mayor fuga.

## 1. Simulación por concepto (formato fiel, 53,8 s)

Severidad: B = bajo, M = medio, A = alto.

### A' — "El comercial de la vaca", trasladado tal cual a 53,8 s
| Ventana | ¿Qué siente el usuario? | Riesgo | Fix |
|---|---|---|---|
| 0–1 s | Pregunta absurda en negro sobre cielo liso y saco rojo. Se entiende. Pero no hay **ninguna imagen de vaca** y la señora está chiquita y de espaldas | **M** | Vaca sticker grande bajo el texto desde el frame 0. Texto al 85 % del ancho |
| 1–3 s | No cambia nada hasta 3,9–4,15 (en v0 el cartel queda fijo 0–3,9) | **A** | Algo nuevo en 1,22 y en 2,20 (ver beat sheet) |
| 3–5 s | Primera tanda (4,15). El gag stencil→sticker, como está diseñado, no se lee: dura 1 beat y el cambio es sutil | **M** | Si queda, que sea gigante y centrado: 1 vaca, no 4 |
| 5–10 s | "tradicional vegano" al 60 % de blanco sobre cielo claro, casi invisible. Después 4 s sin nada hasta el drop. **Es la fuga más grande del formato fiel** | **A** | Un remate antes del drop ("¿duele? consultá por privado" o la ráfaga de sellos de B) y 1 beat limpio en 9,51 |
| Drop 10,0 | Funciona si es fuerte. En v0 el drop son 4 stickers, poco para el golpe de audio | **M** | 8–10 piezas en 1 beat |
| 12–20 s | v0: "turnos por MD" fijo 4,5 s más frames limpios 13,5–15,5 = **meseta**. "zona" al 25 % no cuenta como info | **A** | Una línea legible cada 2 compases y un cambio visual en cada compás |
| 20–41 s | Buena densidad de chistes (envíos, cuotas, alias, promo), pero en v0 se pierde por legibilidad (ver §2) | **M** | Carril de texto protegido |
| 41–49,5 s | **A' no tiene material**: su guion termina en drop+31 s. Quedan 8 s de baile repetitivo sin nada nuevo | **A** | Escalada de B (bloque → velero → el que filma), "sesión 1 de 47" y las hojas completas |
| Final | "compartan que me ayuda un montón" es el mejor remate del proyecto, pero **en v0 no aparece**. End card estática | **M** | Remate en 41,23, sostenido 2 compases. End card viva (§2) |
| Después | Share alto ("@x la amiga emprendedora"). El loop no encaja: el audio pasa de fuerte a la intro bajita | **M** | Comentario fijado + último beat con "¿querés tatuarte una vaca?" chiquito para invitar al re-play |

### B' — "Bueno, haceme la vaca" como capa (sin freezes)
| Ventana | ¿Qué siente el usuario? | Riesgo | Fix |
|---|---|---|---|
| 0–1 s | Título + burbuja + imagen adjunta: **demasiado para 1 s** | **M-A** | Frame 0: solo la acuarela fea grande + 1 burbuja. El sello de vaca cae en 0,24 (movimiento en el primer segundo) |
| 1–3 s | Un sello por cada 2 beats: el patrón "todo te lo hace vaca" engancha | **B** | — |
| 3–5 s | Se entiende el juego | **B** | — |
| 5–10 s | "uno que no se vea → ahí está", "…", "bueno.", "haceme la vaca." en 9,51 y el drop = el sí. **Es el pre-drop más fuerte de los tres** y coincide con ella girando a cámara | **B** | Burbujas apiladas (tipo chat que scrollea) para que cada una quede visible más de 1 beat |
| 10–25 s | Sin freezes, el "telestrator" sobre un cuerpo que se mueve **no acierta**: círculos fuera de lugar y un cuadro sucio | **A** | Anotar solo lugares fijos (bloque, velero, mar) o seguir el saco rojo por color |
| 25–49,5 s | B tenía 33 s y "sesión 1 de 47" necesitaba corte de música y freeze. Sin eso, se queda sin escalada | **A** | Pasarse a la acumulación de producto de A |
| Final | "traé tu idea chiquita" funciona como CTA | **M** | — |
| Después | Es el mejor anzuelo de comentarios ("dejá tu referencia y te contesto con una vaca") | **B** | — |

### C' — "Publicidad seria, toma 14" como capa
| Ventana | ¿Qué siente el usuario? | Riesgo | Fix |
|---|---|---|---|
| 0–1 s | "Tatuaje tradicional." en serif sobre la señora de espaldas = **parece un aviso aburrido de verdad**. El post-it no se lee en 1 s | **A** | — (no tiene arreglo sin la interrupción) |
| 1–5 s | "Hecho a mano. En Buenos Aires." No hay juego. Quien no reconoce el trend se va | **A** | — |
| 5–10 s | "Arte que respeta la vida." Lo único que salva el tramo es la anticipación del trend | **A** | "Hecho a ma—" cortado justo en 9,51 |
| Drop | La "interrupción" no existe porque el footage estuvo siempre. Queda solo el texto serio roto por los stickers | **M** | Los stickers "rompen" el serif en el drop |
| Mitad | Repite las líneas de A (cuotas, alias) | **M** | — |
| Final | "me dijeron que si no hago el trend no me ve nadie" se comparte entre emprendedores, pero **rompe el deadpan** de A | **M** | Usarla como caption, no como overlay |
| Después | Formato de serie ("toma 17") | **M** | — |

**Conclusión:** sin cortes, C pierde su motor. B gana el pre-drop y pierde el post-drop. A gana el post-drop y pierde el pre-drop. **El híbrido A + pre-drop de B** cubre las dos fugas.

## 2. v0 (`viral-video/build/v0.mp4`, 35,1 s): problemas de ejecución

1. **El texto queda debajo de los stickers.**
   - 12,0: el sticker de la vaca tapa "turnos".
   - 22,6: un corazón tapa "tatuaje".
   - 27–28: "3 cuotas sin interés en la vaca" cruza el borde de una hoja crema y una frutilla.
   - 30,6: "seña por alias" queda tapado.

   **Fix:** el texto va siempre en la capa de arriba. Mientras hay texto en pantalla, su carril (y 300–800) queda libre de stickers. Si igual se cruza algo, contorno blanco de 6 px.
2. **Los recortes crema de las hojas** (desde 26 s) son el peor fondo para texto negro: rompen el contraste a la mitad de la palabra. Van al tercio inferior y solo fuera del carril de texto.
3. **"tradicional vegano" (6,3 s) en blanco al 60 % sobre cielo celeste:** ilegible. Pasarlo a negro al 100 % o sacarlo.
4. **"zona: bs as (consultar)" al 25 %, tapado por stickers (18 s):** no suma nada. El gag "casi ilegible" solo funciona sobre fondo limpio.
5. **Drop débil (7,85):** 4 piezas chicas contra un golpe de audio. Tienen que ser 8–10 en 1 beat.
6. **Meseta 12,5–17,5 s:** el mismo texto 4,5 s y cero stickers entre 13,5 y 15,5.
7. **La señora tapada:** en 28–35 s la hoja crema y los stickers cubren torso y cara, contra la regla de A de no taparla más de 1 beat. **La señora ES el meme.**
   **Fix:** bounding box por segmentación del rojo (saco + zapatos, trivial con numpy) para cada frame. No va ningún centro de sticker dentro del box ampliado ×1,2, salvo gags de 1 beat.
8. **End card estática (31,2–35,1):** stickers congelados, señora casi invisible, ícono IG fijo, handle de ≈40 px.
   **Fix:** sacar los stickers de a uno por beat antes de la end card. Video al 45 % de brillo con ella visible. Ícono IG cambiando de color en cada beat (como V2). Handle con cap-height ≥ 80 px, centrado en y≈950.
9. **Faltan remates de la spec:** "¿duele? consultá por privado", "promo vaca + chancho", "compartan que me ayuda un montón" y la tarjeta de turno. El gag stencil→sticker no se ve: a los 3,95 entran corazones Vegan ya con borde.
10. **Hook chico:** "¿querés tatuarte una vaca?" ocupa ≈55 % del ancho. Tiene que ir al 85 % (condensada), cap-height ≥ 110 px.
11. **Marca de agua de ≈22 px:** ilegible en el celular. Que sea "chiquita" no quiere decir invisible: subir a ≈40 px.
12. **Duración:** 35,1 s. El formato fiel pide 53,8.
13. **Safe zones (Reels/TikTok, 1080x1920).**
    - Texto crítico en y 250–1350 y x 60–940.
    - Abajo, de 1550 a 1920, va la caption.
    - A la derecha, x > 940 entre y 950 y 1700, están los botones.
    - En v0 el texto cumple. Los stickers del lateral derecho (20–30 s) quedan debajo de los botones: es ruido, pero aceptable. Nada importante abajo de y 1550.
14. **Audio:** el formato fiel pide "mismo audio original". Los SFX de B (pops, boom) y el crunch/deep-fry sobre el footage quedan **a confirmar** con el cliente. Por defecto: cero SFX y crunch solo en la capa de overlays.

## 3. Ideas de B/C que se pueden portar a la capa (sin tocar footage ni audio)

| Idea | Origen | Valor de retención | Nota |
|---|---|---|---|
| Pedidos de clienta en burbujas + **SELLO de vaca** cada 2 beats, en el pre-drop | B | **Alto**: tapa la fuga de 1–10 s | Cielo, máximo 6 palabras por burbuja, se apilan |
| "uno que no se vea" → sello vacío + "ahí está" | B | **Alto** (el mejor chiste corto) | ≈6,1–6,6 |
| "bueno." → **"haceme la vaca."** en 9,51 y el drop como el "sí" | B | **Alto**: el drop pasa a significar algo | Ella gira a cámara justo ahí |
| Ráfaga de 10 sellos en el drop | B | Alto | Solo overlays, sin shake del footage |
| Flechas rojas: "el bloque (de prueba)", "el velero", "el mar", "el que filma" | B | **Alto** para 27–35 s | Tracking del bloque y del velero (deriva de cámara desde 25 s) |
| "sesión 1 de 47" como sello de texto en el pico de saturación | B | Medio | Sin corte de música |
| Comentario fijado "dejá tu referencia, te contesto con lo que corresponde" | B | Alto (comentarios) | — |
| "Hecho a ma—" en serif, roto por la ráfaga del drop | C | Medio | Si se usa, va en lugar de la burbuja de 9,51. No usar las dos |
| "bueno." / "me dijeron que si no hago el trend no me ve nadie" | C | Medio | **Caption**, no overlay: rompe el deadpan |
| Hojas completas (hoja_1/2) entrando torcidas como "catálogo" | C | Medio (deseo de tatuarse) | 39–41 s, nunca en el carril de texto |
| "toma 17: ¿qué diseño va?" como pregunta en comentarios | C | Medio | Caption o comentario fijado |
| **Fuera:** publicidad que reemplaza el footage, low-pass, tape stops, mute, freezes, polaroid en la end card | B/C | — | Viola la regla del cliente |

## 4. Beat sheet recomendado (híbrido A + B-pre-drop, 53,8 s)

| out (s) | Capa |
|---|---|
| 0,00 | "¿querés tatuarte una vaca?" negro gigante + vaca sticker grande debajo. Marca de agua desde el frame 0 |
| 1,22 | Se va la vaca. Entra la burbuja "te paso mi idea" + acuarela de Pinterest fea |
| 1,71 | **SELLO** vaca sobre la acuarela |
| 2,20 | Se va el hook. Burbuja "algo minimalista" → sello en 2,68 |
| 3,17 | "el nombre de mi ex" → sello en 3,66 |
| 4,15 | Primera tanda de producto (estilo V2): 4 stickers, 2 beats |
| 5,12 | "un tribal como el de mi tío" → sello en 5,61 |
| 6,10 | "uno que no se vea" → 6,59 sello vacío + "ahí está" |
| 7,07 | "turnos por MD" (CTA #1, como el "vení a mi taller" de V2) |
| 8,54 | "…" · 9,02 "bueno." |
| 9,51 | **"haceme la vaca."** (ella de frente) |
| **10,00** | **DROP**: 10 sellos + 8 stickers desde los bordes en 1 beat. En 10,98 se limpia y queda ella en el hueco |
| 11,95 | "vacas disponibles" + tandas on/off cada 2 beats |
| 13,90 | "no hacemos envíos (es un tatuaje)" |
| 15,86 | La marca de agua salta a media izquierda. Tanda de frutillas |
| 17,81 | "¿duele? consultá por privado" |
| 19,76 | Las piezas dejan de irse: 1 por beat |
| 21,71 | "3 cuotas sin interés en la vaca" |
| 23,66 | "promo vaca + chancho" con el chancho-y-vaca gigante 1 compás |
| 25,62 | "seña por alias" |
| 27,57 | Flecha roja: "el bloque (de prueba)" y 3 stickers pegados al bloque |
| 29,52 | "el velero" con sticker sobre el velero |
| 31,47 | "el mar" |
| 33,42 | "el que filma", con flecha al borde inferior |
| 35,37 | Sello de texto "sesión 1 de 47". Pico de saturación (la cara sigue libre) |
| 37,33 | Ella se toca el pelo: "¿en la cabeza? también" |
| 39,28 | Las hojas completas entran torcidas (catálogo) |
| 41,23 | **"compartan que me ayuda un montón"** (2 compases) |
| 45,13 | Los stickers se van de a uno por beat y ella queda sola bailando |
| 47,09 | "turnos por MD" (CTA final) |
| 49,53–53,8 | End card: video al 45 %, ella visible, ícono IG cambiando de color, @brizamaldonado ≥ 80 px. En el último beat, "¿querés tatuarte una vaca?" chiquito (puente al loop) |

Densidad: un cambio visual por compás y una línea legible cada ≤ 2 compases. Nunca hay más de 1 texto a la vez.

## 5. Ranking de retención (formato fiel)
1. **Híbrido A + B-pre-drop:** cubre las dos fugas (1–10 s y 41–49 s).
2. **A'**: el más robusto y fiel al trend, pero pierde gente en 1–10 s y en 41–49 s.
3. **B'**: tiene el pico más alto (pre-drop y comentarios), pero el post-drop sin freezes se cae y su ejecución es frágil.
4. **C'**: sin la interrupción, el hook es un aviso aburrido de verdad, con riesgo alto en 0–5 s.
