'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Obra',    href: '/obra' },
  { label: 'Flash',   href: '/flash' },
  { label: 'Proceso', href: '/proceso' },
  { label: 'Turno',   href: '/turno' },
]

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  // On sub-pages, appear immediately
  const isSubPage = pathname !== '/'
  const show = isSubPage || visible

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        padding: '1.5rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.8s ease, background 0.4s ease, backdrop-filter 0.4s',
        pointerEvents: show ? 'all' : 'none',
        background: scrolled ? 'rgba(245,232,238,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(20,14,14,0.07)' : 'none',
      }}
    >
      {/* Logo → home */}
      <Link
        href="/"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: 'var(--ink)',
          textDecoration: 'none',
          letterSpacing: '0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        Briza <span style={{ color: 'var(--mark)', fontSize: '0.65rem' }}>✦</span> Maldonado
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {links.map(l => {
          const active = pathname === l.href || pathname === l.href + '/'
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: active ? 'var(--mark)' : 'var(--ink-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                borderBottom: active ? '1px solid var(--mark)' : '1px solid transparent',
                paddingBottom: '1px',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--mark)'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'
              }}
            >
              {l.label}
            </Link>
          )
        })}
        <a
          href="https://instagram.com/bri.t4tts"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            color: 'var(--mark)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--mark)',
            paddingBottom: '1px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.6')}
          onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
        >
          @bri.t4tts
        </a>
      </div>
    </nav>
  )
}
