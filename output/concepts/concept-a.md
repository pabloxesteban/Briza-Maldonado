# Concepto A — SAFE VIRAL: "La vaca del saco"

> Plantilla fiel: bailarina sincera + publicidad casera encima. Es el único concepto que copia la mecánica de V2 al pie de la letra.

**Idea (1 frase):** la vaca "vive y deja vivir" posa en una rambla dibujada en Paint, cae el drop y baila sin parar mientras el comercial más serio del mundo de un estudio de tattoo tradicional vegano la tapa de flashes.

## Hook (frame 1)
- **Visual:** cielo azul liso, mar azul más oscuro, un bloque de hormigón blanco (rectángulo) y un velero dibujado feo. En el centro, la vaca del stencil (sin borde) sobre un cuerpito plano color coral (trapecio = guiño al saco, no calco) con dos patitas de línea negra, de perfil, "mirando el mar".
- **Texto:** **"¿querés tatuarte una vaca?"**, Liberation Sans Bold escalada al 80 % de ancho (condensada fake), negra, gigante, centrada sobre la vaca. Sin fade-in.

## Storyline y punchline
Una señora-vaca producida para la foto. Un aviso de flyer. Cae el drop y la vaca baila. El aviso no se entera: sigue informando turnos, cuotas y zona con total seriedad mientras le apila producto encima hasta saturar. **Remate:** el tercer escalón, "3 cuotas sin interés en la vaca" en plena saturación, con la vaca bailando adentro del hueco, y después el end card donde la vaca sigue bailando chiquita.

## Duración y estructura (35,1 s = 18 compases; beat 0,488 s, compás 1,951 s)
| Compás | t (s) | Qué pasa |
|---|---|---|
| 1 | 0,00–1,95 | Hook. Vaca quieta, de perfil |
| 2 | 1,95–3,90 | Limpio. Marca de agua: ícono IG + @[handle de Briza] arriba a la derecha, ciclando color |
| 3 | 3,90 (beat 8) | Primera tanda: 4 corazones "Vegan" de golpe, tapando la vaca. A los 2 beats (4,88) se van |
| 4 | 5,85 | La vaca gira de frente (espejado seco). Texto blanco al 60 %: **"tradicional vegano"** |
| **5** | **7,80 (beat 16)** | **DROP.** La vaca arranca a bailar en el mismo frame. 6 stickers entran desde los bordes. Punch-in único 1,00→1,15 en 2 frames |
| 5–8 | 7,80–15,61 | Tandas cada 2 beats (0,98 s): frutillas → gallo → mariposa. On/off con frames limpios |
| 7 | 11,71 | **"turnos por MD"** gigante, negro (remate 2: "ah, es una publicidad") |
| 9–12 | 15,61–23,41 | Las piezas ya no se van. Marca de agua salta a media izquierda (15,61) y vuelve (19,51) |
| 10 | 17,56 | **"zona: bs as (consultar)"** blanco al 25 %, casi ilegible |
| 11 | 19,51 | **"no hacemos envíos (es un tatuaje)"** |
| 13–16 | 23,41–31,22 | Saturación: 1 pieza por beat hasta 25. Entran las hojas enteras (`originales/`) recortadas y torcidas |
| 14 | 25,37 | **"3 cuotas sin interés en la vaca"** |
| 16 | 29,27 | **"seña por alias"** |
| 17–18 | 31,22–35,12 | End card: todo al 40 % de brillo, ícono IG grande ciclando, **@[handle de Briza]**; la vaca sigue bailando abajo a la derecha, chiquita |

## Visuales
Dos capas que no se mezclan: escena + bailarina (cámara fija, micro-shake de 2 px) y capa de producto (`stickers/*.png` con borde blanco, rotación ±15°, escalas 0,4–1,1). La bailarina NO tiene borde; el producto sí. La cara de la vaca nunca se tapa más de 1 beat. Vocabulario de baile: rebote 30 px por beat, inclinación ±8°, squash 0,92 en el contratiempo, espejado cada 2 compases. Nunca acelera.

## Texto en pantalla (exacto)
1. ¿querés tatuarte una vaca?
2. tradicional vegano
3. turnos por MD
4. zona: bs as (consultar)
5. no hacemos envíos (es un tatuaje)
6. 3 cuotas sin interés en la vaca
7. seña por alias

## Audio
Pista sintetizada propia (`audio.track(35.12, drop_at=7.805)`): pad bajito + riser de 2 compases → four-on-the-floor. Cero SFX (la seriedad se rompe con un vine boom). Al publicar: sonido trending in-app, alineando su drop con 7,80 s.

## Edición
Cut-in seco sin easing, todo en beat. Leve JPEG crunch (q≈40) en toda la pieza. Sin cortes de montaje: el ritmo lo dan los overlays.

## Integración tattoo
Los 10 flashes son el producto que se acumula (como las carpetitas). La vaca es a la vez protagonista y el flash más deseable: se ve entera y nítida 35 s. El corazón "Vegan" funciona como la carpetita "con texto".

## Integración Briza
Solo voz de aviso (voseo, seco) + marca de agua torpe + end card. Cero "hola soy Briza".

## CTA
In-joke: "turnos por MD" / "seña por alias" dentro del aviso. Comentario fijado: "¿cuál te tatuás? (la vaca no cuenta, ya está reservada)".

## Comentarios esperables
- "3 cuotas sin interés en la vaca JAJAJAJ me mató"
- "@sofi sos vos cuando te dicen que hay feria vegana"
- "¿cuánto la vaca?" → Briza: "precio por privado, reina"
- "la vaca bailando en el end card es la persistencia que necesito"
- "¿dónde queda 'consultar'?"

## Producción
**Ahora, 100 % producible:** `stencils/vaca-vive-y-deja-vivir.png` (bailarina), `stickers/*.png` (producto), recortes de `originales/hoja_1.jpg` y `hoja_2.jpg` (saturación); escena, cuerpito, velero, marca de agua e ícono IG genérico dibujados en PIL; texto con `engine.text`; pista con `audio.track`; render con `engine.render`. Riesgo técnico bajo: es el concepto más directo del motor.
**Live-action (bonus):** Briza reemplaza a la vaca con las 8 condiciones del framework (pose seria en Costanera Sur o terraza, campera de color plano, plano único en mano, drop, baile sincero sin guiño, final "accidental"). La vaca pasa a ser producto y aparece bailando en sincro al lado de Briza en el end card. Suma cara y persona = más brand discovery; el chiste no cambia.
