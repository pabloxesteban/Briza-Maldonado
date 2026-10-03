# QC ronda 1: `output/final/briza-viral-final.mp4`

**Veredicto: NEEDS FIXES.** No hay ningún bloqueante de reglas del cliente, pero sí 5 fallas de timing y de safe zone que en el celular se notan. Hay además 2 decisiones de guion que conviene corregir antes de publicar.

## Método

- **Frames revisados:** los 30 de `viral-video/build/qc1/`, más hojas finas en estos tramos:
  - 0–2,4 s a 5 fps;
  - 2–10 s a 2,5 fps;
  - 9,4–11,2 s a 10 fps;
  - 21,5–23,9 s a 7,5 fps;
  - 41–47,2 s a 2,5 fps;
  - 46,9–49,9 s a 5 fps;
  - 52,6–53,8 s a 10 fps.
- **Recortes de la cara** a resolución completa en 10,3, 42,2 y 45,4 s.
- **Referencia:** `work/v2/sheet_01` y `sheet_03`.
- **Código:** `viral-video/pipeline/build_final.py`.

## Verificación técnica

| Ítem | Resultado |
|---|---|
| Formato | 1080x1920, 30 fps, H.264 + AAC 44,1 kHz estéreo, 53,800 s exactos. OK |
| Footage intacto | Diferencia media de gris entre out t y src t+5 en 11,5 y 47,0 s: 0,7 y 0,8. Con ±1 frame sube a 3–5, así que el mapeo out = src − 5 es exacto. No hay freeze, cortes ni punch-in. OK |
| Audio original | Correlación de 0,99994 con `work/video1.mp4` desde 5,0 s, lag 0. RMS por 0,5 s idéntico al de la fuente. Peak de −2,2 dBFS por canal, igual que la fuente, sin clipping. OK |
| Drop | Sube de −14,8 a −11,3 dB (ventana RMS de 0,5 s) justo en 10,0 s. La ráfaga visual entra en el mismo frame. OK |
| Final | Fade de 2 frames. Los últimos 50 ms quedan en −35 dB y el último sample ≈ 4e-5: no hay click. OK |
| Reglas del cliente #1 | Recorte de 5 s, drop en 10,0, fin en src 58,8 y end card oscurecido con ícono IG ciclando y @ entre 49,51 y 53,80. **Cumple** |
| Reglas del cliente #2 | No aparecen vaca, chancho ni "vegan" en ningún frame revisado. Se usan 5 diseños (mariposa-daga, frutilla, gallo, pajaro-flores, flor-alambre-puas). Los stickers opacos aparecen solo 6 veces y en forma puntual. Están los calcos violetas translúcidos, el ghost text, los flashes de color y el IG ciclando. **Cumple** |

## Scores

| Eje | /10 | Evidencia |
|---|---|---|
| VIRALIDAD | 6,5 | Hay remates que funcionan sin conocer a Briza: "no hacemos envíos (es un tatuaje)" en 17,8 s, "3 cuotas sin interés en la frutilla" en 23,7 s, "acá un tatuaje" seguido de "acá también" con la flecha al bloque de cemento (27,6–31,5 s) y "¿mi vieja se va a enterar? / sí." en 5,6–6,6 s. Le resta la densidad: entre 13,9 y 41,2 s hay una línea nueva cada compás, sin aire, así que se lee como una lista de chistes y no como la hipnosis deadpan de V2, que tiene unos 4 textos en todo el video. |
| MEME | 7 | La plantilla V2 se reconoce al instante: "¿querés…?" en el frame 0, la @ de publicidad casera, la acumulación en el drop y el end card. Los calcos con su "papel" rectangular translúcido son un buen equivalente de las carpetitas. El chat del pre-drop es una capa propia que funciona y no rompe la estructura. |
| ARGENTINA | 8 | El voseo es consistente: "agendá", "traé", "agendame". Hay léxico de emprendimiento ("seña por alias", "3 cuotas sin interés", "turnos por MD", "promo de a dos") y "¿mi vieja se va a enterar?". No hay una sola línea de agencia. "la tuneamos." es apenas forzado, pero pasa. |
| TATTOO | 5 | En todo el video no aparece ningún tatuaje en piel. Los stickers B/N son chicos: 180 px en la pierna (22,2 s) y unos 300 px el resto. Los diseños aparecen más que nada como calcos violetas lavados. El gag "stencil → así queda" (21,7–23,2 s) cae sobre el pantalón blanco y se lee como un ícono flotando, no como un tatuaje. |
| MARCA | 7 | La @ se ve desde el frame 0, el header del chat dice "@brizamaldonado · tatuajes" y el end card es claro. Todo se siente parte del chiste y no tiene feel de aviso real. Falta saber dónde atiende (ver fix 8), y el handle sigue siendo un placeholder. |
| CONVERSIÓN | 6 | El camino es "agendá tu turnito", "turnos por MD", "seña por alias", la tarjeta TURNITO y la @. El concepto está bien, pero no hay zona ni barrio (V2 tenía "villa …"). Además, el "ya que estoy" de la tarjeta queda tapado por el sello (ver fix 5). |
| RETENCIÓN | 6,5 | El frame 0 está bien armado: hook gigante, calco, @ y la señora de espaldas. El copy "¿querés tatuarte?" es genérico, y la especificidad absurda de "filet crochet" era la mitad del gancho de V2. El chat recupera: hay remate cada ~1,5 s desde 2,2 s. Lo que retiene en 0–10 s es el chat, no el hook. |
| ORIGINALIDAD | 7,5 | La capa es propia: el chat cliente↔tatuadora, los calcos violetas, las flechas a lugares absurdos, la tarjeta TURNITO con sello y el callback "el que filma: jueves 17 hs". De V2 solo se copia la estructura del trend, que es lo que pide el cliente, y "¿querés + verbo?", que es la plantilla. No hay ninguna frase de @juampidelbosque literal. |
| PRODUCCIÓN | 6,5 | La tipografía del carril se lee bien en el celular (stroke blanco de 6 px) y la cara queda libre casi siempre. Fallan cuatro cosas: 3 textos que duran 1 beat (0,49 s), la watermark y 2 stickers debajo de la botonera derecha, el sello que tapa la tarjeta y el saco que se ve rosa en el pico. |
| REGLAS CLIENTE | 9,5 | Cumple todo. |

