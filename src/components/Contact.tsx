'use client'

import { useEffect, useRef, useState } from 'react'

const questions = [
  { id: 'q1', prompt: '¿Qué estás pensando?', placeholder: 'Un diseño, una idea, un flash...' },
  { id: 'q2', prompt: '¿Qué estilo te interesa?', placeholder: 'Blackwork, fineline, ornamental...' },
  { id: 'q3', prompt: '¿Dónde en el cuerpo?', placeholder: 'Antebrazo, costilla, tobillo...' },
  { id: 'q4', prompt: '¿Tamaño aproximado?', placeholder: 'Pequeño (5cm), mediano (10cm), grande...' },
  { id: 'q5', prompt: '¿Cómo te contactamos?', placeholder: 'Tu Instagram o email' },
]

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(-1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setCurrent(0), 400)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (current >= 0 && current < questions.length) {
      setTimeout(() => inputRefs.current[current]?.focus(), 600)
    }
  }, [current])

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Enter' && answers[questions[idx].id]) {
      if (idx < questions.length - 1) {
        setCurrent(idx + 1)
      } else {
        setSent(true)
      }
    }
  }

  return (
    <section
      id="turno"
      ref={ref}
      data-cursor="book"
      style={{
        borderTop: '1px solid rgba(28,28,28,0.1)',
        padding: 'clamp(5rem, 10vw, 10rem) 2.5rem',
        minHeight: '80vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'start',
      }}
    >
      {/* Left: heading */}
      <div style={{ paddingTop: '1rem' }}>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            marginBottom: '2.5rem',
          }}
        >
          Hagamos<br />
          <span style={{ fontStyle: 'italic' }}>algo tuyo.</span>
        </h2>
        <p
          style={{
            fontSize: '0.8rem',
            lineHeight: 1.8,
            color: 'var(--ink-muted)',
            maxWidth: '22rem',
          }}
        >
          Cada tatuaje es una conversación entre tu idea y mi línea.
          Respondé las preguntas y te contacto pronto.
        </p>

        {/* Direct link */}
        <div style={{ marginTop: '3rem' }}>
          <a
            href="https://instagram.com/bri.t4tts"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(107,79,87,0.3)',
              paddingBottom: '2px',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              ;(e.target as HTMLElement).style.color = 'var(--mark)'
              ;(e.target as HTMLElement).style.borderColor = 'var(--mark)'
            }}
            onMouseLeave={e => {
              ;(e.target as HTMLElement).style.color = 'var(--ink-muted)'
              ;(e.target as HTMLElement).style.borderColor = 'rgba(107,79,87,0.3)'
            }}
          >
            o escribime directo en Instagram ↗
          </a>
        </div>
      </div>

      {/* Right: conversational form */}
      <div>
        {sent ? (
          <div
            style={{
              paddingTop: '4rem',
              animation: 'fadeIn 0.8s ease forwards',
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                color: 'var(--mark)',
                marginBottom: '1.5rem',
              }}
            >
              ✦
            </div>
            <p
              className="font-display"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontStyle: 'italic',
                color: 'var(--ink)',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              Recibido.
            </p>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--ink-muted)',
                lineHeight: 1.7,
              }}
            >
              Te voy a escribir pronto por Instagram.
            </p>
          </div>
        ) : (
          <div style={{ paddingTop: '1rem' }}>
            {questions.map((q, i) => (
              <div
                key={q.id}
                className={`form-step ${i <= current ? (i < current ? 'done' : 'active') : ''}`}
                style={{
                  marginBottom: '2.5rem',
                  opacity: i > current ? 0 : i < current ? 0.35 : 1,
                  transform: i > current ? 'translateY(16px)' : 'translateY(0)',
                  transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                  pointerEvents: i === current ? 'all' : 'none',
                }}
              >
                <p
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: i === current ? 'var(--mark)' : 'var(--ink-muted)',
                    marginBottom: '0.75rem',
                    transition: 'color 0.3s',
                  }}
                >
                  {String(i + 1).padStart(2, '0')} — {q.prompt}
                </p>
                <div style={{ position: 'relative' }}>
                  <input
                    ref={el => { inputRefs.current[i] = el }}
                    type="text"
                    placeholder={q.placeholder}
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    onKeyDown={e => handleKey(e, i)}
                    disabled={i !== current}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${i === current ? 'var(--ink)' : 'rgba(28,28,28,0.15)'}`,
                      padding: '0.75rem 0',
                      fontSize: '1rem',
                      color: 'var(--ink)',
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: 'italic',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                  />
                  {i === current && answers[q.id] && (
                    <button
                      onClick={() => {
                        if (i < questions.length - 1) setCurrent(i + 1)
                        else setSent(true)
                      }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'none',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--mark)',
                      }}
                      data-hover
                    >
                      {i < questions.length - 1 ? 'siguiente →' : 'enviar ✦'}
                    </button>
                  )}
                </div>
                {i === current && (
                  <p
                    style={{
                      fontSize: '0.55rem',
                      letterSpacing: '0.15em',
                      color: 'var(--ink-muted)',
                      opacity: 0.4,
                      marginTop: '0.5rem',
                    }}
                  >
                    Enter para continuar
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
