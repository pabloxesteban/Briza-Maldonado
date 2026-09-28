'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const flashes = [
  // Top row: left · center · right
  { src: '/Briza-Maldonado/flash/mariposa-daga.png',     name: 'Mariposa con Daga', style: 'Blackwork',   price: '$50.000', available: true,  top: '2%',  left: '3%',   rot: -6,  size: 155 },
  { src: '/Briza-Maldonado/flash/frutilla.png',           name: 'Frutilla',          style: 'Blackwork',   price: '$40.000', available: true,  top: '0%',  left: '38%',  rot: 8,   size: 115 },
  { src: '/Briza-Maldonado/flash/corazon-vegan.png',      name: 'Corazón Vegan',     style: 'Traditional', price: '$55.000', available: true,  top: '4%',  left: '70%',  rot: -5,  size: 130 },
  // Middle row: left · right
  { src: '/Briza-Maldonado/flash/gorrion.png',            name: 'Gorrión',           style: 'Traditional', price: '$60.000', available: false, top: '40%', left: '18%',  rot: 7,   size: 140 },
  { src: '/Briza-Maldonado/flash/flor-hojas.png',         name: 'Flor con Hojas',    style: 'Traditional', price: '$45.000', available: true,  top: '36%', left: '60%',  rot: -9,  size: 125 },
  // Bottom row: left · right
  { src: '/Briza-Maldonado/flash/cerdo-cabra.png',        name: 'Cerdo & Cabra',     style: 'Traditional', price: '$65.000', available: true,  top: '65%', left: '5%',   rot: -4,  size: 145 },
  { src: '/Briza-Maldonado/flash/rosa-alambre-flash.png', name: 'Rosa con Alambre',  style: 'Blackwork',   price: '$50.000', available: true,  top: '62%', left: '52%',  rot: 10,  size: 135 },
]

function SpiralBinding() {
  return (
    <div style={{
      position: 'absolute',
      left: -18,
      top: '4%',
      height: '92%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      zIndex: 10,
    }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          width: 28,
          height: 18,
          borderRadius: '50%',
          border: '3px solid #1a1a1a',
          backgroundColor: 'transparent',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
        }} />
      ))}
    </div>
  )
}

function NotebookCover({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        margin: '0 auto',
        aspectRatio: '3/4',
        cursor: 'none',
        transform: hovered ? 'rotate(-1deg) scale(1.02)' : 'rotate(0deg) scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        filter: hovered
          ? 'drop-shadow(0 32px 64px rgba(232,24,95,0.35)) drop-shadow(0 8px 24px rgba(0,0,0,0.5))'
          : 'drop-shadow(0 16px 40px rgba(0,0,0,0.5))',
      }}
    >
      {/* Cover body */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'var(--mark)',
        borderRadius: '0 8px 8px 0',
        overflow: 'hidden',
      }}>
        {/* texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
          opacity: 0.6,
        }} />
        {/* subtle worn-cover gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.15) 0%, transparent 50%)',
        }} />

        {/* Tape label — title */}
        <div style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: 'translateX(-50%) rotate(-2deg)',
          backgroundColor: '#f0e8d8',
          padding: '0.7rem 2.2rem',
          width: '78%',
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            letterSpacing: '-0.02em',
            color: '#140E0E',
            lineHeight: 1,
          }}>Flash</p>
        </div>

        {/* Tape label — subtitle */}
        <div style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translateX(-50%) rotate(1.5deg)',
          backgroundColor: '#f0e8d8',
          padding: '0.5rem 1.8rem',
          width: '65%',
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)',
            color: '#140E0E',
            letterSpacing: '-0.01em',
          }}>Disponibles</p>
        </div>

        {/* ring holes — left side */}
        <div style={{ position: 'absolute', left: 18, top: '10%', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', left: 18, top: '50%', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }} />
        <div style={{ position: 'absolute', left: 18, top: '90%', width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }} />

        {/* click hint */}
        <div style={{
          position: 'absolute',
          bottom: '8%',
          width: '100%',
          textAlign: 'center',
          opacity: hovered ? 0.7 : 0.35,
          transition: 'opacity 0.3s',
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.45rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(250,232,240,0.9)',
          }}>
            abrir ↓
          </p>
        </div>
      </div>

      {/* Spiral binding */}
      <SpiralBinding />
    </div>
  )
}

