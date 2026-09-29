'use client'

import { useEffect, useRef, useState } from 'react'

const V = '/Briza-Maldonado/proceso/'
const CLIP = 'portada'
const OFFSETS = [0, 1.8, 3.6] // same footage, staggered per column

// Full-bleed studio footage, tinted to the site's pink/ink duotone, with her name running across it as a band.
// Desktop splits it into three staggered columns; phones show it once, full screen. Scrolling pushes the band faster.
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const band = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${introPlaying ? 2.3 : 0.15}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setMobile(mq.matches)
    on(); mq.addEventListener('change', on)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, x = 0, lastY = window.scrollY, boost = 0, prev = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - prev); prev = now
      const y = window.scrollY
      boost += (Math.min(40, Math.abs(y - lastY)) - boost) * 0.1
      lastY = y
      if (!reduce && y < window.innerHeight * 1.2) root.style.setProperty('--hero-p', Math.min(1, y / window.innerHeight).toFixed(4))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearTimeout(t); cancelAnimationFrame(raf); mq.removeEventListener('change', on) }
  }, [])

  // Some phones refuse autoplay until a gesture
  useEffect(() => {
    const kick = () => ref.current?.querySelectorAll('video').forEach(v => { if (v.paused) v.play().catch(() => {}) })
    kick()
    window.addEventListener('touchstart', kick, { passive: true, once: true })
    return () => window.removeEventListener('touchstart', kick)
  }, [mobile])

  return (
    <section ref={ref} className="hero hero--t">
      <div className="t-media">
        {(mobile ? [0] : OFFSETS).map((o, i) => (
          <figure key={i} className="t-clip" style={{ ['--i' as string]: i }}>
            <video muted autoPlay loop playsInline preload="auto" poster={`${V}${CLIP}-poster.jpg`} disablePictureInPicture aria-hidden
              onLoadedMetadata={e => { if (o) e.currentTarget.currentTime = o % (e.currentTarget.duration || 5) }}>
              <source src={`${V}${CLIP}.webm`} type="video/webm" />
              <source src={`${V}${CLIP}.mp4`} type="video/mp4" />
            </video>
          </figure>
        ))}
      </div>

      <h1 className="sr-only">Briza Maldonado, tatuadora traditional en Palermo, Buenos Aires</h1>

      <div className="t-title" aria-hidden>
        <span className="t-name">Briza</span>
        <span className="t-swash swash">Maldonado</span>
        <p className="t-sub">Tatuadora traditional <i>✦</i> Palermo, Buenos Aires <i>✦</i> Vegan tattoo artist</p>
      </div>

      <div className="t-cta t-reveal">
        <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
        <a href="#obra" className="t-link" data-cursor="view">Ver trabajos ↓</a>
      </div>
    </section>
  )
}
