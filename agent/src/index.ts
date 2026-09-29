// Briza's booking assistant: a Cloudflare Worker that runs a Claude tool-use loop.
// It answers questions, reads open slots and flashes, and books requests that stay "Pendiente" until
// Briza accepts or rejects them from the WhatsApp notice she receives. Her number never reaches the site.
import Anthropic from '@anthropic-ai/sdk'
import { FLASHES } from './flashes'
import { FAQ } from './faq'
import { createPending, getEvent, retitle, removeFreeSlot } from './gcal-write'
import { whatsappToBriza } from './notify'
import { LIMITS, hit, hourKey, dayKey } from './limits'

interface Env {
  ANTHROPIC_API_KEY: string
  GCAL_ID?: string
  GCAL_KEY?: string
  // Private calendar where booking requests land as "Pendiente" + service account key JSON that can write to it
  GCAL_PENDING_ID?: string
  GOOGLE_SA_JSON?: string
  ALLOWED_ORIGIN: string
  // Briza's WhatsApp (secret, never sent to the browser) + CallMeBot key for her notices
  BRIZA_PHONE?: string
  CALLMEBOT_KEY?: string
  // Signs the accept/reject links; public URL of this worker for those links
  DECIDE_SECRET: string
  PUBLIC_URL: string
  RATE?: KVNamespace
}

type Msg = Anthropic.Beta.BetaMessageParam

const MODEL = 'claude-opus-5-5'
const MAX_HISTORY = 40 // messages kept per conversation
const MAX_STEPS = 6 // tool rounds per user turn
const TZ = 'America/Argentina/Buenos_Aires'

const SYSTEM = `Sos la asistente virtual de Briza Maldonado, tatuadora traditional en Palermo, Buenos Aires (vegan tattoo artist, black & white y color). Hablás en español rioplatense, cálida y breve (2-4 oraciones), sin emojis de más.

Qué hacés:
- Respondés dudas sobre tatuajes con Briza: estilos, flashes disponibles (usá list_flashes, no inventes precios), cuidados básicos y cómo se reserva.
- Ayudás a elegir turno: usá get_open_slots y ofrecé 2-4 opciones concretas. Nunca inventes horarios.
- Cuando la persona tenga idea (o flash), zona, tamaño aproximado, un turno elegido (o "lo antes posible"), su nombre y su WhatsApp, llamá a request_booking una sola vez. Pedí de a uno los datos que falten.

Reglas:
- Podés reservar con request_booking, pero la reserva queda PENDIENTE: Briza la acepta o la rechaza y le escribe a la persona a su WhatsApp. Nunca digas que un turno está confirmado.
- Antes de reservar, avisá siempre que todas las reservas se confirman con una seña de al menos el 40% del costo total, y pedí que lo acepte.
- Nunca des el número de teléfono de Briza: el contacto es por esta solicitud o por Instagram (@bri.t4tts).
- Diseños propios: el precio lo cotiza Briza según tamaño y detalle; no des cifras.
- Si preguntan algo médico, legal o que no sabés, sugerí consultarlo con Briza por WhatsApp.
- No hables de temas ajenos al estudio.`

const FAQ_TEXT = FAQ.map(f => `- ${f.q}: ${f.a || '(sin definir: decí que eso lo confirma Briza al responder la solicitud)'}`).join('\n')
const SYSTEM_FULL = `${SYSTEM}\n\nRespuestas de Briza a preguntas frecuentes (usalas, no inventes otras):\n${FAQ_TEXT}`

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: 'get_open_slots',
    description: 'Lista los turnos libres publicados por Briza en su calendario (horario de Buenos Aires). Usala antes de ofrecer fechas.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        from_date: { type: 'string', description: 'Fecha desde, YYYY-MM-DD. Vacío = hoy.' },
        days: { type: 'integer', description: 'Cuántos días mirar hacia adelante (1-60).' },
      },
      required: ['from_date', 'days'],
      additionalProperties: false,
    },
  },
  {
    name: 'list_flashes',
    description: 'Lista los flashes del cuaderno con tamaño, precio y si siguen disponibles.',
    strict: true,
    input_schema: { type: 'object', properties: {}, required: [], additionalProperties: false },
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
        slot: { type: 'string', description: 'Turno elegido tal como lo devolvió get_open_slots (label), o "lo antes posible" / "sin fecha".' },
        slot_start: { type: 'string', description: 'El campo start (ISO) del turno elegido en get_open_slots; vacío si no eligió uno.' },
        contact: { type: 'string', description: 'WhatsApp de la persona para que Briza le responda.' },
        notes: { type: 'string', description: 'Otros detalles útiles; vacío si no hay.' },
        deposit_ok: { type: 'boolean', description: 'true si la persona aceptó la seña del 40%.' },
      },
      required: ['name', 'idea', 'zone', 'size', 'slot', 'slot_start', 'contact', 'notes', 'deposit_ok'],
      additionalProperties: false,
    },
  },
]

