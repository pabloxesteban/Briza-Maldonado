'use client'

import { useEffect, useState } from 'react'

const BASE = '/Briza-Maldonado/_img/brand/'

// First visit per session: the heart gets "tattooed" — black line and shading first, then the colour —
// and the screen lifts away.
export default function Intro() {
  const [phase, setPhase] = useState<'line' | 'color' | 'out' | 'gone'>('line')
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('bm-intro') === '1'; sessionStorage.setItem('bm-intro', '1') } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase('gone'); return }
    const t = [
      setTimeout(() => setPhase('color'), 950),
      setTimeout(() => setPhase('out'), 1850),
      setTimeout(() => setPhase('gone'), 2600),
    ]
    return () => t.forEach(clearTimeout)
  }, [])
  if (phase === 'gone') return null
  return (
    <div className={`intro ${phase === 'out' ? 'out' : ''}`} aria-hidden>
      <div className="intro-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}logo-ink-640.webp`} alt="" className="intro-ink" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}logo-640.webp`} alt="" className={`intro-color ${phase !== 'line' ? 'on' : ''}`} />
      </div>
    </div>
  )
}
