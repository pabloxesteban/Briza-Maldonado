'use client'

import { useEffect, useRef } from 'react'

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('[data-reveal]').forEach((item, i) => {
            setTimeout(() => {
              ;(item as HTMLElement).style.opacity = '1'
              ;(item as HTMLElement).style.transform = 'translateY(0)'
            }, i * 150)
          })
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="contacto"
      ref={ref}
      style={{
        borderTop: '1px solid rgba(28,28,28,0.12)',
        padding: 'clamp(5rem, 10vw, 12rem) 2.5rem',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <p
        data-reveal
        style={{
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: '4rem',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'all 0.7s ease',
        }}
      >
        ✦ Contacto
      </p>

      <h2
        data-reveal
        className="font-display"
        style={{
          fontSize: 'clamp(3rem, 10vw, 10rem)',
          lineHeight: 0.95,
          color: 'var(--text-primary)',
          marginBottom: '5rem',
          opacity: 0,
          transform: 'translateY(50px)',
          transition: 'all 1s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        Agendá<br />
        <span style={{ fontStyle: 'italic' }}>tu turno</span>
      </h2>

      <div
        data-reveal
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'all 0.8s ease',
        }}
      >
        <a
          href="https://instagram.com/bri.t4tts"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '1.2rem 3rem',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hot)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--text-primary)')}
        >
          Instagram ↗
        </a>
        <a
          href="mailto:hola@brizamaldonado.com"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(107,79,87,0.3)',
            paddingBottom: '2px',
          }}
        >
          Email
        </a>
      </div>
    </section>
  )
}