// ─── Tools ────────────────────────────────────────────────────────────────
const fmt = (d: Date) => d.toLocaleString('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

async function getOpenSlots(env: Env, input: { from_date: string; days: number }) {
  if (!env.GCAL_ID || !env.GCAL_KEY) return { slots: [], note: 'El calendario todavía no está conectado: ofrecé coordinar la fecha con Briza por WhatsApp.' }
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
  return { slots, note: slots.length ? '' : 'No hay turnos publicados en ese rango.' }
}

export type Booking = { name: string; idea: string; zone: string; size: string; slot: string; slot_start: string; contact: string; notes: string; deposit_ok: boolean }

const hmac = async (secret: string, msg: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(sig).slice(0, 16), b => b.toString(16).padStart(2, '0')).join('')
}

// Shared by the assistant and the site's form: pending event + WhatsApp notice to Briza
export async function submitRequest(env: Env, b: Booking, ip: string) {
  if (!b.deposit_ok) return { ok: false, error: 'Falta que la persona acepte la seña del 40%.' }
  const phone = b.contact.replace(/[^\d]/g, '')
  if (phone.length < 8) return { ok: false, error: 'Falta un WhatsApp válido para que Briza pueda responder.' }
  if (!(await hit(env.RATE, dayKey(ip, 'req'), LIMITS.requestsPerDay, 86400))) {
    return { ok: false, error: 'Ya se enviaron varias solicitudes hoy desde esta conexión. Si necesitás algo más, escribí por Instagram @bri.t4tts.' }
  }
  const lines = [
    `Nombre: ${b.name}`, `WhatsApp: ${b.contact} → https://wa.me/${phone}`, `Idea: ${b.idea}`,
    `Zona: ${b.zone}`, `Tamaño: ${b.size}`, `Turno pedido: ${b.slot}`, 'Seña 40%: aceptada',
    ...(b.notes ? [`Notas: ${b.notes}`] : []),
  ]
  let eventId = ''
  if (env.GCAL_PENDING_ID && env.GOOGLE_SA_JSON) {
    try {
      eventId = await createPending(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, {
        title: `⏳ Pendiente · ${b.name} · ${b.idea}`.slice(0, 120),
        description: ['Solicitud desde la web. Aceptala o rechazala desde el WhatsApp que te llegó.', '', ...lines].join('\n'),
        data: { name: b.name, phone, idea: b.idea, slot: b.slot, start: b.slot_start },
      })
    } catch { /* the WhatsApp notice below still carries everything */ }
  }
  let notified = false
  if (env.BRIZA_PHONE && env.CALLMEBOT_KEY) {
    const links = eventId
      ? await (async () => {
        const base = `${env.PUBLIC_URL}/decide?e=${encodeURIComponent(eventId)}`
        return [`✅ Aceptar: ${base}&a=ok&s=${await hmac(env.DECIDE_SECRET, eventId + 'ok')}`,
          `❌ Rechazar: ${base}&a=no&s=${await hmac(env.DECIDE_SECRET, eventId + 'no')}`]
      })()
      : ['Respondele directo por WhatsApp para aceptar o rechazar.']
    const text = ['⏳ Nueva solicitud de turno', '', ...lines, '', '¿La aceptás o la rechazás?', ...links, '',
      '📅 Acordate de chequear Google Calendar (calendario Solicitudes) antes de decidir.'].join('\n')
    try { await whatsappToBriza(env.BRIZA_PHONE, env.CALLMEBOT_KEY, text); notified = true } catch { /* noop */ }
  }
  return { ok: true, pending: true, notified, summary: ['Solicitud enviada a Briza ✦', '', ...lines.filter(l => !l.startsWith('WhatsApp'))].join('\n') }
}

