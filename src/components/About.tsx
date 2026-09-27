'use client'

import { useEffect, useRef } from 'react'

export default function About() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('[data-line]').forEach((line, i) => {
            setTimeout(() => {
              ;(line as HTMLElement).style.opacity = '1'
              ;(line as HTMLElement).style.transform = 'translateY(0)'
            }, i * 120)
          })
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="sobre-mi"
      ref={ref}
      style={{
        borderTop: '1px solid rgba(28,28,28,0.12)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '80vh',
      }}
    >
      {/* Image side */}
      <div
        style={{
          backgroundColor: '#E8D0DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', opacity: 0.15 }}>
          <div style={{ fontSize: '8rem' }}>✦</div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          Briza Maldonado — Palermo, CABA
        </div>
      </div>

      {/* Text side */}
      <div
        style={{
          padding: 'clamp(3rem, 6vw, 7rem) clamp(2rem, 5vw, 5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: '1px solid rgba(28,28,28,0.12)',
        }}
      >
        <p
          data-line
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--accent-hot)',
            marginBottom: '3rem',
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.7s ease',
          }}
        >
          ✦ Sobre mí
        </p>

        {[
          'Soy Briza, tatuadora',
          'basada en Palermo.',
          'Trabajo desde la línea fina,',
          'el blackwork ilustrativo',
          'y lo ornamental.',
          '',
          'Diseño en iPad,',
          'transfiero a la piel.',
          'Cada pieza es única.',
        ].map((line, i) => (
          <div
            key={i}
            data-line
            style={{
              overflow: 'hidden',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          >
            <span
              className="font-display"
              style={{
                display: 'block',
                fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
                lineHeight: 1.3,
                color: line === '' ? 'transparent' : 'var(--text-primary)',
                fontStyle: i > 5 ? 'italic' : 'normal',
              }}
            >
              {line || ' '}
            </span>
          </div>
        ))}

        <div
          data-line
          style={{
            marginTop: '3rem',
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.7s ease',
          }}
        >
          {['Vegana', 'Palermo', 'iPad → Piel', 'Pole Dance'].map(tag => (
            <span
              key={tag}
              style={{
                padding: '0.3rem 0.8rem',
                border: '1px solid rgba(28,28,28,0.2)',
                borderRadius: '999px',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
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
