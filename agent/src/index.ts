// Briza's booking assistant: a Cloudflare Worker that runs a Claude tool-use loop for the website chat
// and Instagram DMs. It answers questions, shows open slots and flashes, quotes orientative ranges,
// takes reference photos and books requests that stay "Pendiente" until Briza accepts or rejects them
// from the WhatsApp notice she receives. Accepting sends a Mercado Pago link for the 40% deposit.
// A daily job reminds clients of tomorrow's session, sends aftercare the day after, and tells the
// waitlist when new slots appear. Briza's number never reaches the site.
import Anthropic from '@anthropic-ai/sdk'
import { loadFlashes } from './flashes'
import { FAQ } from './faq'
import { RULES, PRICING, AFTERCARE } from './config'
import { createPending, getEvent, retitle, removeFreeSlot, listEvents, type PendingData, type CalEvent } from './gcal-write'
import { whatsappToBriza } from './notify'
import { LIMITS, hit, hourKey, dayKey } from './limits'
import { verifySignature, sendDM, username } from './instagram'
import { createDepositLink, getPayment } from './mp'

interface Env {
  ANTHROPIC_API_KEY: string
  ALLOWED_ORIGIN: string
  PUBLIC_URL: string
  DECIDE_SECRET: string
  GCAL_ID?: string            // public "Turnos" calendar (Libre slots)
  GCAL_KEY?: string
  GCAL_PENDING_ID?: string    // private "Solicitudes" calendar
  GOOGLE_SA_JSON?: string
  BRIZA_PHONE?: string        // Briza's WhatsApp (secret) + CallMeBot key for her notices
  CALLMEBOT_KEY?: string
  MP_ACCESS_TOKEN?: string    // Mercado Pago
  FLASH_SHEET_URL?: string    // published CSV of the flash sheet
  IG_TOKEN?: string           // Instagram API (professional account)
  IG_USER_ID?: string
  IG_APP_SECRET?: string
  IG_VERIFY_TOKEN?: string
  RATE?: KVNamespace          // limits, Instagram conversations, waitlist
  REFS?: R2Bucket             // reference photos
}

type Msg = Anthropic.Beta.BetaMessageParam
type Channel = { kind: 'web'; ip: string } | { kind: 'ig'; sid: string }

const MODEL = 'claude-opus-5-5'
const MAX_HISTORY = 40
const MAX_STEPS = 6
const TZ = 'America/Argentina/Buenos_Aires'
const IG_HANDLE = '@bri.t4tts'

// ─── Prompt ───────────────────────────────────────────────────────────────
const SYSTEM = `Sos la asistente virtual de Briza Maldonado, tatuadora traditional en Palermo, Buenos Aires (vegan tattoo artist, black & white y color). Hablás en español rioplatense, cálida y breve (2-4 oraciones), sin emojis de más.

Qué hacés:
- Respondés dudas: estilos, flashes (list_flashes, nunca inventes precios ni disponibilidad), cuidados, reglas del estudio y cómo se reserva.
- Diseños propios: podés dar un rango orientativo con quote_estimate; aclarás que el precio final lo define Briza.
- Si la persona manda fotos de referencia, describilas en una frase para confirmar la idea; se adjuntan solas a la solicitud.
- Turnos: usá get_open_slots y ofrecé 2-4 opciones concretas. Nunca inventes horarios.
- Si no hay turnos que le sirvan, ofrecé anotarla en la lista de espera (join_waitlist).
- Reserva: cuando tengas idea (o flash), zona, tamaño aproximado, turno elegido (o "lo antes posible"), nombre${'${contactRule}'} y la aceptación de la seña, llamá a request_booking una sola vez. Pedí de a uno los datos que falten.

Reglas:
- La reserva queda PENDIENTE: Briza la acepta o la rechaza. Nunca digas que un turno está confirmado.
- Antes de reservar, avisá que todas las reservas se confirman con una seña de al menos el 40% del costo total (se paga por Mercado Pago cuando Briza acepta) y pedí que lo acepte.
- Nunca des el número de teléfono de Briza.
- Cuidados: usá la guía de abajo. Si describe fiebre, pus, enrojecimiento que se expande, calor intenso o dolor que empeora, decile que consulte a un médico ya y que le avise a Briza.
- Si no sabés algo, decí que lo confirma Briza. No hables de temas ajenos al estudio.`

const FAQ_TEXT = FAQ.map(f => `- ${f.q}: ${f.a || '(sin definir: lo confirma Briza)'}`).join('\n')
const RULES_TEXT = RULES.map(r => `- ${r}`).join('\n')

