'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Stagger reveal lines
    const lines = nameRef.current?.querySelectorAll<HTMLElement>('[data-line]')
    lines?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.clipPath = 'inset(0 0% 0 0)'
      }, 300 + i * 180)
    })
  }, [])

  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
        display: 'grid',
        gridTemplateRows: '1fr auto',
      }}
    >
      {/* Portrait — full bleed, right half, fades left */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/Briza-Maldonado/briza-portrait.jpg"
          alt="Briza Maldonado"
          fill
          priority
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0,
            animation: 'fadeIn 2s ease 0.6s forwards',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.6) 55%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.6) 55%, black 100%)',
          }}
          sizes="100vw"
        />
        {/* Tint so text reads over photo */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, var(--bg) 0%, rgba(245,232,238,0.7) 35%, rgba(245,232,238,0.1) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 2.5rem 4.5rem',
          minHeight: '100vh',
        }}
      >
        {/* Vertical label */}
        <div
          style={{
            position: 'absolute', top: '7rem', left: '2.5rem',
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            opacity: 0, animation: 'fadeIn 0.8s ease 2.2s forwards',
          }}
        >
          Palermo · Buenos Aires
        </div>

        <div ref={nameRef}>
          {/* ✦ tag */}
          <p
            style={{
              fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'var(--mark)', marginBottom: '1.5rem',
              opacity: 0, animation: 'fadeIn 0.6s ease 0.2s forwards',
            }}
          >
            ✦ Tattoo Artist
          </p>

          {/* BRIZA */}
          <div style={{ overflow: 'hidden', lineHeight: 0.85 }}>
            <h1
              className="font-display"
              data-line
              style={{
                fontSize: 'clamp(6rem, 18vw, 20rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: 'var(--ink)',
                lineHeight: 0.85,
                display: 'block',
                clipPath: 'inset(0 100% 0 0)',
                opacity: 0,
                transition: 'clip-path 1.2s cubic-bezier(0.77,0,0.175,1), opacity 0.01s',
              }}
            >
              Briza
            </h1>
          </div>

          {/* MALDONADO — italic, inset */}
          <div
            style={{
              overflow: 'hidden', lineHeight: 0.88,
              paddingLeft: 'clamp(2rem, 8vw, 9rem)',
            }}
          >
            <h1
              className="font-display"
              data-line
              style={{
                fontSize: 'clamp(4.5rem, 14vw, 16rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                lineHeight: 0.88,
                display: 'block',
                clipPath: 'inset(0 100% 0 0)',
                opacity: 0,
                transition: 'clip-path 1.2s cubic-bezier(0.77,0,0.175,1) 0.18s, opacity 0.01s 0.18s',
              }}
            >
              Maldonado
            </h1>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              marginTop: '3rem',
              opacity: 0, animation: 'fadeIn 0.9s ease 1.6s forwards',
            }}
          >
            <p
              className="font-display"
              style={{
                fontSize: 'clamp(0.9rem, 1.4vw, 1.2rem)',
                fontStyle: 'italic',
                color: 'var(--ink-muted)',
                lineHeight: 1.5,
                maxWidth: '22rem',
              }}
            >
              Del iPad a la piel.<br />
              <span style={{ color: 'var(--mark)' }}>@bri.t4tts</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '1px', height: '52px', backgroundColor: 'var(--ink-muted)',
                  opacity: 0.3, transformOrigin: 'top',
                  animation: 'drawH 1s ease 2.5s both',
                }}
              />
              <span
                style={{
                  fontSize: '0.45rem', letterSpacing: '0.35em',
                  textTransform: 'uppercase', color: 'var(--ink-muted)', opacity: 0.4,
                }}
              >
                scroll
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scattered flash stickers in the hero — absolute positioned */}
      <div
        style={{
          position: 'absolute', top: '18%', right: '10%', zIndex: 3,
          width: 'clamp(90px, 12vw, 160px)', aspectRatio: '1',
          opacity: 0, animation: 'fadeIn 1s ease 1.8s forwards',
          ['--rot' as string]: '-6deg',
          animationName: 'fadeIn, floatA',
          animationDuration: '1s, 7s',
          animationDelay: '1.8s, 1.8s',
          animationFillMode: 'forwards, none',
          animationIterationCount: '1, infinite',
          animationTimingFunction: 'ease, ease-in-out',
        } as React.CSSProperties}
      >
        <Image
          src="/Briza-Maldonado/flash/rosa-alambre-flash.png"
          alt="" fill
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(20,14,14,0.2))' }}
          sizes="160px"
        />
      </div>
      <div
        style={{
          position: 'absolute', top: '42%', right: '24%', zIndex: 3,
          width: 'clamp(60px, 8vw, 100px)', aspectRatio: '1',
          opacity: 0, animation: 'fadeIn 1s ease 2.4s forwards',
          ['--rot' as string]: '12deg',
          animationName: 'fadeIn, floatC',
          animationDuration: '1s, 9s',
          animationDelay: '2.4s, 2.4s',
          animationFillMode: 'forwards, none',
          animationIterationCount: '1, infinite',
          animationTimingFunction: 'ease, ease-in-out',
        } as React.CSSProperties}
      >
        <Image
          src="/Briza-Maldonado/flash/mariposa-daga.png"
          alt="" fill
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(20,14,14,0.18))' }}
          sizes="100px"
        />
      </div>
    </section>
  )
}