async function runTool(env: Env, name: string, input: unknown, turn: { bookings: number }, ip: string): Promise<{ result: unknown; action?: { summary: string } }> {
  switch (name) {
    case 'get_open_slots': return { result: await getOpenSlots(env, input as { from_date: string; days: number }) }
    case 'list_flashes': return { result: FLASHES }
    case 'request_booking': {
      if (turn.bookings++ >= 1) return { result: { error: 'Ya se envió una solicitud en esta respuesta.' } }
      const r = await submitRequest(env, input as Booking, ip)
      return { result: r, action: r.ok ? { summary: r.summary! } : undefined }
    }
    default: return { result: { error: `Herramienta desconocida: ${name}` } }
  }
}

// ─── The loop ─────────────────────────────────────────────────────────────
async function chat(env: Env, history: Msg[], ip: string) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  const messages: Msg[] = history.slice(-MAX_HISTORY)
  const turn = { bookings: 0 } // one booking request per visitor message
  let action: { summary: string } | undefined

  const today = new Date().toLocaleDateString('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  for (let step = 0; step < MAX_STEPS; step++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: [
        { type: 'text', text: SYSTEM_FULL, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `Hoy es ${today} (hora de Buenos Aires).` },
      ],
      tools: TOOLS,
      messages,
      output_config: { effort: 'low' }, // short, friendly chat turns
      // Route safety declines to a fallback model instead of stopping
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    } as Anthropic.Beta.MessageCreateParamsNonStreaming)

    messages.push({ role: 'assistant', content: response.content })

    if (response.stop_reason === 'refusal') {
      return { messages, reply: 'Eso no lo puedo responder por acá. Podés escribirle a Briza por Instagram (@bri.t4tts).', action }
    }
    if (response.stop_reason === 'pause_turn') continue
    if (response.stop_reason !== 'tool_use') {
      const reply = response.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text').map(b => b.text).join('\n').trim()
      return { messages, reply, action }
    }

    const uses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use')
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = []
    for (const u of uses) {
      try {
        const r = await runTool(env, u.name, u.input, turn, ip)
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

// Only accept plain user/assistant turns; the last one must be the visitor's new text
function sanitize(raw: unknown): Msg[] | null {
  if (!Array.isArray(raw) || !raw.length || raw.length > 200) return null
  const out = raw.filter((m): m is Msg => !!m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant'))
  const last = out[out.length - 1]
  if (last?.role !== 'user' || typeof last.content !== 'string' || !last.content.trim() || last.content.length > 1500) return null
  return out
}

const page = (title: string, body: string) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><body style="margin:0;font-family:system-ui,sans-serif;background:#F7F1E2;color:#161414;display:grid;place-items:center;min-height:100vh;padding:24px">
<div style="max-width:420px;background:#fffdf7;border-radius:20px;padding:28px;box-shadow:0 20px 50px -25px rgba(0,0,0,.35)">${body}</div></body>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
const esc = (t: string) => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

// Briza taps Aceptar / Rechazar in her WhatsApp notice
async function decide(env: Env, url: URL) {
  const id = url.searchParams.get('e') ?? '', a = url.searchParams.get('a') ?? '', sig = url.searchParams.get('s') ?? ''
  if (!id || !['ok', 'no'].includes(a) || sig !== await hmac(env.DECIDE_SECRET, id + a)) return page('Link inválido', '<h2>Link inválido</h2>')
  if (!env.GOOGLE_SA_JSON || !env.GCAL_PENDING_ID) return page('Falta configuración', '<h2>Falta configurar el calendario</h2>')
  const ev = await getEvent(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, id)
  const d = ev.extendedProperties?.private
  if (!d) return page('Sin datos', '<h2>No encontré la solicitud</h2>')
  const base = ev.summary.replace(/^(⏳ Pendiente|✅ Confirmado|❌ Rechazado)\s*·\s*/, '')
  if (a === 'ok') {
    await retitle(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, id, `✅ Confirmado · ${base}`, '10')
    if (d.start && env.GCAL_ID) { try { await removeFreeSlot(env.GOOGLE_SA_JSON, env.GCAL_ID, d.start) } catch { /* Briza can remove it by hand */ } }
    const msg = `Hola ${d.name}! Soy Briza ✦ Confirmo tu turno para ${d.idea} el ${d.slot}. Para dejarlo reservado necesito una seña del 40% del total; te paso los datos para transferir. ¡Gracias!`
    return page('Turno aceptado', `<h2>✅ Turno aceptado</h2><p>${esc(d.name)} · ${esc(d.idea)} · ${esc(d.slot)}</p><p>Ya lo marqué como confirmado en tu calendario${d.start ? ' y saqué el turno libre de la web' : ''}. Ahora avisale:</p>
<a href="https://wa.me/${d.phone}?text=${encodeURIComponent(msg)}" style="display:block;text-align:center;background:#161414;color:#F7F1E2;padding:14px;border-radius:999px;font-weight:800;text-decoration:none">Escribirle por WhatsApp ↗</a>`)
  }
  await retitle(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, id, `❌ Rechazado · ${base}`, '8')
  const msg = `Hola ${d.name}! Soy Briza ✦ Gracias por escribirme. Ese turno no lo puedo tomar; si querés te propongo otra fecha.`
  return page('Solicitud rechazada', `<h2>❌ Solicitud rechazada</h2><p>${esc(d.name)} · ${esc(d.idea)}</p><p>La marqué como rechazada en tu calendario. Avisale:</p>
<a href="https://wa.me/${d.phone}?text=${encodeURIComponent(msg)}" style="display:block;text-align:center;background:#161414;color:#F7F1E2;padding:14px;border-radius:999px;font-weight:800;text-decoration:none">Escribirle por WhatsApp ↗</a>`)
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    if (req.method === 'GET' && url.pathname === '/decide') return decide(env, url)

    const origin = req.headers.get('Origin') ?? ''
    const allowed = origin === env.ALLOWED_ORIGIN || origin.startsWith('http://localhost')
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    }
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (req.method !== 'POST' || !allowed) return new Response('Not allowed', { status: 403, headers: cors })
    const ip = req.headers.get('CF-Connecting-IP') ?? 'anon'

    let body: { messages?: unknown; booking?: Booking }
    try { body = await req.json() } catch { return new Response('Bad JSON', { status: 400, headers: cors }) }

    // The site's booking form
    if (url.pathname === '/request') {
      const b = body.booking
      if (!b || typeof b.name !== 'string' || typeof b.contact !== 'string') return new Response('Bad booking', { status: 400, headers: cors })
      const clean = (v: unknown, n = 300) => String(v ?? '').slice(0, n)
      const out = await submitRequest(env, {
        name: clean(b.name, 80), idea: clean(b.idea), zone: clean(b.zone, 80), size: clean(b.size, 80), slot: clean(b.slot, 120),
        slot_start: clean(b.slot_start, 40), contact: clean(b.contact, 40), notes: clean(b.notes, 500), deposit_ok: b.deposit_ok === true,
      }, ip)
      return Response.json(out, { status: out.ok ? 200 : 429, headers: cors })
    }

    // The assistant
    const history = sanitize(body.messages)
    if (!history) return new Response('Bad messages', { status: 400, headers: cors })
    if (!(await hit(env.RATE, hourKey(ip, 'chat'), LIMITS.chatPerHour, 3600)) || !(await hit(env.RATE, dayKey(ip, 'chatd'), LIMITS.chatPerDay, 86400))) {
      return Response.json({ error: 'limit', reply: 'Llegaste al límite de mensajes por ahora. Probá más tarde o escribí por Instagram @bri.t4tts.' }, { status: 429, headers: cors })
    }
    try {
      const out = await chat(env, history, ip)
      return Response.json(out, { headers: cors })
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) return Response.json({ error: 'busy' }, { status: 429, headers: cors })
      if (e instanceof Anthropic.APIError) return Response.json({ error: 'upstream', status: e.status }, { status: 502, headers: cors })
      return Response.json({ error: 'failed' }, { status: 500, headers: cors })
    }
  },
}