function FlashItem({ flash, index, visible }: { flash: typeof flashes[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [popped, setPopped] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPopped(v => !v)}
      data-hover
      style={{
        position: 'absolute',
        top: flash.top,
        left: flash.left,
        width: flash.size,
        cursor: 'none',
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? `rotate(0deg) scale(1.15) translateY(-10px)`
            : `rotate(${flash.rot}deg) scale(1)`
          : `rotate(${flash.rot}deg) scale(0.6)`,
        transition: visible
          ? hovered
            ? 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease'
            : 'transform 0.4s ease, opacity 0.5s ease'
          : 'none',
        transitionDelay: visible ? `${index * 70}ms` : '0ms',
        zIndex: hovered || popped ? 20 : index + 1,
        filter: hovered
          ? 'drop-shadow(0 16px 32px rgba(0,0,0,0.3))'
          : 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
      }}
    >
      <div style={{ position: 'relative', width: flash.size, height: flash.size }}>
        <Image src={flash.src} alt={flash.name} fill style={{ objectFit: 'contain' }} sizes={`${flash.size}px`} />
      </div>

      {/* price tag that appears on hover */}
      <div style={{
        position: 'absolute',
        bottom: -28,
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: '0.95rem',
          color: flash.available ? '#c0392b' : '#888',
          letterSpacing: '0.01em',
          lineHeight: 1.1,
        }}>
          {flash.price}
        </p>
        {!flash.available && (
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '0.7rem',
            color: '#aaa',
          }}>agotado</p>
        )}
      </div>
    </div>
  )
}

function NotebookInterior({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false)
  const [itemsVisible, setItemsVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50)
    const t2 = setTimeout(() => setItemsVisible(true), 300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.96)',
      transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
      position: 'relative',
    }}>
      {/* Notebook outer */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        minHeight: 780,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        borderRadius: '0 8px 8px 0',
        overflow: 'visible',
      }}>
        <SpiralBinding />

        {/* Lined paper */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: 780,
          borderRadius: '0 8px 8px 0',
          overflow: 'hidden',
          backgroundColor: '#f7f4ee',
          backgroundImage: `
            repeating-linear-gradient(
              transparent,
              transparent 29px,
              #b8cfe0 29px,
              #b8cfe0 30px
            ),
            linear-gradient(to right, transparent 52px, #dfa0a0 52px, #dfa0a0 53px, transparent 53px)
          `,
          padding: '2.5rem 2.5rem 3rem 4rem',
        }}>

          {/* Header handwritten */}
          <div style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              color: '#1a1a5e',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}>
              Flash disponibles
            </p>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1rem',
              color: '#c0392b',
              marginTop: '0.2rem',
            }}>
              ✦ consultá por turno → @bri.t4tts
            </p>
          </div>

          {/* Flash items scattered on the paper */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: 600,
          }}>
            {flashes.map((flash, i) => (
              <FlashItem key={i} flash={flash} index={i} visible={itemsVisible} />
            ))}

            {/* handwritten annotations */}
            <div style={{
              position: 'absolute', bottom: '5%', right: '2%',
              fontFamily: "'Caveat', cursive",
              fontSize: '0.85rem',
              color: '#5a5a8a',
              transform: 'rotate(-3deg)',
              opacity: itemsVisible ? 0.7 : 0,
              transition: 'opacity 0.8s ease 0.6s',
            }}>
              1 diseño por cliente ✦
            </div>

            <div style={{
              position: 'absolute', bottom: '18%', left: '55%',
              fontFamily: "'Caveat', cursive",
              fontSize: '0.8rem',
              color: '#c0392b',
              transform: 'rotate(4deg)',
              opacity: itemsVisible ? 0.6 : 0,
              transition: 'opacity 0.8s ease 0.8s',
            }}>
              ← hover para ver precio
            </div>
          </div>

          {/* close button */}
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <button
              onClick={onClose}
              data-hover
              style={{
                background: 'none',
                border: 'none',
                fontFamily: "'Caveat', cursive",
                fontSize: '1rem',
                color: '#c0392b',
                cursor: 'none',
                textDecoration: 'underline',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
            >
              cerrar cuaderno ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Flash() {
  const [open, setOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <section
      id="flash"
      ref={sectionRef}
      style={{
        borderTop: '1px solid rgba(28,28,28,0.1)',
        padding: '5rem 2.5rem 6rem',
        overflow: 'visible',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '4rem' }}>
        <p className="font-display" style={{
          fontSize: 'clamp(2.5rem, 6vw, 6rem)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'var(--ink)',
          fontStyle: 'italic',
        }}>
          Flash disponibles
        </p>
      </div>

      {/* Notebook */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 0 3rem',
        minHeight: open ? 'auto' : 480,
        transition: 'min-height 0.4s ease',
      }}>
        {open
          ? <NotebookInterior onClose={() => setOpen(false)} />
          : <NotebookCover onClick={handleOpen} />
        }
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');
      `}</style>
    </section>
  )
}
