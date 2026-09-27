'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef(false)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
      el.style.opacity = '1'
    }

    const onEnter = () => {
      hoveredRef.current = true
      el.style.transform = 'translate(-50%, -50%) scale(1.6) rotate(22deg)'
      el.style.color = 'var(--mark)'
    }
    const onLeave = () => {
      hoveredRef.current = false
      el.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)'
      el.style.color = 'var(--ink)'
    }

    document.addEventListener('mousemove', onMove)

    const bindElements = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(node => {
        node.addEventListener('mouseenter', onEnter)
        node.addEventListener('mouseleave', onLeave)
      })
    }
    bindElements()

    const observer = new MutationObserver(bindElements)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), color 0.15s ease',
        fontSize: '14px',
        color: 'var(--ink)',
        opacity: 0,
        mixBlendMode: 'multiply',
        userSelect: 'none',
        lineHeight: 1,
      }}
    >
      ✦
    </div>
  )
}
