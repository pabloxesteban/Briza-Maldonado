'use client'

import Image from 'next/image'

const images = [
  '/Briza-Maldonado/portfolio/garza.jpg',
  '/Briza-Maldonado/portfolio/lobo.jpg',
  '/Briza-Maldonado/portfolio/polilla-esterno.jpg',
  '/Briza-Maldonado/portfolio/daga-serpiente.jpg',
  '/Briza-Maldonado/portfolio/lockets-gatos.jpg',
  '/Briza-Maldonado/portfolio/cocodrilo.jpg',
  '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg',
  '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg',
  '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg',
  '/Briza-Maldonado/portfolio/mono-corazon.jpg',
]

// Duplicate for seamless loop
const strip = [...images, ...images]

export default function ImageStrip() {
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(28,28,28,0.08)',
        borderBottom: '1px solid rgba(28,28,28,0.08)',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Marquee row 1 — left */}
      <div style={{
        display: 'flex',
        animation: 'stripLeft 28s linear infinite',
        willChange: 'transform',
      }}>
        {strip.map((src, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              width: '180px',
              height: '240px',
              flexShrink: 0,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
                filter: 'grayscale(20%) brightness(0.88)',
              }}
              sizes="180px"
            />
          </div>
        ))}
      </div>

      {/* Label strip */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        <div style={{
          backgroundColor: 'var(--bg)',
          padding: '0.6rem 2rem',
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
        }}>
          {['Traditional', '✦', 'Black & white', '✦', 'Color'].map((t, i) => (
            <span key={i} style={{
              fontSize: '0.5rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: t === '✦' ? 'var(--mark)' : 'var(--ink-muted)',
              whiteSpace: 'nowrap',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes stripLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
