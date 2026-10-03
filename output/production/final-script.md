# Guion final (v4.1) — versión Briza del trend

> Reemplaza las versiones anteriores (vaca / chat / copy con chistes), descartadas por las reglas del cliente #2 y #3. Implementación: `viral-video/pipeline/build_v4.py`.

- **DURATION**: 53.80 s
- **ASPECT RATIO**: 9:16, 1080×1920
- **FPS**: 30
- **SOURCE**: VIDEO_1 intacto, out = src − 5,0 s, audio original sin tocar.
- **BEATS**: grilla ajustada al bombo real (125,73 BPM, error mediano 10 ms; `viral-video/build/beats.json`). Drop = beat 0 = 9.94 s. End card = beat 83 = 49.55 s.
- **HOOK**: "¿Querés **tatuarte**?" (variantes A/B/C en `output/variants/`, cambian los primeros 4,5 s).

## Tipografía y voz
Subtítulos estilo reel de Briza: Montserrat ExtraBold 96 px blanca, palabra clave en amarillo #FFD400, sombra suave, centrados en y≈585. Entran en el beat (escala 1,10 → 1 en 2 frames) y laten ±2 % con el bombo después del drop. Texto natural e informativo, sin chistes: el footage es el chiste.

## Capas
- **Techno**: stencils de Briza en blanco semitransparente desparramados por toda la pantalla (posiciones nuevas cada compás), dos grupos que se alternan en cada bombo; corcheas en el pico (beat 64+). Máscara: cara libre, banda del subtítulo atenuada.
- **Tatuajes terminados** (`tatuajes/portfolio`): pop-ups con borde blanco, 1 cada 2 beats, 4 por bloque en posiciones distintas del lado libre; pila final de 16 tatuajes (uno por beat/corchea) sin tapar cara ni torso.
- **Flashes**: sólo 5 stickers (drop y "flashes disponibles").
- Sin handle, sin ícono de IG, sin chat, sin SFX.

## Shots / beats
Plano único original (CAMERA: sin tocar).

### SHOT 01
- **TIME**: 0.00–4.21 s (beats -21…-12)
- **TEXT**: ¿Querés [tatuarte]?
- **VISUAL**: footage + capa; stencils semitransparentes, sutiles
- **AUDIO**: pista original (intro baja)
- **EDIT**: entrada en beat

### SHOT 02
- **TIME**: 4.21–8.03 s (beats -12…-4)
- **TEXT**: Hago tatuajes [tradicionales]
- **VISUAL**: footage + capa; stencils semitransparentes, sutiles
- **AUDIO**: pista original (intro baja)
- **EDIT**: entrada en beat

### SHOT 03
- **TIME**: 8.03–9.94 s (beats -4…0)
- **TEXT**: en [Palermo]
- **VISUAL**: footage + capa; stencils semitransparentes, sutiles
- **AUDIO**: pista original (intro baja)
- **EDIT**: entrada en beat

### SHOT 04
- **TIME**: 9.94–13.76 s (beats 0…8)
- **TEXT**: [agenda abierta]
- **VISUAL**: flashes: mariposa-daga, frutilla; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat; flash blanco 2 frames en el drop

### SHOT 05
- **TIME**: 13.76–17.58 s (beats 8…16)
- **TEXT**: muchos [animalitos]
- **VISUAL**: tatuajes: cocodrilo, conejo, elefante-skate, pinguino; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat

### SHOT 06
- **TIME**: 17.58–21.39 s (beats 16…24)
- **TEXT**: flashes [disponibles]
- **VISUAL**: flashes: pajaro-flores, gallo, flor-alambre-puas; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat

### SHOT 07
- **TIME**: 21.39–25.21 s (beats 24…32)
- **TEXT**: o traé tu [idea]
- **VISUAL**: tatuajes: lobo, lockets-gatos, garza, polilla-esterno; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat

### SHOT 08
- **TIME**: 25.21–29.03 s (beats 32…40)
- **TEXT**: trabajos [recientes]
- **VISUAL**: tatuajes: mariposas-rodillas, daga-serpiente, rosa-alambre, mariposa-pierna; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat

### SHOT 09
- **TIME**: 29.03–32.85 s (beats 40…48)
- **TEXT**: [Palermo], Buenos Aires
- **VISUAL**: tatuajes: patchwork-sleeve, espinas, alambre-daga-corazon, mono-corazon; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat

### SHOT 10
- **TIME**: 32.85–36.66 s (beats 48…56)
- **TEXT**: [diseños] propios
- **VISUAL**: tatuajes: cocodrilo, elefante-skate, lobo, conejo; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat

### SHOT 11
- **TIME**: 36.66–40.48 s (beats 56…64)
- **TEXT**: [turnos] por MD
- **VISUAL**: tatuajes: garza, pinguino, lockets-gatos, polilla-esterno; capa techno en cada bombo
- **AUDIO**: pista original
- **EDIT**: entrada en beat

### SHOT 12
- **TIME**: 40.48–49.55 s (beats 64…83)
- **TEXT**: [agenda abierta]
- **VISUAL**: tatuajes: mariposas-rodillas, rosa-alambre, daga-serpiente, espinas, mariposa-pierna, patchwork-sleeve, alambre-daga-corazon, mono-corazon, cocodrilo, conejo, elefante-skate, lobo, lockets-gatos, garza, polilla-esterno, pinguino; capa techno en corcheas (pico) + pila final
- **AUDIO**: pista original
- **EDIT**: entrada en beat; flash blanco

### SHOT 13 — END CARD
- **TIME**: 49.55–53.80 s
- **TEXT**: "**agenda abierta**" / "Palermo · turnos por MD"
- **VISUAL**: video oscurecido, la pila de tatuajes debajo, stencils suaves; sin ícono ni handle
- **EDIT**: flash blanco en el beat 83
