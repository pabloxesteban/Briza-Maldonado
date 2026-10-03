# QC ronda 2: `output/final/briza-viral-final.mp4` (v3, 53,8 s)

**Veredicto: NEEDS FIXES.** La regla del cliente #3 se cumple: no hay handle, no hay chat, no hay chistes en el texto y no aparece "jueves 17 hs". La tipografía es la de Briza y el footage y el audio están intactos. Los problemas son de otro tipo:

- una foto de tatuaje real y algunos stickers quedan debajo de la UI de TikTok/IG;
- la segunda mitad tiene dos huecos visuales de ~4 s sin nada, así que pierde la escalada del trend;
- hay un solo tatuaje real, repetido;
- hay un dato sin respaldo ("chiquitos, medianos y grandes");
- hay un corte de línea feo en "Buenos / Aires".

Nada de esto es grave, pero son cosas que se notan en el celular. Todo se arregla en `build_v3.py` sin re-pensar la pieza.

## Método

- **Hojas de frames:**
  - 1 fps de 0 a 53 s;
  - 4 fps en 0–3, 9,5–11,5, 25–33 y 49–53,8 s.
- **Frames a resolución completa** en 1, 15,5, 39 y 43 s, con la safe zone dibujada (x>940 entre y 950–1700, y línea en y=1550).
- **Referencia:** las hojas de contacto `work/reel/sheets/s_01..06`.
- **Código:** `viral-video/pipeline/build_v3.py`.

Tiempos de referencia: b(n) = 10 + n·0,4878. b(-12)=4,15, b(0)=10,00, b(8)=13,90, b(16)=17,80, b(24)=21,71, b(32)=25,61, b(40)=29,51, b(48)=33,41, b(56)=37,32, b(64)=41,22, b(72)=45,12, b(81)=49,51.

## Verificación técnica

| Ítem | Resultado |
|---|---|
| Formato | 1080x1920, 30 fps, AAC 44,1 kHz estéreo, 53,800 s. OK |
| Audio original | Correlación de 0,99995 con `work/video1.mp4` desde 5,0 s, lag 0. Intro en −19,8 dB y drop en −13,9 dB a partir de 10,0 s. Peak de −2,2 dBFS. OK |
| Estructura VIDEO_2 | Recorte de 5 s, drop en 10,0 s con flash blanco en el mismo frame y end card oscurecido con ícono IG ciclando entre 49,51 y 53,80 s. El corte cae antes de la caída de cámara (src 58,8). OK |
| Regla #3 | Sin @ ni handle en ningún frame, sin chat, sin "jueves 17 hs" y sin chistes en los subtítulos. Todo en español y con voseo. Están Palermo (8,0–10,0 y 37,3–41,2 s), animalitos (13,9–17,8 s), agenda abierta (10,0–13,9 s, 41,2–45,1 s y end card) y tatuajes reales (25,6–41,2 s). OK |
| Tipografía | Montserrat ExtraBold blanca con la palabra clave en #FFD400 y sombra suave: coincide con el reel de Briza. El reel pone el subtítulo en el tercio inferior y más chico. Acá va a y=560, sobre el cielo, y es más grande. Para esta pieza es la decisión correcta: no tapa a la señora y queda legible. OK |
| Ortografía | ¿Querés, traé, tatuarte: tildes y signos correctos. No hay typos. OK |
| Cara | En ningún frame revisado hay foto, sticker ni texto sobre la cara. Los ghosts tienen la máscara elíptica de la cabeza y funciona (43 s). OK |
| Beat | Todos los cambios de texto caen en múltiplos de 8 beats. Los pop-ups entran en beat con un rebote de 3 frames. OK |
| Glitches | No hay parpadeos, saltos ni frames negros. El fade final es de 2 frames. OK |

## Lo que funciona

- **Hook de 0 a 4 s.** "¿Querés tatuarte?" sobre la señora de espaldas mirando el mar. Es literalmente el "¿querés aprender filet crochet?" de VIDEO_2. El texto serio y el baile hacen el chiste solos, que es justo lo que pidió el cliente.
- **Secuencia "del stencil / a la piel" (25,6–33,4 s).** La foto del calco y después el tatuaje terminado es el mejor momento de "tattoo desire". Es informativo, real y suena a tatuadora.
- **Sticker y ghost blanco.** Los stickers con borde blanco y los ghosts blancos a 30 % son una traducción limpia de las carpetitas.

## Problemas

