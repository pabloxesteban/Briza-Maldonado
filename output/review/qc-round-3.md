# QC ronda 3: `output/final/briza-viral-final.mp4` (v4, 53,8 s)

**Veredicto: NEEDS FIXES.** Las instrucciones nuevas del cliente se cumplen casi todas:

- no hay logo de IG ni handle en ningún frame;
- "del stencil / a la piel" ya no está;
- los tatuajes del portfolio dominan sobre los flashes (16 fotos reales contra 5 stickers, y los stickers solo aparecen entre 10 y 21 s);
- la capa de stencils fantasma cubre todo el cuadro y late con la música.

Quedan 4 problemas que se ven en el celular:

1. Hay cards que se apilan en el mismo lugar y tapan a la anterior entre 13,9 y 36,7 s.
2. Algunas fotos se repiten muy pegadas, y entre 48 y 53,8 s hay duplicados en pantalla al mismo tiempo.
3. El sticker `gallo` tapa la cara entre 18,6 y 21,4 s.
4. `beats.json` va unos 90 ms tarde respecto del bombo real, así que el pulso visual cae 2–3 frames después del golpe.

Todo se arregla en `build_v4.py` sin rediseñar nada.

## Método
- **Frames a 2 fps (0–53,5 s):** en hojas de 6x2.
- **Frames a resolución completa:** en 10,2, 15,2, 19,0, 21,0, 24,3, 38,7 y 47,6 s, con la safe zone dibujada (recuadro x>940, y 950–1700, y línea en y=1550).
- **Pulso de la capa fantasma:** muestreo frame a frame entre 29,9 y 31,6 s. Medí la luminancia media del cielo (y 0–400) del final menos la del footage limpio (`work/video1.mp4`, src+5 s).
- **Audio:** envolvente low-pass <150 Hz (bombo) y high-pass >4 kHz (hats) cada 10 ms entre 30–31,5 s y 40–41,5 s. Hice el promedio sincronizado con beats.json y ajusté una grilla sobre los onsets del bombo, con 68 beats entre 10 y 49,5 s.
- **Volcado de `PLAN` y `STICKERS`:** importé `build_v4`, verifiqué posiciones y repeticiones y corrí `hits_face` sobre los stickers.

## Verificación de lo pedido por el cliente

| Ítem | Resultado |
|---|---|
| Sin logo IG ni handle | OK. No aparecen en ningún frame, ni en el end card. |
| Sin "del stencil / a la piel" | OK |
| Portfolio > flashes | OK. Las 16 fotos de `tatuajes/portfolio` se usan desde 13,9 s hasta el final. Los flashes son 5 stickers entre 9,96 y 21,4 s. |
| Fantasmas por todo el cuadro, "techno" | OK. Cubren de borde a borde, con dos grupos alternados por beat y reposicionados en cada compás. Funciona con la música y le da textura. La máscara de cara y la franja despejada del subtítulo (`lane_mask`) funcionan. |
| Pulso del fantasma en el beat | Respeta beats.json exacto: el salto de luminancia pasa de ~9 a ~21–23 en el primer frame ≥ beat (30,033, 30,500 y 30,967) y decae en ~0,25 s. Pero beats.json no coincide con el bombo (ver problema 4). |
| Subtítulos en el beat, latido sutil | OK. Entran en beat con 1,10→1,04 y el latido es de +2,2 % con decay de 0,11 s. Frame a frame no se nota jitter ni temblor, es apenas perceptible. Se mantiene la legibilidad sobre la capa blanca. |
| Español y tildes | OK: ¿Querés, traé, "Palermo, Buenos Aires" (ya no se corta). |
| Safe zones | Casi OK. Las cards de la derecha llegan como mucho a x≈900–915 y ninguna entra al recuadro de botones. Algunos bordes inferiores rozan y≈1550: `polilla-esterno` en 24,3 s (L2, cy 1330) y `conejo`, que es alta (1,56:1) en L2 a 35,8 s. No es grave. |
| Cara | **FALLA:** `gallo` (18,6–21,4 s) y `frutilla` (10,2–11,9 s), ver problema 3. |
| End card | Video oscurecido + "agenda abierta / Palermo · turnos por MD". Cumple la regla #3. |
| Footage y audio | Continuos, sin cortes y sin glitches en las hojas. |

## Problemas

### 1. Cards apiladas una encima de otra (13,9–36,7 s, severidad ALTA: RETENTION, TATTOO)
La señora está en el centro-derecha, así que `body_overlap` espeja todas las cards R1/R2 a L1/L2, que ya están ocupadas. En el volcado de `PLAN`, cada par comparte el mismo cx/cy:
- `cocodrilo` / `conejo` en (215, 1010);
- `elefante-skate` / `pinguino` en (230, 1330);
- lo mismo con `lobo`/`lockets-gatos`, `garza`/`polilla-esterno`, `mariposas-rodillas`/`daga-serpiente`, etc.

