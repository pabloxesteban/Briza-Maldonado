'use client'

import { useEffect, useRef } from 'react'

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>('[data-word]').forEach((word, i) => {
            setTimeout(() => {
              word.style.opacity = '1'
              word.style.transform = 'translateY(0)'
            }, i * 80)
          })
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const words = ['No', 'hay', 'futuro', '—', 'hagamos', 'uno.']

  return (
    <section
      ref={ref}
      style={{
        borderTop: '1px solid rgba(28,28,28,0.1)',
        borderBottom: '1px solid rgba(28,28,28,0.1)',
        padding: '6rem 2.5rem',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 1rem',
          alignItems: 'baseline',
        }}
      >
        {words.map((word, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <span
              data-word
              className="font-display"
              style={{
                display: 'block',
                fontSize: 'clamp(3rem, 9vw, 9rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: word === '—' ? 'var(--mark)' : 'var(--ink)',
                fontStyle: i === 5 ? 'italic' : 'normal',
                opacity: 0,
                transform: 'translateY(100%)',
                transition: 'opacity 0.8s ease, transform 0.9s cubic-bezier(0.77,0,0.175,1)',
              }}
            >
              {word}
            </span>
          </div>
        ))}
      </div>

      {/* Subtext */}
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <p
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            opacity: 0,
            animation: 'fadeIn 1s ease 0.5s forwards',
            maxWidth: '24rem',
            textAlign: 'right',
            lineHeight: 1.8,
          }}
        >
          Traditional · Black &amp; white · Color<br />
          Palermo, Buenos Aires
        </p>
      </div>
    </section>
  )
}