1. **Safe zone, foto real debajo de los botones (37,3–41,2 s, severidad MEDIA-ALTA).** `free_x` espeja `terminado-cerca.jpg` a cx=880. La card mide ~388 px con el borde y la sombra, así que ocupa x≈686–1074 entre y≈980–1380. Más o menos el 35 % derecho queda bajo like, comentar y compartir. Justo la foto del tatuaje terminado es la que se come la UI.
2. **Safe zone, stickers del lado derecho (13,9–17,8 s y 41,2–45,1 s, severidad MEDIA).** `pajaro-flores` está en cx=890/900 y llega a x≈1000–1010 entre y≈1080–1410. Además pega contra el brazo de la señora a 15–16 s. `gallo` en cx=880 (5,6–8,0 s) y `frutilla` en cx=880 (10,0–11,95 s) también entran en x>940.
3. **La escalada se cae en la segunda mitad (severidad MEDIA, RETENTION).**
   - En VIDEO_2 la acumulación crece hasta tapar casi todo entre 30 y 50 s.
   - Acá los ghosts terminan en b(38)≈28,5 s.
   - De 33,4 a 37,3 s ("chiquitos, medianos y grandes") no hay nada: solo el subtítulo.
   - De 45,1 a 49,5 s ("turnos por MD") tampoco hay nada.
   - El único pico (41,2–45,1 s) dura 4 s y se corta en seco.
   - Son 8 s de "video limpio" justo en la zona donde se pierde gente. El trend pide que la capa crezca, y acá baja.
4. **Un solo tatuaje real, repetido (severidad MEDIA, TATTOO).** `terminado-pierna.jpg` (29,5–31,5 s), `terminado-cerca.jpg` (31,5–33,4 s) y otra vez `terminado-cerca.jpg` (37,3–41,2 s) son el mismo tatuaje, la bailarina. A 37 s se lee como un loop. Del reel se pueden sacar más recortes y ninguno se usa:
   - el boceto en el iPad (s_02/s_03);
   - el stencil recortado como sticker sobre la ventana (s_03);
   - la pierna completa terminada con medias grises (s_04);
   - el detalle de las plumas/helecho (s_05).
5. **Dato sin respaldo (33,4–37,3 s, severidad MEDIA, regla "nada inventado").** "chiquitos, medianos y [grandes]" afirma que hace piezas grandes y no hay ninguna fuente que lo respalde. Los otros textos sí tienen respaldo:
   - "flashes disponibles" → las hojas de flash;
   - "o traé tu idea" → el diseño propio del reel;
   - "del stencil a la piel" → las fotos.
6. **Corte de línea "Palermo, Buenos / Aires" (37,3–41,2 s, severidad BAJA-MEDIA).** El nombre de la ciudad queda partido en dos renglones y se ve desprolijo. Pasa lo mismo, en menor medida, con "chiquitos, medianos y / grandes": la "y" queda colgando al final del renglón.
7. **Amarillo sobre ghosts blancos (10,0–13,9 s y 41,2–45,1 s, severidad BAJA).** "agenda abierta" en amarillo sobre stencils blancos al 32–36 % pierde contraste. Se sigue leyendo gracias a la sombra, pero es justo el mensaje clave y está en su peor fondo.
8. **Palabra destacada en "turnos por [MD]" (45,1–49,5 s, severidad BAJA).** Lo que tiene que saltar es "turnos", no la sigla.
9. **End card sin marca (49,5–53,8 s, consulta al cliente, no es un fix).** Sin handle, el ícono IG queda huérfano: en TikTok no apunta a nada. BRAND DISCOVERY depende al 100 % de que se publique desde la cuenta de Briza. Hay que preguntarle al cliente si permite el nombre (no el @), por ejemplo "tatuajes · Briza · Palermo". Mientras tanto se puede cambiar el ícono por un sticker (gallo) ciclando colores, o mantenerlo para respetar el trend. Decide el orquestador o el cliente.

## Lista de fixes (en términos de `build_v3.py`)

1. **[MEDIA-ALTA] Foto a 37,3–41,2 s.** En `PHOTOS` cambiar la última entrada a `(b(56), b(64), "terminado-cerca.jpg" → otra foto (ver fix 4), 190, 1180, 300, -4)`. Además, en `frame()`, saltear `free_x` cuando el resultado quede del lado derecho:
   ```python
   cx = free_x(...); cx = min(cx, 940 - (w + 68) // 2)
   ```
   Si choca con la señora, preferir el lado izquierdo con w=300. Regla general: ninguna card con borde derecho >940 para y entre 950 y 1700.