Resultado: cada tatuaje se ve ~1 s y lo tapa el siguiente. Nunca hay más de 2 en pantalla y siempre en la columna izquierda. La escalada que pide el trend recién aparece en 36,7 s. Se pierden la mitad de los trabajos y la sensación de que se acumula "producto".

### 2. Repeticiones pegadas y duplicados simultáneos (36,7–53,8 s, severidad MEDIA-ALTA)
- **Repeticiones pegadas:**
  - El bloque 56–64 (36,7–40,6 s) usa `garza`, `pinguino`, `lockets-gatos` y `polilla-esterno`.
  - La pila final (`PILE_NAMES`) arranca con esos mismos 4 en el mismo orden (40,6, 41,0, 41,5 y 42,0 s).
  - `pinguino` sale a 40,56 y vuelve en el beat siguiente. Se lee como un loop.
- **Duplicados simultáneos:** `PILE_NAMES * 2` vuelve a meter `pinguino` (48,2 s), `garza` (48,6 s) y `lockets-gatos` (49,1 s) mientras las copias de 40,6–41,5 s siguen en pantalla. Hay dos fotos idénticas a la vez en el end card.
- **Bloque 48–56 (32,9–36,7 s):** repite `cocodrilo`, `elefante-skate`, `lobo` y `conejo`, 13–19 s después de su primera aparición. Es aceptable, pero con 16 fotos se puede evitar.

### 3. Stickers sobre la cara (severidad MEDIA-ALTA, regla dura)
`STICKERS` no pasa por `hits_face`:
- **`gallo`** (cx 770, cy 1080, h 360): entre 18,6 y 21,4 s queda pegado a la cabeza y tapa parte de la cara. En 21,0 s le cubre el lado derecho de la cara. `hits_face` da True.
- **`frutilla`** (cx 790, cy 1120): entre 10,2 y 11,9 s roza la cabeza. `hits_face` da True.

### 4. beats.json va ~90 ms tarde respecto del bombo (severidad MEDIA: "respetar los beats")
- **Medición:** la mediana del onset del bombo (derivada de la envolvente <150 Hz) cae 92 ms antes de cada timestamp de beats.json (p10–p90: −129 a −44 ms). Ejemplos:
  - el bombo arranca en 30,44 y el beat está en 30,493;
  - el bombo arranca en 30,91 y el beat está en 30,964;
  - el bombo arranca en 40,93 y el beat está en 41,027.
- **Contraprueba:** los hats en off-beat caen en 30,18, 30,66 y 31,14, a media negra exacta de esos bombos. El bombo está bien identificado.
- **Efecto:** el flash de los fantasmas, el pop de las cards y la entrada de los subtítulos llegan 2–3 frames después del golpe. Con imagen atrasada respecto del audio, más de ~45 ms ya se percibe como "arrastrado", y el efecto es justamente un flash seco.
- **Jitter:** beats.json tiene ±40 ms entre beats consecutivos (por ejemplo 12,375→12,895 = 0,52 s y 13,868→14,307 = 0,44 s). Una grilla fija ajustada a los onsets da 0,47646 s (125,93 BPM), con residuo mediano de 10 ms.
- **Nota:** entre 40,0 y 40,9 s hay un mini-break sin bombo. Ahí el pulso "late" sin nada debajo. Es menor y se puede dejar.

### 5. Menores (BAJA)
- **Textos repetidos:**
  - "Hago tatuajes [tradicionales]" (4,2 s) y "tatuajes [tradicionales]" (32,9 s);
  - "[agenda abierta]" aparece 3 veces: 10,0, 41,0–49,6 y el end card.
  
  Es válido como repetición publicitaria, pero el bloque de 32,9–36,7 s podría decir algo más útil dentro de lo respaldado, por ejemplo "[diseños] propios" (respaldado por el reel).
- **End card estático:** 4,3 s oscuros sin nada que se mueva. La pila queda atenuada y los fantasmas casi desaparecen (0,10–0,18). Conviene que "agenda abierta" siga latiendo (ya lo hace con `put_caption`) y subir los fantasmas del end card a ~0,18–0,28 para que no se sienta un corte de energía.
- **Brand discovery:** sin handle ni IG, la marca depende al 100 % de la cuenta que publique. Es decisión del cliente, no un fix.

## Fixes en términos de `build_v4.py`

