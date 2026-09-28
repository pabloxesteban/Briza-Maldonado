'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const flashStickers = [
  { src: '/Briza-Maldonado/flash/mariposa-daga.png',     name: 'Mariposa con Daga', style: 'Blackwork',   price: '$50.000', available: true,  size: 150, top: '5%',  left: '28%', rot: -14, anim: 'floatA 6.5s ease-in-out infinite', delay: '0s' },
  { src: '/Briza-Maldonado/flash/gorrion.png',            name: 'Gorrión',           style: 'Traditional', price: '$60.000', available: false, size: 130, top: '14%', left: '62%', rot: -8,  anim: 'floatC 8.5s ease-in-out infinite', delay: '0.5s' },
  { src: '/Briza-Maldonado/flash/rosa-alambre-flash.png', name: 'Rosa con Alambre',  style: 'Blackwork',   price: '$50.000', available: true,  size: 140, top: '32%', left: '45%', rot: -4,  anim: 'floatC 7.8s ease-in-out infinite', delay: '1.3s' },
  { src: '/Briza-Maldonado/flash/frutilla.png',           name: 'Frutilla',          style: 'Blackwork',   price: '$40.000', available: true,  size: 115, top: '50%', left: '4%',  rot: 11,  anim: 'floatB 7.2s ease-in-out infinite', delay: '1s' },
  { src: '/Briza-Maldonado/flash/cerdo-cabra.png',        name: 'Cerdo & Cabra',     style: 'Traditional', price: '$65.000', available: true,  size: 135, top: '58%', left: '55%', rot: 5,   anim: 'driftRight 7s ease-in-out infinite', delay: '2s' },
  { src: '/Briza-Maldonado/flash/flor-hojas.png',         name: 'Flor con Hojas',    style: 'Traditional', price: '$45.000', available: true,  size: 112, top: '74%', left: '18%', rot: 7,   anim: 'floatA 5.8s ease-in-out infinite', delay: '1.8s' },
  { src: '/Briza-Maldonado/flash/corazon-vegan.png',      name: 'Corazón Vegan',     style: 'Traditional', price: '$55.000', available: true,  size: 105, top: '80%', left: '40%', rot: -10, anim: 'floatB 9s ease-in-out infinite', delay: '0.8s' },
]

type Sticker = typeof flashStickers[0]

