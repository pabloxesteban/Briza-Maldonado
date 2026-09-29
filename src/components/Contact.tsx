'use client'

import { useEffect, useRef, useState } from 'react'
import BookingCalendar from './BookingCalendar'

const INSTAGRAM = 'bri.t4tts'
// Requests go to the booking worker (agent/): pending event + WhatsApp notice to Briza. Her number never reaches the site.
const AGENT = process.env.NEXT_PUBLIC_AGENT_URL

type Answers = {
  idea: string; detail: string
  zone: string; size: string
  when: string
  name: string
  phone: string // Instagram user, or WhatsApp as last resort
  useWa: boolean
  email: string
  news: boolean
  slotStart: string
  deposit: boolean
}

const EMPTY: Answers = { idea: '', detail: '', zone: '', size: '', when: '', name: '', phone: '', useWa: false, email: '', news: false, slotStart: '', deposit: false }

const IDEAS = ['Un flash del cuaderno', 'Un diseño propio', 'Todavía no sé']
const ZONES = ['Brazo', 'Antebrazo', 'Pierna', 'Costilla', 'Espalda', 'Otra zona']
const SIZES = ['Chico · 5–9 cm', 'Mediano · 10–15 cm', 'Grande · +15 cm']
const WHEN = ['Lo antes posible', 'Este mes', 'Próximos meses', 'Sin apuro']

const STEPS = ['La idea', 'Zona y tamaño', 'Turno', 'Vos'] as const

function buildMessage(a: Answers) {
  return [
    `Hola Bri! Soy ${a.name.trim()} y quiero un turno ✦`,
    '',
    `• Idea: ${a.idea}${a.detail.trim() ? ` — ${a.detail.trim()}` : ''}`,
    `• Zona: ${a.zone}`,
    `• Tamaño: ${a.size}`,
    /a las/.test(a.when) ? `• Turno: ${a.when} (¿me lo confirmás?)` : `• Cuándo: ${a.when}`,
    '',
    'Acepto la seña del 40% para reservar.',
    'Te mando referencias por acá.',
  ].join('\n')
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      data-hover
      className="book-chip"
      style={{
        padding: '0.8rem 1.15rem',
        border: `1px solid ${on ? 'var(--ink)' : 'rgba(22,20,20,0.2)'}`,
        background: on ? 'var(--ink)' : 'transparent',
        color: on ? 'var(--bg)' : 'var(--ink)',
        borderRadius: 999,
        fontFamily: 'var(--font-body)',
        fontSize: '0.92rem',
        lineHeight: 1,
        transition: 'background .35s var(--ease), color .35s var(--ease), border-color .35s var(--ease)',
      }}
    >
      {label}
    </button>
  )
}

function Question({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="font-display" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '1.6rem' }}>
      <span style={{ fontSize: '0.45em', verticalAlign: 'top', color: 'var(--mark)', marginRight: '0.6em', fontStyle: 'normal', letterSpacing: 0 }}>{n}</span>
      {children}
    </p>
  )
}

const label: React.CSSProperties = { fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '0.9rem' }

