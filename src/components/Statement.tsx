'use client'

import { useEffect, useRef } from 'react'

// A short manifesto between the portrait and the work: the words ink themselves in as you read (scroll).
const WORDS = 'Tatúo traditional en Palermo. Líneas firmes, negro sólido y color que dura. Cada diseño se dibuja a mano y se tatúa'.split(' ')

export default function Statement() {
  const ref = useRef<HTMLElement>(null)
  const spans = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = ref.current
    if (!root) return
    root.classList.add('live')
    let raf = 0, cur = 0, last = -1
    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.top < vh && r.bottom > 0) {
        const target = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height * 0.9)))
        cur += (target - cur) * 0.12
        const n = cur * WORDS.length
        if (Math.abs(n - last) > 0.01) {
          last = n
          spans.current.forEach((s, i) => { if (s) s.style.opacity = String(0.14 + 0.86 * Math.min(1, Math.max(0, n - i))) })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section ref={ref} className="statement" aria-label="Sobre mi trabajo">
      <p className="statement-text">
        {WORDS.map((w, i) => <span key={i} ref={el => { spans.current[i] = el }}>{w} </span>)}
        <span className="swash statement-end">una sola vez.</span>
      </p>
    </section>
  )
}
