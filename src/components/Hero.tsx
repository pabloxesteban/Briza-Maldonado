'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const P = '/Briza-Maldonado/'

// Vitalina/Mysta pattern: one figure, cut out, standing in front of the name set huge behind her
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const fig = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${introPlaying ? 2.3 : 0.15}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)

    // Gentle depth on scroll: the name drifts slower than the figure
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, cur = 0
    const tick = () => {
      const target = reduce ? 0 : Math.min(1, window.scrollY / window.innerHeight)
      cur += (target - cur) * 0.12
      if (word.current) word.current.style.transform = `translate3d(0, ${cur * 60}px, 0)`
      if (fig.current) fig.current.style.transform = `translate3d(-50%, ${cur * -40}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section ref={ref} className="hero hero--v">
      <div ref={word} className="v-word" aria-hidden>
        <span className="v-mask"><span>BRIZA</span></span>
      </div>

      <div ref={fig} className="v-figure">
        <Image src={P + 'briza-recorte.png'} alt="Briza Maldonado tatuando" fill priority sizes="(max-width: 767px) 110vw, 48vw" style={{ objectFit: 'contain', objectPosition: 'bottom center' }} />
      </div>

      <h1 className="sr-only">Briza Maldonado, tatuadora traditional en Palermo, Buenos Aires</h1>

      <p className="v-corner v-corner--tr v-reveal">Tatuadora traditional<br />Palermo, Buenos Aires</p>
      <div className="v-corner v-corner--bl v-reveal">
        <p className="v-surname swash">Maldonado</p>
        <p className="v-tag">Black &amp; white y color.<br />Cada pieza, una sola vez.</p>
      </div>
      <div className="v-corner v-corner--br v-reveal">
        <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
        <a href="#obra" className="hero-link" data-cursor="view">Ver trabajos ↓</a>
      </div>
    </section>
  )
}