export default function Contact() {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(EMPTY)
  const [done, setDone] = useState<null | 'sent' | 'instagram'>(null)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [copied, setCopied] = useState(false)
  const [flashes, setFlashes] = useState<string[]>([])
  // Reference photos (the try-on picture, or ones the client picks) as data URLs
  const [refs, setRefs] = useState<string[]>([])
  const [attach, setAttach] = useState(true)
  const addRefs = (files: FileList | null) => {
    Array.from(files ?? []).slice(0, 3 - refs.length).forEach(f => {
      const img = new window.Image()
      img.onload = () => {
        const k = Math.min(1, 1280 / Math.max(img.width, img.height))
        const c = document.createElement('canvas'); c.width = img.width * k; c.height = img.height * k
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        setRefs(r => [...r, c.toDataURL('image/jpeg', 0.82)].slice(0, 3)); setAttach(true)
        URL.revokeObjectURL(img.src)
      }
      img.src = URL.createObjectURL(f)
    })
  }
  const nameRef = useRef<HTMLInputElement>(null)
  const set = (k: 'idea' | 'detail' | 'zone' | 'size' | 'when' | 'name' | 'phone' | 'email') => (v: string) => setA(p => ({ ...p, [k]: v, ...(k === 'when' ? { slotStart: '' } : {}) }))

  const ready = [
    !!a.idea,
    !!a.zone && !!a.size,
    !!a.when,
    a.name.trim().length > 1 && (a.useWa ? a.phone.replace(/\D/g, '').length >= 8 : /^@?[a-z0-9._]{2,30}$/i.test(a.phone.trim())) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim()) && a.deposit,
  ][step]

  useEffect(() => {
    if (step === 3) setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 350)
  }, [step])

  // Pre-select the idea when a flash asks for it (see Flash notebook)
  useEffect(() => {
    const onPick = (e: Event) => {
      const d = (e as CustomEvent<string | string[] | { names: string[]; preview?: string }>).detail
      const names = typeof d === 'string' ? [d] : Array.isArray(d) ? d : d.names
      if (d && typeof d === 'object' && !Array.isArray(d) && d.preview) { setRefs([d.preview]); setAttach(true) }
      setFlashes(names)
      setA(p => ({ ...p, idea: 'Un flash del cuaderno', detail: names.join(' + ') }))
      setStep(0); setDone(null)
    }
    const onIdea = (e: Event) => {
      setA(p => ({ ...p, idea: 'Un diseño propio', detail: (e as CustomEvent<string>).detail }))
      setStep(0); setDone(null)
    }
    window.addEventListener('book:flash', onPick)
    window.addEventListener('book:idea', onIdea)
    return () => { window.removeEventListener('book:flash', onPick); window.removeEventListener('book:idea', onIdea) }
  }, [])

  const send = async (via: 'sent' | 'instagram') => {
    const msg = buildMessage(a)
    if (via === 'sent' && AGENT) {
      setSending(true); setSendError('')
      try {
        // Upload the references first (the worker stores them and links them in Briza's notice)
        const refUrls: string[] = []
        if (attach) for (const r of refs) {
          const blob = await (await fetch(r)).blob()
          const up = await fetch(`${AGENT}/upload`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: blob })
          const j = await up.json().catch(() => ({})) as { url?: string }
          if (j.url) refUrls.push(j.url)
        }
        const res = await fetch(`${AGENT}/request`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking: {
            name: a.name.trim(), contact: a.phone, idea: `${a.idea}${a.detail.trim() ? ` — ${a.detail.trim()}` : ''}`,
            zone: a.zone, size: a.size, slot: a.when, slot_start: a.slotStart, notes: '', deposit_ok: a.deposit,
            email: a.email.trim(), newsletter: a.news, refs: refUrls,
          } }),
        })
        const out = await res.json() as { ok: boolean; error?: string }
        if (!out.ok) throw new Error(out.error || 'No se pudo enviar')
        setDone('sent')
      } catch (e) {
        setSendError((e as Error).message || 'No se pudo enviar. Probá por Instagram.')
      } finally { setSending(false) }
      return
    }
    // Instagram DMs can't be pre-filled, so the message goes to the clipboard first
    try { await navigator.clipboard.writeText(msg); setCopied(true) } catch { setCopied(false) }
    window.open(`https://ig.me/m/${INSTAGRAM}`, '_blank', 'noopener')
    setDone('instagram')
  }

  const next = () => { if (ready && step < 3) setStep(s => s + 1) }

  return (
    <section
      id="turno"
      data-cursor="book"
      className="booking"
      style={{
        borderTop: '1px solid rgba(22,20,20,0.1)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.25rem, 4vw, 2.5rem)',
        minHeight: '90vh',
      }}
    >
      <div className="booking-grid">
        {/* Left: title, progress and a live ticket of what will be sent */}
        <div className="bk-left">
          <h2 className="bk-title">Hagamos <span className="swash">algo tuyo.</span></h2>
          <p className="bk-lede">Cuatro preguntas rápidas y tu solicitud me llega al instante. Te respondo en 24–48 h.</p>

          {!done && (
            <div className="bk-progress" aria-label={`Paso ${step + 1} de 4`}>
              <div className="bk-progress-top"><span>Paso {step + 1} de 4 · {STEPS[step]}</span><b>{Math.round(((step + (ready ? 1 : 0)) / 4) * 100)}%</b></div>
              <div className="bk-track"><span style={{ transform: `scaleX(${(step + (ready ? 1 : 0)) / 4})` }} /></div>
            </div>
          )}

          <div className="bk-ticket" aria-live="polite">
            <p className="bk-ticket-head"><span>Tu pedido</span><span className="swash">Briza</span></p>
            {([
              ['Idea', a.idea ? `${a.idea}${a.detail.trim() ? ` — ${a.detail.trim()}` : ''}` : ''],
              ['Zona', a.zone],
              ['Tamaño', a.size],
              ['Turno', a.when],
              ['Nombre', a.name.trim()],
            ] as const).map(([k, v], i) => (
              <button key={k} type="button" className={`bk-row ${v ? 'filled' : ''}`} disabled={done !== null || !v}
                onClick={() => setStep([0, 1, 1, 2, 3][i])} data-hover>
                <span className="bk-k">{k}</span>
                <span className="bk-v">{v || '—'}</span>
              </button>
            ))}
            <p className="bk-ticket-foot">Palermo, CABA · Seña del 40% para reservar</p>
          </div>

          <p className="bk-alt">¿Preferís escribir directo? <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">@{INSTAGRAM} ↗</a></p>
        </div>

        {/* Right: one question at a time */}
        <div style={{ minHeight: '26rem' }}>
          {done ? (
            <div key="done" className="book-reveal">
              <Question n="✦">{done === 'sent' ? 'Listo, Briza recibió tu solicitud.' : 'Listo, se abrió Instagram.'}</Question>
              <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--ink-muted)', maxWidth: '30rem', marginBottom: '2rem' }}>
                {done === 'sent'
                  ? 'Queda pendiente hasta que Briza la confirme: te responde por Instagram en 24–48 h y te llega la confirmación por mail, con el link de Mercado Pago para la seña del 40%.'
                  : copied
                    ? 'Copié tu mensaje: pegalo en el chat y sumá tus referencias.'
                    : 'Escribime en el chat con tu idea, zona, tamaño y cuándo te gustaría.'}
              </p>
              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                {done === 'instagram' && <button type="button" className="book-link" data-hover onClick={() => send('instagram')}>Abrir de nuevo ↗</button>}
                <button type="button" className="book-link" data-hover onClick={() => { setDone(null); setStep(0); setA(EMPTY) }}>Empezar otra consulta</button>
              </div>
            </div>
          ) : (
            <form key={step} className="book-reveal" onSubmit={e => { e.preventDefault(); next() }}>
              {step === 0 && (
                <>
                  {a.idea === 'Un flash del cuaderno' && flashes.length > 0 && (
                    <div className="book-picked">
                      <p style={label}>{flashes.length > 1 ? 'Flashes que querés reservar' : 'Flash que querés reservar'}</p>
                      <ul>
                        {flashes.map(n => (
                          <li key={n}>✦ {n}
                            <button type="button" aria-label={`Quitar ${n}`} onClick={() => {
                              const rest = flashes.filter(x => x !== n)
                              setFlashes(rest)
                              setA(p => ({ ...p, detail: rest.join(' + '), idea: rest.length ? p.idea : '' }))
                            }}>✕</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="book-refs">
                    <p style={label}>Referencias (opcional)</p>
                    <div className="book-refs-row">
                      {refs.map((r, k) => (
                        <span key={k} className="book-ref"><img src={r} alt={`Referencia ${k + 1}`} />
                          <button type="button" aria-label="Quitar referencia" onClick={() => setRefs(x => x.filter((_, j) => j !== k))}>✕</button></span>
                      ))}
                      {refs.length < 3 && (
                        <label className="book-ref-add">+ Adjuntar foto<input type="file" accept="image/*" multiple onChange={e => { addRefs(e.target.files); e.target.value = '' }} /></label>
                      )}
                    </div>
                    {refs.length > 0 && (
                      <label className="book-deposit" style={{ marginTop: '.6rem' }}>
                        <input type="checkbox" checked={attach} onChange={e => setAttach(e.target.checked)} />
                        <span>Enviar {refs.length > 1 ? 'estas fotos' : 'esta foto'} a Briza como referencia{flashes.length ? ' (tu prueba con el flash)' : ''}.</span>
                      </label>
                    )}
                  </div>
                  <Question n="01">¿Qué tenés en mente?</Question>
                  <div className="book-chips">
                    {IDEAS.map(o => <Chip key={o} label={o} on={a.idea === o} onClick={() => set('idea')(o)} />)}
                  </div>
                  <label style={{ display: 'block', marginTop: '2rem' }}>
                    <p style={label}>Contame un poco (opcional)</p>
                    <input className="book-input" value={a.detail} onChange={e => set('detail')(e.target.value)}
                      placeholder={a.idea === 'Un flash del cuaderno' ? 'Ej: la golondrina' : 'Ej: una rosa con daga, estilo traditional'} />
                  </label>
                </>
              )}
              {step === 1 && (
                <>
                  <Question n="02">¿Dónde y de qué tamaño?</Question>
                  <p style={label}>Zona</p>
                  <div className="book-chips">
                    {ZONES.map(o => <Chip key={o} label={o} on={a.zone === o} onClick={() => set('zone')(o)} />)}
                  </div>
                  <p style={{ ...label, marginTop: '2rem' }}>Tamaño aproximado</p>
                  <div className="book-chips">
                    {SIZES.map(o => <Chip key={o} label={o} on={a.size === o} onClick={() => set('size')(o)} />)}
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <Question n="03">Elegí tu turno</Question>
                  <BookingCalendar value={a.when} onPick={(label, start) => setA(p => ({ ...p, when: label, slotStart: start }))} />
                  <p style={{ ...label, marginTop: '1.8rem' }}>¿Ninguno te sirve? Decime cuándo</p>
                  <div className="book-chips">
                    {WHEN.map(o => <Chip key={o} label={o} on={a.when === o} onClick={() => set('when')(o)} />)}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', marginTop: '2rem' }}>Tatúo en Palermo, CABA.</p>
                </>
              )}
              {step === 3 && (
                <>
                  <Question n="04">¿Cómo te llamás?</Question>
                  <input ref={nameRef} className="book-input" value={a.name} onChange={e => set('name')(e.target.value)} placeholder="Tu nombre" autoComplete="given-name" />
                  <p style={{ ...label, marginTop: '2rem' }}>{a.useWa ? 'Tu WhatsApp' : 'Tu Instagram (Briza te escribe por ahí)'}</p>
                  <input key={a.useWa ? 'wa' : 'ig'} className="book-input" value={a.phone} onChange={e => set('phone')(e.target.value)}
                    placeholder={a.useWa ? '11 1234 5678' : '@tuusuario'} autoCapitalize="none" inputMode={a.useWa ? 'tel' : 'text'} />
                  <button type="button" className="book-alt-contact" onClick={() => setA(p => ({ ...p, useWa: !p.useWa, phone: '' }))}>
                    {a.useWa ? '← Mejor por Instagram' : 'No tengo / no uso Instagram → dejar WhatsApp'}
                  </button>
                  <p style={{ ...label, marginTop: '2rem' }}>Tu mail (para la confirmación del turno)</p>
                  <input className="book-input" type="email" value={a.email} onChange={e => set('email')(e.target.value)} placeholder="vos@mail.com" autoComplete="email" />
                  <label className="book-deposit">
                    <input type="checkbox" checked={a.news} onChange={e => setA(p => ({ ...p, news: e.target.checked }))} />
                    <span>Quiero enterarme de <b>descuentos y próximos eventos</b> de Briza (opcional).</span>
                  </label>
                  <label className="book-deposit">
                    <input type="checkbox" checked={a.deposit} onChange={e => setA(p => ({ ...p, deposit: e.target.checked }))} />
                    <span>Entiendo que el turno se reserva con una <b>seña de al menos el 40%</b> del costo total.</span>
                  </label>
                  <div className="book-chips" style={{ marginTop: '1.6rem' }}>
                    {AGENT && <button type="button" className="book-send" data-hover disabled={!ready || sending} onClick={() => send('sent')}>{sending ? 'Enviando…' : 'Enviar solicitud ●'}</button>}
                    <button type="button" className={`book-send ${AGENT ? 'ghost' : ''}`} data-hover disabled={!ready} onClick={() => send('instagram')}>Por Instagram ↗</button>
                  </div>
                  {sendError && <p className="book-error">{sendError}</p>}
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', marginTop: '2.6rem' }}>
                {step > 0 && <button type="button" className="book-link" data-hover onClick={() => setStep(s => s - 1)}>← Atrás</button>}
                {step < 3 && <button type="submit" className="book-send" data-hover disabled={!ready}>Seguir →</button>}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
