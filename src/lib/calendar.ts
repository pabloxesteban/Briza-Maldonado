// Open slots come from Briza's Google Calendar: every event whose title starts with "Libre"
// (e.g. "Libre", "Libre – flash") is a bookable slot. Anything else in the calendar is ignored.
// Needs a public calendar + an API key restricted to the Calendar API and this site's domain.
export type Slot = { start: Date; end: Date }

const ID = process.env.NEXT_PUBLIC_GCAL_ID
const KEY = process.env.NEXT_PUBLIC_GCAL_KEY
export const calendarReady = Boolean(ID && KEY)

export async function fetchSlots(from: Date, to: Date): Promise<Slot[]> {
  if (!calendarReady) return demo(from, to)
  const q = new URLSearchParams({
    key: KEY!, timeMin: from.toISOString(), timeMax: to.toISOString(),
    singleEvents: 'true', orderBy: 'startTime', maxResults: '250', q: 'Libre',
  })
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(ID!)}/events?${q}`)
  if (!res.ok) throw new Error(`calendar ${res.status}`)
  const data = await res.json() as { items?: { summary?: string; start?: { dateTime?: string }; end?: { dateTime?: string } }[] }
  const now = Date.now()
  return (data.items ?? [])
    .filter(e => /^\s*libre/i.test(e.summary ?? '') && e.start?.dateTime && e.end?.dateTime)
    .map(e => ({ start: new Date(e.start!.dateTime!), end: new Date(e.end!.dateTime!) }))
    .filter(s => s.start.getTime() > now)
}

// Until the calendar is connected, `?demo` in the URL shows sample slots so the design can be reviewed.
// Without it, no slots are shown (never fake availability to real clients).
function demo(from: Date, to: Date): Slot[] {
  if (typeof window === 'undefined' || !new URLSearchParams(location.search).has('demo')) return []
  const out: Slot[] = []
  const d = new Date(from); d.setHours(0, 0, 0, 0)
  for (let k = 1; d < to; k++) {
    d.setDate(d.getDate() + 1)
    const wd = d.getDay()
    if (wd === 0 || wd === 1 || k % 3 === 0) continue
    for (const h of wd === 6 ? [12, 15] : [11, 14, 17]) {
      const s = new Date(d); s.setHours(h, 0, 0, 0)
      out.push({ start: s, end: new Date(s.getTime() + 2.5 * 3600e3) })
    }
  }
  return out
}
