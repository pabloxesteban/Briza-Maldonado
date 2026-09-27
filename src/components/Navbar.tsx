'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#flash', label: 'Flash' },
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#contacto', label: 'Reservar' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between transition-all duration-500"
      style={{
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        backgroundColor: scrolled ? 'rgba(250, 232, 240, 0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(244, 114, 182, 0.2)' : 'none',
      }}
    >
      <Link href="/" className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--black)' }}>
        Briza Maldonado
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="text-sm font-medium tracking-wide relative group"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
            <span
              className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: 'var(--accent-hot)' }}
            />
          </a>
        ))}
      </div>

      <a
        href="#contacto"
        className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--accent-hot)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(240, 40, 122, 0.3)',
        }}
      >
        Reservar turno
      </a>
    </nav>
  )
}