const systemFor = (ch: Channel) => {
  const contactRule = ch.kind === 'ig'
    ? ' (por Instagram no hace falta pedir teléfono: Briza responde por acá)'
    : ', su WhatsApp o su usuario de Instagram (para que Briza le responda)'
  return `${SYSTEM.replace('${contactRule}', contactRule)}

Reglas del estudio (respetalas y explicalas si hace falta):
${RULES_TEXT}

Preguntas frecuentes (respuestas de Briza):
${FAQ_TEXT}

${AFTERCARE}`
}

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: 'get_open_slots',
    description: 'Turnos libres publicados por Briza (horario de Buenos Aires). Usala antes de ofrecer fechas.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        from_date: { type: 'string', description: 'YYYY-MM-DD, vacío = hoy.' },
        days: { type: 'integer', description: 'Días hacia adelante (1-60).' },
      },
      required: ['from_date', 'days'], additionalProperties: false,
    },
  },
  {
    name: 'list_flashes',
    description: 'Flashes del cuaderno con tamaño, precio y disponibilidad actual.',
    strict: true,
    input_schema: { type: 'object', properties: {}, required: [], additionalProperties: false },
  },
  {
    name: 'quote_estimate',
    description: 'Rango de precio orientativo para un diseño propio según tamaño y color. Si no hay rangos cargados, lo cotiza Briza.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: { size_cm: { type: 'number' }, color: { type: 'boolean', description: 'true si lleva color' } },
      required: ['size_cm', 'color'], additionalProperties: false,
    },
  },
  {
    name: 'join_waitlist',
    description: 'Anota a la persona en la lista de espera; se le avisa cuando Briza publique turnos nuevos.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' }, idea: { type: 'string' },
        contact: { type: 'string', description: 'WhatsApp o usuario de Instagram; vacío si escribe por Instagram.' },
      },
      required: ['name', 'idea', 'contact'], additionalProperties: false,
    },
  },
  {
    name: 'request_booking',
    description: 'Reserva el turno como PENDIENTE y le avisa a Briza, que lo acepta o rechaza. Solo con la seña del 40% aceptada.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        idea: { type: 'string', description: 'Flash elegido o descripción del diseño propio.' },
        zone: { type: 'string' },
        size: { type: 'string' },
        slot: { type: 'string', description: 'label del turno de get_open_slots, o "lo antes posible".' },
        slot_start: { type: 'string', description: 'start (ISO) del turno elegido; vacío si no eligió uno.' },
        contact: { type: 'string', description: 'WhatsApp o usuario de Instagram; vacío si escribe por Instagram.' },
        notes: { type: 'string', description: 'Otros detalles; vacío si no hay.' },
        deposit_ok: { type: 'boolean', description: 'true si aceptó la seña del 40%.' },
      },
      required: ['name', 'idea', 'zone', 'size', 'slot', 'slot_start', 'contact', 'notes', 'deposit_ok'],
      additionalProperties: false,
    },
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
const fmt = (d: Date) => d.toLocaleString('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
const esc = (t: string) => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

const hmac = async (secret: string, msg: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(sig).slice(0, 16), b => b.toString(16).padStart(2, '0')).join('')
}

async function notifyBriza(env: Env, text: string) {
  if (!env.BRIZA_PHONE || !env.CALLMEBOT_KEY) return false
  try { await whatsappToBriza(env.BRIZA_PHONE, env.CALLMEBOT_KEY, text); return true } catch { return false }
}

// How Briza (or the worker) reaches a client
function clientLink(d: Pick<PendingData, 'channel' | 'contact'>, text: string) {
  if (d.channel === 'ig') return ''
  if (/^\d{8,}$/.test(d.contact)) return `https://wa.me/${d.contact}?text=${encodeURIComponent(text)}`
  return `https://ig.me/m/${d.contact.replace(/^@/, '')}`
}
async function messageClient(env: Env, d: Pick<PendingData, 'channel' | 'contact'>, text: string) {
  if (d.channel !== 'ig' || !env.IG_TOKEN || !env.IG_USER_ID) return false
  try { await sendDM(env.IG_TOKEN, env.IG_USER_ID, d.contact, text); return true } catch { return false }
}

function parseContact(raw: string, ch: Channel): { channel: 'wa' | 'ig'; contact: string } | null {
  if (ch.kind === 'ig') return { channel: 'ig', contact: ch.sid }
  const digits = raw.replace(/\D/g, '')
  if (digits.length >= 8 && !/[a-z]/i.test(raw.replace(/^@/, ''))) return { channel: 'wa', contact: digits }
  const handle = raw.trim().replace(/^@/, '').replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').replace(/\/.*$/, '')
  return /^[a-z0-9._]{2,30}$/i.test(handle) ? { channel: 'wa', contact: `@${handle}` } : null
}

