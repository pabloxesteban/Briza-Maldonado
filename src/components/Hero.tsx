'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const lines = containerRef.current?.querySelectorAll<HTMLElement>('[data-line]')
    lines?.forEach((line, i) => {
      setTimeout(() => {
        line.style.opacity = '1'
        line.style.transform = 'scaleX(1)'
      }, 400 + i * 200)
    })
  }, [])

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 2.5rem 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background tattoo image — right side, fades into text */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '52%',
          height: '100%',
          opacity: 0,
          animation: 'fadeIn 1.8s ease 0.8s forwards',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <Image
          src="/Briza-Maldonado/portfolio/garza.jpg"
          alt=""
          fill
          priority
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.85) 60%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.85) 60%, black 100%)',
          }}
          sizes="52vw"
        />
        {/* Tint overlay so it blends with bg color */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--bg)',
          opacity: 0.35,
        }} />
      </div>

      {/* Location — top left */}
      <div
        style={{
          position: 'absolute',
          top: '8rem',
          left: '2.5rem',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          opacity: 0,
          animation: 'fadeIn 0.8s ease 2s forwards',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          zIndex: 2,
        }}
      >
        Palermo · Buenos Aires · 2024
      </div>

      {/* Main title */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Line above BRIZA */}
        <div
          data-line
          style={{
            height: '1px',
            backgroundColor: 'var(--ink)',
            opacity: 0,
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.9s cubic-bezier(0.77,0,0.175,1), opacity 0s',
            marginBottom: '1.5rem',
            width: 'clamp(8rem, 20vw, 20rem)',
          }}
        />

        {/* BRIZA */}
        <div style={{ overflow: 'hidden' }}>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(5rem, 16vw, 16rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              transform: 'translateY(110%)',
              animation: 'slideUp 1.1s cubic-bezier(0.77,0,0.175,1) 0.2s forwards',
              display: 'block',
            }}
          >
            Briza
          </h1>
        </div>

        {/* MALDONADO */}
        <div style={{ overflow: 'hidden', paddingLeft: 'clamp(3rem, 10vw, 12rem)' }}>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(4rem, 13vw, 13rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              fontStyle: 'italic',
              color: 'var(--ink)',
              transform: 'translateY(110%)',
              animation: 'slideUp 1.1s cubic-bezier(0.77,0,0.175,1) 0.4s forwards',
              display: 'block',
            }}
          >
            Maldonado
          </h1>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '3rem',
          }}
        >
          <p
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              opacity: 0,
              animation: 'fadeIn 0.8s ease 1.3s forwards',
            }}
          >
            Tattoo Artist
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: 0,
              animation: 'fadeIn 0.8s ease 1.8s forwards',
            }}
          >
            <div
              style={{
                width: '1px',
                height: '48px',
                backgroundColor: 'var(--ink-muted)',
                opacity: 0.3,
                animation: 'drawV 1s ease 2s forwards',
                transformOrigin: 'top',
                transform: 'scaleY(0)',
              }}
            />
            <span
              style={{
                fontSize: '0.5rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                opacity: 0.5,
              }}
            >
              scroll
            </span>
          </div>

          <p
            className="font-display"
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
              fontStyle: 'italic',
              color: 'var(--ink-muted)',
              opacity: 0,
              animation: 'fadeIn 0.8s ease 1.5s forwards',
            }}
          >
            Del iPad a la piel <span style={{ color: 'var(--mark)' }}>✦</span>
          </p>
        </div>
      </div>
    </section>
  )
}
