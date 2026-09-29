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
    <section ref={ref} className="hero checker" style={{ ['--a' as string]: 'var(--c-pink)', ['--b' as string]: 'var(--c-pink-2)' }}>
      <div className="hero-card">
        <div className="hero-top hero-pop" style={{ ['--i' as string]: 0 }}>
          <span>Tatuadora traditional</span>
          <span>Palermo, Buenos Aires</span>
        </div>

        {/* The name fills the width; a small portrait sits in the line, not over it */}
        <h1 className="hero-name" aria-label="Briza Maldonado">
          <span className="hero-name-row">
            <span className="hero-word" style={{ ['--i' as string]: 1 }}>Briza</span>
            <span className="hero-portrait" style={{ ['--i' as string]: 3 }}>
              <Image src={P + 'briza-portrait.jpg'} alt="" fill priority sizes="(max-width: 767px) 30vw, 16vw" style={{ objectFit: 'cover', objectPosition: '45% 30%' }} />
            </span>
          </span>
          <span className="hero-word swash hero-surname" style={{ ['--i' as string]: 2 }}>Maldonado</span>
        </h1>

        <div className="hero-foot">
          <p className="hero-sub hero-pop" style={{ ['--i' as string]: 4 }}>
            Tatuajes traditional con onda.<br />Black &amp; white y color. Cada pieza, una sola vez.
          </p>
          <div className="hero-cta hero-pop" style={{ ['--i' as string]: 5 }}>
            <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
            <a href="#obra" className="hero-link" data-cursor="view">Ver trabajos ↓</a>
          </div>
        </div>

        <div className="hero-sticker hero-sticker--heart" style={{ ['--i' as string]: 6 }}>
          <Image src={P + 'flash/corazon-vegan-paper.png'} alt="" fill sizes="18vw" style={{ objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  )
}
