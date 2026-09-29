'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const P = '/Briza-Maldonado/'
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const photo = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const slot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const introPlaying = document.documentElement.dataset.intro === 'playing' ||
      (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const root = ref.current
    if (!root) return
    root.style.setProperty('--hero-delay', `${introPlaying ? 2.3 : 0.15}s`)
    const t = setTimeout(() => root.classList.add('in'), 30)

    // The photo is a full-screen layer clipped to the small window's rect; scrolling opens the clip to full bleed
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, cur = 0
    const tick = () => {
      const r = root.getBoundingClientRect()
      const target = reduce ? 0 : clamp(-r.top / Math.max(1, r.height - 2 * window.innerHeight))
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.0005) cur = target
      const s = slot.current?.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight
      const k = ease(cur)
      if (s && photo.current) {
        const top = s.top * (1 - k), left = s.left * (1 - k)
        const right = (vw - s.right) * (1 - k), bottom = (vh - s.bottom) * (1 - k)
        const rad = 36 * (1 - k)
        photo.current.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${rad}px)`
        const img = photo.current.firstElementChild as HTMLElement | null
        if (img) img.style.transform = `scale(${1.25 - 0.25 * k})`
      }
      if (content.current) {
        content.current.style.opacity = String(1 - clamp(cur * 4))
        content.current.style.transform = `translateY(${-cur * 90}px)`
        content.current.style.pointerEvents = cur > 0.2 ? 'none' : ''
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section ref={ref} className="hero hero--open">
      <div className="hero-stage">
        <div ref={content} className="hero-content">
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
          {/* Where the photo window sits before it opens */}
          <div ref={slot} className="hero-slot">
            <div className="hero-sticker hero-sticker--heart" style={{ ['--i' as string]: 4 }}>
              <Image src={P + 'flash/corazon-vegan-paper.png'} alt="" fill priority sizes="(max-width: 767px) 44vw, 20vw" style={{ objectFit: 'contain' }} />
            </div>
            <div className="hero-sticker hero-sticker--bird" style={{ ['--i' as string]: 5 }}>
              <Image src={P + 'flash/gorrion-paper.png'} alt="" fill sizes="12vw" style={{ objectFit: 'contain' }} />
            </div>
          </div>
          <div className="hero-sticker hero-sticker--berry" style={{ ['--i' as string]: 6 }}>
            <Image src={P + 'flash/frutilla-paper.png'} alt="" fill sizes="10vw" style={{ objectFit: 'contain' }} />
          </div>
        </div>

        <div ref={photo} className="hero-photo-layer" aria-hidden>
          <Image src={P + 'briza-tatuando.jpg'} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: '55% 30%' }} />
        </div>
      </div>
    </section>
  )
}
