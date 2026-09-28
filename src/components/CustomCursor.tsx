'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)
  const hovering = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const isHover = !!(el?.closest('[data-hover], a, button, [role="button"]'))
      if (isHover !== hovering.current) {
        hovering.current = isHover
        if (ringRef.current) {
          ringRef.current.style.width = isHover ? '56px' : '32px'
          ringRef.current.style.height = isHover ? '56px' : '32px'
          ringRef.current.style.borderColor = isHover ? 'var(--mark)' : 'var(--ink)'
          ringRef.current.style.opacity = isHover ? '0.6' : '0.25'
        }
      }
    }

    const lerp = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1
      ring.current.y += (pos.current.y - ring.current.y) * 0.1
      if (ringRef.current) {
        const w = parseFloat(ringRef.current.style.width || '32')
        const h = parseFloat(ringRef.current.style.height || '32')
        ringRef.current.style.transform = `translate(${ring.current.x - w / 2}px, ${ring.current.y - h / 2}px)`
      }
      raf.current = requestAnimationFrame(lerp)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    raf.current = requestAnimationFrame(lerp)
    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
      document.body.style.cursor = ''
    }
  }, [])

  return (
    <>
      {/* dot */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '5px', height: '5px',
        borderRadius: '50%',
        backgroundColor: 'var(--mark)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-100px,-100px)',
        marginLeft: '-2.5px', marginTop: '-2.5px',
      }} />
      {/* ring */}
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '32px', height: '32px',
        borderRadius: '50%',
        border: '1px solid var(--ink)',
        opacity: 0.25,
        pointerEvents: 'none',
        zIndex: 9998,
        transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s, opacity 0.3s',
      }} />
    </>
  )
}
