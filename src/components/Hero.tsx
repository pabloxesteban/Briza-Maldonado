'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const flashStickers = [
  { src: '/Briza-Maldonado/flash/mariposa-daga.png', name: 'Mariposa con Daga', style: 'Blackwork', price: '$50.000', available: true,
    size: 88, bottom: '44%', left: '1%', rot: -14, anim: 'floatA 6.5s ease-in-out infinite', delay: '0s' },
  { src: '/Briza-Maldonado/flash/frutilla.png', name: 'Frutilla', style: 'Blackwork', price: '$40.000', available: true,
    size: 68, bottom: '60%', left: '16%', rot: 11, anim: 'floatB 7.2s ease-in-out infinite', delay: '1s' },
  { src: '/Briza-Maldonado/flash/gorrion.png', name: 'Gorrión', style: 'Traditional', price: '$60.000', available: false,
    size: 80, bottom: '72%', left: '4%', rot: -8, anim: 'floatC 8.5s ease-in-out infinite', delay: '0.5s' },
  { src: '/Briza-Maldonado/flash/flor-hojas.png', name: 'Flor con Hojas', style: 'Traditional', price: '$45.000', available: true,
    size: 66, bottom: '24%', left: '26%', rot: 7, anim: 'floatA 5.8s ease-in-out infinite', delay: '1.8s' },
  { src: '/Briza-Maldonado/flash/corazon-vegan.png', name: 'Corazón Vegan', style: 'Traditional', price: '$55.000', available: true,
    size: 60, bottom: '14%', left: '6%', rot: -10, anim: 'floatB 9s ease-in-out infinite', delay: '0.8s' },
  { src: '/Briza-Maldonado/flash/cerdo-cabra.png', name: 'Cerdo & Cabra', style: 'Traditional', price: '$65.000', available: true,
    size: 78, bottom: '50%', left: '36%', rot: 5, anim: 'driftRight 7s ease-in-out infinite', delay: '2s' },
  { src: '/Briza-Maldonado/flash/rosa-alambre-flash.png', name: 'Rosa con Alambre', style: 'Blackwork', price: '$50.000', available: true,
    size: 84, bottom: '32%', left: '46%', rot: -4, anim: 'floatC 7.8s ease-in-out infinite', delay: '1.3s' },
]

type Sticker = typeof flashStickers[0]

