'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lineRef.current) lineRef.current.style.width = '100%'
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ padding: '0 2.5rem 4rem' }}
    >
      {/* Top right year mark */}
      <div
        className="absolute top-8 right-10 text-xs tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)', writingMode: 'vertical-rl' }}
      >
        Buenos Aires — 2024
      </div>

      {/* Symbol top left */}
      <div
        className="absolute"
        style={{ top: '7rem', left: '2.5rem', fontSize: '1rem', color: 'var(--accent-hot)', opacity: 0.5 }}
      >
        ✦
      </div>

      {/* Main title */}
      <div className="relative z-10" style={{ paddingBottom: '2rem' }}>
        <h1
          className="font-display leading-none select-none"
          style={{
            fontSize: 'clamp(4rem, 14vw, 14rem)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
          }}
        >
          <span className="block overflow-hidden">
            <span
              className="block"
              style={{
                transform: 'translateY(110%)',
                animation: 'slideUp 1s cubic-bezier(0.77,0,0.175,1) 0.1s forwards',
              }}
            >
              Briza
            </span>
          </span>
          <span
            className="block overflow-hidden"
            style={{ paddingLeft: 'clamp(2rem, 8vw, 10rem)' }}
          >
            <span
              className="block"
              style={{
                transform: 'translateY(110%)',
                animation: 'slideUp 1s cubic-bezier(0.77,0,0.175,1) 0.25s forwards',
                fontStyle: 'italic',
              }}
            >
              Maldonado
            </span>
          </span>
        </h1>

        {/* Horizontal rule */}
        <div
          ref={lineRef}
          style={{
            height: '1px',
            width: '0%',
            backgroundColor: 'var(--text-primary)',
            marginTop: '3rem',
            transition: 'width 1.2s cubic-bezier(0.77,0,0.175,1)',
            opacity: 0.2,
          }}
        />

        {/* Bottom row */}
        <div
          className="flex justify-between items-end"
          style={{ marginTop: '1.5rem' }}
        >
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)', opacity: 0, animation: 'fadeIn 0.8s ease 1.2s forwards' }}
          >
            Tattoo Artist — Palermo, Buenos Aires
          </p>
          <div style={{ textAlign: 'right', opacity: 0, animation: 'fadeIn 0.8s ease 1.4s forwards' }}>
            <p className="font-display italic" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', color: 'var(--text-secondary)' }}>
              Del iPad a la piel ✦
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
