'use client'

import { useEffect, useRef } from 'react'

// A quiet sign-off band before the footer: outlined words drifting slowly, nudged by the scroll
// (it follows the direction you scroll and speeds up a touch while you do).
const WORDS = ['Vegan tattoo artist', 'Palermo', 'Traditional', 'Buenos Aires']

export default function ImageStrip() {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, x = 0, dir = -1, boost = 0, lastY = window.scrollY, prev = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - prev); prev = now
      const y = window.scrollY, dy = y - lastY; lastY = y
      if (dy) dir = dy > 0 ? -1 : 1
      boost += (Math.min(30, Math.abs(dy)) - boost) * 0.08
      const el = track.current
      if (el) {
        const half = el.scrollWidth / 2
        x = (x + dir * (0.025 + boost * 0.012) * dt) % half
        if (x > 0) x -= half
        el.style.transform = `translate3d(${x}px, 0, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const set = WORDS.flatMap((w, i) => [
    <span key={`w${i}`} className={`ws-word ${i % 2 ? 'swash ws-soft' : ''}`}>{w}</span>,
    <i key={`s${i}`} aria-hidden>✦</i>,
  ])

  return (
    <div className="ws" aria-label="Vegan tattoo artist · Palermo · Traditional · Buenos Aires">
      <div ref={track} className="ws-track" aria-hidden>
        <div className="ws-set">{set}</div>
        <div className="ws-set">{set}</div>
      </div>
    </div>
  )
}