// ─── Tools ────────────────────────────────────────────────────────────────
async function getOpenSlots(env: Env, input: { from_date: string; days: number }) {
  if (!env.GCAL_ID || !env.GCAL_KEY) return { slots: [], note: 'El calendario todavía no está conectado: ofrecé la lista de espera o que Briza proponga fecha.' }
  const from = input.from_date ? new Date(`${input.from_date}T00:00:00-03:00`) : new Date()
  const start = new Date(Math.max(from.getTime(), Date.now()))
  const end = new Date(start.getTime() + Math.min(60, Math.max(1, input.days || 21)) * 86400e3)
  const q = new URLSearchParams({ key: env.GCAL_KEY, timeMin: start.toISOString(), timeMax: end.toISOString(), singleEvents: 'true', orderBy: 'startTime', maxResults: '100', q: 'Libre' })
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.GCAL_ID)}/events?${q}`)
  if (!res.ok) return { slots: [], note: 'No pude leer el calendario ahora.' }
  const data = await res.json() as { items?: { summary?: string; start?: { dateTime?: string } }[] }
  const slots = (data.items ?? [])
    .filter(e => /^\s*libre/i.test(e.summary ?? '') && e.start?.dateTime)
    .map(e => ({ label: fmt(new Date(e.start!.dateTime!)), start: e.start!.dateTime! }))
  return { slots, note: slots.length ? '' : 'No hay turnos publicados en ese rango: ofrecé la lista de espera.' }
}

function quote(input: { size_cm: number; color: boolean }) {
  if (!PRICING.length) return { range: '', note: 'Briza todavía no cargó rangos: decí que lo cotiza ella al ver la idea.' }
  const i = input.size_cm <= 8 ? 0 : input.size_cm <= 15 ? 1 : 2
  const row = PRICING[Math.min(i, PRICING.length - 1)]
  return { size: row.size, range: input.color ? row.color : row.bw, note: 'Orientativo: el precio final lo define Briza.' }
}

type WaitEntry = { name: string; idea: string; channel: 'wa' | 'ig'; contact: string; at: string }
async function joinWaitlist(env: Env, input: { name: string; idea: string; contact: string }, ch: Channel) {
  if (!env.RATE) return { ok: false, error: 'La lista de espera no está disponible ahora.' }
  const c = parseContact(input.contact, ch)
  if (!c) return { ok: false, error: 'Falta un WhatsApp o usuario de Instagram válido.' }
  const list = JSON.parse(await env.RATE.get('waitlist') ?? '[]') as WaitEntry[]
  if (list.some(w => w.contact === c.contact)) return { ok: true, note: 'Ya estaba anotada.' }
  list.push({ name: input.name.slice(0, 80), idea: input.idea.slice(0, 200), ...c, at: new Date().toISOString() })
  await env.RATE.put('waitlist', JSON.stringify(list.slice(-200)))
  return { ok: true, note: 'Anotada. Se le avisa cuando Briza publique turnos nuevos.' }
}

export type Booking = { name: string; idea: string; zone: string; size: string; slot: string; slot_start: string; contact: string; notes: string; deposit_ok: boolean }

// Shared by the assistant (web + Instagram) and the site's form: pending event + WhatsApp notice to Briza
async function submitRequest(env: Env, b: Booking, ch: Channel, refs: string[] = []) {
  if (!b.deposit_ok) return { ok: false, error: 'Falta que la persona acepte la seña del 40%.' }
  const c = parseContact(b.contact, ch)
  if (!c) return { ok: false, error: 'Falta un WhatsApp o usuario de Instagram válido para que Briza pueda responder.' }
  const who = ch.kind === 'ig' ? ch.sid : ch.ip
  if (!(await hit(env.RATE, dayKey(who, 'req'), LIMITS.requestsPerDay, 86400))) {
    return { ok: false, error: `Ya se enviaron varias solicitudes hoy. Si necesitás algo más, escribí por Instagram ${IG_HANDLE}.` }
  }
  const igName = c.channel === 'ig' && env.IG_TOKEN ? await username(env.IG_TOKEN, c.contact) : ''
  const contactLine = c.channel === 'ig' ? `Instagram: ${igName ? '@' + igName : '(por DM)'}`
    : c.contact.startsWith('@') ? `Instagram: ${c.contact} → https://ig.me/m/${c.contact.slice(1)}`
      : `WhatsApp: +${c.contact} → https://wa.me/${c.contact}`
  const lines = [
    `Nombre: ${b.name}`, contactLine, `Idea: ${b.idea}`, `Zona: ${b.zone}`, `Tamaño: ${b.size}`,
    `Turno pedido: ${b.slot}`, 'Seña 40%: aceptada',
    ...(b.notes ? [`Notas: ${b.notes}`] : []),
    ...refs.map((r, i) => `Referencia ${i + 1}: ${r}`),
  ]
  let eventId = ''
  if (env.GCAL_PENDING_ID && env.GOOGLE_SA_JSON) {
    try {
      eventId = await createPending(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, {
        title: `⏳ Pendiente · ${b.name} · ${b.idea}`.slice(0, 120),
        description: ['Solicitud desde la web/Instagram. Aceptala o rechazala desde el WhatsApp que te llegó.', '', ...lines].join('\n'),
        data: { name: b.name, channel: c.channel, contact: c.contact, idea: b.idea, slot: b.slot, start: b.slot_start, refs: refs.join(' ').slice(0, 1000) },
      })
    } catch { /* the WhatsApp notice below still carries everything */ }
  }
  const links = eventId
    ? [`✅ Aceptar: ${env.PUBLIC_URL}/decide?e=${encodeURIComponent(eventId)}&a=ok&s=${await hmac(env.DECIDE_SECRET, eventId + 'ok')}`,
      `❌ Rechazar: ${env.PUBLIC_URL}/decide?e=${encodeURIComponent(eventId)}&a=no&s=${await hmac(env.DECIDE_SECRET, eventId + 'no')}`]
    : ['Respondele directo para aceptar o rechazar.']
  const notified = await notifyBriza(env, ['⏳ Nueva solicitud de turno', '', ...lines, '', '¿La aceptás o la rechazás?', ...links, '',
    '📅 Acordate de chequear Google Calendar (calendario Solicitudes) antes de decidir.'].join('\n'))
  return { ok: true, pending: true, notified, summary: ['Solicitud enviada a Briza ✦', '', ...lines.filter(l => !/^(WhatsApp|Instagram|Referencia)/.test(l))].join('\n') }
}

