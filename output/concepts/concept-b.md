# Concepto B' — CHAOTIC SHITPOST como capa: "Bueno, haceme la vaca"

> En vez de un aviso, una historia de clienta. Durante la intro hay un chat de MD encima del cielo: la clienta manda referencias y cada una recibe un sello de vaca. La clienta se rinde ("bueno. haceme la vaca.") en el beat anterior al drop, y el baile de la señora pasa a SIGNIFICAR algo: es la clienta feliz. Después del drop, la tatuadora "planifica" con stickers y flechas rojas, primero sobre el cuerpo y después sobre el paisaje, hasta tatuar el velero. Todo es overlay: el footage y el audio quedan intactos.

**Idea (1 frase):** la tatuadora contesta todas las referencias con una vaca, la clienta se rinde, la señora baila de felicidad y el plan de tattoos se le escapa hasta el mar.

> **Versión original descartada por regla del cliente.** Se cayeron los freezes tipo "telestrator" sobre el cuerpo congelado, el corte de música de 2 beats con "sesión 1 de 47", el deep-fry y el shake del footage y los SFX (pop, scribble, boom). Esos recursos rompían el footage continuo y el audio original.

## Fuente y mapeo
- `work/video1.mp4` + audio original. **out = src − 5,00**, drop en **10,00**, fin en **53,80**, end card V2 en **49,53–53,80**.
- Los gráficos que van "sobre el cuerpo" se ubican con un bounding box por segmentación del rojo (saco y zapatos) en cada frame. Los del bloque y el velero llevan tracking, porque la cámara deriva desde ≈25 s.

## Hook (frame 1)
- En el cielo, una sola burbuja gris de la clienta, "te paso mi idea", más la imagen adjunta grande: una acuarela fea de Pinterest generada (manchones pastel con blur y un lobo de 3 triángulos).
- Encabezado del chat: **@brizamaldonado · tattoo tradicional vegano**, que da la atribución desde el frame 0.
- En **0,24**, el primer **SELLO** de vaca sobre la acuarela: hay movimiento en el primer segundo.

## Estructura
| out (s) | Capa |
|---|---|
| 0,00 | Burbuja + acuarela. Sello en 0,24 |
| 1,22 | "algo minimalista, una línea finita" → sello en 1,71 |
| 2,20 | "el nombre de mi ex" → sello en 2,68 |
| 3,17 | "un mandala" → sello en 3,66 |
| 4,15 | "un tribal como el de mi tío" → sello en 4,63 |
| 5,12 | "uno que no se vea" → en 5,61 sello casi transparente + Briza: **"ahí está"** |
| 6,59 | Briza: "tengo vacas" |
| 7,56 | Clienta: "…" (2 beats) |
| 8,54 | "bueno." |
| 9,51 | **"haceme la vaca."** (ella está de frente) |
| **10,00** | **DROP = el "sí".** 10 sellos y 8 stickers en 1 beat. En 10,98 se limpia y ella queda en el hueco |
| 11,95 | Briza: **"¿y un chanchito al lado?"** El chancho-y-vaca aparece junto a ella, fuera del box |
| 13,90 | "frutilla, tobillo": sticker cerca de los zapatos (tracking por rojo), flecha roja "acá" |
| 15,86 | "mariposa, mano" con flecha, 1 beat |
| 17,81 | "¿el gallo en la espalda?" → "no se ve, confiá" |
| 19,76 | "corazón Vegan, donde quieras" |
| 21,71 | Sale del cuerpo: **"el saco también"** (contorno de marcador alrededor del box, sin tapar) |
| 23,66 | **"el bloque (de prueba)"**: 3 stickers pegados al bloque, con tracking |
| 25,62 | **"el velero"**: sticker sobre el velero, con tracking |
| 27,57 | **"el mar"**: 6 stickers flotando en el mar |
| 29,52 | **"el que filma"**: flecha hacia el borde de abajo |
| 31,47–37,33 | Acumulación de flechas y stickers, 1 por beat. Ella sigue libre |
| 37,33 | Clienta: **"¿y duele?"** |
| 39,28 | Briza: **"consultá por privado"** |
| 41,23–47,09 | Los stickers se van de a uno. **"consultas por MD (traé tu idea chiquita)"** |
| 49,53–53,80 | End card V2: video al 45 %, ícono IG que cambia de color, @brizamaldonado grande |

## Texto en pantalla (exacto)
@brizamaldonado · tattoo tradicional vegano · te paso mi idea · algo minimalista, una línea finita · el nombre de mi ex · un mandala · un tribal como el de mi tío · uno que no se vea · ahí está · tengo vacas · … · bueno. · haceme la vaca. · ¿y un chanchito al lado? · acá · frutilla, tobillo · mariposa, mano · ¿el gallo en la espalda? · no se ve, confiá · corazón Vegan, donde quieras · el saco también · el bloque (de prueba) · el velero · el mar · el que filma · ¿y duele? · consultá por privado · consultas por MD (traé tu idea chiquita)

## Audio
Pista original sin tocar.

## Producción
- **Chat:** burbujas planas, máximo 6 palabras cada una. Se apilan como un chat que scrollea, así cada una queda visible ≥ 2 beats.
- **Referencias:** generadas en PIL.
- **Segmentación del rojo** con numpy para el box.
- **Tracking simple** del bloque y del velero (template matching).
- **Riesgo medio:** sin freezes, las flechas sobre un cuerpo que se mueve pueden quedar sucias. Por eso la parte "sobre el cuerpo" dura poco y la escalada se va al paisaje.

## Fortalezas / debilidades
- **Fortalezas:**
  - El mejor pre-drop de los tres: el drop SIGNIFICA algo.
  - Es el mejor anzuelo para comentarios ("dejá tu referencia y te contesto con una vaca").
  - Identifica al comprador.
- **Debilidades:**
  - Post-drop frágil y con poco producto acumulado.
  - Briza "ignora tu idea": riesgo de alejar a quien quiere un diseño propio.
