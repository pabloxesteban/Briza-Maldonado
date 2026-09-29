'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const P = '/Briza-Maldonado/'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${introPlaying ? 2.3 : 0.15}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <section ref={ref} className="hero hero--tt">
      {/* Corner collage, like La Tatuajería: Briza, and her work */}
      <div className="tt-photo tt-photo--a"><Image src={P + 'portfolio/lobo.jpg'} alt="" fill priority sizes="22vw" style={{ objectFit: 'cover' }} /></div>
      <div className="tt-photo tt-photo--b"><Image src={P + 'briza-tatuando.jpg'} alt="Briza Maldonado tatuando" fill priority sizes="(max-width: 767px) 58vw, 30vw" style={{ objectFit: 'cover', objectPosition: '55% 28%' }} /></div>
      <div className="tt-photo tt-photo--c"><Image src={P + 'portfolio/lockets-gatos.jpg'} alt="" fill sizes="18vw" style={{ objectFit: 'cover' }} /></div>

      <div className="tt-copy">
        <h1 className="tt-title">
          <span className="tt-line"><span style={{ ['--i' as string]: 0 }}>Briza</span></span>
          <span className="tt-line"><span className="swash" style={{ ['--i' as string]: 1 }}>Maldonado</span></span>
        </h1>
        <div className="tt-text">
          <p className="tt-reveal" style={{ ['--i' as string]: 2 }}>Tatuadora traditional en Palermo, Buenos Aires.</p>
          <p className="tt-reveal tt-muted" style={{ ['--i' as string]: 3 }}>Black &amp; white y color. Cada pieza se diseña para vos y se tatúa una sola vez.</p>
          <div className="hero-cta tt-reveal" style={{ ['--i' as string]: 4 }}>
            <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
            <a href="#obra" className="hero-link" data-cursor="view">Ver trabajos ↓</a>
          </div>
        </div>
      </div>

      <div className="tt-sticker"><Image src={P + 'flash/sirena-paper.png'} alt="" fill sizes="14vw" style={{ objectFit: 'contain' }} /></div>
    </section>
  )
}
