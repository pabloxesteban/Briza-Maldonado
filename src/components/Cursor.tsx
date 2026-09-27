'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    let trailCount = 0
    const MAX_TRAIL = 12

    const onMove = (e: MouseEvent) => {
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
      el.style.opacity = '1'

      // Ink trail
      if (trailCount >= MAX_TRAIL) return
      trailCount++
      const dot = document.createElement('div')
      dot.textContent = '✦'
      dot.style.cssText = `
        position:fixed;
        left:${e.clientX}px;
        top:${e.clientY}px;
        transform:translate(-50%,-50%) scale(${0.4 + Math.random() * 0.5});
        font-size:10px;
        color:var(--mark);
        pointer-events:none;
        z-index:9998;
        opacity:0.6;
        transition:opacity 0.6s ease, transform 0.6s ease;
        mix-blend-mode:multiply;
        user-select:none;
        line-height:1;
      `
      document.body.appendChild(dot)
      requestAnimationFrame(() => {
        dot.style.opacity = '0'
        dot.style.transform = `translate(-50%,-60%) scale(${0.2 + Math.random() * 0.3})`
      })
      setTimeout(() => {
        dot.remove()
        trailCount--
      }, 650)
    }

    const onEnter = () => {
      el.style.transform = 'translate(-50%, -50%) scale(1.8) rotate(22deg)'
      el.style.color = 'var(--mark)'
    }
    const onLeave = () => {
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
        lineHeight: '1',
      }}
    >
      ✦
    </div>
  )
}
