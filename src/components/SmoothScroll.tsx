'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Allow other components to pause/resume Lenis (e.g. lightbox)
    const onStop = () => lenis.stop()
    const onStart = () => lenis.start()
    window.addEventListener('lenis:stop', onStop)
    window.addEventListener('lenis:start', onStart)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      window.removeEventListener('lenis:stop', onStop)
      window.removeEventListener('lenis:start', onStart)
    }
  }, [])

  return <>{children}</>
}
