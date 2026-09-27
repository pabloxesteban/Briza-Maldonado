'use client'

import { useEffect, useRef, useState } from 'react'

const flashes = [
  { id: 'F—01', name: 'Corazón de espinas', style: 'Blackwork', price: '$45.000', available: true },
  { id: 'F—02', name: 'Mariposa simple', style: 'Fineline', price: '$35.000', available: true },
  { id: 'F—03', name: 'Moño ornamental', style: 'Ornamental', price: '$40.000', available: false },
  { id: 'F—04', name: 'Luna con flores', style: 'Illustrativo', price: '$50.000', available: true },
  { id: 'F—05', name: 'Serpiente y daga', style: 'Traditional', price: '$55.000', available: true },
  { id: 'F—06', name: 'Polilla esterno', style: 'Fineline', price: '$60.000', available: true },
  { id: 'F—07', name: 'Oso anarquista', style: 'Blackwork', price: '$45.000', available: false },
]

function FlashRow({ flash, index }: { flash: typeof flashes[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), index * 60)
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        display: 'grid',
        gridTemplateColumns: '5rem 1fr 8rem 7rem 5rem',
        alignItems: 'center',
        padding: '1.8rem 0',
        borderTop: '1px solid rgba(28,28,28,0.08)',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
        cursor: flash.available ? 'none' : 'default',
        backgroundColor: hovered && flash.available ? 'rgba(240,40,122,0.03)' : 'transparent',
      }}
    >
      <span
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          color: hovered ? 'var(--mark)' : 'var(--ink-muted)',
          transition: 'color 0.2s',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {flash.id}
      </span>

      <div>
        <span
          className="font-display"
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
            fontStyle: 'italic',
            color: 'var(--ink)',
            display: 'block',
            lineHeight: 1.2,
          }}
        >
          {flash.name}
        </span>
        {/* Border that draws on hover */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--mark)',
            width: hovered && flash.available ? '100%' : '0%',
            transition: 'width 0.5s cubic-bezier(0.77,0,0.175,1)',
            marginTop: '0.4rem',
            maxWidth: '16rem',
          }}
        />
      </div>

      <span
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          opacity: 0.6,
        }}
      >
        {flash.style}
      </span>

      <span
        style={{
          fontSize: '0.8rem',
          color: 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {flash.price}
      </span>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {flash.available ? (
          <a
            href="https://instagram.com/bri.t4tts"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: hovered ? 'var(--mark)' : 'var(--ink-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              borderBottom: hovered ? '1px solid var(--mark)' : '1px solid transparent',
              paddingBottom: '1px',
            }}
          >
            consultar →
          </a>
        ) : (
          <span
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              opacity: 0.3,
            }}
          >
            agotado
          </span>
        )}
      </div>
    </div>
  )
}

export default function Flash() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="flash"
      style={{
        borderTop: '1px solid rgba(28,28,28,0.1)',
        padding: '5rem 2.5rem 6rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '4rem',
        }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
          }}
        >
          ✦ Flash
        </h2>
        <div style={{ textAlign: 'right' }}>
          <p
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              fontStyle: 'italic',
            }}
          >
            Disponibles
          </p>
          <p
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              marginTop: '0.75rem',
              opacity: 0.6,
            }}
          >
            Diseños únicos — uno por cliente
          </p>
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '5rem 1fr 8rem 7rem 5rem',
          padding: '0.75rem 0',
          borderBottom: '1px solid rgba(28,28,28,0.15)',
          marginBottom: '0.5rem',
        }}
      >
        {['Ref', 'Diseño', 'Estilo', 'Precio', ''].map((col, i) => (
          <span
            key={i}
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              opacity: 0.5,
              textAlign: i === 4 ? 'right' : 'left',
            }}
          >
            {col}
          </span>
        ))}
      </div>

      {flashes.map((f, i) => (
        <FlashRow key={f.id} flash={f} index={i} />
      ))}

      {/* Last border */}
      <div style={{ borderTop: '1px solid rgba(28,28,28,0.08)' }} />
    </section>
  )
}
