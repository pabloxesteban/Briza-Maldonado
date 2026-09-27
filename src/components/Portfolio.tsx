'use client'

import { useEffect, useRef, useState } from 'react'

const works = [
  {
    num: '01', title: 'Polilla', style: 'Blackwork · Fineline',
    year: '2024', note: 'Esterno. Inspirado en la quietud de lo nocturno.',
    color: '#E8D5E0', accent: '#D4A8BB',
  },
  {
    num: '02', title: 'Mariposas', style: 'Illustrativo',
    year: '2024', note: 'Rodillas. Simétricas, delicadas, permanentes.',
    color: '#D5E0E8', accent: '#A8C4D4',
  },
  {
    num: '03', title: 'Corazón Alambrado', style: 'Blackwork',
    year: '2024', note: 'Antebrazo. El amor como contradicción.',
    color: '#E8E0D5', accent: '#D4C4A8',
  },
  {
    num: '04', title: 'Garza', style: 'Watercolor · Fineline',
    year: '2023', note: 'Costilla. Delicadeza que ocupa espacio.',
    color: '#D5E8E0', accent: '#A8D4C4',
  },
  {
    num: '05', title: 'Moño Ornamental', style: 'Ornamental',
    year: '2024', note: 'Nuca. Objeto femenino con geometría precisa.',
    color: '#E8D5D5', accent: '#D4A8A8',
  },
  {
    num: '06', title: 'Patchwork Sleeve', style: 'Mixed Styles',
    year: '2024', note: 'Manga completa. Cada pieza un capítulo.',
    color: '#E0D5E8', accent: '#C4A8D4',
  },
]

function StencilBorder({ isHovered }: { isHovered: boolean }) {
  const rectRef = useRef<SVGRectElement>(null)

  useEffect(() => {
    const rect = rectRef.current
    if (!rect) return
    // Calculate perimeter for dash animation
    const w = rect.closest('svg')?.clientWidth || 300
    const h = rect.closest('svg')?.clientHeight || 400
    const perimeter = 2 * (w + h)
    rect.style.strokeDasharray = String(perimeter)
    rect.style.strokeDashoffset = isHovered ? '0' : String(perimeter)
    rect.style.transition = isHovered
      ? 'stroke-dashoffset 0.8s cubic-bezier(0.77,0,0.175,1)'
      : 'stroke-dashoffset 0.5s ease'
    rect.style.opacity = '1'
  }, [isHovered])

  return (
    <svg
      className="stencil-border"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
    >
      <rect
        ref={rectRef}
        x="3" y="3"
        width="calc(100% - 6px)" height="calc(100% - 6px)"
        fill="none"
        stroke="var(--mark)"
        strokeWidth="1.5"
        style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
      />
    </svg>
  )
}

function WorkItem({ work, index }: { work: typeof works[0]; index: number }) {
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
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  const isEven = index % 2 === 0

  return (
    <article
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '85vh',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 1s ease, transform 1s cubic-bezier(0.25,0.46,0.45,0.94)',
        borderTop: '1px solid rgba(28,28,28,0.1)',
      }}
    >
      {/* Image */}
      <div
        className="stencil-wrap"
        style={{
          order: isEven ? 0 : 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: work.color,
          cursor: 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-hover
      >
        {/* Placeholder — replace with <Image> when real photos available */}
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '65vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.15">
            <circle cx="40" cy="40" r="30" stroke="var(--ink)" strokeWidth="0.8" />
            <line x1="40" y1="10" x2="40" y2="70" stroke="var(--ink)" strokeWidth="0.8" />
            <line x1="10" y1="40" x2="70" y2="40" stroke="var(--ink)" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Stencil SVG border — traces on hover */}
        <StencilBorder isHovered={hovered} />

        {/* Hover label */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--mark)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          ✦ ver
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          order: isEven ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(3rem, 6vw, 6rem) clamp(2rem, 5vw, 5rem)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--mark)',
              marginBottom: '2.5rem',
            }}
          >
            {work.num}
          </p>
          <h3
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              fontStyle: 'italic',
              marginBottom: '1.5rem',
            }}
          >
            {work.title}
          </h3>
          <p
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              marginBottom: '3rem',
            }}
          >
            {work.style}
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              lineHeight: 1.7,
              color: 'var(--ink-muted)',
              maxWidth: '22rem',
              fontStyle: 'italic',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            "{work.note}"
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: 'var(--ink-muted)',
              opacity: 0.5,
            }}
          >
            {work.year}
          </span>
          {/* Thin decorative line */}
          <div
            style={{
              height: '1px',
              width: hovered ? '3rem' : '0',
              backgroundColor: 'var(--mark)',
              transition: 'width 0.6s cubic-bezier(0.77,0,0.175,1)',
            }}
          />
        </div>
      </div>
    </article>
  )
}

export default function Portfolio() {
  return (
    <section id="obra" style={{ marginTop: '6rem' }}>
      {/* Header */}
      <div
        style={{
          padding: '0 2.5rem 5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
          }}
        >
          ✦ Obra
        </h2>
        <p
          className="font-display"
          style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            fontStyle: 'italic',
          }}
        >
          Trabajos
        </p>
      </div>

      {works.map((work, i) => (
        <WorkItem key={work.num} work={work} index={i} />
      ))}
    </section>
  )
}