## Fixes (por prioridad)

1. **"jueves 17 hs." dura 1 beat y es el setup de dos callbacks.**
   - **Tiempo:** 8,05–8,54 s.
   - **Severidad:** ALTA.
   - **Agente:** video-editor.
   - **Problema:** se ve en un solo frame de la hoja a 2,5 fps. Sin este setup, en 35,4 s "el que filma: jueves 17 hs" y en 47,6 s el "17 hs" de la tarjeta no tienen de dónde agarrarse.
   - **Cambio:** en `TEXTS`, `(b(-4), b(-2), "jueves 17 hs.")` y `TYPING = (b(-2), b(-1))`, o sea "escribiendo…" pasa a 1 beat.

2. **"“bueno, agendame”" dura 0,49 s y es el remate del pre-drop.**
   - **Tiempo:** 9,51–10,00 s.
   - **Severidad:** ALTA.
   - **Agente:** video-editor.
   - **Cambio:** extender a `(b(-1), b(1))`, es decir hasta 10,49, para que el texto aterrice encima de la ráfaga del drop. Ya está en la capa superior con stroke, así que se lee sobre los calcos. Correr el ghost "TATUAJES" a `b(1)–b(2)` para que no conviva con el texto.

3. **"1. el stencil" dura 1 beat y el gag de la pierna no se lee.**
   - **Tiempo:** 21,71–23,66 s.
   - **Severidad:** MEDIA-ALTA.
   - **Agentes:** video-editor (timing y tamaño) + visual-director (ubicación).
   - **Problema:**
     - El calco de 190 px va sobre el pantalón blanco entre las rodillas, con un rectángulo de papel visible, y parece un ícono flotando.
     - El sticker resultado mide 180 px.
     - Entre 23,17 y 23,66 "2. así queda" apunta a la nada.
   - **Cambio:**
     - Timing: `(b(24), b(26), "1. el stencil")` y `(b(26), b(28), "2. así queda")`. El sprite cambia en b(26) y queda hasta b(28).
     - Tamaño: 300 px.
     - Ubicación: anclarlo en el empeine o tobillo, que es piel visible sobre el stiletto (`y0 + 0.93h`), o en el antebrazo si visual-director confirma que el box lo permite sin tocar el torso.
     - Sacarle el papel al calco de este gag.

4. **Hay elementos debajo de la botonera derecha de TikTok/IG (x 940–1080, y 950–1700).**
   - **Tiempo:** watermark en 29,51–41,22 s (`WM_POS` (600,1300) → x 600–1020); sticker frutilla en 15,85–16,83 s (cx 920, cy 1440); sticker pajaro-flores en 39,76–41,22 s (cx 900, cy 1450).
   - **Severidad:** MEDIA-ALTA, porque es la @ durante 12 s.
   - **Agente:** video-editor.
   - **Cambio:**
     - Watermark del tramo 3 a (60, 250), arriba a la izquierda, o a (90, 1380) si el track de ella lo permite.
     - Frutilla a cx 700, cy 1400.
     - pajaro-flores a cx 760, cy 1400.
     - Ninguno debe pasar de x 880.

5. **El sello "AGENDADO" tapa el remate de la tarjeta.**
   - **Tiempo:** 48,54–49,51 s.
   - **Severidad:** MEDIA.
   - **Agente:** video-editor.
   - **Problema:** queda encima de "17 hs" y de "ya que estoy", que es el callback más gracioso de la tarjeta, y en el celular no se lee ninguno de los dos.
   - **Cambio:**
     - En `card()`, `paste(c, st, 700, 830, rot=-14)`: abajo a la derecha, montado sobre el borde inferior de la tarjeta y la línea "seña".
     - Escalar el sello a 0,8.

