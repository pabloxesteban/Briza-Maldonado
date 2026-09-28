'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Obra',    href: '/obra' },
  { label: 'Flash',   href: '/flash' },
  { label: 'Proceso', href: '/proceso' },
]

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Hide the mobile dock while the booking form itself is on screen
  const [bookingInView, setBookingInView] = useState(false)
  useEffect(() => {
    const el = document.getElementById('turno')
    if (!el) return
    const io = new IntersectionObserver(([e]) => setBookingInView(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [pathname])

  const [pastHero, setPastHero] = useState(false)
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isSubPage = pathname !== '/'
  const bookHref = pathname === '/' ? '#turno' : '/turno'
  const show = isSubPage || visible

  return (
    <>
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
          background: scrolled || menuOpen ? 'rgba(245,232,238,0.95)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled && !menuOpen ? '1px solid rgba(20,14,14,0.07)' : 'none',
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
            zIndex: 1,
          }}
        >
          Briza <span style={{ color: 'var(--mark)', fontSize: '0.65rem' }}>✦</span> Maldonado
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
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
          <Link href={bookHref} className="cta-book" data-cursor="book">Pedir turno ✦</Link>
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          style={{
            display: 'none', // shown via CSS on mobile
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            padding: '4px',
            zIndex: 1,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{
            display: 'block', width: '22px', height: '1.5px',
            background: 'var(--ink)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '22px', height: '1.5px',
            background: 'var(--ink)',
            transition: 'opacity 0.3s ease',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '22px', height: '1.5px',
            background: 'var(--ink)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className="nav-mobile-menu"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 490,
          background: 'rgba(245,232,238,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '6rem 2.5rem 3rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {links.map((l, i) => {
            const active = pathname === l.href || pathname === l.href + '/'
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2.5rem, 12vw, 4rem)',
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: active ? 'var(--mark)' : 'var(--ink)',
                  textDecoration: 'none',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.4s ease ${i * 60 + 80}ms, transform 0.4s ease ${i * 60 + 80}ms`,
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        <Link href={bookHref} className="cta-book" onClick={() => setMenuOpen(false)}
          style={{ alignSelf: 'flex-start', marginTop: '2.5rem', padding: '1rem 1.6rem', fontSize: '.78rem', opacity: menuOpen ? 1 : 0, transition: `opacity 0.4s ease ${links.length * 60 + 80}ms` }}>
          Pedir turno ✦
        </Link>

        {/* Instagram at bottom */}
        <a
          href="https://instagram.com/bri.t4tts"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 'auto',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'var(--mark)',
            textDecoration: 'none',
            opacity: menuOpen ? 1 : 0,
            transition: `opacity 0.4s ease ${links.length * 60 + 120}ms`,
          }}
        >
          @bri.t4tts
        </a>
      </div>

      {/* Mobile: booking always one thumb away */}
      <div className={`cta-dock ${bookingInView || menuOpen || !show || (!isSubPage && !pastHero) ? 'hide' : ''}`}>
        <Link href={bookHref} className="cta-book">Pedir turno ✦</Link>
      </div>
    </>
  )
}
