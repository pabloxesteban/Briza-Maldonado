# Concepto B — CHAOTIC SHITPOST: "A todo le hago una vaca"

> No hay bailarina ni escena aspiracional. Es un chat de MD entre clientes y la tatuadora: cada referencia que llega se pisa con un sellazo de la vaca. Del trend se queda con el sonido (123 BPM + drop) y con la escalada por acumulación.

**Idea (1 frase):** los clientes le mandan a Briza sus referencias (Pinterest, el nombre del ex, un mandala, la cara del perro) y ella contesta siempre lo mismo: una vaca, cada vez más rápido, hasta que el único que pide la vaca se queda sin vaca.

## Hook (frame 1)
- **Visual:** pantalla de chat genérica (fondo blanco, header gris "cliente nuevo", sin logos). Burbuja gris del cliente: "hola!! te paso mi idea 🙏" + una "imagen adjunta" `acuarela_pinterest.jpg`: manchones pastel generados (blur de círculos de colores) con un lobo aullando hecho con 3 triángulos.
- **Texto superior (fuera del chat):** **"cómo trabajo con referencias:"**, Liberation Sans Bold blanca con contorno negro de 6 px, arriba (y≈300).

## Storyline y punchline
Tutorial falso de "cómo trabajo con referencias". La respuesta de Briza a cualquier pedido es estampar la vaca encima. Después del drop los pedidos llegan uno por compás, luego uno por beat, el chat se fríe y se llena de vacas. **Remate:** el cliente se rinde, "bueno. haceme la vaca." — la música se corta 1 beat — y Briza contesta "uh no, la vaca ya la tiene todo el mundo. ¿un gallo?" + gallo estampado con boom. La tatuadora que solo hace vacas se niega a hacer la vaca.

## Duración y estructura (29,3 s = 15 compases; beat 0,488 s, compás 1,951 s)
| Compás | t (s) | Qué pasa |
|---|---|---|
| 1 | 0,00 | Hook: cliente + acuarela_pinterest.jpg |
| 1 | 0,98 (beat 2) | Burbuja de Briza "dale!" |
| 2 | 1,95 (beat 4) | **SELLO:** `stickers/vaca-vive-y-deja-vivir.png` cae torcida encima de la acuarela, tapándola. Sfx pop grave |
| 3 | 3,90 | Cliente: **"algo minimalista, una línea finita"** |
| 4 | 5,85 | Sello vaca. Briza: **"listo"** |
| **5** | **7,80** | **DROP.** Chat a doble velocidad. Pedido por compás (pedido en beat 0, sello en beat 2): |
| 5 | 7,80 | **"el nombre de mi ex en cursiva"** → vaca |
| 6 | 9,76 | **"un mandala"** (círculos PIL) → vaca |
| 7 | 11,71 | **"la cara de mi perro (es un caniche)"** → vaca |
| 8 | 13,66 | **"algo que represente mi viaje a Bariloche"** → vaca |
| 9 | 15,61 | **"un tribal como el de mi tío"** → vaca |
| 10 | 17,56 | **"uno que no se vea"** → vaca invisible (sello vacío al 10 %) + burbuja "ahí está" |
| 11–12 | 19,51–23,41 | **Ráfaga, una palabra por beat:** "brújula" "infinito" "rosa" "dragón" "reloj" "pluma" "ancla" "mi abuela" → vaca en cada uno, 8 sellos, deep-fry creciente (saturación 1,0→1,8, JPEG q 40→12), shake 6–14 px |
| 12 | 22,44 | Cliente, letras grandes: **"bueno. haceme la vaca."** Freeze + música en silencio 1 beat |
| 13 | 23,41 | Briza: **"uh no, la vaca ya la tiene todo el mundo"** — frame limpio, sin fry |
| 13 | 24,39 (beat 50) | Briza: **"¿un gallo?"** |
| 14 | 25,37 | **SELLO GALLO** gigante + boom + punch-in 1,0→1,25. Vuelve la música |
| 15 | 27,32–29,27 | End card: chat al 30 %, **"consultas por MD (traé tu referencia)"** + @[handle de Briza]. Último frame = chat vacío con "hola!! te paso mi idea" → loopea con el frame 1 |

## Visuales
UI de chat dibujada en PIL, plana, sin marca de ninguna app. Las "referencias" son gráficos malos generados (acuarela de blur, mandala de círculos, nombre "Lucas" en cursiva con DejaVu Serif Italic, caniche de 6 círculos, montaña triangular "Bariloche", tribal de polígonos negros). Los sellos son los stickers con borde blanco, rotados ±20°, siempre más grandes que la referencia. Las vacas no se borran: se apilan en el chat.

## Texto en pantalla (exacto)
cómo trabajo con referencias: · hola!! te paso mi idea 🙏 · dale! · algo minimalista, una línea finita · listo · el nombre de mi ex en cursiva · un mandala · la cara de mi perro (es un caniche) · algo que represente mi viaje a Bariloche · un tribal como el de mi tío · uno que no se vea · ahí está · brújula · infinito · rosa · dragón · reloj · pluma · ancla · mi abuela · bueno. haceme la vaca. · uh no, la vaca ya la tiene todo el mundo · ¿un gallo? · consultas por MD (traé tu referencia)

## Audio
`audio.track(29.27, drop_at=7.805)` + SFX en `audio.mix`: `sfx_pop` en cada sello (pitch sube en la ráfaga), `sfx_boom` en el gallo, corte de música 22,44–23,41. Acá los SFX están permitidos: es otro registro (shitpost), no la publicidad seria. Con sonido trending in-app: dejar los SFX en la pista original a volumen alto y el trend debajo.

## Edición
Feo a propósito: deep-fry progresivo, shake, punch-in solo en el gallo. Todo cae en beat. Legibilidad sagrada: pedidos con x-height ≥ 64 px, máx. 6 palabras.

## Integración tattoo
Situaciones de cliente reales (Pinterest, ex, tribal del tío, "que no se vea") = el chiste interno de tatuadora que cualquiera entiende. Cada sello muestra un flash entero y nítido 1 beat: la vaca, el gallo y, en la ráfaga, corazón Vegan, frutilla y chancho-y-vaca mezclados en sellos "fuera de serie".

## Integración Briza
Es la que contesta en el chat: seca, tierna, terca. Personalidad de tatuadora de flash ("yo dibujo lo mío"), no de servicio a pedido.

## CTA
"consultas por MD (traé tu referencia)" — invita a mandar la referencia sabiendo qué va a pasar. Comentario fijado: "dejá tu referencia acá abajo 👇 te contesto con lo que corresponde".

## Comentarios esperables
- "¿y si te pido un dragón?" → Briza contesta con la foto de la vaca (loop de respuestas infinito, cada una es otra impresión)
- "uno que no se vea → vaca invisible JAJAJA"
- "@lucas el nombre de tu ex"
- "la traición del final no me la esperaba"
- "yo quiero el gallo igual"

## Producción
**Ahora, 100 % producible:** stickers de `stickers/` como sellos, chat + referencias + UI en PIL, emoji con Noto Color Emoji, fry con `engine.crunch` y saturación, shake con `engine.shake`, punch con `engine.punch`, audio con `audio.mix` (pop/boom/cortes). No necesita ninguna persona ni escena.
**Live-action (bonus):** Briza en el estudio, en contrapicado, sosteniendo el celular; cada pedido aparece como overlay y ella levanta sin expresión una hoja de flash con la vaca (y al final el gallo). Abre una serie: "referencias de la semana" con pedidos reales de seguidores, contestados todos con una vaca.