1. **[ALTA] Grilla de cards sin choques.**
   - Reemplazar el espejado de slot por una asignación que no repita una posición ocupada.
   - Al espejar, chequear si el slot destino está tomado por una card activa en [t0, t1]. Si lo está, usar los slots extra del lado libre: agregar a `SLOTS`, por ejemplo, `"L0": (200, 760)` sobre el horizonte y `"L3": (380, 1180)`, y verificar `hits_face`.
   - Más simple, armar los bloques de 8 beats con 2 slots fijos por lado según dónde esté la señora:
     ```python
     side = "L" if body_overlap(765, 310, t0, t1) > 0.3 else "R"
     ```
     Con esa variable, distribuir las 4 cards en 4 posiciones distintas del lado libre: (215, 900), (215, 1240), (420, 1000) y (420, 1340), con `hits_face` y torso=True.
   - Criterio de aceptación: en 16,9, 24,5, 28,5 y 32,5 s se tienen que ver 4 cards distintas.
2. **[MEDIA-ALTA] Repeticiones.**
   - Reordenar `PILE_NAMES` para que arranque con fotos que no aparecieron en 32,9–40,6 s, por ejemplo `["mariposas-rodillas", "rosa-alambre", "daga-serpiente", "espinas", "mariposa-pierna", "patchwork-sleeve", ...]`, y dejar `garza`/`pinguino`/`lockets-gatos`/`polilla-esterno` para el final.
   - Cortar el loop con `PILE_NAMES[:19-…]` sin `* 2`: son 19 beats (64→83) y 16 nombres. Los 3 beats sobrantes se pueden cubrir así:
     - (a) agrandar las primeras 3 cards de la pila (re-pop con `pop_scale`), o
     - (b) dejar 3 beats sin card nueva y solo con flash.
   - Nunca dos copias en pantalla.
   - Opcional: en el bloque 48–56 usar el orden inverso de 8–16 para alejar las repeticiones.
3. **[MEDIA-ALTA] Stickers fuera de la cara.**
   - Pasar `STICKERS` por la misma lógica que las cards. Si `hits_face(cx, cy, 0.85*h, h, b(e0), b(e1), torso=True)` da True, espejar a x≈220 o subir al cielo.
   - Concreto:
     - `gallo` → (220, 1300, 330, 8) y `flor-alambre-puas` → (420, 1420, 260, 6), o bien `gallo` → (800, 760, 300, 8) sobre el horizonte, si `hits_face` da False;
     - `frutilla` → (210, 1420, 240, 10), debajo de la mariposa.
   - Verificar en 11,0, 19,0 y 21,0 s.
4. **[MEDIA] Beats al bombo real.** Reemplazar `BEATS` por una grilla ajustada a los onsets, o al menos corregir el offset:
   ```python
   BEATS = [round(9.932 + (i - 20) * 0.47646, 3) for i in range(len(json.load(open(BUILD / "beats.json"))))]
   ```
   Así el drop queda en 9,932 s, con el mismo índice 20. Si no, mínimo hacer `BEATS = [x - 0.08 for x in BEATS]`. Después re-medir: el frame de pico del fantasma tiene que coincidir con el frame del onset del bombo, con ±1 frame (por ejemplo 30,433 y 30,900).
   - Ojo: el flash del drop (`FLASHES[0] = DROP`) se corre ~1 frame antes. Está bien: el drop real de la música está en 9,93–9,96.
5. **[BAJA]**
   - Cambiar el texto de (48, 56) por algo no repetido y respaldado (por ejemplo "[diseños] propios" o "flashes y [diseños] propios").
   - Fantasmas del end card en `ghost_alpha`: `0.18 + 0.10*beat_env(...)`.
   - Bajar el cy de L2/R2 a 1300, o limitar con `min(cy, 1550 - h/2 - 20)` según el alto real de la card (`conejo` mide 1,56:1).

## Puntajes (/10)

| Criterio | Nota | Comentario |
|---|---|---|
| VIRALITY | 7 | El trend se reconoce y la capa techno le da identidad. |
| MEME | 7 | El hook serio + el baile funcionan. Falta la sobre-acumulación en la mitad (cards apiladas). |
| ARGENTINA | 7 | Voseo, Palermo, "turnos por MD". |
| TATTOO | 7 | Trabajos reales y variados. Pierde puntos porque la mitad se ve 1 s tapada y por los loops. |
| BRAND | 5 | Sin nombre ni handle, por regla del cliente. La identidad visual (tipo Briza + portfolio) ayuda. |
| CONVERSION | 6 | "Agenda abierta" + "turnos por MD" son claros, pero no hay a quién escribirle fuera del perfil. |
| RETENTION | 6 | Buena primera parte. Entre 14 y 36 s la capa no escala. La pila de 41–49 s funciona. |
| ORIGINALITY | 7 | Los fantasmas pulsantes de flash sobre todo el cuadro son una buena traducción de las carpetitas. |
| PRODUCTION | 6 | Limpio y legible. Bajan la nota los choques de cards, el sticker sobre la cara y el sync ~90 ms tarde. |
| CLIENT RULES | 8 | Sin IG, sin stencil/piel, portfolio > flashes, todo en español. Falla la cara tapada (regla #1 implícita: no tapar a la señora). |

**Para aprobar:** fixes 1–4. El 5 es opcional.
