# Observaciones de fuente (input compartido para todos los agentes)

Generado por el orquestador a partir de inspección frame a frame (1 fps), análisis de audio (RMS cada 0,5 s, autocorrelación de onsets) y lectura de los assets del repo.
Frames disponibles: `work/v1/sheet_0N.jpg`, `work/v2/sheet_0N.jpg` (contact sheets 6x2, 1 frame/seg, leer en orden: sheet_01 = s0–11, sheet_02 = s12–23, etc.). Detalles: `work/v2/detail.jpg`.

## VIDEO_1 — viral original (60,3 s, 9:16, 576x1024, 30 fps)
- UN SOLO PLANO, cámara en mano de otra persona (se ve su sombra ~7 s), casi fija, plano general. Sin cortes, sin texto, sin edición.
- Locación: rambla/escollera junto al mar, cielo azul liso, velero de fondo, bloque de hormigón blanco detrás.
- Personaje: señora (~60 años) de saco rojo oversize, pantalón blanco, stilettos rojos. Look "producida para la foto".
- 0–15 s: camina de espaldas/perfil mirando el mar, gira, se acomoda. Música bajita (≈ -20 dB). Expectativa: "¿va a pasar algo?".
- 15,0 s: DROP de la música (sube a ≈ -14 dB, constante hasta el final). Ella se da vuelta a cámara y empieza a bailar.
- 15–59 s: baile total, sincero, sin ironía: pasos cortos, rodillas flexionadas, manos "amasando" frente al cuerpo, se agacha, gira el torso, se toca el pelo, se agarra del bloque. Movimientos repetitivos, poco coreografiados, 100 % comprometida. No mira la cámara con complicidad.
- 59 s: fin abrupto (la cámara gira / se cae / alguien la agarra → se ve un interior). Silencio último 1,3 s.
- Música: electrónica/house-pop, ≈123 BPM, sin voz inteligible detectada.
- Por qué es viral (hipótesis inicial del orquestador): contraste estética "elegante/aspiracional" vs baile torpe y absolutamente sincero; duración larga que se vuelve hipnótica; cringe cariñoso ("la tía en el cumple"); "main character energy" sin vergüenza.

## VIDEO_2 — adaptación argentina (58 s, mismo formato)
- Cuenta: @juampidelbosque (Argentina). Re-usa el MISMO footage de VIDEO_1, recortando ≈5 s de intro (drop pasa a 10,0 s).
- 0 s: texto grande negro, condensada tipo Helvetica/Arial Narrow, centrado sobre la señora: "¿querés aprender filet crochet?" (voseo).
- ≈4 s en adelante: aparecen fotos recortadas de carpetitas de filet crochet (blancas, caladas) pegadas sobre el video, sin sombra, sin animación sofisticada: aparecen/desaparecen de golpe, en cualquier posición, tapan a la señora.
- ≈7–9 s: "vení a mi taller" (texto blanco semi-transparente gigante).
- Escalada: la cantidad de carpetitas crece hasta casi tapar todo el cuadro (30–50 s). Algunas tienen textos ("Argentina", logos).
- ≈28 s: "villa ..." (ubicación del taller). ≈31–33 s: "escribime para + info".
- Logo de IG + @usuario chiquito, como marca de agua de publicidad casera, todo el video.
- 54–58 s: end card: video oscurecido + ícono de Instagram que cambia de color + @juampidelbosque.
- Mecanismo: el emprendedor de nicho "usa" el video viral como si fuera su comercial oficial, con estética de publicidad de feria/Canva de 2009, completamente seria. El chiste = mismatch total entre el baile y el rubro + la sobre-acumulación de producto. El CTA es parte del chiste (la publicidad mala ES el meme).

## Audio
- Ambos: música continua; intro baja (-20 dB) y drop a -14 dB (v1 en 15,0 s, v2 en 10,0 s). Tempo ≈123 BPM (beat ≈0,488 s).
- No hay voz en off, no hay SFX agregados en V2.

## Assets de Briza disponibles en el repo
- `originales/hoja_1.jpg`, `originales/hoja_2.jpg`: hojas de flash, tradicional en negro sobre papel crema.
- `stencils/*.png` (transparentes) y `stickers/*.png` (con borde blanco): flor-alambre-puas, frutilla, vaca-vive-y-deja-vivir, chancho-y-vaca, gallo, pajaro-flores, corazon-vegan-v1/v2, mariposa-daga, flor-hojas.
- Tema recurrente: TRADICIONAL VEGANO (vaca "vive y deja vivir", corazón "Vegan", animales de granja con corazoncito en la frente).

## Restricciones de producción (decididas por el orquestador)
- NO hay footage de Briza ni de ninguna persona disponible ahora. NO se reutiliza el footage de VIDEO_1 (persona real, contenido ajeno).
- El video producido ahora debe poder hacerse con: los assets del repo + gráficos generados (PIL/ffmpeg) + audio sintetizado/SFX generados. Se puede dibujar todo "a propósito feo" (estética Paint/Canva/cutout).
- La música trend se agrega idealmente in-app al publicar (sonido trending). El render lleva una pista propia sintetizada ≈123 BPM con drop, para que el timing sea compatible.
- Se entrega además un guion de rodaje para una versión live-action con Briza (segunda iteración).
- Herramientas: ffmpeg, ImageMagick, Python (PIL, numpy, scipy). Fuentes: DejaVu, Liberation (Sans/Narrow no; Arial-like = Liberation Sans), FreeSans, Noto Color Emoji.
