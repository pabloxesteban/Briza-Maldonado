'use client'

import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 mix-blend-multiply"
      style={{ padding: '2rem 2.5rem' }}
    >
      <div className="flex items-center justify-between">
        <a
          href="#"
          className="font-display text-sm tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-primary)', letterSpacing: '0.25em' }}
        >
          ✦ Briza Maldonado
        </a>
        <a
          href="https://instagram.com/bri.t4tts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          @bri.t4tts
        </a>
      </div>
    </nav>
  )
}
