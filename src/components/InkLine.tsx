'use client'

import { useEffect, useRef, useState } from 'react'

// A hand-drawn magenta stroke that draws itself as it enters the screen, stitching one section to the next
export default function InkLine({ flip = false }: { flip?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect() } }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <svg ref={ref} className={`ink-line ${drawn ? 'drawn' : ''}`} viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path pathLength={1} d="M-10 30 C 120 22, 210 34, 330 27 S 560 18, 640 26 C 720 33, 800 20, 880 24 C 930 26, 960 30, 1010 22" />
    </svg>
  )
}
