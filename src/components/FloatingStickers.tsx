'use client'

import { useState } from 'react'
import Image from 'next/image'

const floaters = [
  {
    src: '/Briza-Maldonado/flash/mariposa-daga.png',
    size: 110, top: '12%', left: '4%', rot: -14,
    anim: 'floatA 6.5s ease-in-out infinite', delay: '0s',
    name: 'Mariposa con Daga', style: 'Blackwork', price: '$50.000', available: true,
  },
  {
    src: '/Briza-Maldonado/flash/frutilla.png',
    size: 78, top: '8%', right: '6%', rot: 10,
    anim: 'floatB 7.2s ease-in-out infinite', delay: '1.1s',
    name: 'Frutilla', style: 'Blackwork', price: '$40.000', available: true,
  },
  {
    src: '/Briza-Maldonado/flash/gorrion.png',
    size: 88, top: '38%', right: '2%', rot: -7,
    anim: 'floatC 8s ease-in-out infinite', delay: '0.4s',
    name: 'Gorrión', style: 'Traditional', price: '$60.000', available: false,
  },
  {
    src: '/Briza-Maldonado/flash/flor-hojas.png',
    size: 74, top: '62%', left: '2%', rot: 8,
    anim: 'floatA 5.8s ease-in-out infinite', delay: '2s',
    name: 'Flor con Hojas', style: 'Traditional', price: '$45.000', available: true,
  },
  {
    src: '/Briza-Maldonado/flash/corazon-vegan.png',
    size: 66, top: '78%', right: '4%', rot: -12,
    anim: 'floatB 9s ease-in-out infinite', delay: '0.7s',
    name: 'Corazón Vegan', style: 'Traditional', price: '$55.000', available: true,
  },
  {
    src: '/Briza-Maldonado/flash/cerdo-cabra.png',
    size: 84, top: '52%', left: '1%', rot: 5,
    anim: 'driftRight 7s ease-in-out infinite', delay: '1.8s',
    name: 'Cerdo & Cabra', style: 'Traditional', price: '$65.000', available: true,
  },
]

type Floater = typeof floaters[0]

function StickerTooltip({ f, onClose }: { f: Floater; onClose: () => void }) {
  return (
    <>
      {/* backdrop click to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 8998,
        }}
      />
      <div
        style={{
          position: 'absolute', top: '110%', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg)',
          border: '1px solid rgba(20,14,14,0.15)',
          padding: '0.9rem 1.2rem',
          whiteSpace: 'nowrap', zIndex: 8999,
          boxShadow: '0 8px 32px rgba(20,14,14,0.15)',
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: '0.85rem', color: 'var(--ink)',
          marginBottom: '0.3rem',
        }}>
          {f.name}
        </p>
        <p style={{ fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>
          {f.style}
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--ink)', fontWeight: 500 }}>{f.price}</span>
          <span style={{
            fontSize: '0.48rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: f.available ? 'var(--mark)' : 'var(--ink-muted)',
            padding: '0.2rem 0.5rem',
            border: `1px solid ${f.available ? 'var(--mark)' : 'rgba(107,79,87,0.3)'}`,
          }}>
            {f.available ? 'disponible' : 'agotado'}
          </span>
        </div>
        {f.available && (
          <p style={{ fontSize: '0.45rem', letterSpacing: '0.12em', color: 'var(--ink-muted)', marginTop: '0.5rem' }}>
            consultar en @bri.t4tts
          </p>
        )}
      </div>
    </>
  )
}

export default function FloatingStickers() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 80,
        overflow: 'hidden',
      }}
    >
      {floaters.map((f, i) => (
        <div
          key={i}
          onClick={() => setOpen(open === i ? null : i)}
          style={{
            position: 'absolute' as const,
            top: f.top,
            left: 'left' in f ? (f as { left?: string }).left : undefined,
            right: 'right' in f ? (f as { right?: string }).right : undefined,
            width: f.size,
            height: f.size,
            ['--rot' as string]: `${f.rot}deg`,
            animation: f.anim,
            animationDelay: f.delay,
            opacity: 0.6,
            filter: 'drop-shadow(0 4px 12px rgba(20,14,14,0.12))',
            pointerEvents: 'all',
            cursor: 'pointer',
            transition: 'opacity 0.2s, filter 0.2s',
          } as React.CSSProperties}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.opacity = '1'
            el.style.filter = 'drop-shadow(0 12px 28px rgba(20,14,14,0.25))'
            el.style.animationPlayState = 'paused'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.opacity = '0.6'
            el.style.filter = 'drop-shadow(0 4px 12px rgba(20,14,14,0.12))'
            el.style.animationPlayState = 'running'
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={f.src}
              alt={f.name}
              fill
              style={{
                objectFit: 'contain',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transform: open === i ? 'scale(1.15) rotate(0deg)' : 'scale(1)',
              }}
              sizes={`${f.size}px`}
            />
            {open === i && <StickerTooltip f={f} onClose={() => setOpen(null)} />}
          </div>
        </div>
      ))}
    </div>
  )
}
