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
npx wrangler deploy                          # imprime la URL, p. ej. https://briza-agent.<cuenta>.workers.dev
```

Después, en GitHub → Settings → Secrets and variables → Actions → **Variables**, crear
`AGENT_URL` con esa URL y volver a publicar el sitio. Sin `AGENT_URL` el chat no aparece.

## Qué puede hacer la IA
- `get_open_slots`: lee los eventos "Libre" del calendario.
- `list_flashes`: flashes, precios y disponibilidad (`src/flashes.ts`, mantener igual que la web).
- `request_booking`: arma el mensaje de WhatsApp para Briza (queda pendiente hasta que confirme).