2. **[MEDIA] Stickers.**
   - En `STICKERS`, todo cx del lado derecho pasa a ≤800 (gallo 880→800, frutilla 880→800, pajaro-flores 890/900→800, flor-alambre-puas 880→800).
   - Los que están a y 1200–1300 se pueden subir a cy≈1000–1050, sobre el mar, para no tocar el brazo.
   - Verificar a 15,5 s que pajaro-flores no pise el saco.
3. **[MEDIA] Rellenar los huecos con escalada.**
   - (a) 33,4–37,3 s: poner 2–3 pop-ups de fotos nuevas del reel (fix 4) que entren uno por beat cada 2 beats y se acumulen, más una tanda de ghosts `ghost(b(48)+k*BEAT, b(56), ...)` a 0,28.
   - (b) 45,1–49,5 s: no limpiar todo en b(72). Dejar que los ghosts del pico sigan y se sumen hasta b(81) (`t1=b(81)`), con los stickers del pico extendidos hasta b(81). Así el end card es el corte de la acumulación máxima, como en VIDEO_2.
   - Mantener a la vista la máscara de la cabeza y la banda del subtítulo.
4. **[MEDIA] Más tatuajes reales.** Recortar de `work/reel/briza_reel.mp4` y guardar en `tatuajes/`:
   - `boceto-ipad.jpg` (boceto de la bailarina en el iPad);
   - `pierna-completa.jpg` (plano de la pierna terminada entera);
   - `detalle-plumas.jpg`.

   Ordenar la secuencia boceto → stencil → terminado → pierna completa, sin repetir ningún archivo.
5. **[MEDIA] Texto 33,4–37,3 s.** Reemplazar "chiquitos, medianos y [grandes]" por algo con respaldo, por ejemplo "diseños [propios]" o "[flashes] y diseños propios". Si el cliente confirma que hace grandes, se puede dejar.
6. **[BAJA-MEDIA] Cortes de línea.**
   - En `caption()`, tokenizar con `.split(" ")` en vez de `.split()` y usar NBSP en `"[Palermo], Buenos Aires"`. Así sale "Palermo, / Buenos Aires" o entra en un solo renglón. Otra opción: `size=88` para ese texto.
   - Para el otro, usar "chiquitos, medianos y [grandes]" o el texto nuevo del fix 5.
7. **[BAJA] Contraste del subtítulo.** En `ghost_layer()` sumar a la máscara un rectángulo con blur que despeje la banda del subtítulo (y≈470–650, o hasta 700 si son dos renglones). Así "agenda abierta" queda siempre sobre cielo limpio.
8. **[BAJA] Destacado.** Cambiar `"turnos por [MD]"` → `"[turnos] por MD"` en `TEXTS`.
9. **[CONSULTA] End card.** Definir con el cliente si se permite el nombre sin @. Por ahora no tocar.

## Puntajes /10

| Criterio | Nota | Por qué |
|---|---|---|
| VIRALITY | 6 | El footage carga todo. La capa es correcta, pero no tiene un pico memorable en la segunda mitad. |
| MEME | 6 | El hook es fiel al trend (texto serio sobre el baile). Falta la sobre-acumulación que hace reír en VIDEO_2. |
| ARGENTINA | 6 | Hay voseo, Palermo y "por MD". Es correcto, pero sin mucho más. |
| TATTOO | 6 | El stencil → terminado es muy bueno, pero hay un solo tatuaje y se repite. |
| BRAND | 4 | No hay nombre ni handle en ningún lado (por regla del cliente). Todo depende de la cuenta que publique. |
| CONVERSION | 6 | "agenda abierta" y "turnos por MD" son claros. Falta un destino concreto. |
| RETENTION | 5 | Hay huecos muertos en 33,4–37,3 y 45,1–49,5 s. |
| ORIGINALITY | 5 | Es la plantilla del trend bien ejecutada, nada más. |
| PRODUCTION | 8 | Tipografía prolija, buen beat-sync, audio intacto, sin glitches. Restan la safe zone y el corte de línea. |
| CLIENT RULES | 9 | Cumple la #1, la #2 y la #3. Resta un dato sin respaldo ("grandes"). |

**Agente que arregla:** el editor/pipeline (`build_v3.py`) se ocupa de los fixes 1, 2, 3, 6, 7 y 8. El 4 lo hace el pipeline, extrayendo frames del reel. El 5 es de copy, y el 9 se le pregunta al cliente.
