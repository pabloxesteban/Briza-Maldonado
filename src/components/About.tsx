'use client'

import { useEffect, useRef } from 'react'

const lines = [
  { text: 'Soy Briza.', delay: 0 },
  { text: 'Tatuadora.', delay: 100 },
  { text: 'Vegana.', delay: 200 },
  { text: 'Vivo y trabajo', delay: 300 },
  { text: 'en Palermo,', delay: 400 },
  { text: 'Buenos Aires.', delay: 500 },
]

const lines2 = [
  { text: 'Diseño en iPad.', delay: 600 },
  { text: 'Transfiero a la piel.', delay: 700 },
  { text: 'Cada pieza,', delay: 800 },
  { text: 'una sola vez.', delay: 900 },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>('[data-inscribe]').forEach(line => {
            const delay = Number(line.dataset.inscribe)
            setTimeout(() => {
              line.style.clipPath = 'inset(0 0% 0 0)'
            }, delay)
          })
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="sobre-mi"
      ref={ref}
      className="about-grid"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        minHeight: '90vh',
      }}
    >
      {/* Left: portrait */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '70vh',
          backgroundColor: '#1a1416',
        }}
      >
        <img
          src="/Briza-Maldonado/briza-portrait.jpg"
          alt="Briza Maldonado"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
          }}
        />
        {/* subtle tint so caption reads */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(14,10,10,0.5) 0%, transparent 50%)',
        }} />
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', zIndex: 2 }}>
          <p style={{
            fontSize: '0.55rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8,
          }}>
            Briza Maldonado<br />
            Palermo, CABA<br />
            <span style={{ color: 'var(--mark)' }}>@bri.t4tts</span>
          </p>
        </div>
      </div>

      {/* Right: inscribing text */}
      <div
        style={{
          backgroundColor: 'var(--bg)',
          padding: 'clamp(3rem, 6vw, 7rem) clamp(1.25rem, 5vw, 5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Block 1 */}
        <div style={{ marginBottom: '2.5rem' }}>
          {lines.map((line, i) => (
            <div
              key={i}
              data-inscribe={line.delay}
              className="font-display"
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
                lineHeight: 1.2,
                color: 'var(--ink)',
                clipPath: 'inset(0 100% 0 0)',
                transition: 'clip-path 0.7s cubic-bezier(0.77,0,0.175,1)',
                fontStyle: i % 3 === 2 ? 'italic' : 'normal',
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Dividing mark */}
        <div
          style={{
            width: '2rem',
            height: '1px',
            backgroundColor: 'var(--mark)',
            margin: '1rem 0 2rem',
          }}
        />

        {/* Block 2 */}
        <div style={{ marginBottom: '3rem' }}>
          {lines2.map((line, i) => (
            <div
              key={i}
              data-inscribe={line.delay}
              className="font-display"
              style={{
                fontSize: 'clamp(1.2rem, 2.2vw, 2rem)',
                lineHeight: 1.3,
                color: 'var(--ink-muted)',
                clipPath: 'inset(0 100% 0 0)',
                transition: 'clip-path 0.7s cubic-bezier(0.77,0,0.175,1)',
                fontStyle: 'italic',
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {['Vegana ✦', 'Traditional', 'Black & white', 'Color', 'Palermo'].map(tag => (
            <span
              key={tag}
              style={{
                padding: '0.3rem 0.9rem',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                borderRadius: '999px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
