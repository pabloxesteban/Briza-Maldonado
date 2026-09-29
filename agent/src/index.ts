// Briza's booking assistant: a Cloudflare Worker that runs a Claude tool-use loop.
// It answers questions, reads open slots from Briza's Google Calendar and flash list, and prepares a
// booking request. It never books on its own: the request goes to Briza on WhatsApp and she decides.
import Anthropic from '@anthropic-ai/sdk'
import { FLASHES } from './flashes'
import { createPendingEvent } from './gcal-write'

interface Env {
  ANTHROPIC_API_KEY: string
  GCAL_ID?: string
  GCAL_KEY?: string
  // Private calendar where booking requests land as "Pendiente" + service account key JSON that can write to it
  GCAL_PENDING_ID?: string
  GOOGLE_SA_JSON?: string
  ALLOWED_ORIGIN: string
  WHATSAPP: string
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
- No confirmás turnos: Briza tiene la última palabra. Decí siempre que la solicitud queda pendiente hasta que Briza la confirme por WhatsApp.
- Diseños propios: el precio lo cotiza Briza según tamaño y detalle; no des cifras.
- Si preguntan algo médico, legal o que no sabés, sugerí consultarlo con Briza por WhatsApp.
- No hables de temas ajenos al estudio.`

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
    description: 'Prepara la solicitud de turno para que la persona se la envíe a Briza por WhatsApp. No confirma nada: Briza decide.',
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
      },
      required: ['name', 'idea', 'zone', 'size', 'slot', 'slot_start', 'contact', 'notes'],
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

type Booking = { name: string; idea: string; zone: string; size: string; slot: string; slot_start: string; contact: string; notes: string }

async function requestBooking(env: Env, b: Booking) {
  const text = [
    `Hola Bri! Soy ${b.name} y quiero un turno ✦`,
    '',
    `• Idea: ${b.idea}`,
    `• Zona: ${b.zone}`,
    `• Tamaño: ${b.size}`,
    `• Turno: ${b.slot} (¿me lo confirmás?)`,
    ...(b.notes ? [`• Notas: ${b.notes}`] : []),
    '',
    '(Lo armé con la asistente de la web)',
  ].join('\n')
  const url = `https://wa.me/${env.WHATSAPP}?text=${encodeURIComponent(text)}`

  // Heads-up for Briza: a "Pendiente" event in her private requests calendar, whether or not the
  // visitor ends up sending the WhatsApp. She approves by replying and editing the event.
  let pending = false
  if (env.GCAL_PENDING_ID && env.GOOGLE_SA_JSON) {
    const phone = b.contact.replace(/[^\d]/g, '')
    try {
      await createPendingEvent(env.GOOGLE_SA_JSON, env.GCAL_PENDING_ID, {
        title: `⏳ Pendiente · ${b.name} · ${b.idea}`.slice(0, 120),
        start: b.slot_start,
        description: [
          'Solicitud desde la asistente de la web. Confirmala o rechazala respondiendo por WhatsApp.',
          '',
          `Nombre: ${b.name}`,
          `Contacto: ${b.contact}${phone ? ` → https://wa.me/${phone}` : ''}`,
          `Idea: ${b.idea}`,
          `Zona: ${b.zone}`,
          `Tamaño: ${b.size}`,
          `Turno pedido: ${b.slot}`,
          ...(b.notes ? [`Notas: ${b.notes}`] : []),
          '',
          'Al confirmarlo: borrá "⏳ Pendiente" del título y el evento "Libre" de ese horario en el calendario de turnos.',
        ].join('\n'),
      })
      pending = true
    } catch { /* the WhatsApp message still carries everything */ }
  }
  return {
    ok: true, whatsapp_url: url, summary: text, briza_notified: pending,
    note: pending
      ? 'Briza ya recibió el aviso en su calendario como pendiente. Decile que también puede tocar el botón para escribirle por WhatsApp, y que el turno se confirma cuando Briza responda.'
      : 'Mostrale el resumen y decile que toque el botón para enviárselo a Briza. Queda pendiente hasta que ella confirme.',
  }
}

async function runTool(env: Env, name: string, input: unknown, turn: { bookings: number }): Promise<{ result: unknown; action?: { whatsapp_url: string; summary: string } }> {
  switch (name) {
    case 'get_open_slots': return { result: await getOpenSlots(env, input as { from_date: string; days: number }) }
    case 'list_flashes': return { result: FLASHES }
    case 'request_booking': {
      if (turn.bookings++ >= 1) return { result: { error: 'Ya se envió una solicitud en esta respuesta.' } }
      const r = await requestBooking(env, input as Booking)
      return { result: r, action: { whatsapp_url: r.whatsapp_url, summary: r.summary } }
    }
    default: return { result: { error: `Herramienta desconocida: ${name}` } }
  }
}

// ─── The loop ─────────────────────────────────────────────────────────────
async function chat(env: Env, history: Msg[]) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  const messages: Msg[] = history.slice(-MAX_HISTORY)
  const turn = { bookings: 0 } // one booking request per visitor message
  let action: { whatsapp_url: string; summary: string } | undefined

  const today = new Date().toLocaleDateString('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  for (let step = 0; step < MAX_STEPS; step++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
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
      return { messages, reply: 'Eso no lo puedo responder por acá. Escribile a Briza por WhatsApp y te ayuda.', action }
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
        const r = await runTool(env, u.name, u.input, turn)
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

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
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

    let body: { messages?: unknown }
    try { body = await req.json() } catch { return new Response('Bad JSON', { status: 400, headers: cors }) }
    const history = sanitize(body.messages)
    if (!history) return new Response('Bad messages', { status: 400, headers: cors })

    try {
      const out = await chat(env, history)
      return Response.json(out, { headers: cors })
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) return Response.json({ error: 'busy' }, { status: 429, headers: cors })
      if (e instanceof Anthropic.APIError) return Response.json({ error: 'upstream', status: e.status }, { status: 502, headers: cors })
      return Response.json({ error: 'failed' }, { status: 500, headers: cors })
    }
  },
}
