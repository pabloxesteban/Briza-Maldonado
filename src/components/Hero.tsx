'use client'

import { useEffect, useRef, useState } from 'react'

const V = '/Briza-Maldonado/proceso/'
const CLIP = 'portada'
// Same footage in three columns: each keeps a third of the loop apart and frames a different part,
// so no two columns ever show the same moment
const OFFSETS = [0, 1 / 3, 2 / 3]

// Full-bleed studio footage, tinted to the site's pink/ink duotone, with her name set edge to edge.
// Desktop splits it into three staggered columns; phones show it once, full screen.
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

  // Keep the columns locked a third of a loop apart (independent loops drift and end up in sync)
  useEffect(() => {
    if (mobile) return
    const id = setInterval(() => {
      const vs = Array.from(ref.current?.querySelectorAll('video') ?? [])
      const lead = vs[0]
      if (!lead || !lead.duration) return
      const d = lead.duration
      vs.forEach((v, i) => {
        if (!i || v.readyState < 2) return
        const want = (lead.currentTime + OFFSETS[i] * d) % d
        let diff = Math.abs(v.currentTime - want); diff = Math.min(diff, d - diff)
        if (diff > 0.25) v.currentTime = want
      })
    }, 700)
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
        {(mobile ? [0] : OFFSETS).map((o, i) => (
          <figure key={i} className="t-clip" style={{ ['--i' as string]: i }}>
            <video muted autoPlay loop playsInline preload="auto" poster={`${V}${CLIP}-poster.jpg`} disablePictureInPicture aria-hidden
              onLoadedMetadata={e => { const v = e.currentTarget; if (o && v.duration) v.currentTime = o * v.duration }}>
              <source src={`${V}${CLIP}.webm`} type="video/webm" />
              <source src={`${V}${CLIP}.mp4`} type="video/mp4" />
            </video>
          </figure>
        ))}
      </div>

      <h1 className="sr-only">Briza Maldonado, tatuadora traditional en Palermo, Buenos Aires</h1>

      <div className="t-title">
        <p className="t-swash swash" aria-hidden>Maldonado</p>
        <div ref={word} className="t-fit" aria-hidden><span ref={text} className="t-name">Briza</span></div>
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
