'use client'

import { useEffect, useState } from 'react'

const links = [
  { label: 'Obra', href: '#obra' },
  { label: 'Flash', href: '#flash' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Turno', href: '#turno' },
]

export default function Navbar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        padding: '1.75rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <a
        href="#"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.85rem',
          fontStyle: 'italic',
          color: 'var(--ink)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        Briza <span style={{ color: 'var(--mark)' }}>✦</span>
      </a>

      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--mark)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--ink-muted)')}
          >
            {l.label}
          </a>
        ))}
        <a
          href="https://instagram.com/bri.t4tts"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'var(--ink-muted)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(107,79,87,0.3)',
            paddingBottom: '1px',
          }}
        >
          @bri.t4tts
        </a>
      </div>
    </nav>
  )
}
