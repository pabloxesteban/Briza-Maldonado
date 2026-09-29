'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const P = '/Briza-Maldonado/'
const NAME = 'BRIZA'

// One figure, cut out, in front of her name set edge to edge (Monolith / Vitalina pattern).
// On scroll the page lifts off her: the name rises slower than she does and the frame closes softly.
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const fig = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${introPlaying ? 2.3 : 0.15}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)

    // Fit the name to the full width, whatever the font metrics
    const fit = () => {
      const w = word.current, s = text.current
      if (!w || !s) return
      s.style.fontSize = '100px'
      const natural = s.getBoundingClientRect().width
      if (natural) s.style.fontSize = `${(100 * w.clientWidth) / natural}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, cur = 0, last = -1
    const tick = () => {
      const target = reduce ? 0 : Math.min(1, window.scrollY / window.innerHeight)
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.0005) cur = target
      if (cur !== last) {
        last = cur
        if (word.current) word.current.style.transform = `translate3d(0, ${cur * 18}vh, 0)`
        if (fig.current) fig.current.style.transform = `translate3d(-50%, ${cur * -6}vh, 0) scale(${1 - cur * 0.04})`
        root.style.setProperty('--hero-p', cur.toFixed(4))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearTimeout(t); cancelAnimationFrame(raf); window.removeEventListener('resize', fit) }
  }, [])

  return (
    <section ref={ref} className="hero hero--v">
      <div className="v-meta v-reveal">
        <p>Tatuadora<br />traditional</p>
        <p>Palermo<br />Buenos Aires</p>
        <p className="v-meta-hide">Black &amp; white<br />y color</p>
        <p className="v-meta-hide">Diseños únicos<br />dibujados a mano</p>
      </div>

      <div ref={word} className="v-word" aria-hidden>
        <span ref={text} className="v-mask">
          {NAME.split('').map((c, i) => <span key={i} style={{ ['--i' as string]: i }}>{c}</span>)}
        </span>
      </div>

      <div ref={fig} className="v-figure">
        <Image src={P + 'briza-tatuando.jpg'} alt="Briza Maldonado tatuando en su estudio" fill priority sizes="(max-width: 767px) 80vw, 36vw" style={{ objectFit: 'cover', objectPosition: '50% 30%' }} />
      </div>

      <h1 className="sr-only">Briza Maldonado, tatuadora traditional en Palermo, Buenos Aires</h1>

      <div className="v-corner v-corner--bl v-reveal">
        <p className="v-surname swash">Maldonado</p>
        <p className="v-tag">Cada pieza, una sola vez.</p>
      </div>
      <div className="v-corner v-corner--br v-reveal">
        <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
        <a href="#obra" className="hero-link" data-cursor="view">Ver trabajos ↓</a>
      </div>
      <span className="v-scroll v-reveal" aria-hidden><i /></span>
    </section>
  )
}
