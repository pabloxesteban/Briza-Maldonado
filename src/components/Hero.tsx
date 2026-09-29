'use client'

import { useEffect, useRef, useState } from 'react'

const V = '/Briza-Maldonado/proceso/'
// Three studio clips, each starting at a different point of its loop so the columns never move in step
const CLIPS = [{ src: 'portada', start: 0 }, { src: 'portada3', start: 0.45 }, { src: 'portada2', start: 0.7 }]

// Full-bleed studio footage, tinted to the site's pink/ink duotone, with her name set edge to edge.
// Desktop shows the three clips side by side; phones dissolve from one to the next.
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${introPlaying ? 2.3 : 0.15}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)
    // Fit the name edge to edge
    const fit = () => {
      const w = word.current, t = text.current
      if (!w || !t) return
      t.style.fontSize = '100px'
      const n = t.getBoundingClientRect().width
      if (n) t.style.fontSize = `${(100 * w.clientWidth) / n}px`
    }
    fit(); document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setMobile(mq.matches)
    on(); mq.addEventListener('change', on)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      const y = window.scrollY
      if (!reduce && y < window.innerHeight * 1.2) root.style.setProperty('--hero-p', Math.min(1, y / window.innerHeight).toFixed(4))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearTimeout(t); cancelAnimationFrame(raf); mq.removeEventListener('change', on); window.removeEventListener('resize', fit) }
  }, [])

  // Phones: one clip at a time
  const [cur, setCur] = useState(0)
  useEffect(() => {
    if (!mobile) return
    const id = setInterval(() => setCur(c => (c + 1) % CLIPS.length), 4800)
    return () => clearInterval(id)
  }, [mobile])

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
        {CLIPS.map((c, i) => (
          <figure key={c.src} className={`t-clip ${mobile && i === cur ? 'on' : ''}`} style={{ ['--i' as string]: i }}>
            <video muted autoPlay loop playsInline preload="auto" poster={`${V}${c.src}-poster.jpg`} disablePictureInPicture aria-hidden
              onLoadedMetadata={e => { const v = e.currentTarget; if (c.start && v.duration) v.currentTime = c.start * v.duration }}>
              <source src={`${V}${c.src}.webm`} type="video/webm" />
              <source src={`${V}${c.src}.mp4`} type="video/mp4" />
            </video>
          </figure>
        ))}
      </div>

      <h1 className="sr-only">Briza Maldonado, tatuadora traditional en Palermo, Buenos Aires</h1>

      <div className="t-title">
        <div ref={word} className="t-fit" aria-hidden><span ref={text} className="t-name">Briza</span></div>
        <p className="t-swash swash" aria-hidden>Maldonado</p>
        <div className="t-row">
          <p>Tatuadora<br />traditional</p>
          <p>Palermo<br />Buenos Aires</p>
          <p className="t-row-hide">Vegan<br />tattoo artist</p>
          <div className="t-cta">
            <a href="#turno" className="cta-book" data-cursor="book">Pedir turno ●</a>
            <a href="#obra" className="t-link" data-cursor="view">Ver trabajos ↓</a>
          </div>
        </div>
      </div>
    </section>
  )
}
