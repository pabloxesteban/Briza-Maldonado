'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const FL = '/Briza-Maldonado/flash/'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    // Everything pops in after the logo intro when it plays
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${introPlaying ? 2.3 : 0.15}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <section ref={ref} className="hero checker" style={{ ['--a' as string]: 'var(--c-pink)', ['--b' as string]: 'var(--c-pink-2)' }}>
      <div className="hero-card">
        <h1 className="hero-title">
          <span className="hero-line" style={{ ['--i' as string]: 0 }}>Tatuajes</span>
          <span className="hero-line" style={{ ['--i' as string]: 1 }}>traditional</span>
          <span className="hero-line swash" style={{ ['--i' as string]: 2 }}>con onda.</span>
        </h1>
        <p className="hero-sub hero-pop" style={{ ['--i' as string]: 3 }}>
          Soy Briza, tatuadora en Palermo, Buenos Aires.<br />Black &amp; white y color. Cada pieza, una sola vez.
        </p>
        <div className="hero-cta hero-pop" style={{ ['--i' as string]: 4 }}>
          <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
          <a href="#obra" className="hero-link" data-cursor="view">Ver trabajos ↓</a>
        </div>

        <div className="hero-sticker hero-sticker--heart" style={{ ['--i' as string]: 5 }}>
          <Image src={FL + 'corazon-vegan-paper.png'} alt="Flash de corazón vegano" fill priority sizes="(max-width: 767px) 55vw, 30vw" style={{ objectFit: 'contain' }} />
        </div>
        <div className="hero-sticker hero-sticker--berry" style={{ ['--i' as string]: 6 }}>
          <Image src={FL + 'frutilla-paper.png'} alt="" fill sizes="(max-width: 767px) 32vw, 16vw" style={{ objectFit: 'contain' }} />
        </div>
        <div className="hero-sticker hero-sticker--bird" style={{ ['--i' as string]: 7 }}>
          <Image src={FL + 'gorrion-paper.png'} alt="" fill sizes="20vw" style={{ objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  )
}
