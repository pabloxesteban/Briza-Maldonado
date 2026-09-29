# Asistente de turnos (Cloudflare Worker)

Chat con Claude que responde dudas, muestra turnos libres del Google Calendar de Briza y arma la
solicitud. **No confirma turnos**: la solicitud se envía a Briza por WhatsApp y ella decide.

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
