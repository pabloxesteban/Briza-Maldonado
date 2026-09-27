'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const stickers = [
  { src: '/Briza-Maldonado/flash/mariposa-daga.png', alt: 'Mariposa con daga', rot: -8, x: 0, y: 0, scale: 1.05 },
  { src: '/Briza-Maldonado/flash/corazon-vegan.png', alt: 'Corazón Vegan', rot: 4, x: 2, y: 1, scale: 0.95 },
  { src: '/Briza-Maldonado/flash/frutilla.png', alt: 'Frutilla', rot: -3, x: -1, y: 2, scale: 0.88 },
  { src: '/Briza-Maldonado/flash/flor-hojas.png', alt: 'Flor con hojas', rot: 7, x: 1, y: -1, scale: 0.92 },
  { src: '/Briza-Maldonado/flash/gorrion.png', alt: 'Gorrión', rot: -5, x: 0, y: 1, scale: 1.0 },
  { src: '/Briza-Maldonado/flash/rosa-alambre-flash.png', alt: 'Rosa con alambre', rot: 9, x: -2, y: 0, scale: 0.97 },
  { src: '/Briza-Maldonado/flash/cerdo-cabra.png', alt: 'Cerdo y cabra', rot: -6, x: 1, y: -2, scale: 1.02 },
]

const flashes = [
  { id: 'F—01', name: 'Mariposa con Daga', style: 'Blackwork', price: '$50.000', available: true },
  { id: 'F—02', name: 'Corazón Vegan', style: 'Traditional', price: '$55.000', available: true },
  { id: 'F—03', name: 'Frutilla', style: 'Blackwork', price: '$40.000', available: true },
  { id: 'F—04', name: 'Flor con Hojas', style: 'Traditional', price: '$45.000', available: true },
  { id: 'F—05', name: 'Gorrión', style: 'Traditional', price: '$60.000', available: false },
  { id: 'F—06', name: 'Rosa con Alambre', style: 'Blackwork', price: '$50.000', available: true },
  { id: 'F—07', name: 'Cerdo & Cabra', style: 'Traditional', price: '$65.000', available: true },
]

function StickerItem({ sticker, index }: { sticker: typeof stickers[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), index * 80)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        transform: revealed
          ? hovered
            ? `rotate(0deg) scale(1.12) translateY(-8px)`
            : `rotate(${sticker.rot}deg) scale(${sticker.scale})`
          : `rotate(${sticker.rot}deg) scale(0.7)`,
        opacity: revealed ? 1 : 0,
        transition: hovered
          ? 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease, filter 0.25s ease'
          : 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s ease, filter 0.3s ease',
        filter: hovered
          ? 'drop-shadow(0 16px 32px rgba(28,28,28,0.25)) drop-shadow(0 4px 8px rgba(28,28,28,0.15))'
          : 'drop-shadow(0 4px 12px rgba(28,28,28,0.12))',
        cursor: 'none',
        zIndex: hovered ? 10 : 1,
      }}
    >
      <Image
        src={sticker.src}
        alt={sticker.alt}
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 40vw, 14vw"
      />
      {/* Flash number on hover */}
      <div
        style={{
          position: 'absolute',
          bottom: '-1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.5rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--mark)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
      >
        {flashes[index]?.id} — {flashes[index]?.name}
      </div>
    </div>
  )
}

function FlashRow({ flash, index }: { flash: typeof flashes[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), index * 60)
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        display: 'grid',
        gridTemplateColumns: '5rem 1fr 8rem 7rem 5rem',
        alignItems: 'center',
        padding: '1.6rem 0',
        borderTop: '1px solid rgba(28,28,28,0.08)',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
        backgroundColor: hovered && flash.available ? 'rgba(240,40,122,0.03)' : 'transparent',
        cursor: flash.available ? 'none' : 'default',
      }}
    >
      <span style={{
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        color: hovered ? 'var(--mark)' : 'var(--ink-muted)',
        transition: 'color 0.2s',
      }}>
        {flash.id}
      </span>

      <div>
        <span className="font-display" style={{
          fontSize: 'clamp(1rem, 2vw, 1.5rem)',
          fontStyle: 'italic',
          color: 'var(--ink)',
          display: 'block',
          lineHeight: 1.2,
        }}>
          {flash.name}
        </span>
        <div style={{
          height: '1px',
          backgroundColor: 'var(--mark)',
          width: hovered && flash.available ? '100%' : '0%',
          transition: 'width 0.5s cubic-bezier(0.77,0,0.175,1)',
          marginTop: '0.4rem',
          maxWidth: '14rem',
        }} />
      </div>

      <span style={{
        fontSize: '0.55rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)',
        opacity: 0.6,
      }}>
        {flash.style}
      </span>

      <span style={{
        fontSize: '0.8rem',
        color: 'var(--ink)',
      }}>
        {flash.price}
      </span>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {flash.available ? (
          <a
            href="https://instagram.com/bri.t4tts"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: hovered ? 'var(--mark)' : 'var(--ink-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              borderBottom: hovered ? '1px solid var(--mark)' : '1px solid transparent',
              paddingBottom: '1px',
            }}
          >
            consultar →
          </a>
        ) : (
          <span style={{
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            opacity: 0.3,
          }}>
            agotado
          </span>
        )}
      </div>
    </div>
  )
}

export default function Flash() {
  return (
    <section
      id="flash"
      style={{
        borderTop: '1px solid rgba(28,28,28,0.1)',
        padding: '5rem 2.5rem 6rem',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '5rem',
      }}>
        <h2 className="font-display" style={{
          fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
        }}>
          ✦ Flash
        </h2>
        <div style={{ textAlign: 'right' }}>
          <p className="font-display" style={{
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            fontStyle: 'italic',
          }}>
            Disponibles
          </p>
          <p style={{
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginTop: '0.75rem',
            opacity: 0.6,
          }}>
            Diseños únicos — uno por cliente
          </p>
        </div>
      </div>

      {/* Sticker wall */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2rem',
        marginBottom: '6rem',
        padding: '2rem 0 3rem',
      }}>
        {stickers.map((s, i) => (
          <StickerItem key={i} sticker={s} index={i} />
        ))}
      </div>

      {/* Table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '5rem 1fr 8rem 7rem 5rem',
        padding: '0.75rem 0',
        borderBottom: '1px solid rgba(28,28,28,0.15)',
        marginBottom: '0.5rem',
      }}>
        {['Ref', 'Diseño', 'Estilo', 'Precio', ''].map((col, i) => (
          <span key={i} style={{
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            opacity: 0.5,
            textAlign: i === 4 ? 'right' : 'left',
          }}>
            {col}
          </span>
        ))}
      </div>

      {flashes.map((f, i) => (
        <FlashRow key={f.id} flash={f} index={i} />
      ))}

      <div style={{ borderTop: '1px solid rgba(28,28,28,0.08)' }} />
    </section>
  )
}
