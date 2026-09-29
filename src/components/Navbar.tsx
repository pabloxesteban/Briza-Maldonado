'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
          padding: '1.1rem clamp(1rem, 2.5vw, 2.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.8s ease, background 0.4s ease, backdrop-filter 0.4s',
          pointerEvents: show ? 'all' : 'none',
          background: scrolled || menuOpen ? 'rgba(247,241,226,0.95)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled && !menuOpen ? '1px solid rgba(22,20,20,0.07)' : 'none',
        }}
      >
        {/* Logo → home */}
        <Link
          href="/"
          aria-label="Briza Maldonado — inicio"
          style={{
            fontFamily: 'var(--font-display)',
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
          <Image src="/Briza-Maldonado/brand/logo.png" alt="" width={900} height={687} priority
            sizes="64px" style={{ width: 54, height: 'auto', display: 'block' }} />
          <span className="nav-wordmark">Briza</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem', zIndex: 1 }}>
          <Link href={bookHref} className="cta-book nav-desktop" data-cursor="book">Pedir turno ●</Link>
          <button className="nav-toggle" onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} data-hover>
            <span>{menuOpen ? 'Close' : 'Menu'}</span><i />
          </button>
        </div>
      </nav>

      {/* Full-screen menu: giant links left, duotone photo right */}
      <div className={`menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu-links">
          {[...links, { label: 'Turno', href: bookHref }].map((l, i) => {
            const active = pathname === l.href || pathname === l.href + '/'
            return (
              <div key={l.href} className="menu-mask">
                <Link href={l.href} onClick={() => setMenuOpen(false)} className={active ? 'active' : ''}
                  style={{ transitionDelay: menuOpen ? `${i * 70 + 300}ms` : '0ms' }}>
                  {l.label}
                </Link>
              </div>
            )
          })}
          <div className="menu-social">
            <a href="https://instagram.com/bri.t4tts" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/5491156233929" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="menu-photo duo">
          <Image src="/Briza-Maldonado/portfolio/daga-serpiente.jpg" alt="" fill sizes="50vw" style={{ objectFit: 'cover' }} />
        </div>
      </div>

      {/* Mobile: booking always one thumb away */}
      <div className={`cta-dock ${bookingInView || menuOpen || !show || (!isSubPage && !pastHero) ? 'hide' : ''}`}>
        <Link href={bookHref} className="cta-book">Pedir turno ●</Link>
      </div>
    </>
  )
}