async function runTool(env: Env, name: string, input: unknown, turn: { bookings: number; refs: string[] }, ch: Channel): Promise<{ result: unknown; action?: { summary: string } }> {
  switch (name) {
    case 'get_open_slots': return { result: await getOpenSlots(env, input as { from_date: string; days: number }) }
    case 'list_flashes': return { result: await loadFlashes(env.FLASH_SHEET_URL) }
    case 'quote_estimate': return { result: quote(input as { size_cm: number; color: boolean }) }
    case 'join_waitlist': return { result: await joinWaitlist(env, input as { name: string; idea: string; contact: string }, ch) }
    case 'request_booking': {
      if (turn.bookings++ >= 1) return { result: { error: 'Ya se envió una solicitud en esta respuesta.' } }
      const r = await submitRequest(env, input as Booking, ch, turn.refs)
      return { result: r, action: r.ok ? { summary: r.summary! } : undefined }
    }
    default: return { result: { error: `Herramienta desconocida: ${name}` } }
  }
}

// ─── The loop ─────────────────────────────────────────────────────────────
// Reference photos sent in the conversation (our own /ref/ URLs) travel with the booking request
function refsIn(env: Env, messages: Msg[]) {
  const out: string[] = []
  for (const m of messages) {
    if (m.role !== 'user' || typeof m.content === 'string') continue
    for (const b of m.content) {
      if (b.type === 'image' && b.source.type === 'url' && b.source.url.startsWith(`${env.PUBLIC_URL}/ref/`)) out.push(b.source.url)
    }
  }
  return out.slice(-4)
}

async function chat(env: Env, history: Msg[], ch: Channel) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  const messages: Msg[] = history.slice(-MAX_HISTORY)
  while (messages.length && messages[0].role !== 'user') messages.shift()
  const turn = { bookings: 0, refs: refsIn(env, messages) }
  let action: { summary: string } | undefined
  const today = new Date().toLocaleDateString('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  for (let step = 0; step < MAX_STEPS; step++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: [
        { type: 'text', text: systemFor(ch), cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `Hoy es ${today} (hora de Buenos Aires). Canal: ${ch.kind === 'ig' ? 'Instagram DM' : 'web'}.` },
      ],
      tools: TOOLS,
      messages,
      output_config: { effort: 'low' }, // short, friendly chat turns
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default', // route safety declines to a fallback model instead of stopping
    } as Anthropic.Beta.MessageCreateParamsNonStreaming)

    messages.push({ role: 'assistant', content: response.content })
    if (response.stop_reason === 'refusal') return { messages, reply: `Eso no lo puedo responder por acá. Podés escribirle a Briza por Instagram (${IG_HANDLE}).`, action }
    if (response.stop_reason === 'pause_turn') continue
    if (response.stop_reason !== 'tool_use') {
      const reply = response.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text').map(b => b.text).join('\n').trim()
      return { messages, reply, action }
    }
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = []
    for (const u of response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use')) {
      try {
        const r = await runTool(env, u.name, u.input, turn, ch)
        if (r.action) action = r.action
        results.push({ type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(r.result) })
      } catch (e) {
        results.push({ type: 'tool_result', tool_use_id: u.id, content: `Error: ${(e as Error).message}`, is_error: true })
      }
    }
    messages.push({ role: 'user', content: results })
  }
  return { messages, reply: 'Se me complicó un poco. ¿Me repetís qué necesitás?', action }
}

