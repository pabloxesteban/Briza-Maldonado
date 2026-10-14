# Brief: proyecto de Behance de Briza Maldonado

> Brief para la sesión local de Claude, la que tiene Claude in Chrome con la sesión de Behance abierta.
> Objetivo: armar un caso de Behance que compita con los mejores proyectos de ilustración, tatuaje y diseño
> de la plataforma, no solo "subir las imágenes".
> Método: el mismo que usamos para Alumfer (repo `pabloxesteban/Alumfer`). Primero se analizan los referentes,
> después se diverge y se mata lo obvio, se generan las imágenes con un prompt dirigido y nada pasa sin superar un gate.

---

## 0. Contexto y material

- **Repo:** https://github.com/pabloxesteban/Briza-Maldonado, rama `claude/affectionate-bardeen-1im8y1`
- **Artista:** Briza Maldonado, tatuadora. Flash de temática vegana/animalista.
- **Material propio (es la obra y NO se modifica):**
  - `originales/hoja_1.jpg`, `originales/hoja_2.jpg`: las hojas de flash dibujadas a mano
  - `stencils/`: 10 diseños en PNG con fondo transparente
  - `stickers/`: los mismos 10 diseños con borde blanco
  - `videos/`: 10 videos "Ruleta de flash" (1080x1920)
  - Diseños: chancho y vaca, corazón vegan v1 y v2, flor con alambre de púas, flor con hojas, frutilla, gallo,
    mariposa con daga, pájaro con flores, vaca "vive y deja vivir"
- **No se publica:** `tools/`, `reports/`, `research_notes/`.

## 1. Leer el método de Alumfer antes de empezar

Cloná `https://github.com/pabloxesteban/Alumfer` (rama `main`) y leé:

| Qué | Dónde | Para qué |
|---|---|---|
| Engine y loop | `creative/engine/README.md`, `orchestrator.md`, `creative-loop.md`, `quality-gates.md`, `prohibitions.md` | El proceso completo: divergir, destruir, converger, gate |
| Agentes | `creative/agents/` (creative-director, competitor/trend research, concept-generator, creative-challenger, brand-guardian, quality-controller, copywriters/) | Los roles a reproducir con subagentes |
| Skills | `creative/skills/` (competitor-analysis, trend-research, brand-analysis, storytelling, copywriting, quality-control) | Cómo se hace cada análisis |
| Análisis de referentes | `creative/knowledge/aesop-brand-analysis.md`, `apple-brand-analysis.md`, `design-references.md`, `premium-architecture-studios.md` | **El formato a imitar**: qué hace el referente, por qué funciona, el principio y cómo aplicarlo |
| Proyecto modelo | `creative/content/projects/2026-07-carrusel-compartible/` (00-brief → 12-pipeline + package/) | Estructura de carpetas y trazabilidad |
| Generación de imágenes | `services/image-generation/` (prompt-builder.ts, README) | Claude dirige y escribe el prompt, GPT Image genera. Reutilizá este servicio |

## 2. Pipeline (replicar la estructura de Alumfer en `behance/proyecto/`)

Usá **subagentes en paralelo** para la investigación y uno por rol en las etapas de juicio.

1. **`00-brief.md`**: objetivo, público (estudios que buscan tatuadores, clientes, curadores de Behance), qué tiene que lograr el proyecto (que lo destaquen en "Illustration" / "Tattoo", seguidores, consultas).
2. **`01-research-referentes.md`**: investigar con agentes en paralelo y con Chrome (behance.net, pestaña nueva):
   - **Tatuadores:** proyectos de flash y tattoo design destacados ("Featured" / "Best of Behance").
   - **Ilustradores:** casos de ilustración con mejor presentación (line-art, blackwork, ilustración botánica y animal).
   - **Diseñadores:** cómo presentan los mejores un sistema (portada, ritmo de módulos, mockups, tipografía, cierre).
   - Analizar mínimo 15 proyectos (5 por grupo) con el formato de `aesop-brand-analysis.md`: qué hacen, por qué funciona, principio, aplicación a Briza. Guardar link, apreciaciones, likes y vistas de cada uno.
3. **`02-patrones.md`**: síntesis de lo que se repite en los mejores. Medidas del lienzo, cantidad de módulos, paleta, tipo de portada, uso de mockups, GIF/video, texto, cierre. Agregar lo que hace todo el mundo y conviene evitar.
4. **`03-conceptos.md`**: mínimo 20 conceptos de narrativa/dirección de arte para el caso. El **creative-challenger** mata los obvios ("subir las hojas y listo") y quedan 3 finalistas.
5. **`04-ranking.md`**: puntuar a los finalistas con un gate adaptado a Behance (0-100): impacto de la portada en miniatura ×1.5, originalidad ×1.5, calidad de presentación ×1.5, narrativa/ritmo ×1, coherencia de marca ×1, potencial de "Featured" ×1, claridad ×0.5. **Gate: 80.** Si ninguno llega, se itera.
6. **`05-storyboard.md`**: la secuencia de módulos del proyecto, de punta a punta (portada, intro, proceso, hojas, diseños uno por uno, aplicaciones, video/GIF, cierre/créditos/contacto).
7. **`06-direccion-de-arte.md`**: paleta, tipografía, grilla, texturas y tratamiento del fondo, alineados al estilo de Briza.
8. **Producción** en `behance/package/`:
   - **Portada** de 808x632 (pensada para leerse en miniatura).
   - **Módulos** de 1400 px de ancho (JPG/PNG, <10 MB cada uno), numerados en orden.
   - **Mockups generados con IA** usando `services/image-generation` de Alumfer, adaptando `prompt-builder.ts` a tatuaje/ilustración: por ejemplo el diseño tatuado en piel (antebrazo, pantorrilla), stickers sobre una laptop o un cuaderno, prints enmarcados, la hoja de flash sobre la mesa del estudio. **Regla:** el dibujo tiene que ser el de Briza, píxel por píxel. La IA genera la escena y el diseño real se compone encima (con edición o máscara), nunca se redibuja.
   - **GIFs/video**: recortes de la ruleta de `videos/` como módulo animado.
   - **`textos.md`**: título, descripción en ES y EN, textos de cada módulo si los lleva, 10 tags, campos creativos y herramientas.
9. **`07-brand-guardian.md` y `08-quality-control.md`**: chequeo final contra los referentes. ¿Se banca al lado de los 5 mejores del research? Si no, se vuelve al paso 7.
10. **`09-pipeline.md`**: resumen de cómo pensó el sistema, al estilo de `12-pipeline.md` de Alumfer.

**Antes de subir nada, mostrame la portada, el storyboard y 3 módulos, y esperá mi OK.**

## 3. Subida a Behance (Chrome)

- Pestaña nueva en behance.net. Verificá que la sesión abierta sea la cuenta correcta.
- Crear proyecto, cargar los módulos en orden, los GIF/video, la portada, el título, la descripción, los tags, los campos creativos y las herramientas.
- Si se usaron imágenes generadas con IA (mockups), declararlo en las herramientas o en el campo de IA que ofrezca Behance.
- **Dejar como BORRADOR. No publicar.** Avisame para revisar y yo confirmo.
- Si aparece un captcha, un login, un pago o un diálogo dudoso: frenar y avisarme.

## Reglas

- La obra de Briza no se altera ni se redibuja con IA. La IA solo hace las escenas.
- Los referentes son para entender estructura y nivel, nunca para copiarlos (ver "Qué NO copiar" en Alumfer).
- Hacé commit y push del trabajo en la rama indicada al terminar cada etapa.
