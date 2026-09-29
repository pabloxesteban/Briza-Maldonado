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
    <section ref={ref} className="hero hero--calm">
      <div className="hero-text-col">
        <h1 className="hero-title">
          <span className="hero-line hero-line--name" style={{ ['--i' as string]: 0 }}>Briza</span>
          <span className="hero-line swash" style={{ ['--i' as string]: 1 }}>Maldonado</span>
        </h1>
        <p className="hero-sub hero-pop" style={{ ['--i' as string]: 2 }}>
          Tatuajes traditional con onda, en Palermo, Buenos Aires.<br />Black &amp; white y color. Cada pieza, una sola vez.
        </p>
        <div className="hero-cta hero-pop" style={{ ['--i' as string]: 3 }}>
          <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
          <a href="#obra" className="hero-link" data-cursor="view">Ver trabajos ↓</a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-arch hero-pop" style={{ ['--i' as string]: 2 }}>
          <Image src={P + 'briza-tatuando.jpg'} alt="Briza Maldonado tatuando en su estudio" fill priority sizes="(max-width: 767px) 80vw, 36vw" style={{ objectFit: 'cover', objectPosition: '58% 30%' }} />
        </div>
        <div className="hero-sticker hero-sticker--mermaid" style={{ ['--i' as string]: 4 }}>
          <Image src={P + 'flash/sirena-paper.png'} alt="" fill priority sizes="(max-width: 767px) 36vw, 16vw" style={{ objectFit: 'contain' }} />
        </div>
        <div className="hero-sticker hero-sticker--bird" style={{ ['--i' as string]: 5 }}>
          <Image src={P + 'flash/gorrion-paper.png'} alt="" fill sizes="12vw" style={{ objectFit: 'contain' }} />
        </div>
        <div className="hero-sticker hero-sticker--berry" style={{ ['--i' as string]: 6 }}>
          <Image src={P + 'flash/frutilla-paper.png'} alt="" fill sizes="10vw" style={{ objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  )
}
