# Automatización legítima con código para una creadora chica en TikTok (2025-2026)

Contexto: una tatuadora con cuenta chica, en Argentina, que diseña flashes en PNG. Investigación hecha en octubre de 2026. Muchas fuentes son blogs de proveedores. Las marco cuando no son primarias.

## 1. APIs de TikTok for Developers: ¿a qué puede acceder realmente una creadora chica?

### Takeaway
Una creadora sola **no puede usar de forma práctica la Content Posting API para publicar en público en su propia cuenta**. Las apps sin auditar solo publican en modo privado (SELF_ONLY), y TikTok rechaza en la auditoría las herramientas "para subir contenido a las cuentas que vos o tu equipo manejan". Lo que sí sirve de verdad: la Display API (leer sus propios videos y métricas básicas, con Login Kit) y herramientas de terceros auditadas (Buffer, Later, Metricool, etc.) que ya pasaron la auditoría. La Research API está fuera de alcance: es solo para académicos u ONG, no para uso comercial ni para creadores.

### Cited Findings
**Content Posting API: Direct Post y Upload**
- Direct Post publica directo al perfil. Videos: `/v2/post/publish/video/init/`. Fotos: `/v2/post/publish/content/init/`. El flujo "Upload/inbox" (`/v2/post/publish/inbox/video/init/`) manda el contenido al inbox o borradores de la creadora para que termine de editarlo y publicarlo desde la app. Requisitos: scope `video.publish` aprobado por TikTok, autorización de la usuaria, access token + open_id, y la configuración Direct Post habilitada en la app — [TikTok Developers: Content Posting API Get Started](https://developers.tiktok.com/doc/content-posting-api-get-started)
- Métodos de subida: `FILE_UPLOAD` (PUT por chunks a un `upload_url`) o `PULL_FROM_URL`, que exige un dominio o prefijo de URL verificado. Las fotos solo se pueden mandar por URL de dominio verificado — [TikTok Developers: Get Started](https://developers.tiktok.com/doc/content-posting-api-get-started)
- **Clientes sin auditar:** hasta 5 usuarios pueden publicar en una ventana de 24 h. Todas las cuentas deben estar en privado al momento de publicar y los posts quedan en `SELF_ONLY`. Para hacerlos públicos, la dueña tiene que pasar la cuenta a pública y después cambiar a mano la privacidad de cada post a "Everyone". La auditoría levanta la restricción de visibilidad — [TikTok Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)
- Si una app sin auditar intenta publicar en una cuenta pública, TikTok la bloquea en `/publish/video/init/` con el error `unaudited_client_can_only_post_to_private_accounts`. Otros errores: `spam_risk_too_many_posts` (límite diario de posts) y `reached_active_user_cap` (límite de usuarias activas) — [TikTok Developers: Direct Post reference](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post) (vía resumen de búsqueda)
- **Límite de posts:** existe un tope de posts por cuenta de creadora en 24 h vía Direct Post, compartido entre todos los clientes de API. Suele rondar los **15 posts por día**, pero varía según la creadora. Además, cada cliente de API tiene un tope de creadoras activas por día, basado en la estimación de uso declarada en el formulario de auditoría — [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)
- **Uso no aceptado (clave):** las guías listan explícitamente como "Not acceptable: A utility tool to help upload contents to the account(s) you or your team manages" (una herramienta para subir contenido a las cuentas que vos o tu equipo manejan). También prohíben apps que copien contenido arbitrario de otras plataformas a TikTok y que agreguen marcas de agua, logos, links o texto promocional — [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)
- **Requisitos de UX obligatorios para apps auditadas:** consultar creator_info en cada post, mostrar el nickname, que la usuaria elija la privacidad en un desplegable **sin valor por defecto**, casillas de Comment/Duet/Stitch desmarcadas por defecto, toggle de divulgación de contenido comercial ("Your brand" / "Branded content"; el branded content no puede ser privado), declaración de consentimiento a la Music Usage Confirmation, vista previa del contenido y consentimiento explícito antes de subir — [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)
- La duración de la auditoría (2 a 6 semanas) sale de guías de terceros. TikTok no la confirma — [Blotato TikTok API](https://www.blotato.com/api/tiktok) (secundaria, no verificada)

**Especificaciones de medios (Media Transfer Guide)**
- Video: MP4 (preferido), WebM o MOV. Códec H.264 (preferido), H.265, VP8 o VP9. Entre 23 y 60 FPS. Cada dimensión entre 360 y 4096 px. Hasta 4 GB. Por API se pueden mandar videos de hasta 10 min, pero el límite de publicación de cada creadora va de 3 a 10 min. Chunks de 5 a 64 MB (el último puede llegar a 128 MB), de 1 a 1000 chunks, subidos en orden. Fotos: WebP o JPEG, máximo "1080p", hasta 20 MB — [TikTok Media Transfer Guide](https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide)

**Display API + Login Kit**
- Tres endpoints: `/v2/user/info/` (open_id, avatar, display_name, bio, deep link), `/v2/video/list/` (videos recientes) y `/v2/video/query/` (por ID). Scopes: `user.info.basic` y `video.list` — [TikTok Display API overview](https://developers.tiktok.com/doc/display-api-overview)
- Lista oficial de scopes (incluye `user.info.stats`, `video.list`, `video.publish`, `video.upload`) — [TikTok API scopes](https://developers.tiktok.com/docs/en/tiktok-api-scopes) (no la abrí en detalle esta sesión)

**Research API**
- Elegibilidad informada: instituciones académicas sin fines de lucro de EE. UU., EEE, Reino Unido y Suiza, más ONG registradas en la UE. Usuarios comerciales, creadores y anunciantes quedan explícitamente excluidos. Se cita un límite de 1000 requests por día — [xpoz.ai](https://www.xpoz.ai/blog/guides/tiktok-research-api-limits-access-and-alternatives/) (vendedor secundario)
- Se amplió a instituciones académicas sin fines de lucro de Europa el 10/08/2023 — [TikTok changelog](https://developers.tiktok.com/docs/en/changelog)
- Un instituto de investigación sin fines de lucro (KInIT, Eslovaquia) tardó 21 meses (dic 2023 a sep 2025) en lograr acceso — [kinit.sk](https://kinit.sk/when-research-apis-close-the-door-when-you-finally-get-it-it-is-not-what-you-have-asked-for/)

**API for Business (Organic API / Accounts API)**
- La Organic API de TikTok API for Business agrupa las APIs Accounts, Mentions, TikTok One (TTO), Discovery y Spark Ads Recommendation. Está pensada para que las marcas manejen su presencia orgánica: publicación, interacción con la comunidad (comentarios) e insights de la cuenta — [TikTok: About API for Business](https://ads.tiktok.com/resources/help/article/marketing-api)
- Un conector de terceros pide estos scopes al conectar una cuenta Business o Creator: info de usuaria, insights de usuaria, lista de videos, insights de videos, gestión de comentarios y publicación de videos (Business API v1.3) — [Adriel docs](https://docs.adriel.com/data-sources/o-z/tiktok-organic/how-to-connect)

**Commercial Content API**
- No encontré documentación primaria en esta sesión. Ver Gaps.

### Inferences
- Para una sola cuenta, la vía API "propia" es en la práctica un callejón sin salida: sin auditoría solo se publica en privado, y la auditoría rechaza herramientas para cuentas propias. Lo razonable es usar un programador oficial ya auditado y reservar el código para **generar** los videos y **analizar** los datos.
- El flujo Upload/inbox (borradores) vía un tercero auditado es útil: el video llega a borradores y ella agrega desde el celular el sonido en tendencia (que no se puede agregar por API) antes de publicar.
- Display API + Login Kit sirve para un panel personal de métricas (vistas, likes por video), aunque los campos exactos de métricas no quedaron confirmados.

### Gaps
- No logré confirmar los rate limits exactos de cada endpoint (por ejemplo, requests por minuto) ni los campos de métricas de video.list (view_count, like_count, etc.).
- No verifiqué los requisitos ni la disponibilidad de la Commercial Content API (es una API de transparencia de anuncios, sin uso para crecer).
- Tampoco confirmé si el acceso a la Accounts API for Business requiere aprobación como desarrollador ni si está disponible en Argentina.

## 2. Programadores oficiales: nativo de TikTok y herramientas de terceros

### Takeaway
El programador nativo de TikTok Studio (web/escritorio) es gratis y permite programar hasta unos 10 días antes en cuentas Creator o Business. Entre los terceros, Publer, Buffer y Metricool son las opciones baratas o con plan gratis. Hootsuite es caro (unos USD 99 por usuaria al mes) y no se justifica para una creadora sola.

### Cited Findings
- TikTok Studio en navegador de escritorio permite programar posts hasta 10 días antes, solo en cuentas Creator o Business. Las fuentes dicen que la app móvil no tiene botón de programación. Programación mínima unos 15 minutos antes. Una vez en cola, quizá no se pueda editar el caption, la portada ni el horario (hay que borrar y volver a subir) — [Hopper HQ](https://www.hopperhq.com/blog/how-to-schedule-tiktok-posts-desktop-mobile/); [AdaptlyPost](https://adaptlypost.com/blog/how-to-schedule-tiktok-posts); [dev.to](https://dev.to/johnbuilds/can-you-schedule-a-post-on-tiktok-2026-3b2c) (blogs secundarios; hay contradicciones en la duración máxima: 10 vs 15 min)
- Precios (secundarios, verificar en el sitio de cada proveedor):
  - **Buffer:** unos USD 5-6 por canal al mes. El plan gratis cubre 3 canales y 10 posts programados por canal. Soporta TikTok — [wbcomdesigns](https://wbcomdesigns.com/best-buffer-alternatives/); [fs-poster](https://www.fs-poster.com/blog/buffer-vs-hootsuite-vs-later)
  - **Later:** Starter entre USD 16,67 y 18,75 al mes con pago anual (unos 25 mensual). Growth entre 30 y 50 al mes, según la fuente (las fuentes se contradicen) — [fs-poster](https://www.fs-poster.com/blog/buffer-vs-hootsuite-vs-later); [dupple](https://dupple.com/learn/best-social-media-management-tools)
  - **Metricool:** plan gratis con hasta 11 redes. Premium desde USD 20 al mes — [Metricool vs Buffer](https://metricool.com/metricool-vs-buffer/) (página del propio proveedor)
  - **Publer:** gratis, o desde USD 5 al mes más 4 por cuenta extra — [usecarly](https://www.usecarly.com/blog/buffer-alternatives/); [ryandoser](https://ryandoser.com/metricool-alternatives/)
  - **Hootsuite:** Standard unos USD 99 por usuaria al mes (pago anual), sin plan gratis — [lilachbullock](https://www.lilachbullock.com/best-hootsuite-alternatives-social-media-scheduling/)
- Postiz (open source, se puede autoalojar) tiene integración con TikTok — [Mintlify docs Postiz TikTok](https://www.mintlify.com/gitroomhq/postiz-app/platforms/tiktok) (encontrado en búsqueda, no lo abrí)

### Inferences
- Recomendación de costo cero: TikTok Studio web (hasta 10 días) o el plan gratis de Metricool/Buffer. Si además quiere analytics cruzados con Instagram, Metricool es el más completo dentro de lo gratis.
- Conviene que el sonido en tendencia lo agregue ella en la app. Por eso, mandar a borradores o programar en Studio con audio propio son las dos estrategias posibles.

### Gaps
- No verifiqué en las páginas oficiales de precios si los proveedores cobran en ARS, si aplican impuestos argentinos a servicios digitales ni qué funciones de TikTok (borradores vs Direct Post) trae cada plan.

## 3. Generar videos con código a partir de diseños PNG

### Takeaway
Con ffmpeg (gratis) se puede convertir cada PNG de flash en un video vertical 1080x1920 con zoom tipo Ken Burns, slideshow con música o revelado, y quema de subtítulos generados con Whisper. Remotion (React) y MoviePy (Python) sirven para plantillas más elaboradas. Exportar en MP4 H.264, 30 fps, AAC.

### Cited Findings
- Especificaciones aceptadas por TikTok (API): MP4/H.264 preferido, 23-60 FPS, 360-4096 px por lado, hasta 4 GB — [Media Transfer Guide](https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide)
- Filtros de ffmpeg relevantes: `zoompan` (Ken Burns), `scale`/`pad`/`crop` (para encuadrar en 9:16), `xfade` (transiciones), `subtitles` (quemar un .srt), `overlay`, `fade` — [FFmpeg Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html)
- Recetas (sintaxis estándar de ffmpeg según la documentación de filtros; probar localmente):
  - **Ken Burns con 1 PNG, 6 s, 1080x1920:**
    `ffmpeg -loop 1 -i flash.png -vf "scale=2160:-2,zoompan=z='min(zoom+0.0015,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1080x1920:fps=30,format=yuv420p" -t 6 -c:v libx264 -crf 18 -preset slow out.mp4`
    (escalar antes de `zoompan` reduce el temblor)
  - **Encuadrar un PNG cuadrado en 9:16 con fondo:** `-vf "scale=1080:-2,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=white"`
  - **Slideshow con música:** `ffmpeg -framerate 1/3 -pattern_type glob -i 'flashes/*.png' -i musica.mp3 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p" -c:v libx264 -c:a aac -b:a 192k -shortest slideshow.mp4`
  - **Revelado tipo "dibujo de línea":** opciones aproximadas: (a) wipe con `xfade=transition=wiperight` entre un frame en blanco y el diseño; (b) exportar desde el software de dibujo (Procreate tiene "Time-lapse Replay/Export") y acelerarlo con `setpts=0.25*PTS`. Un revelado de trazo vectorial real requiere SVG + animación (Remotion o CSS `stroke-dashoffset`).
  - **Quemar subtítulos:** `-vf "subtitles=subs.srt:force_style='FontName=Arial,FontSize=14,Alignment=2,MarginV=120'"`
- **Whisper (OpenAI, open source)** transcribe audio y genera .srt/.vtt (`whisper audio.mp3 --language Spanish --output_format srt`) — [GitHub openai/whisper](https://github.com/openai/whisper)
- **Remotion:** videos en React renderizados por código. Gratis para personas y empresas chicas (hasta 3 empleados). Las empresas más grandes necesitan licencia — [Remotion license](https://www.remotion.dev/docs/license) (condición de licencia según la documentación de Remotion; no la revisé en esta sesión)
- **MoviePy:** librería de Python para edición de video (ImageClip, concatenación, texto) — [GitHub Zulko/moviepy](https://github.com/Zulko/moviepy)
- TikTok prohíbe que las apps de publicación agreguen marcas de agua, logos o texto promocional al contenido compartido (es una regla para las apps, no para la creadora que edita su propio video) — [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)

### Inferences
- Pipeline sugerido: carpeta de PNG → script (Python + ffmpeg) que genera 3 variantes por diseño (zoom, slideshow, antes/después) en 1080x1920, 30 fps, H.264 CRF 18 y AAC → Whisper si hay voz en off → subir a borradores o programar → agregar el sonido en tendencia desde la app.
- Dejar libres los márgenes superior e inferior (unos 150-250 px) para que la interfaz de TikTok no tape el texto (práctica común; ver Gaps).

### Gaps
- No encontré una página oficial de TikTok de 2025-2026 con las "zonas seguras" exactas ni el bitrate recomendado para subidas orgánicas.
- No verifiqué la disponibilidad actual de las plantillas de CapCut ni sus términos (CapCut tuvo cambios de términos y restricciones en algunos países).

## 4. Analytics: qué exporta TikTok y cómo analizarlo con scripts

### Takeaway
TikTok Studio en escritorio permite exportar a CSV/XLSX los últimos 7, 28 o 60 días, una categoría por vez (Overview, Content, Followers). Como la ventana es móvil, hay que exportar con regularidad y acumular los datos con un script (pandas) para no perder el historial.

### Cited Findings
- Ruta: studio.tiktok.com → Analytics → elegir rango (hasta 60 días) → Export (arriba a la derecha) → CSV. Se exporta una categoría por vez (Overview, Content, Followers). Los datos fuera de la ventana móvil no vuelven a estar disponibles. Las marcas de tiempo vienen en UTC — [Emplicit](https://emplicit.co/blog/how-to-build-a-tiktok-analytics-dashboard/) (secundaria)
- La web permite descargar los últimos 60 días en CSV o XLSX. El export de TikTok Ads Manager es otro distinto — [Coupler.io (ES)](https://blog.coupler.io/es/como-exportar-datos-de-tiktok/)
- La opción programática oficial son los insights vía Display API (videos) o la Accounts API for Business (insights de cuenta y de videos) — [Display API](https://developers.tiktok.com/doc/display-api-overview); [About API for Business](https://ads.tiktok.com/resources/help/article/marketing-api)

### Inferences
- Script sugerido: export semanal manual → carpeta `exports/` → pandas une todo y deduplica por fecha o video → calcula vistas medias por formato (zoom, slideshow, proceso), por hora de publicación (convertida de UTC a America/Argentina/Buenos_Aires) y por tipo de hook → gráfico. No hace falta ninguna API.

### Gaps
- No confirmé las columnas exactas del CSV de Content (por ejemplo, si incluye tiempo medio de visualización o tasa de finalización por video). Hay que revisarlo con un export real.

## 5. Automatización de DMs y comentarios, anuncios de mensajería, Lead Gen, Spark Ads y Promote (Argentina/LatAm)

### Takeaway
En 2026 **no existe comentario→DM automático en TikTok** con ninguna herramienta. La Business Messaging API solo permite responder dentro de una ventana de 48 h que abre la persona al escribir primero. ManyChat ya soporta TikTok (beta, solo cuentas Business), pero solo para DMs entrantes. Las respuestas automáticas nativas (bienvenida, palabra clave) son gratis, pero exigen Advanced Access y cuenta Business verificada. Promote arranca en unos USD 3 por día. Ads Manager pide USD 50 por día por campaña y 20 por grupo de anuncios. Los Instant Messaging Ads a WhatsApp pueden requerir allowlisting.

### Cited Findings
**ManyChat y herramientas de DM**
- ManyChat soporta TikTok como canal nativo en beta abierta, solo con cuentas Business (no personales). Funciones: DMs automatizados, captura de email y teléfono, secuencias. Algunos pasos avanzados de Instagram todavía no están para TikTok — [SetSmart](https://setsmart.io/blog/manychat-tiktok) (secundaria)
- Fechas reportadas: lanzamiento para cuentas Business de EE. UU. en noviembre de 2025 y anuncio amplio en enero de 2026. Las cuentas de la UE y el Reino Unido todavía no pueden conectarse (hay lista de espera) — [InstantDM](https://instantdm.com/blog/tiktok-comment-to-dm) (secundaria; contradicción: SetSmart dice que el comentario por palabra clave dispara un DM y CreatorFlow/InstantDM dicen que no)
- CreatorFlow (sep 2026, cita business-api.tiktok.com y documentación de partners): **ninguna herramienta nativa ni de terceros envía un DM automático cuando alguien comenta**. La Business Messaging API es "solo respuesta": ventana de 48 h desde el último mensaje de la persona, hasta 10 mensajes por ventana, el negocio no puede iniciar la conversación y no hay envíos masivos. Los comentarios, likes, follows y shares no abren la ventana. Para las cuentas del EEE, Suiza y el Reino Unido, la API de DMs no está disponible — [CreatorFlow](https://creatorflow.so/blog/tiktok-comment-to-dm/)
- Precios de ManyChat según CreatorFlow (citando manychat.com, julio 2026): Free (25 contactos activos), Essential USD 17 al mes, Pro 39, Business 99 (14, 29 y 69 con pago anual) — [CreatorFlow](https://creatorflow.so/blog/tiktok-comment-to-dm/); SetSmart da 14, 29 y 69 (coincide con el pago anual) — [SetSmart](https://setsmart.io/blog/manychat-tiktok)
- Vista Social: la automatización de DMs de TikTok es solo para cuentas Business y usa la Business Messaging API oficial. No está disponible en el EEE, Suiza ni el Reino Unido — [Vista Social](https://vistasocial.com/insights/tiktok-dm-automation/)
- Las normas comunitarias prohíben el engagement falso y la automatización no autorizada (por ejemplo, bots que inician sesión con la cuenta) — citado por [CreatorFlow](https://creatorflow.so/blog/tiktok-comment-to-dm/)

**Respuestas automáticas nativas (cuenta Business)**
- Cuatro tipos gratis: mensaje de bienvenida, respuesta por palabra clave, pregunta sugerida y chat prompts. Funcionan solo dentro del chat. Requisitos: Advanced Access y Verified Business Account. Palabra clave de hasta 40 caracteres y respuesta de hasta 500, con coincidencia exacta. Revisión de 1 a 5 días hábiles. Máximo 4 mensajes automáticos activos — [CreatorFlow](https://creatorflow.so/blog/tiktok-comment-to-dm/) (cita ads.tiktok.com; no verificado en primaria)
- Origen de la función: en 2021 TikTok agregó en Business Suite → "Message settings" la bienvenida y las respuestas por palabra clave. Los mensajes automáticos pasan por moderación — [Social Media Today](https://www.socialmediatoday.com/news/tiktok-adds-new-auto-reply-message-option-for-business-accounts/596912/); [BlogHer](https://www.blogher.com/social-media/tiktok-auto-reply-messages-18806)

**Instant Messaging Ads y Lead Gen**
- Los Instant Messaging Ads usan el objetivo Lead Generation y llevan a WhatsApp, Messenger, LINE, Zalo o una URL personalizada. Optimización por clics (WhatsApp, Messenger o URL) o por conversaciones (solo Messenger o WhatsApp). La optimización por conversación requiere integrarse con un partner MMT (Message Management Tool). Los cargos de la WhatsApp Business API los cobra el MMT — [TikTok Help: How to set up Instant Messaging Ads](https://ads.tiktok.com/help/article/how-to-set-up-tiktok-instant-messaging-ads)
- Si no aparece "Instant messaging apps" en Optimization location, probablemente falta allowlisting y hay que pedirlo — [YCloud help](https://helpdocs.ycloud.com/help-center/ctwa-click-to-whatsapp-ad/tiktok-ads/create-tiktok-instant-messaging-ad) (proveedor; Botmaker, de LatAm, actualizado 27/05/2026: [Botmaker](https://help.botmaker.com/en/help/4954131602542432403))

**Presupuestos: Ads Manager y Promote**
- Ads Manager: presupuesto diario de campaña mayor a USD 50 y de grupo de anuncios mayor a USD 20 — [TikTok Help: Budget](https://ads.tiktok.com/resources/help/article/budget)
- En Argentina se reporta el mismo mínimo y rechazos frecuentes de tarjetas bancarias argentinas — [Spendfigo Argentina](https://spendfigo.com/guides/tiktok-ads/argentina) (proveedor de pagos, sesgado)
- Promote (impulso desde la app): mínimo informado de USD 3 por día y máximo de 1000 por día, de 1 a 7 días. Unos USD 10 rinden "hasta 1000 vistas" (estimación de TikTok citada por terceros) — [Sprout Social](https://sproutsocial.com/insights/tiktok-promotion/); [Hootsuite](https://blog.hootsuite.com/tiktok-promotion/); [TopQLearn](https://topqlearn.com/how-much-does-tiktok-promote-cost)
- Promote se paga con monedas (Coins) o con otros métodos. Pagar desde la app puede sumar cargos móviles (unos 30% de comisión de la tienda de apps, según un resumen). La versión web (tiktok.com/promote/web) no los menciona — [TikTok Help: Supported payment methods for Promote](https://ads.tiktok.com/help/article/supported-methods-of-payment-for-promote?lang=en)

**Spark Ads**
- La API Spark Ads Recommendation es parte de la Organic API — [About API for Business](https://ads.tiktok.com/resources/help/article/marketing-api). Spark Ads permite promocionar un post orgánico (con autorización del código del post) desde Ads Manager. Por eso aplican los mínimos de Ads Manager (USD 50 por día por campaña).

### Inferences
- Para una tatuadora: el embudo legítimo es CTA en el video ("escribime 'TURNO' por DM") → respuesta por palabra clave nativa o ManyChat (si la cuenta Business argentina califica) → link a WhatsApp o formulario. "Comentá X y te mando el link" no se puede automatizar en TikTok (sí en Instagram).
- Argentina no figura en las exclusiones regionales reportadas (EEE, Suiza, Reino Unido), así que en principio la API de mensajería debería estar disponible, pero no hay confirmación oficial.
- Con presupuesto chico, Promote (desde USD 3 por día, pagando por web) es la única pauta realista. Ads Manager, Spark Ads e Instant Messaging Ads exigen al menos USD 50 por día por campaña.

### Gaps
- No encontré una lista oficial de países con respuestas automáticas, ManyChat-TikTok o Instant Messaging Ads en Argentina.
- No encontré el mínimo de Promote en ARS ni si Promote o Ads Manager facturan en ARS. Tampoco cuál es el impacto del impuesto PAÍS o de las percepciones (cambiaron en 2024-2025).
- No verifiqué los requisitos exactos de "Advanced Access" (seguidores, antigüedad).
- No investigué el formulario Lead Gen nativo (Instant Form) en Argentina.

## 6. Herramientas de IA para guiones, hooks y captions; TikTok Symphony / Creative Assistant

### Takeaway
TikTok Symphony (Creative Studio + Assistant) es la suite oficial de IA. El Assistant está disponible globalmente en TikTok Creative Center y en español. Creative Studio se reportó gratis para usuarios de TikTok for Business. Sirve para ideas de guiones, hooks y tendencias, sin costo.

### Cited Findings
- Symphony Assistant está disponible globalmente en TikTok Creative Center y como complemento de Adobe Express, en portugués, inglés, español, alemán, vietnamita, tailandés, japonés, indonesio y chino — [TikTok Business blog (pt-BR)](https://ads.tiktok.com/business/pt-BR/blog/tiktok-symphony-ai-creative-suite?)
- Symphony Creative Studio es gratis para todos los usuarios de TikTok for Business (reporte de 2024) — [Techloy](https://techloy.com/tiktok-unveils-symphony-creative-studios-its-new-ai-powered-platform-for-creators)
- Novedades de 2026: automatización con Smart+. Se informa la integración de Seedance 2.0 (generación de video) en abril de 2026 — [Vidjet (jul 2026)](https://www.vidjet.com/blog/latest-features-on-tiktok-symphony-studio-july-2026-update); [theatdb](https://www.theatdb.com/companies/tiktok-symphony) (secundarias)

### Inferences
- Combinación útil: Creative Center (tendencias, sonidos y hashtags por país, incluida Argentina si está listada) + Symphony Assistant para hooks + un LLM general (Claude o ChatGPT) con prompts propios para captions en español rioplatense. Los videos generados con IA deben llevar la etiqueta de contenido IA de TikTok.

### Gaps
- No confirmé si Creative Studio (avatares y generación de video) está habilitado para cuentas argentinas. Las fuentes no dan una lista de países.
- No investigué si el "AI-generated content label" es obligatorio para animaciones simples de PNG (probablemente no, porque no son contenido realista generado por IA).
