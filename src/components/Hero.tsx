'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const flashStickers = [
  { src: '/Briza-Maldonado/flash/mariposa-daga.png',    name: 'Mariposa con Daga', style: 'Blackwork',   price: '$50.000', available: true,  size: 100, top: '6%',  left: '2%',  rot: -14, anim: 'floatA 6.5s ease-in-out infinite', delay: '0s' },
  { src: '/Briza-Maldonado/flash/gorrion.png',           name: 'Gorrión',           style: 'Traditional', price: '$60.000', available: false, size: 84,  top: '18%', left: '20%', rot: -8,  anim: 'floatC 8.5s ease-in-out infinite', delay: '0.5s' },
  { src: '/Briza-Maldonado/flash/rosa-alambre-flash.png',name: 'Rosa con Alambre',  style: 'Blackwork',   price: '$50.000', available: true,  size: 92,  top: '32%', left: '5%',  rot: -4,  anim: 'floatC 7.8s ease-in-out infinite', delay: '1.3s' },
  { src: '/Briza-Maldonado/flash/frutilla.png',          name: 'Frutilla',          style: 'Blackwork',   price: '$40.000', available: true,  size: 70,  top: '46%', left: '28%', rot: 11,  anim: 'floatB 7.2s ease-in-out infinite', delay: '1s' },
  { src: '/Briza-Maldonado/flash/cerdo-cabra.png',       name: 'Cerdo & Cabra',     style: 'Traditional', price: '$65.000', available: true,  size: 86,  top: '58%', left: '2%',  rot: 5,   anim: 'driftRight 7s ease-in-out infinite', delay: '2s' },
  { src: '/Briza-Maldonado/flash/flor-hojas.png',        name: 'Flor con Hojas',    style: 'Traditional', price: '$45.000', available: true,  size: 72,  top: '70%', left: '22%', rot: 7,   anim: 'floatA 5.8s ease-in-out infinite', delay: '1.8s' },
  { src: '/Briza-Maldonado/flash/corazon-vegan.png',     name: 'Corazón Vegan',     style: 'Traditional', price: '$55.000', available: true,  size: 66,  top: '80%', left: '5%',  rot: -10, anim: 'floatB 9s ease-in-out infinite', delay: '0.8s' },
]

type Sticker = typeof flashStickers[0]

function StickerPin({ s, mouseX, mouseY }: { s: Sticker; mouseX: number; mouseY: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // subtle parallax based on mouse position
  const px = (mouseX - 0.5) * -18 * (s.size / 100)
  const py = (mouseY - 0.5) * -12 * (s.size / 100)

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        width: s.size,
        height: s.size,
        top: s.top,
        left: s.left,
        ['--rot' as string]: `${s.rot}deg`,
        animation: open ? 'none' : s.anim,
        animationDelay: s.delay,
        cursor: 'pointer',
        zIndex: open ? 50 : 10,
        transform: open ? 'scale(1.2)' : `translate(${px}px, ${py}px)`,
        transition: open ? 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' : 'transform 0.6s ease',
      }}
      onClick={() => setOpen(v => !v)}
    >
      <div
        style={{
          position: 'relative', width: '100%', height: '100%',
          opacity: 0.82,
          filter: open
            ? 'drop-shadow(0 16px 32px rgba(20,14,14,0.35))'
            : 'drop-shadow(0 4px 14px rgba(20,14,14,0.14))',
          transition: 'opacity 0.25s, filter 0.25s',
        }}
        onMouseEnter={e => {
          if (!open) {
            const el = e.currentTarget as HTMLElement
            el.style.opacity = '1'
            el.style.filter = 'drop-shadow(0 12px 24px rgba(20,14,14,0.28))'
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            const el = e.currentTarget as HTMLElement
            el.style.opacity = '0.82'
            el.style.filter = 'drop-shadow(0 4px 14px rgba(20,14,14,0.14))'
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
            bottom: '115%', left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg)',
            border: '1px solid rgba(20,14,14,0.1)',
            padding: '1rem 1.2rem',
            whiteSpace: 'nowrap',
            zIndex: 51,
            boxShadow: '0 12px 36px rgba(20,14,14,0.16)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.18s ease',
          }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.3rem' }}>
              {s.name}
            </p>
            <p style={{ fontSize: '0.44rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '0.55rem' }}>
              {s.style}
            </p>
            <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', color: 'var(--ink)', fontWeight: 600 }}>{s.price}</span>
              <span style={{
                fontSize: '0.42rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '0.2rem 0.55rem',
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
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const lines = nameRef.current?.querySelectorAll<HTMLElement>('[data-line]')
    lines?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.clipPath = 'inset(0 0% 0 0)'
      }, 300 + i * 220)
    })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    el.addEventListener('mousemove', handle, { passive: true })
    return () => el.removeEventListener('mousemove', handle)
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
      {/* Portrait — right 52%, objectPosition tuned to show Briza's face */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '52%',
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
            objectPosition: '50% 62%',
            opacity: 0,
            animation: 'fadeIn 2.2s ease 0.5s forwards',
          }}
          sizes="52vw"
        />
        {/* gradient: left edge (blend into bg) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, var(--bg) 0%, rgba(245,232,238,0.55) 30%, transparent 65%)',
        }} />
        {/* gradient: bottom edge */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg) 0%, transparent 22%)',
        }} />
      </div>

      {/* Flash stickers — spread vertically on the left, parallax on mouse */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        opacity: 0,
        animation: 'fadeIn 1s ease 2.2s forwards',
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'all' }}>
          {flashStickers.map((s, i) => (
            <StickerPin key={i} s={s} mouseX={mouse.x} mouseY={mouse.y} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 6,
        padding: '0 2.5rem 4.5rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
      }}>
        {/* Vertical label */}
        <div style={{
          position: 'absolute', top: '7rem', left: '2.5rem',
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          fontSize: '0.48rem', letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          opacity: 0, animation: 'fadeIn 0.8s ease 2.6s forwards',
          pointerEvents: 'none',
        }}>
          Palermo · Buenos Aires
        </div>

        <div ref={nameRef} style={{ pointerEvents: 'none' }}>
          <p style={{
            fontSize: '0.52rem', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'var(--mark)', marginBottom: '1.5rem',
            opacity: 0, animation: 'fadeIn 0.6s ease 0.3s forwards',
          }}>
            ✦ Tattoo Artist
          </p>

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

          {/* Bottom bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginTop: '3rem',
            opacity: 0, animation: 'fadeIn 0.9s ease 1.8s forwards',
          }}>
            <p className="font-display" style={{
              fontSize: 'clamp(0.85rem, 1.3vw, 1.15rem)',
              fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.5, maxWidth: '22rem',
            }}>
              Del iPad a la piel.<br />
              <span style={{ color: 'var(--mark)' }}>@bri.t4tts</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '1px', height: '52px', backgroundColor: 'var(--ink-muted)',
                opacity: 0.3, transformOrigin: 'top',
                animation: 'drawH 1s ease 2.8s both',
              }} />
              <span style={{
                fontSize: '0.44rem', letterSpacing: '0.35em',
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
