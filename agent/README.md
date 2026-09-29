# Asistente de turnos (Cloudflare Worker)

Una sola IA para el **chat de la web** y los **mensajes directos de Instagram**. Responde dudas, muestra
flashes y turnos libres, da precios orientativos, recibe fotos de referencia y reserva turnos que quedan
**pendientes** hasta que Briza los acepta o rechaza desde el WhatsApp que le llega.

## Qué hace
| | Cómo |
|---|---|
| Reservas pendientes | Evento "⏳ Pendiente" en el calendario privado *Solicitudes* + WhatsApp a Briza con ✅ Aceptar / ❌ Rechazar y el recordatorio de revisar Google Calendar |
| Seña 40% (Mercado Pago) | Al aceptar, Briza pone el precio total y se genera el link de pago. Cuando entra el pago el evento pasa a "💰 Señado" y Briza recibe aviso |
| Recordatorio | Todos los días 10:00: clientes de mañana reciben recordatorio (automático por Instagram; por WhatsApp, Briza recibe los mensajes listos para enviar con un toque) |
| Cuidados | Al día siguiente del turno se envía la guía de cuidados (`src/config.ts`). La IA responde dudas y deriva al médico ante señales de alarma |
| Referencias | Fotos desde el chat (📎) o Instagram; se guardan y van adjuntas a la solicitud |
| Precio orientativo | Rangos de `PRICING` en `src/config.ts` (vacío = no da cifras) |
| Lista de espera | Si no hay turnos, la anota; cuando Briza publica turnos nuevos, se les avisa |
| Flashes vivos | Google Sheet publicado como CSV (`nombre, cm, precio, disponible`) → web y asistente se actualizan solos |
| Reglas | `RULES` en `src/config.ts` |
| Contacto | Solo Instagram: se pide el usuario (en DMs no hace falta) y un mail para la confirmación |
| Anti-abuso | 25 mensajes/h, 80/día y 2 solicitudes/día por persona |
| Instagram | Responde DMs. Briza puede tomar una conversación escribiendo **#pausa** en ese chat y devolvérsela a la IA con **#ia** |

El número de Briza es un secreto del servidor: nunca aparece en la web ni en el repositorio.

## Publicar (una vez)
```bash
cd agent && npm install --legacy-peer-deps && npx wrangler login
npx wrangler kv namespace create RATE        # pegar el id en wrangler.toml
npx wrangler r2 bucket create briza-refs
npx wrangler deploy                           # anotar la URL y ponerla en PUBLIC_URL (wrangler.toml), deploy otra vez
npx wrangler secret put NOMBRE                # uno por cada secreto listado en wrangler.toml
```
En GitHub → Settings → Secrets and variables → Actions → Variables: `AGENT_URL` (URL del worker) y
`FLASH_SHEET` (CSV publicado). Volver a publicar la web.

### Google Calendar
- Calendario público **Turnos**: eventos "Libre" = turnos que se ofrecen.
- Calendario privado **Solicitudes**: acá caen las reservas.
- Cuenta de servicio (Google Cloud → IAM → Cuentas de servicio → clave JSON) compartida en **ambos**
  calendarios con "Hacer cambios en eventos".

### WhatsApp para Briza (CallMeBot)
Briza agenda el contacto de CallMeBot y le manda "I allow callmebot to send me messages"; la respuesta
trae la `apikey` → `CALLMEBOT_KEY`. `BRIZA_PHONE` = su número con código de país.

### Mercado Pago
Mercado Pago Developers → Tus integraciones → crear app → Credenciales de producción → Access Token →
`MP_ACCESS_TOKEN`. Las notificaciones de pago llegan solas a `/mp`.

### Instagram
Requiere cuenta **profesional** (creador o empresa).
1. developers.facebook.com → crear app → agregar el producto **Instagram** → "API setup with Instagram login".
2. Conectar la cuenta @bri.t4tts y generar el token → `IG_TOKEN`; el ID de la cuenta → `IG_USER_ID`.
3. Webhooks: URL `https://<worker>/ig`, token de verificación = el valor de `IG_VERIFY_TOKEN`, suscribir `messages`.
4. App secret → `IG_APP_SECRET`. Pedir el permiso `instagram_business_manage_messages` (revisión de Meta) y pasar la app a modo Live.

### Mails a clientes (Resend)
Crear cuenta en resend.com, verificar un dominio (o usar el de prueba) y cargar `RESEND_API_KEY` y `MAIL_FROM`.
Se envían: recepción de la solicitud, aceptación con link de seña, seña recibida, recordatorio y cuidados.

### Newsletter
Solo se anotan quienes dicen que sí (casilla o respuesta explícita en el chat). Lista descargable en
`https://<worker>/newsletter.csv?k=<DECIDE_SECRET>`.

## Preguntas frecuentes
`src/faq.ts`: las vacías la IA las deriva a Briza. Completarlas = menos mensajes repetidos.
