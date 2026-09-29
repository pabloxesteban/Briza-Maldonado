// Writes "Pendiente" events to Briza's private requests calendar through a Google service account.
// The service account only needs "Make changes to events" on that one calendar.
type ServiceAccount = { client_email: string; private_key: string }

const b64url = (buf: ArrayBuffer | string) => {
  const bytes = typeof buf === 'string' ? new TextEncoder().encode(buf) : new Uint8Array(buf)
  let s = ''
  bytes.forEach(b => { s += String.fromCharCode(b) })
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

let cached: { token: string; exp: number } | null = null

async function accessToken(sa: ServiceAccount): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token
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

export async function createPendingEvent(saJson: string, calendarId: string, ev: {
  title: string; description: string; start?: string; minutes?: number
}) {
  const sa = JSON.parse(saJson) as ServiceAccount
  const token = await accessToken(sa)
  const TZ = 'America/Argentina/Buenos_Aires'
  let when: Record<string, unknown>
  if (ev.start && !Number.isNaN(Date.parse(ev.start))) {
    const s = new Date(ev.start)
    when = { start: { dateTime: s.toISOString(), timeZone: TZ }, end: { dateTime: new Date(s.getTime() + (ev.minutes ?? 150) * 60e3).toISOString(), timeZone: TZ } }
  } else {
    // No date chosen: an all-day note on today so Briza sees it right away
    const d = new Date().toLocaleDateString('en-CA', { timeZone: TZ })
    when = { start: { date: d }, end: { date: d } }
  }
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: ev.title, description: ev.description, colorId: '5', ...when,
      reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 0 }] },
    }),
  })
  if (!res.ok) throw new Error(`calendar insert ${res.status}`)
  const data = await res.json() as { htmlLink?: string }
  return data.htmlLink ?? ''
}
