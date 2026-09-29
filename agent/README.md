# Asistente de turnos (Cloudflare Worker)

Chat con Claude que responde dudas, muestra turnos libres del Google Calendar de Briza y arma la
solicitud como **pendiente**. Briza la acepta o rechaza desde el WhatsApp que le llega.

## Publicar

```bash
cd agent
npm install --legacy-peer-deps
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # clave de https://console.anthropic.com
npx wrangler secret put GCAL_ID             # mismo calendario que usa la web
npx wrangler secret put GCAL_KEY            # clave de Google restringida a Calendar API
npx wrangler secret put GCAL_PENDING_ID     # calendario PRIVADO "Solicitudes"
npx wrangler secret put GOOGLE_SA_JSON      # JSON de la cuenta de servicio (ver abajo)
npx wrangler secret put BRIZA_PHONE         # WhatsApp de Briza con código de país (nunca en el repo)
npx wrangler secret put CALLMEBOT_KEY       # ver "Aviso por WhatsApp"
npx wrangler secret put DECIDE_SECRET       # cualquier texto largo al azar
npx wrangler kv namespace create RATE       # pegar el id en wrangler.toml
npx wrangler deploy                          # imprime la URL, p. ej. https://briza-agent.<cuenta>.workers.dev
```

Después, en GitHub → Settings → Secrets and variables → Actions → **Variables**, crear
`AGENT_URL` con esa URL y volver a publicar el sitio. Sin `AGENT_URL` el chat no aparece.

## Qué puede hacer la IA
- `get_open_slots`: lee los eventos "Libre" del calendario.
- `list_flashes`: flashes, precios y disponibilidad (`src/flashes.ts`, mantener igual que la web).
- `request_booking`: arma el mensaje de WhatsApp para Briza (queda pendiente hasta que confirme).

## Aviso a Briza: eventos "⏳ Pendiente"
Cada solicitud crea un evento amarillo **"⏳ Pendiente · Nombre · Idea"** en un calendario privado
(en el horario pedido, o todo el día de hoy si no eligió fecha), con los datos y el link al WhatsApp
del cliente. Briza confirma respondiendo por WhatsApp, borra "⏳ Pendiente" del título y el evento
"Libre" de ese horario. Si lo rechaza, borra el evento.

Configuración (una vez):
1. En Google Calendar crear un calendario **"Solicitudes"** y dejarlo **privado** (tiene datos de clientes).
2. En Google Cloud Console → IAM → Cuentas de servicio → crear una, y en "Claves" crear una clave **JSON**.
3. En la configuración del calendario "Solicitudes" → "Compartir con personas" → agregar el mail de la
   cuenta de servicio con permiso **"Hacer cambios en eventos"**.
4. Cargar el ID de ese calendario en `GCAL_PENDING_ID` y el JSON completo en `GOOGLE_SA_JSON`.

## Aviso por WhatsApp a Briza (Aceptar / Rechazar)
Cada solicitud (del chat o del formulario) le manda a Briza un WhatsApp con los datos, el recordatorio
de chequear Google Calendar y dos links: **✅ Aceptar** y **❌ Rechazar**.
- Aceptar: marca el evento como "✅ Confirmado", saca el turno "Libre" de la web y le abre a Briza un
  mensaje listo para el cliente (con el pedido de seña del 40%).
- Rechazar: lo marca "❌ Rechazado" y le abre un mensaje amable para el cliente.

Se envía con **CallMeBot** (gratis, solo a tu propio número): Briza agenda el contacto de CallMeBot y le
manda "I allow callmebot to send me messages"; le responde con su `apikey` → cargarla en `CALLMEBOT_KEY`.
Instrucciones actualizadas en callmebot.com. En `wrangler.toml` completar `PUBLIC_URL` con la URL del worker.

## Límites anti-abuso (por conexión)
25 mensajes por hora, 80 por día y 2 solicitudes de turno por día (en `src/limits.ts`).

## Preguntas frecuentes
`src/faq.ts` tiene las respuestas que Briza repite siempre. Las que están vacías la IA las deriva a
Briza: completarlas hace que casi nadie tenga que preguntarle lo mismo.