// Web chat: plain turns only; the new visitor turn is text, optionally with up to 3 of our reference photos
function sanitize(env: Env, raw: unknown): Msg[] | null {
  if (!Array.isArray(raw) || !raw.length || raw.length > 200) return null
  const out = raw.filter((m): m is Msg => !!m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant'))
  const last = out[out.length - 1]
  if (last?.role !== 'user') return null
  if (typeof last.content === 'string') return last.content.trim() && last.content.length <= 1500 ? out : null
  if (!Array.isArray(last.content) || last.content.length > 4) return null
  const ok = last.content.every(b =>
    (b.type === 'text' && typeof b.text === 'string' && b.text.length <= 1500) ||
    (b.type === 'image' && b.source?.type === 'url' && b.source.url.startsWith(`${env.PUBLIC_URL}/ref/`)))
  return ok ? out : null
}

// ─── Briza's decision pages ───────────────────────────────────────────────
const page = (title: string, body: string) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><body style="margin:0;font-family:system-ui,sans-serif;background:#F7F1E2;color:#161414;display:grid;place-items:center;min-height:100vh;padding:24px">
<div style="max-width:440px;width:100%;background:#fffdf7;border-radius:20px;padding:28px;box-shadow:0 20px 50px -25px rgba(0,0,0,.35);line-height:1.5">${body}</div></body>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
const btn = (href: string, label: string) => `<a href="${href}" style="display:block;text-align:center;background:#161414;color:#F7F1E2;padding:14px;border-radius:999px;font-weight:800;text-decoration:none;margin-top:12px">${label}</a>`
const strip = (s: string) => s.replace(/^(⏳ Pendiente|✅ Confirmado|❌ Rechazado|💰 Señado)\s*·\s*/, '')

async function decide(env: Env, req: Request, url: URL) {
  const id = url.searchParams.get('e') ?? '', a = url.searchParams.get('a') ?? '', sig = url.searchParams.get('s') ?? ''
  if (!id || !['ok', 'no'].includes(a) || sig !== await hmac(env.DECIDE_SECRET, id + a)) return page('Link inválido', '<h2>Link inválido</h2>')
  if (!env.GOOGLE_SA_JSON || !env.GCAL_PENDING_ID) return page('Falta configuración', '<h2>Falta configurar el calendario</h2>')
  const ev = await getEvent(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, id)
  const d = ev.extendedProperties?.private
  if (!d) return page('Sin datos', '<h2>No encontré la solicitud</h2>')
  const base = strip(ev.summary)

  if (a === 'no') {
    await retitle(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, id, `❌ Rechazado · ${base}`, '8')
    const msg = `Hola ${d.name}! Soy Briza ✦ Gracias por escribirme. Ese turno no lo puedo tomar; si querés te propongo otra fecha.`
    const sent = await messageClient(env, d, msg)
    return page('Rechazada', `<h2>❌ Solicitud rechazada</h2><p>${esc(d.name)} · ${esc(d.idea)}</p><p>La marqué como rechazada en tu calendario.</p>${
      sent ? '<p>Le avisé por Instagram.</p>' : clientLink(d, msg) ? btn(clientLink(d, msg), 'Avisarle ↗') : '<p>Respondele por Instagram.</p>'}`)
  }

  // Accept: first ask the total so the 40% deposit link can be generated
  const total = Number(url.searchParams.get('total') ?? '')
  if (req.method === 'GET' && !total) {
    return page('Aceptar turno', `<h2>✅ Aceptar turno</h2><p><b>${esc(d.name)}</b> · ${esc(d.idea)}<br>${esc(d.slot)}</p>
<form method="GET"><input type="hidden" name="e" value="${esc(id)}"><input type="hidden" name="a" value="ok"><input type="hidden" name="s" value="${esc(sig)}">
<label style="display:block;font-weight:700;margin-top:12px">Precio total (ARS)</label>
<input name="total" type="number" min="1000" step="500" required style="width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:1px solid #ccc;font-size:18px">
<p style="font-size:14px;color:#666">Se genera un link de Mercado Pago por la seña del 40%.</p>
<button style="width:100%;background:#161414;color:#F7F1E2;padding:14px;border:0;border-radius:999px;font-weight:800;font-size:16px">Confirmar y generar seña</button></form>`)
  }
  const deposit = Math.ceil((total * 0.4) / 100) * 100
  let payLink = ''
  if (env.MP_ACCESS_TOKEN && total) {
    try { payLink = await createDepositLink(env.MP_ACCESS_TOKEN, { eventId: id, title: `Seña tatuaje · ${d.idea} · Briza Maldonado`, amount: deposit, notifyUrl: `${env.PUBLIC_URL}/mp` }) } catch { /* Briza can send transfer details instead */ }
  }
  await retitle(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, id, `✅ Confirmado · ${base}${total ? ` · $${total.toLocaleString('es-AR')} (seña $${deposit.toLocaleString('es-AR')})` : ''}`, '10')
  if (d.start && env.GCAL_ID) { try { await removeFreeSlot(env.GOOGLE_SA_JSON, env.GCAL_ID, d.start) } catch { /* can be removed by hand */ } }
  const msg = `Hola ${d.name}! Soy Briza ✦ Acepto tu turno para ${d.idea} (${d.slot}). ${total ? `El total es $${total.toLocaleString('es-AR')} y para reservarlo necesito la seña de $${deposit.toLocaleString('es-AR')}` : 'Para reservarlo necesito una seña del 40% del total'}${payLink ? `: ${payLink}` : '; te paso los datos para transferir'}. ¡Gracias!`
  const sent = await messageClient(env, d, msg)
  return page('Aceptado', `<h2>✅ Turno aceptado</h2><p>${esc(d.name)} · ${esc(d.idea)} · ${esc(d.slot)}</p><p>Marcado como confirmado${d.start ? ' y saqué el turno libre de la web' : ''}.${payLink ? ' Cuando pague la seña te aviso y el evento pasa a 💰 Señado.' : ''}</p>${
    sent ? '<p>Le mandé el mensaje por Instagram.</p>' : clientLink(d, msg) ? btn(clientLink(d, msg), 'Enviarle el mensaje ↗') : `<p>Mensaje para enviarle:</p><p style="background:#f3ecdc;padding:12px;border-radius:12px">${esc(msg)}</p>`}`)
}

// Mercado Pago tells us about a payment: check it with MP itself, then mark the booking
async function mpWebhook(env: Env, url: URL, req: Request) {
  if (!env.MP_ACCESS_TOKEN || !env.GOOGLE_SA_JSON || !env.GCAL_PENDING_ID) return new Response('ok')
  let id = url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? ''
  if (!id) { try { id = String(((await req.json()) as { data?: { id?: string } }).data?.id ?? '') } catch { /* noop */ } }
  if (!id) return new Response('ok')
  const p = await getPayment(env.MP_ACCESS_TOKEN, id)
  if (p.status !== 'approved' || !p.external_reference) return new Response('ok')
  const ev = await getEvent(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, p.external_reference)
  if (ev.summary.startsWith('💰')) return new Response('ok')
  await retitle(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, ev.id, `💰 Señado · ${strip(ev.summary)}`, '2')
  const d = ev.extendedProperties?.private
  await notifyBriza(env, `💰 Entró la seña de ${d?.name ?? 'un cliente'} ($${(p.transaction_amount ?? 0).toLocaleString('es-AR')}) · ${d?.idea ?? ''} · ${d?.slot ?? ''}`)
  if (d) await messageClient(env, d, `¡Listo ${d.name}! Recibí tu seña ✦ Tu turno quedó reservado: ${d.slot}. Te escribo un día antes con la dirección.`)
  return new Response('ok')
}

// ─── Instagram DMs ────────────────────────────────────────────────────────
type IgEvent = { sender: { id: string }; message?: { mid: string; text?: string; is_echo?: boolean; attachments?: { type: string; payload?: { url?: string } }[] } }

async function handleIg(env: Env, e: IgEvent) {
  const sid = e.sender.id
  if (!e.message || e.message.is_echo || sid === env.IG_USER_ID || !env.RATE || !env.IG_TOKEN || !env.IG_USER_ID) return
  // Briza can take over a conversation by sending "#pausa" from her account; "#ia" gives it back
  if (await env.RATE.get(`igpause:${sid}`)) return
  if (!(await hit(env.RATE, hourKey(sid, 'ig'), LIMITS.chatPerHour, 3600))) return
  const key = `ig:${sid}`
  const history = JSON.parse(await env.RATE.get(key) ?? '[]') as Msg[]
  const content: Anthropic.Beta.BetaContentBlockParam[] = []
  for (const a of e.message.attachments ?? []) {
    if (a.type === 'image' && a.payload?.url && env.REFS) {
      // Keep a copy: Instagram's CDN links expire
      const img = await fetch(a.payload.url)
      if (img.ok) {
        const k = `${crypto.randomUUID()}.jpg`
        await env.REFS.put(k, img.body, { httpMetadata: { contentType: img.headers.get('Content-Type') ?? 'image/jpeg' } })
        content.push({ type: 'image', source: { type: 'url', url: `${env.PUBLIC_URL}/ref/${k}` } })
      }
    }
  }
  if (e.message.text) content.push({ type: 'text', text: e.message.text.slice(0, 1500) })
  if (!content.length) return
  history.push({ role: 'user', content })
  const out = await chat(env, history, { kind: 'ig', sid })
  await env.RATE.put(key, JSON.stringify(out.messages.slice(-MAX_HISTORY)), { expirationTtl: 30 * 86400 })
  if (out.reply) await sendDM(env.IG_TOKEN, env.IG_USER_ID, sid, out.reply)
}

async function igWebhook(env: Env, req: Request, url: URL, ctx: ExecutionContext) {
  if (req.method === 'GET') {
    const ok = url.searchParams.get('hub.mode') === 'subscribe' && env.IG_VERIFY_TOKEN && url.searchParams.get('hub.verify_token') === env.IG_VERIFY_TOKEN
    return ok ? new Response(url.searchParams.get('hub.challenge') ?? '') : new Response('Forbidden', { status: 403 })
  }
  const raw = await req.text()
  if (!env.IG_APP_SECRET || !(await verifySignature(env.IG_APP_SECRET, raw, req.headers.get('X-Hub-Signature-256')))) return new Response('Bad signature', { status: 403 })
  const body = JSON.parse(raw) as { entry?: { messaging?: IgEvent[] }[] }
  for (const entry of body.entry ?? []) {
    for (const m of entry.messaging ?? []) {
      // Briza typing "#pausa" / "#ia" in a chat from her own account
      if (m.message?.is_echo && env.RATE && m.message.text) {
        const to = (m as IgEvent & { recipient?: { id: string } }).recipient?.id
        if (to && /^#pausa\b/i.test(m.message.text)) ctx.waitUntil(env.RATE.put(`igpause:${to}`, '1', { expirationTtl: 7 * 86400 }))
        if (to && /^#ia\b/i.test(m.message.text)) ctx.waitUntil(env.RATE.delete(`igpause:${to}`))
        continue
      }
      ctx.waitUntil(handleIg(env, m).catch(() => {}))
    }
  }
  return new Response('ok') // answer Meta fast; the reply is sent in the background
}

// ─── Daily job: reminders, aftercare, waitlist ────────────────────────────
async function daily(env: Env) {
  if (!env.GOOGLE_SA_JSON || !env.GCAL_PENDING_ID) return
  const now = new Date()
  const dayStart = (offset: number) => {
    const d = new Date(now.toLocaleString('en-US', { timeZone: TZ }))
    d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset)
    return new Date(d.getTime() + 3 * 3600e3) // Buenos Aires is UTC-3
  }
  const booked = (e: CalEvent) => /^(✅|💰)/.test(e.summary) && e.extendedProperties?.private
  const tomorrow = (await listEvents(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, dayStart(1), dayStart(2))).filter(booked)
  const yesterday = (await listEvents(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, dayStart(-1), dayStart(0))).filter(booked)

  const lines: string[] = []
  // 1 · Reminder the day before
  for (const e of tomorrow) {
    const d = e.extendedProperties!.private!
    const msg = `Hola ${d.name}! Te recuerdo tu turno de mañana (${d.slot}) para ${d.idea} ✦ Vení comida, hidratada y con ropa cómoda que deje la zona a mano. Cualquier cosa avisame. ¡Nos vemos! — Briza`
    if (!(await messageClient(env, d, msg))) lines.push(`🔔 Recordatorio · ${d.name}: ${clientLink(d, msg) || '(respondé por Instagram)'}`)
  }
  // 2 · Aftercare the day after
  for (const e of yesterday) {
    const d = e.extendedProperties!.private!
    const msg = `Hola ${d.name}! ¿Cómo va el tatuaje? ✦ Te dejo los cuidados:\n\n${AFTERCARE}\n\nCualquier duda escribime. — Briza`
    if (!(await messageClient(env, d, msg))) lines.push(`🩹 Cuidados · ${d.name}: ${clientLink(d, msg) || '(respondé por Instagram)'}`)
  }
  // 6 · Waitlist: new slots since yesterday
  if (env.RATE && env.GCAL_ID && env.GCAL_KEY) {
    const { slots } = await getOpenSlots(env, { from_date: '', days: 45 })
    const seen = new Set(JSON.parse(await env.RATE.get('slots:seen') ?? '[]') as string[])
    const fresh = slots.filter(s => !seen.has(s.start))
    await env.RATE.put('slots:seen', JSON.stringify(slots.map(s => s.start)))
    const wait = JSON.parse(await env.RATE.get('waitlist') ?? '[]') as WaitEntry[]
    if (fresh.length && seen.size && wait.length) {
      const list = fresh.slice(0, 4).map(s => s.label).join(', ')
      const left: WaitEntry[] = []
      for (const w of wait) {
        const msg = `Hola ${w.name}! Soy Briza ✦ Abrí turnos nuevos: ${list}. Si querés uno, pedilo en la web o respondeme por acá.`
        if (await messageClient(env, w, msg)) continue
        const link = clientLink(w, msg)
        if (link) lines.push(`📝 Lista de espera · ${w.name}: ${link}`)
        else left.push(w)
      }
      await env.RATE.put('waitlist', JSON.stringify(left))
    }
  }
  if (lines.length) await notifyBriza(env, ['☀️ Pendientes de hoy (tocá cada link para enviarlo):', '', ...lines].join('\n'))
}

// ─── Router ───────────────────────────────────────────────────────────────
export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url)
    if (url.pathname === '/decide') return decide(env, req, url)
    if (url.pathname === '/mp') return mpWebhook(env, url, req).catch(() => new Response('ok'))
    if (url.pathname === '/ig') return igWebhook(env, req, url, ctx)
    if (req.method === 'GET' && url.pathname.startsWith('/ref/') && env.REFS) {
      const obj = await env.REFS.get(url.pathname.slice(5))
      return obj ? new Response(obj.body, { headers: { 'Content-Type': obj.httpMetadata?.contentType ?? 'image/jpeg', 'Cache-Control': 'public, max-age=31536000' } }) : new Response('Not found', { status: 404 })
    }

    const origin = req.headers.get('Origin') ?? ''
    const allowed = origin === env.ALLOWED_ORIGIN || origin.startsWith('http://localhost')
    const cors = { 'Access-Control-Allow-Origin': allowed ? origin : env.ALLOWED_ORIGIN, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (req.method !== 'POST' || !allowed) return new Response('Not allowed', { status: 403, headers: cors })
    const ip = req.headers.get('CF-Connecting-IP') ?? 'anon'

    // 3 · Reference photo upload (JPEG, resized in the browser)
    if (url.pathname === '/upload') {
      if (!env.REFS) return Response.json({ error: 'off' }, { status: 503, headers: cors })
      if (!(await hit(env.RATE, dayKey(ip, 'up'), 8, 86400))) return Response.json({ error: 'limit' }, { status: 429, headers: cors })
      const buf = await req.arrayBuffer()
      const type = req.headers.get('Content-Type') ?? ''
      if (!/^image\/(jpeg|png|webp)$/.test(type) || buf.byteLength > 1_500_000) return Response.json({ error: 'bad image' }, { status: 400, headers: cors })
      const k = `${crypto.randomUUID()}.${type.split('/')[1]}`
      await env.REFS.put(k, buf, { httpMetadata: { contentType: type } })
      return Response.json({ url: `${env.PUBLIC_URL}/ref/${k}` }, { headers: cors })
    }

    let body: { messages?: unknown; booking?: Booking }
    try { body = await req.json() } catch { return new Response('Bad JSON', { status: 400, headers: cors }) }

    // The site's booking form
    if (url.pathname === '/request') {
      const b = body.booking
      if (!b || typeof b.name !== 'string' || typeof b.contact !== 'string') return new Response('Bad booking', { status: 400, headers: cors })
      const clean = (v: unknown, n = 300) => String(v ?? '').slice(0, n)
      const out = await submitRequest(env, {
        name: clean(b.name, 80), idea: clean(b.idea), zone: clean(b.zone, 80), size: clean(b.size, 80), slot: clean(b.slot, 120),
        slot_start: clean(b.slot_start, 40), contact: clean(b.contact, 60), notes: clean(b.notes, 500), deposit_ok: b.deposit_ok === true,
      }, { kind: 'web', ip })
      return Response.json(out, { status: out.ok ? 200 : 429, headers: cors })
    }

    // The website assistant
    const history = sanitize(env, body.messages)
    if (!history) return new Response('Bad messages', { status: 400, headers: cors })
    if (!(await hit(env.RATE, hourKey(ip, 'chat'), LIMITS.chatPerHour, 3600)) || !(await hit(env.RATE, dayKey(ip, 'chatd'), LIMITS.chatPerDay, 86400))) {
      return Response.json({ error: 'limit', reply: `Llegaste al límite de mensajes por ahora. Probá más tarde o escribí por Instagram ${IG_HANDLE}.` }, { status: 429, headers: cors })
    }
    try {
      return Response.json(await chat(env, history, { kind: 'web', ip }), { headers: cors })
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) return Response.json({ error: 'busy' }, { status: 429, headers: cors })
      if (e instanceof Anthropic.APIError) return Response.json({ error: 'upstream', status: e.status }, { status: 502, headers: cors })
      return Response.json({ error: 'failed' }, { status: 500, headers: cors })
    }
  },

  async scheduled(_: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(daily(env))
  },
}