function StickerPin({ s }: { s: Sticker }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        position: 'absolute',
        width: s.size,
        height: s.size,
        bottom: s.bottom,
        left: s.left,
        ['--rot' as string]: `${s.rot}deg`,
        animation: s.anim,
        animationDelay: s.delay,
        cursor: 'pointer',
        zIndex: open ? 50 : 10,
      }}
      onClick={() => setOpen(v => !v)}
    >
      <div
        style={{
          position: 'relative', width: '100%', height: '100%',
          opacity: 0.8,
          filter: open
            ? 'drop-shadow(0 14px 30px rgba(20,14,14,0.3))'
            : 'drop-shadow(0 4px 12px rgba(20,14,14,0.12))',
          transform: open ? 'scale(1.18) rotate(0deg)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.25s, opacity 0.2s',
        }}
        onMouseEnter={e => {
          if (!open) {
            const el = e.currentTarget as HTMLElement
            el.style.opacity = '1'
            el.style.filter = 'drop-shadow(0 10px 22px rgba(20,14,14,0.25))'
            el.style.animationPlayState = 'paused'
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            const el = e.currentTarget as HTMLElement
            el.style.opacity = '0.8'
            el.style.filter = 'drop-shadow(0 4px 12px rgba(20,14,14,0.12))'
            el.style.animationPlayState = 'running'
          }
        }}
      >
        <Image src={s.src} alt={s.name} fill style={{ objectFit: 'contain' }} sizes={`${s.size}px`} />
      </div>

      {open && (
        <>
          <div onClick={e => { e.stopPropagation(); setOpen(false) }} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute',
            top: '115%', left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg)',
            border: '1px solid rgba(20,14,14,0.12)',
            padding: '0.9rem 1.1rem',
            whiteSpace: 'nowrap',
            zIndex: 51,
            boxShadow: '0 8px 28px rgba(20,14,14,0.14)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease',
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>
              {s.name}
            </p>
            <p style={{ fontSize: '0.47rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>
              {s.style}
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--ink)', fontWeight: 500 }}>{s.price}</span>
              <span style={{
                fontSize: '0.45rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '0.2rem 0.5rem',
                border: `1px solid ${s.available ? 'var(--mark)' : 'rgba(107,79,87,0.3)'}`,
                color: s.available ? 'var(--mark)' : 'var(--ink-muted)',
              }}>
                {s.available ? '✦ disponible' : 'agotado'}
              </span>
            </div>
            {s.available && (
              <p style={{ fontSize: '0.43rem', letterSpacing: '0.1em', color: 'var(--ink-muted)', marginTop: '0.4rem', opacity: 0.7 }}>
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

  useEffect(() => {
    const lines = nameRef.current?.querySelectorAll<HTMLElement>('[data-line]')
    lines?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.clipPath = 'inset(0 0% 0 0)'
      }, 300 + i * 200)
    })
  }, [])

  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'visible',
      }}
    >
      {/* Portrait — right side, contained so face always shows */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '55%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden',
      }}>
        <Image
          src="/Briza-Maldonado/briza-portrait.jpg"
          alt="Briza Maldonado"
          fill priority
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0,
            animation: 'fadeIn 2s ease 0.6s forwards',
          }}
          sizes="55vw"
        />
        {/* left-to-right fade into background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, var(--bg) 0%, rgba(245,232,238,0.3) 40%, transparent 100%)',
        }} />
        {/* bottom fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg) 0%, transparent 30%)',
        }} />
      </div>

      {/* Floating stickers — positioned relative to section, clustered around name */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        opacity: 0,
        animation: 'fadeIn 0.8s ease 2s forwards',
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'all' }}>
          {flashStickers.map((s, i) => <StickerPin key={i} s={s} />)}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          position: 'relative', zIndex: 6,
          padding: '0 2.5rem 4.5rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Vertical label */}
        <div style={{
          position: 'absolute', top: '7rem', left: '2.5rem',
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          opacity: 0, animation: 'fadeIn 0.8s ease 2.4s forwards',
        }}>
          Palermo · Buenos Aires
        </div>

        <div ref={nameRef}>
          <p style={{
            fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--mark)', marginBottom: '1.5rem',
            opacity: 0, animation: 'fadeIn 0.6s ease 0.2s forwards',
          }}>
            ✦ Tattoo Artist
          </p>

          {/* BRIZA */}
          <div style={{ overflow: 'hidden', lineHeight: 0.85 }}>
            <h1
              className="font-display"
              data-line
              style={{
                fontSize: 'clamp(6rem, 18vw, 20rem)',
                fontWeight: 900, letterSpacing: '-0.04em',
                color: 'var(--ink)', lineHeight: 0.85, display: 'block',
                clipPath: 'inset(0 100% 0 0)', opacity: 0,
                transition: 'clip-path 1.2s cubic-bezier(0.77,0,0.175,1), opacity 0.01s',
              }}
            >
              Briza
            </h1>
          </div>

          {/* MALDONADO */}
          <div style={{ overflow: 'hidden', lineHeight: 0.88, paddingLeft: 'clamp(2rem, 8vw, 9rem)' }}>
            <h1
              className="font-display"
              data-line
              style={{
                fontSize: 'clamp(4.5rem, 14vw, 16rem)',
                fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.03em',
                color: 'var(--ink)', lineHeight: 0.88, display: 'block',
                clipPath: 'inset(0 100% 0 0)', opacity: 0,
                transition: 'clip-path 1.2s cubic-bezier(0.77,0,0.175,1) 0.18s, opacity 0.01s 0.18s',
              }}
            >
              Maldonado
            </h1>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginTop: '3rem',
            opacity: 0, animation: 'fadeIn 0.9s ease 1.7s forwards',
          }}>
            <p className="font-display" style={{
              fontSize: 'clamp(0.9rem, 1.4vw, 1.2rem)',
              fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.5, maxWidth: '22rem',
            }}>
              Del iPad a la piel.<br />
              <span style={{ color: 'var(--mark)' }}>@bri.t4tts</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '1px', height: '52px', backgroundColor: 'var(--ink-muted)',
                opacity: 0.3, transformOrigin: 'top',
                animation: 'drawH 1s ease 2.6s both',
              }} />
              <span style={{
                fontSize: '0.45rem', letterSpacing: '0.35em',
                textTransform: 'uppercase', color: 'var(--ink-muted)', opacity: 0.4,
              }}>
                scroll
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
