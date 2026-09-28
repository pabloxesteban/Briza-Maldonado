'use client'

import { useEffect, useRef } from 'react'

type CursorState = 'default' | 'hover' | 'view' | 'book' | 'drag'

function getCursorState(el: Element | null): CursorState {
  if (!el) return 'default'
  const closest = el.closest('[data-cursor], a, button, [role="button"], [data-hover]')
  if (!closest) return 'default'
  const state = (closest as HTMLElement).dataset.cursor
  if (state === 'view') return 'view'
  if (state === 'book') return 'book'
  if (state === 'drag') return 'drag'
  return 'hover'
}

const STATE_STYLES: Record<CursorState, { size: number; border: string; opacity: number; label?: string; bg?: string }> = {
  default: { size: 32,  border: 'var(--ink)',  opacity: 0.25 },
  hover:   { size: 56,  border: 'var(--mark)', opacity: 0.6 },
  view:    { size: 72,  border: 'var(--mark)', opacity: 1,   label: 'VER',  bg: 'var(--mark)' },
  book:    { size: 72,  border: 'var(--mark)', opacity: 1,   label: 'TURNO', bg: 'var(--ink)' },
  drag:    { size: 56,  border: 'var(--ink)',  opacity: 0.5, label: '⟷' },
}

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })
  const raf     = useRef<number>(0)
  const curState = useRef<CursorState>('default')

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const state = getCursorState(el)
      if (state === curState.current) return
      curState.current = state

      const s = STATE_STYLES[state]
      const r = ringRef.current
      const l = labelRef.current
      if (!r || !l) return

      r.style.width  = `${s.size}px`
      r.style.height = `${s.size}px`
      r.style.borderColor = s.border
      r.style.opacity = String(s.opacity)
      r.style.backgroundColor = s.bg ?? 'transparent'

      if (s.label) {
        l.textContent = s.label
        l.style.opacity = '1'
        l.style.color = s.bg === 'var(--mark)' ? '#FAE8F0' : '#FAE8F0'
      } else {
        l.style.opacity = '0'
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

    // Only enable on non-touch/desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

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
    <div className="custom-cursor-root">
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
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '32px', height: '32px',
        borderRadius: '50%',
        border: '1px solid var(--ink)',
        opacity: 0.25,
        pointerEvents: 'none',
        zIndex: 9998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'width 0.3s ease, height 0.3s ease, border-color 0.25s, opacity 0.25s, background-color 0.25s',
      }}>
        <span ref={labelRef} style={{
          fontSize: '0.38rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#FAE8F0',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          opacity: 0,
          transition: 'opacity 0.2s',
          userSelect: 'none',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}
