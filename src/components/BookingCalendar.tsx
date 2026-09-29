'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchSlots, type Slot } from '@/lib/calendar'

const WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const hhmm = (d: Date) => d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

export const slotLabel = (s: Date) =>
  `${DAYS[s.getDay()]} ${s.getDate()}/${s.getMonth() + 1} a las ${hhmm(s)}`

// Month view of Briza's open slots (from her Google Calendar). Pick a day, then a time.
export default function BookingCalendar({ value, onPick }: { value: string; onPick: (label: string, startISO: string) => void }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [error, setError] = useState(false)
  const [day, setDay] = useState<string | null>(null)

  // Load three months ahead once
  useEffect(() => {
    const to = new Date(today.getFullYear(), today.getMonth() + 3, 1)
    fetchSlots(today, to).then(setSlots).catch(() => { setError(true); setSlots([]) })
  }, [today])

  const byDay = useMemo(() => {
    const m = new Map<string, Slot[]>()
    for (const s of slots ?? []) { const k = key(s.start); m.set(k, [...(m.get(k) ?? []), s]) }
    return m
  }, [slots])

  // Jump to the first month that has something free
  useEffect(() => {
    if (!slots?.length) return
    const f = slots[0].start
    setMonth(new Date(f.getFullYear(), f.getMonth(), 1))
  }, [slots])

  const cells = useMemo(() => {
    const first = (month.getDay() + 6) % 7
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  }, [month])

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1)
  const shift = (d: number) => { setMonth(m => new Date(m.getFullYear(), m.getMonth() + d, 1)); setDay(null) }
  const times = day ? byDay.get(day) ?? [] : []

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="cal-arrow" aria-label="Mes anterior" disabled={month <= minMonth} onClick={() => shift(-1)}>←</button>
        <p className="cal-month">{MONTHS[month.getMonth()]} <span>{month.getFullYear()}</span></p>
        <button type="button" className="cal-arrow" aria-label="Mes siguiente" disabled={month >= maxMonth} onClick={() => shift(1)}>→</button>
      </div>

      <div className="cal-grid" role="grid">
        {WEEK.map((w, i) => <span key={i} className="cal-wd">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />
          const k = key(d)
          const free = byDay.get(k)?.length ?? 0
          const past = d < today
          return (
            <button key={i} type="button" disabled={!free || past}
              className={`cal-day ${free && !past ? 'free' : ''} ${day === k ? 'on' : ''} ${key(today) === k ? 'today' : ''}`}
              onClick={() => setDay(k)} aria-label={`${d.getDate()} ${MONTHS[d.getMonth()]}${free ? `, ${free} turnos` : ''}`}>
              {d.getDate()}
              {free > 0 && !past && <i aria-hidden />}
            </button>
          )
        })}
      </div>

      {slots === null && <p className="cal-note">Cargando turnos…</p>}
      {slots !== null && !slots.length && (
        <p className="cal-note">{error ? 'No pude cargar el calendario ahora.' : 'Por ahora no hay turnos publicados.'} Elegí abajo cuándo te gustaría y Briza te propone una fecha.</p>
      )}

      {day && (
        <div className="cal-times" key={day}>
          <p className="cal-times-lbl">Horarios libres</p>
          <div className="book-chips">
            {times.map(s => {
              const label = slotLabel(s.start)
              return (
                <button key={s.start.toISOString()} type="button" aria-pressed={value === label}
                  className={`cal-time ${value === label ? 'on' : ''}`} onClick={() => onPick(label, s.start.toISOString())}>{hhmm(s.start)}</button>
              )
            })}
          </div>
        </div>
      )}

      {value && byDay.size > 0 && /a las/.test(value) && (
        <p className="cal-picked">✦ Elegiste <b>{value}</b>. Queda pendiente hasta que Briza lo confirme.</p>
      )}
    </div>
  )
}
