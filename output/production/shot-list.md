# Shot list: el plano único de VIDEO_1 y los momentos que mandan en la capa

**Formato:** un solo plano continuo, intacto. Recorte desde src 5,00, así que **out = src − 5,00**. Fin en out 53,80 (src 58,80); la cámara se cae en src ≈ 58,9.

**Cómo se verificó:**
- `ffmpeg` sobre `work/video1.mp4`: contact sheets a 2 fps (pre-drop) y 1 fps (post-drop), más frames 1080x1920 con grilla de 100 px en 0 · 2,5 · 5,6 · 9,51 · 10 · 16 · 21,71 · 24,5 · 29,52 · 33,42 · 37,33 · 41,23 · 47,09 · 51 · 53,5.
- Comparado contra `viral-video/build/track.json`, con `key = round(src·30) + 1`.

**Notación:**
- **cx** = centro x de la señora.
- **cabeza** = y0 del track.
- Coordenadas en 1080x1920.

## Momentos (orden cronológico)

| src (s) | out (s) | Qué hace ella / la cámara | cx · cabeza | Implicancia para la capa |
|---|---|---|---|---|
| 5,0–7,0 | 0,0–2,0 | De espaldas, mirando el mar, camina despacio hacia la derecha. Plano general; horizonte y ≈ 900, velero en (510, 880) | 625–645 · 790–820 | **Hook**: no hay cara visible, así que el hook (y 330–870) puede pisar la nuca. Lado libre: izquierdo (cielo y bloque) |
| 7,0–8,5 | 2,0–3,5 | Sigue de espaldas. **La sombra del que filma** entra abajo a la izquierda, (0–420, 1350–1920) | 625–660 · 730–820 | Dato para el callback de "el que filma" (37,33). No poner nada que tape la sombra en 2,5 si se quiere que el gag funcione para el que la vio |
| 8,5–10,0 | 3,5–5,0 | Camina hacia el bloque (que se corre a la derecha del cuadro), mira para abajo, de perfil | 600–630 · 765–800 | Primer sticker en 4,15, lado izquierdo (x ≤ 300) |
| **10,0–10,6** | **5,0–5,6** | **GIRO a cámara**: pasa de perfil a 3/4 frontal y flexiona las rodillas junto al bloque | 570–630 · 800–810 | Desde acá **F es cara real**: rige el test de tinta. L2 en 5,12 |
| 10,6–12,5 | 5,6–7,5 | Frontal, se agacha con la mano al bloque (6,5), se acomoda el saco | 510–565 · 808–850 | Ghost CIELO desde 6,10: la cabeza está en ≥ 808, así que el bloque de ghost (y 330–870) **roza** F (F.y0 = 739 en 6,10). En 6,10–9,02 el ghost va a **260 px, centro y 520** (bloque ≈ 285–755) |
| 12,5–14,5 | 7,5–9,5 | Frontal, manos "amasando" el saco, abre un brazo (8,5) | 465–510 · 890–900 | Se corre a la izquierda: lado libre derecho para calcos |
| **14,51** | **9,51** | De frente, quieta, manos en el saco: la "pausa" antes del drop | 500 · 899 | **Beat limpio** (solo marca de agua) |
| **15,00** | **10,00** | **DROP.** Arranca el baile: rodillas flexionadas, pasos cortos | 600 · 890 | Flash + ráfaga de 7–8 hojas. Las hojas no tocan F (cabeza ≈ 890–1000) |
| 16,0–17,0 | 11,0–12,0 | Primer agachón: baja el torso | 580–610 · 960 | F baja a y ≈ 960. Cielo libre amplio |
| 17,0–21,0 | 12,0–16,0 | Baile frontal estable; se corre a la derecha (cx 650 → 723). Horizonte y ≈ 930. Velero (765, 900) | 627–723 · 880–950 | La marca de agua salta en 15,86 a la izquierda: va al lado libre |
| **23,0** | **18,0** | **Agachón profundo** (el bbox mide 610 px de alto) | 677 · **1001** | Momento en que más baja la cara. Buen frame para el "¿duele?" de 17,81: hay mucho cielo |
| 24,0–28,9 | 19,0–23,9 | Baile; la más corrida a la derecha (cx 690–760) | 650–760 · 884–926 | **Lado libre: izquierdo** (x 60–440). Gag calco → piel en 21,71: pantorrilla ≈ (x0 + 0,35w, y0 + 0,80h): (686, 1677) en 21,71 → (642, 1595) en 22,20. El sprite sigue ese punto frame a frame (track suavizado). Queda en la zona de caption, pero es gag, no info |
| **≈ 28,5–30,0** | **≈ 23,5–25,0** | **La cámara empieza a derivar**: tilt leve hacia arriba, el horizonte baja de y ≈ 930 a ≈ 1020 y el bloque se corre a la izquierda (x ≈ 300–975 → 180–1050) | 640–670 · 926–955 | **Desde acá, cualquier cosa "pegada" al paisaje necesita coordenadas por gag** (ver `editing-notes.md` §13). El cielo libre se agranda (horizonte más bajo) |
| 31,0 | 26,0 | Agachón | 637 · 1004 | — |
| 30,6–41,2 | 25,6–36,2 | Baile central (cx 580–630), estable. El velero queda **justo arriba de su cabeza** (≈ 495–555, 1000–1030) | 580–630 · 913–1036 | Acumulación de calcos: centros a los costados (x < 330 o > 830) |
| **34,5** | **29,52** | Frontal, manos al centro. Bloque x ≈ 180–1050, cara frontal y ≈ 1450–1680. Piernas x ≈ 480–700 | 580 · 921 | **Gag del bloque**: stickers en (300, 1560), (400, 1600), (840, 1570). Flecha por x = 300 |
| **38,0–39,4** | **33,0–34,4** | **Inclinada hacia adelante**, mano en la rodilla. La cabeza en su punto más bajo del tramo | 596–599 · **1030–1036** | **Única ventana del velero**: vela-sticker de 150 px anclada abajo en (555, 985). En 35,0 la cabeza sube a 913 y lo pisaría: sale en 34,40 |
| **42,0–43,0** | **37,0–38,0** | **Se toca el pelo** (mano a la cabeza), gira el torso. Se corre a la izquierda (cx 522 → 503) | 503–522 · 926–938 | La mano entra en F: la zona se amplía sola por el bbox. "El que filma": flecha por x = 180 (pasa sobre el bloque, x ≈ 90–735) |
| 42,0–52,0 | 37,0–47,0 | La más corrida a la izquierda (cx 470–515). El bloque queda pegado al borde izquierdo (x ≈ 40–700), en perspectiva | 470–515 · 925–1002 | **Lado libre: derecho** (x 700–940; ojo con la botonera, que empieza en x 940, y 950). Pico de saturación en 41,23–45,13 |
| **46,2** | **41,23** | Inclinada hacia adelante, brazos abajo ("amasa") | 491 · 1002 | Arranca "compartan que me ayuda un montón": el carril (y 330–880) tiene 120 px de aire sobre F |
| 52,1 | 47,09 | Frontal, brazos abiertos a los costados | 475 · 946 | Tarjeta de turno en y 340–860: no la toca |
| **54,5–58,8** | **49,5–53,8** | Baile frontal, cx ≈ 505–540. **Entra un segundo bloque por la derecha** (x > 990 desde ≈ 51) y el horizonte sigue bajando (y ≈ 1065) | 505–540 · 925–962 | **End card**: el handle va en y 860, no en 950 (pisaría la cabeza en 925–962). Ícono en y 620 |
| 58,8 | 53,8 | **Corte final.** La caída de cámara empieza en src ≈ 58,9 y no puede verse ni un frame | — | Verificar que el último frame exportado sea src ≤ 58,80 |

## Resumen para la colocación

- **Cielo libre todo el video:** y 250 → horizonte. El horizonte está en ≈ 900 en 0–23 s out y en ≈ 1020–1065 desde 25 s. La cabeza nunca sube de 730 (pre) ni de 880 (post).
- **Lado libre por tramo:**
  - 0–5 → izquierdo
  - 7,5–9,5 → derecho
  - 16–24 → izquierdo
  - 25–36 → ambos (ella centrada)
  - 37–49 → derecho
- **Agachones** (la cara baja a y ≥ 1000): out **11–12**, **18,0**, **26,0**, **33,0–34,4**, **41,0–41,5**. Son los mejores momentos para cosas altas cerca de su cabeza (velero) o para ghost text en CIELO a tamaño completo.
- **Deriva de cámara:** desde **out ≈ 23,5–25**. En ese salto, el horizonte baja unos 90 px y el bloque se corre unos 120 px a la izquierda. Después sigue con un corrimiento lento hacia la izquierda hasta 47 y, desde 51, entra un segundo bloque por la derecha.