function StickerPin({ s, mouseX, mouseY, isOpen, onToggle }: {
  s: Sticker; mouseX: number; mouseY: number; isOpen: boolean; onToggle: () => void
}) {
  const px = (mouseX - 0.5) * -28 * (s.size / 130)
  const py = (mouseY - 0.5) * -18 * (s.size / 130)

  // Determine if sticker is in top half → tooltip goes below; bottom half → tooltip goes above
  const topPct = parseFloat(s.top)
  const tooltipAbove = topPct >= 45

  return (
    <div
      style={{
        position: 'absolute',
        width: s.size,
        height: s.size,
        top: s.top,
        left: s.left,
        ['--rot' as string]: `${s.rot}deg`,
        animation: isOpen ? 'none' : s.anim,
        animationDelay: s.delay,
        cursor: 'pointer',
        zIndex: isOpen ? 100 : 30,
        transform: isOpen ? 'scale(1.18)' : `translate(${px}px, ${py}px)`,
        transition: isOpen ? 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' : 'transform 0.7s ease',
      }}
      onClick={onToggle}
    >
      <div
        style={{
          position: 'relative', width: '100%', height: '100%',
          filter: isOpen
            ? 'drop-shadow(0 18px 38px rgba(20,14,14,0.4))'
            : 'drop-shadow(0 6px 18px rgba(20,14,14,0.18))',
          transition: 'filter 0.25s',
        }}
        onMouseEnter={e => {
          if (!isOpen) {
            const el = e.currentTarget as HTMLElement
            el.style.filter = 'drop-shadow(0 14px 28px rgba(20,14,14,0.32))'
          }
        }}
        onMouseLeave={e => {
          if (!isOpen) {
            const el = e.currentTarget as HTMLElement
            el.style.filter = 'drop-shadow(0 6px 18px rgba(20,14,14,0.18))'
          }
        }}
      >
        <Image src={s.src} alt={s.name} fill style={{ objectFit: 'contain' }} sizes={`${s.size}px`} />
      </div>

      {isOpen && (
        <>
          <div onClick={e => { e.stopPropagation(); onToggle() }} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{
            position: 'absolute',
            ...(tooltipAbove
              ? { bottom: '115%' }
              : { top: '115%' }),
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg)',
            border: '1px solid rgba(20,14,14,0.1)',
            padding: '1.1rem 1.4rem',
            whiteSpace: 'nowrap',
            zIndex: 101,
            boxShadow: '0 14px 42px rgba(20,14,14,0.18)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease',
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.3rem' }}>
              {s.name}
            </p>
            <p style={{ fontSize: '0.45rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '0.6rem' }}>
              {s.style}
            </p>
            <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--ink)', fontWeight: 700 }}>{s.price}</span>
              <span style={{
                fontSize: '0.42rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '0.25rem 0.6rem',
                border: `1px solid ${s.available ? 'var(--mark)' : 'rgba(107,79,87,0.3)'}`,
                color: s.available ? 'var(--mark)' : 'var(--ink-muted)',
              }}>
                {s.available ? '✦ disponible' : 'agotado'}
              </span>
            </div>
            {s.available && (
              <p style={{ fontSize: '0.42rem', letterSpacing: '0.1em', color: 'var(--ink-muted)', marginTop: '0.45rem', opacity: 0.65 }}>
                consultar → @bri.t4tts
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const lines = nameRef.current?.querySelectorAll<HTMLElement>('[data-line]')
    lines?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.clipPath = 'inset(0 0% 0 0)'
      }, 300 + i * 220)
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Portrait — far right */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '46%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        <Image
          src="/Briza-Maldonado/briza-portrait.jpg"
          alt="Briza Maldonado"
          fill priority
          style={{
            objectFit: 'cover',
            objectPosition: '30% 55%',
            opacity: 0,
            animation: 'fadeIn 2.2s ease 0.5s forwards',
          }}
          sizes="46vw"
        />
        {/* left fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, var(--bg) 0%, rgba(245,232,238,0.5) 15%, transparent 45%)',
        }} />
        {/* bottom fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg) 0%, transparent 22%)',
        }} />
      </div>

      {/* Name */}
      <div
        ref={nameRef}
        style={{
          position: 'relative', zIndex: 10,
          padding: '0 2.5rem 5rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {/* BRIZA */}
        <div style={{ overflow: 'hidden', lineHeight: 0.85 }}>
          <h1 className="font-display" data-line style={{
            fontSize: 'clamp(6rem, 18vw, 20rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: 'var(--ink)', lineHeight: 0.85, display: 'block',
            clipPath: 'inset(0 100% 0 0)', opacity: 0,
            transition: 'clip-path 1.3s cubic-bezier(0.77,0,0.175,1), opacity 0.01s',
          }}>
            Briza
          </h1>
        </div>

        {/* MALDONADO */}
        <div style={{ overflow: 'hidden', lineHeight: 0.88, paddingLeft: 'clamp(2rem, 8vw, 9rem)' }}>
          <h1 className="font-display" data-line style={{
            fontSize: 'clamp(4.5rem, 14vw, 16rem)',
            fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.03em',
            color: 'var(--ink)', lineHeight: 0.88, display: 'block',
            clipPath: 'inset(0 100% 0 0)', opacity: 0,
            transition: 'clip-path 1.3s cubic-bezier(0.77,0,0.175,1) 0.2s, opacity 0.01s 0.2s',
          }}>
            Maldonado
          </h1>
        </div>

        {/* scroll indicator only */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          marginTop: '2.5rem',
          opacity: 0, animation: 'fadeIn 0.9s ease 1.8s forwards',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '1px', height: '48px', backgroundColor: 'var(--ink-muted)',
              opacity: 0.28, transformOrigin: 'top',
              animation: 'drawH 1s ease 2.8s both',
            }} />
            <span style={{
              fontSize: '0.42rem', letterSpacing: '0.38em',
              textTransform: 'uppercase', color: 'var(--ink-muted)', opacity: 0.35,
            }}>
              scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
