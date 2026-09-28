'use client'

import { useEffect, useState } from 'react'

// Brief signature on first visit per session: the name, a pen stroke, then it lifts away
export default function Intro() {
  const [phase, setPhase] = useState<'show' | 'out' | 'gone'>('show')
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('bm-intro') === '1'; sessionStorage.setItem('bm-intro', '1') } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase('gone'); return }
    const a = setTimeout(() => setPhase('out'), 1050)
    const b = setTimeout(() => setPhase('gone'), 1850)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  if (phase === 'gone') return null
  return (
    <div className={`intro ${phase === 'out' ? 'out' : ''}`} aria-hidden>
      <div>
        <p className="intro-name">Briza Maldonado</p>
        <svg viewBox="0 0 360 24" preserveAspectRatio="none">
          <path pathLength={1} d="M4 14 C 60 8, 120 18, 190 12 S 300 6, 356 11" />
        </svg>
      </div>
    </div>
  )
}
