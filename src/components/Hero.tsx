'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const P = '/Briza-Maldonado/'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    // Lines rise from behind their masks, after the logo intro when it plays
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const start = introPlaying ? 2300 : 200
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${start / 1000}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <section ref={ref} className="hero">
      <div className="hero-photo hero-photo--a duo"><Image src={P + 'portfolio/lobo.jpg'} alt="" fill priority sizes="30vw" style={{ objectFit: 'cover' }} /></div>
      <div className="hero-photo hero-photo--b duo"><Image src={P + 'briza-portrait.jpg'} alt="Briza Maldonado en su estudio" fill priority sizes="(max-width: 767px) 60vw, 34vw" style={{ objectFit: 'cover', objectPosition: '40% 35%' }} /></div>
      <div className="hero-photo hero-photo--c duo"><Image src={P + 'portfolio/polilla-esterno.jpg'} alt="" fill sizes="20vw" style={{ objectFit: 'cover' }} /></div>

      <div className="hero-copy">
        <h1 className="hero-title">
          <span className="hero-line"><span style={{ ['--i' as string]: 0 }}>Briza</span></span>
          <span className="hero-line hero-line--swash"><span className="swash" style={{ ['--i' as string]: 1 }}>Maldonado</span></span>
        </h1>

        <div className="hero-text">
          <p className="hero-reveal" style={{ ['--i' as string]: 2 }}>Tatuadora traditional en Palermo, Buenos Aires. Black &amp; white y color.</p>
          <p className="hero-reveal hero-text-muted" style={{ ['--i' as string]: 3 }}>Cada pieza se diseña para vos y se tatúa una sola vez. Del papel a la piel.</p>
          <div className="hero-cta hero-reveal" style={{ ['--i' as string]: 4 }}>
            <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
            <a href="#obra" className="ghost-link" data-cursor="view">Ver trabajos</a>
          </div>
        </div>
      </div>
    </section>
  )
}