6. **En el pico el saco se ve rosa y la cara queda con halo violeta.**
   - **Tiempo:** 41,2–45,6 s y la ráfaga de 10,0–10,98 s.
   - **Severidad:** MEDIA.
   - **Agente:** video-editor.
   - **Problema:**
     - La máscara del torso en `ghost_layer` usa `fill=150`, que es α ×0,59 y no el tope de 0,30 de editing-notes §4.
     - El óvalo de la cara está bien, pero en 42,2 s el trazo de tinta oscura pasa pegado a la cabeza cuando se agacha.
   - **Cambio:**
     - `fill=150` → `fill=75`.
     - Agrandar el óvalo de la cara 15 % hacia abajo (`y0 + 0.32*h`) para los tramos en que se agacha.
     - En el pico, bajar el alfa máximo a 0,55.

7. **Hay demasiado texto entre 13,9 y 41,2 s.**
   - **Severidad:** MEDIA.
   - **Agente:** script-writer.
   - **Problema:** son 14 líneas seguidas, una por compás, sin un solo compás de aire. V2 funciona por persistencia hipnótica y nosotros por lista de remates: el baile pasa a ser fondo y la acumulación de calcos no se disfruta.
   - **Cambio:** sacar 2 líneas y dejar esos compases solo con calcos acumulándose.
     - "turnos por MD" (15,85 s): redundante con "agendá tu turnito", que puede quedar 4 beats más.
     - "diseños propios (no de Pinterest)" (25,61 s): es relleno; el callback a Pinterest ya pasó.

8. **No hay zona ni barrio.**
   - **Severidad:** MEDIA (conversión).
   - **Agente:** conversion-strategist, con confirmación de Briza.
   - **Problema:** V2 tenía "villa …". Sin el dato, quien quiere el turno no sabe si le queda cerca, y se pierde además el comentario "¿dónde queda?".
   - **Cambio:** agregar a la tarjeta TURNITO un campo "zona: [barrio]" impreso, antes de "seña". También vale una línea de carril "zona: [barrio] (consultar)" en el compás que libera el fix 7.

9. **El hook es genérico.**
   - **Tiempo:** 0–1,71 s.
   - **Severidad:** MEDIA (retención).
   - **Agente:** script-writer.
   - **Problema:** "¿querés tatuarte?" calca la forma de V2 pero pierde la especificidad absurda de "filet crochet".
   - **Cambio:**
     - Renderizar una variante con `--hook`: el código ya soporta `HOOKS`. Propuesta: "¿querés un tatuaje chiquito?", que además prepara "chiquitos, medianos y ‘ya que estoy’".
     - Mantener las reglas de 2 líneas y ≤ 85 % del ancho.
     - Testear A/B contra la actual.

10. **"cuidados: no te toques" tiene doble lectura.**
    - **Tiempo:** 37,32–39,27 s.
    - **Severidad:** BAJA-MEDIA.
    - **Agente:** argentina-cultural-strategist.
    - **Problema:** sale mientras ella baila con las manos a la altura de la cadera. Se puede leer con doble sentido y como burla a la señora, lo que viola el "cringe cariñoso" del meme-framework §2.5.
    - **Cambio:** "cuidados:\nno te rasques". Es el consejo real de cuidado del tatuaje, igual de seco y sin doble lectura.

11. **El ghost text convive con el texto de carril.**
    - **Tiempo:** 13,9–15,85 s ("TURNITO" pisa la "o" final de "turnito"); 41,2–45,1 s ("COMPARTAN" en los dos márgenes, detrás de "compartan que me ayuda un montón").
    - **Severidad:** BAJA.
    - **Agente:** video-editor.
    - **Problema:** contradice editing-notes §2, que dice "Nunca hay texto de carril y ghost text a la vez".
    - **Cambio:** correr los ghosts 2 beats después de que entra la línea, o bajar su alfa a 0,30 dentro del bbox del carril + 30 px.

12. **El thumbnail "foto de Pinterest" no se entiende.**
    - **Tiempo:** 4,63–9,5 s.
    - **Severidad:** BAJA.
    - **Agente:** visual-director.
    - **Problema:** se ve como un manchón rosa con líneas.
    - **Cambio:** que se lea "Pinterest" de inmediato. Sumar la "P" roja en un círculo y un lobo geométrico más contrastado, o una acuarela de colores saturados.

## Pendientes antes de publicar (no son de render)

- Confirmar el handle real, porque `@brizamaldonado` es un placeholder.
- Confirmar que "seña por alias", "3 cuotas" y "promo de a dos" son reales, o tener respuestas en personaje listas.
- Si se aplica el fix 8, confirmar la zona.

## Re-QC

Después de los fixes 1–6, re-renderizar y extraer hojas en 7,5–10,6 s, 21,5–24 s, 29–42 s y 46,9–49,6 s. Los fixes 7–10 dependen del guion y se re-chequean en la ronda 2.
