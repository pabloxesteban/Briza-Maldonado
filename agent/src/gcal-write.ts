// Google Calendar writes through a service account (Briza shares her calendars with its e-mail,
// "Make changes to events"). Used for the private "Solicitudes" calendar and, on approval, to take
// the matching "Libre" slot off the public "Turnos" calendar.
type ServiceAccount = { client_email: string; private_key: string }

const b64url = (buf: ArrayBuffer | string) => {
  const bytes = typeof buf === 'string' ? new TextEncoder().encode(buf) : new Uint8Array(buf)
  let s = ''
  bytes.forEach(b => { s += String.fromCharCode(b) })
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

let cached: { token: string; exp: number } | null = null

async function accessToken(saJson: string): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token
  const sa = JSON.parse(saJson) as ServiceAccount
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64url(JSON.stringify({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }))
  const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')
  const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${header}.${claims}`))
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${header}.${claims}.${b64url(sig)}` }),
  })
  if (!res.ok) throw new Error(`google token ${res.status}`)
  const data = await res.json() as { access_token: string; expires_in: number }
  cached = { token: data.access_token, exp: Date.now() + data.expires_in * 1000 }
  return data.access_token
}

const API = 'https://www.googleapis.com/calendar/v3/calendars/'
const TZ = 'America/Argentina/Buenos_Aires'

async function call(saJson: string, path: string, init: RequestInit = {}) {
  const token = await accessToken(saJson)
  const res = await fetch(API + path, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) } })
  if (!res.ok) throw new Error(`calendar ${res.status}`)
  return res.status === 204 ? null : res.json()
}

export type PendingData = { name: string; phone: string; idea: string; slot: string; start: string }

export async function createPending(saJson: string, cal: string, ev: { title: string; description: string; data: PendingData }) {
  let when: Record<string, unknown>
  if (ev.data.start && !Number.isNaN(Date.parse(ev.data.start))) {
    const s = new Date(ev.data.start)
    when = { start: { dateTime: s.toISOString(), timeZone: TZ }, end: { dateTime: new Date(s.getTime() + 150 * 60e3).toISOString(), timeZone: TZ } }
  } else {
    // No date chosen: an all-day note on today so Briza sees it right away
    const d = new Date().toLocaleDateString('en-CA', { timeZone: TZ })
    when = { start: { date: d }, end: { date: d } }
  }
  const out = await call(saJson, `${encodeURIComponent(cal)}/events`, {
    method: 'POST',
    body: JSON.stringify({
      summary: ev.title, description: ev.description, colorId: '5', ...when,
      extendedProperties: { private: ev.data },
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 0 }] },
    }),
  }) as { id: string }
  return out.id
}

export async function getEvent(saJson: string, cal: string, id: string) {
  return await call(saJson, `${encodeURIComponent(cal)}/events/${encodeURIComponent(id)}`) as
    { id: string; summary: string; extendedProperties?: { private?: PendingData } }
}

export async function retitle(saJson: string, cal: string, id: string, summary: string, colorId: string) {
  await call(saJson, `${encodeURIComponent(cal)}/events/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ summary, colorId }) })
}

// Take the booked "Libre" slot off the public calendar so nobody else can ask for it
export async function removeFreeSlot(saJson: string, cal: string, startISO: string) {
  const s = new Date(startISO)
  const q = new URLSearchParams({ timeMin: new Date(s.getTime() - 60e3).toISOString(), timeMax: new Date(s.getTime() + 60e3).toISOString(), singleEvents: 'true', q: 'Libre' })
  const list = await call(saJson, `${encodeURIComponent(cal)}/events?${q}`) as { items?: { id: string; summary?: string; start?: { dateTime?: string } }[] }
  for (const e of list.items ?? []) {
    if (/^\s*libre/i.test(e.summary ?? '') && e.start?.dateTime && Math.abs(Date.parse(e.start.dateTime) - s.getTime()) < 60e3) {
      await call(saJson, `${encodeURIComponent(cal)}/events/${encodeURIComponent(e.id)}`, { method: 'DELETE' })
    }
  }
}
