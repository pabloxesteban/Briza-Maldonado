'use client'

import { useEffect, useRef, useState } from 'react'

const WHATSAPP = '5491156233929'
const INSTAGRAM = 'bri.t4tts'

type Answers = {
  idea: string; detail: string
  zone: string; size: string
  when: string
  name: string
}

const EMPTY: Answers = { idea: '', detail: '', zone: '', size: '', when: '', name: '' }

const IDEAS = ['Un flash del cuaderno', 'Un diseño propio', 'Todavía no sé']
const ZONES = ['Brazo', 'Antebrazo', 'Pierna', 'Costilla', 'Espalda', 'Otra zona']
const SIZES = ['Chico · 5–9 cm', 'Mediano · 10–15 cm', 'Grande · +15 cm']
const WHEN = ['Lo antes posible', 'Este mes', 'Próximos meses', 'Sin apuro']

const STEPS = ['La idea', 'Zona y tamaño', 'Cuándo', 'Vos'] as const

function buildMessage(a: Answers) {
  return [
    `Hola Bri! Soy ${a.name.trim()} y quiero un turno ✦`,
    '',
    `• Idea: ${a.idea}${a.detail.trim() ? ` — ${a.detail.trim()}` : ''}`,
    `• Zona: ${a.zone}`,
    `• Tamaño: ${a.size}`,
    `• Cuándo: ${a.when}`,
    '',
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
        border: `1px solid ${on ? 'var(--ink)' : 'rgba(255,255,255,0.2)'}`,
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
  const [done, setDone] = useState<null | 'whatsapp' | 'instagram'>(null)
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const set = (k: keyof Answers) => (v: string) => setA(p => ({ ...p, [k]: v }))

  const ready = [
    !!a.idea,
    !!a.zone && !!a.size,
    !!a.when,
    a.name.trim().length > 1,
  ][step]

  useEffect(() => {
    if (step === 3) setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 350)
  }, [step])

  // Pre-select the idea when a flash asks for it (see Flash notebook)
  useEffect(() => {
    const onPick = (e: Event) => {
      const name = (e as CustomEvent<string>).detail
      setA(p => ({ ...p, idea: 'Un flash del cuaderno', detail: name }))
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

  const send = async (via: 'whatsapp' | 'instagram') => {
    const msg = buildMessage(a)
    if (via === 'whatsapp') {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    } else {
      // Instagram DMs can't be pre-filled, so the message goes to the clipboard first
      try { await navigator.clipboard.writeText(msg); setCopied(true) } catch { setCopied(false) }
      window.open(`https://ig.me/m/${INSTAGRAM}`, '_blank', 'noopener')
    }
    setDone(via)
  }

  const next = () => { if (ready && step < 3) setStep(s => s + 1) }

  return (
    <section
      id="turno"
      data-cursor="book"
      className="booking"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.25rem, 4vw, 2.5rem)',
        minHeight: '90vh',
      }}
    >
      <div className="booking-grid">
        {/* Left: title + progress */}
        <div>
          <h2 className="font-display" style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', lineHeight: 0.92, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: '1.6rem' }}>
            Hagamos<br /><span style={{ fontStyle: 'italic' }}>algo tuyo.</span>
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--ink-muted)', maxWidth: '26rem' }}>
            Cuatro preguntas rápidas y te abro el chat con todo escrito. Las referencias me las mandás directo por ahí.
          </p>

          {!done && (
            <ol className="booking-steps" aria-label="Progreso">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    disabled={i >= step}
                    data-hover={i < step ? '' : undefined}
                    aria-current={i === step ? 'step' : undefined}
                    style={{ color: i === step ? 'var(--ink)' : i < step ? 'var(--ink-muted)' : 'rgba(185,167,174,.4)' }}
                  >
                    <span style={{ color: i <= step ? 'var(--mark)' : 'inherit' }}>0{i + 1}</span> {s}
                  </button>
                  <i style={{ transform: `scaleX(${i < step ? 1 : i === step ? 0.35 : 0})` }} />
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Right: one question at a time */}
        <div style={{ minHeight: '26rem' }}>
          {done ? (
            <div key="done" className="book-reveal">
              <Question n="✦">{done === 'whatsapp' ? 'Listo, se abrió WhatsApp.' : 'Listo, se abrió Instagram.'}</Question>
              <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--ink-muted)', maxWidth: '30rem', marginBottom: '2rem' }}>
                {done === 'whatsapp'
                  ? 'Tu mensaje ya está escrito: solo tocá enviar y sumá tus referencias.'
                  : copied
                    ? 'Copié tu mensaje: pegalo en el chat y sumá tus referencias.'
                    : 'Escribime en el chat con tu idea, zona, tamaño y cuándo te gustaría.'}
              </p>
              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                <button type="button" className="book-link" data-hover onClick={() => send(done)}>Abrir de nuevo ↗</button>
                <button type="button" className="book-link" data-hover onClick={() => { setDone(null); setStep(0); setA(EMPTY) }}>Empezar otra consulta</button>
              </div>
            </div>
          ) : (
            <form key={step} className="book-reveal" onSubmit={e => { e.preventDefault(); next() }}>
              {step === 0 && (
                <>
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
                  <Question n="03">¿Para cuándo lo querés?</Question>
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
                  <p style={{ ...label, marginTop: '2.4rem' }}>Enviar por</p>
                  <div className="book-chips">
                    <button type="button" className="book-send" data-hover disabled={!ready} onClick={() => send('whatsapp')}>WhatsApp ↗</button>
                    <button type="button" className="book-send ghost" data-hover disabled={!ready} onClick={() => send('instagram')}>Instagram ↗</button>
                  </div>
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
