'use client'

import { useEffect, useRef } from 'react'

const flashes = [
  { id: 'F01', name: 'Corazón espinas', price: '$45.000' },
  { id: 'F02', name: 'Mariposa simple', price: '$35.000' },
  { id: 'F03', name: 'Moño ornamental', price: '$40.000' },
  { id: 'F04', name: 'Luna con flores', price: '$50.000' },
  { id: 'F05', name: 'Serpiente daga', price: '$55.000' },
]

export default function Flash() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('[data-reveal]').forEach((item, i) => {
            setTimeout(() => {
              ;(item as HTMLElement).style.opacity = '1'
              ;(item as HTMLElement).style.transform = 'translateY(0)'
            }, i * 80)
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
      ref={sectionRef}
      id="flash"
      style={{
        padding: '8rem 2.5rem',
        borderTop: '1px solid rgba(28,28,28,0.12)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '5rem',
        }}
      >
        <h2
          className="font-display italic"
          data-reveal
          style={{
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            lineHeight: 1,
            color: 'var(--text-primary)',
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'all 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          Flash
        </h2>
        <div
          data-reveal
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.9s ease',
            textAlign: 'right',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.4rem 1rem',
              border: '1px solid var(--accent-hot)',
              borderRadius: '999px',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-hot)',
            }}
          >
            ✦ Disponibles
          </span>
        </div>
      </div>

      {/* Flash list */}
      <div>
        {flashes.map((f, i) => (
          <div
            key={f.id}
            data-reveal
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '2rem 0',
              borderTop: '1px solid rgba(28,28,28,0.1)',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: 'all 0.7s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.paddingLeft = '1.5rem'
              el.style.backgroundColor = 'rgba(240,40,122,0.04)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.paddingLeft = '0'
              el.style.backgroundColor = 'transparent'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <span
                className="text-xs tracking-widest"
                style={{ color: 'var(--text-secondary)' }}
              >
                {f.id}
              </span>
              <span
                className="font-display italic"
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: 'var(--text-primary)' }}
              >
                {f.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.price}</span>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-hot)' }}>
                consultar →
              </span>
            </div>
          </div>
        ))}
        {/* Last border */}
        <div style={{ borderTop: '1px solid rgba(28,28,28,0.1)' }} />
      </div>
    </section>
  )
}
