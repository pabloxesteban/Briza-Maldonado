'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WORKS } from '@/data/works'

// Same order as the home page; each one previews its own picture on hover
const links = [
  { label: 'Flashes',  hash: '#flash',   pic: '/Briza-Maldonado/flash/cover.jpg' },
  { label: 'Diseños',  hash: '#obra',    pic: '' },
  { label: 'Proceso',  hash: '#proceso', pic: '/Briza-Maldonado/proceso/boceto-poster.jpg' },
  { label: 'Turno',    hash: '#turno',   pic: '/Briza-Maldonado/briza-tatuando.jpg' },
]

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPic, setMenuPic] = useState(WORKS[4].src)
  const [hoverPic, setHoverPic] = useState<string | null>(null)
  useEffect(() => { if (menuOpen) setMenuPic(p => { let n = p; while (n === p) n = WORKS[Math.floor(Math.random() * WORKS.length)].src; return n }) }, [menuOpen])
  const pathname = usePathname()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  // Esc closes the menu
  useEffect(() => {
    if (!menuOpen) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [menuOpen])

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

  // The floating booking dock steps aside at the very end of the page
  const [footerIn, setFooterIn] = useState(false)
  useEffect(() => {
    // Also out of the way over tools that need the bottom of the screen (e.g. the try-on)
    const els = Array.from(document.querySelectorAll('footer, [data-hide-dock]'))
    if (!els.length) return
    const seen = new Set<Element>()
    const io = new IntersectionObserver(es => {
      es.forEach(e => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
      setFooterIn(seen.size > 0)
    }, { threshold: 0.05 })
    els.forEach(el => io.observe(el))
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
  // The booking button that follows you around opens the assistant (fastest way to a booking);
  // without it, it goes to the booking form. Briza's number never appears on the site.
  const hasAgent = Boolean(process.env.NEXT_PUBLIC_AGENT_URL)
  const bookHref = pathname === '/' ? '#turno' : '/#turno'
  const quickBook = (e: React.MouseEvent) => {
    setMenuOpen(false)
    if (hasAgent) { e.preventDefault(); window.dispatchEvent(new Event('assistant:open')) }
  }
  const show = isSubPage || visible

  return (
    <>
      <nav
        className={!scrolled && !menuOpen && pathname === '/' ? 'nav-on-dark' : ''}
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
          <Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={400} height={480} priority
            sizes="56px" className="nav-arch" />
          <span className="nav-lockup"><span className="nav-l1">Briza</span><span className="nav-l2 swash">Maldonado</span></span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem', zIndex: 1 }}>
          <a href={bookHref} className="cta-book nav-desktop" data-cursor="book" onClick={quickBook}>Pedir turno ●</a>
          <button className="nav-toggle" onClick={() => setMenuOpen(o => !o)} aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} data-hover>
            <span>{menuOpen ? 'Cerrar' : 'Menu'}</span><i />
          </button>
        </div>
      </nav>

      {/* Full-screen menu: giant links left, duotone photo right */}
      <div className={`menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu-links">
          {links.map((l, i) => {
            const href = pathname === '/' ? l.hash : `/${l.hash}`
            return (
              <div key={l.hash} className="menu-mask">
                <Link href={href} onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => setHoverPic(l.pic || menuPic)} onFocus={() => setHoverPic(l.pic || menuPic)}
                  onMouseLeave={() => setHoverPic(null)}
                  style={{ transitionDelay: menuOpen ? `${i * 70 + 300}ms` : '0ms' }}>
                  <span className="menu-n">0{i + 1}</span>{l.label}
                </Link>
              </div>
            )
          })}
          <div className="menu-social">
            <a href="https://instagram.com/bri.t4tts" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div className="menu-photo duo">
          <Image key={hoverPic ?? menuPic} src={hoverPic ?? menuPic} alt="" fill sizes="50vw" className="menu-pic" style={{ objectFit: 'cover' }} />
          <p className="menu-place">Palermo, Buenos Aires · Turnos online</p>
        </div>
      </div>

      {/* Mobile: booking always one thumb away */}
      <div className={`cta-dock ${bookingInView || footerIn || menuOpen || !show || (!isSubPage && !pastHero) ? 'hide' : ''}`}>
        <a href={bookHref} className="cta-book" onClick={quickBook}>Pedir turno ●</a>
      </div>
    </>
  )
}
