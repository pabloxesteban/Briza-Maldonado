'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const works = [
  {
    num: '01',
    title: 'Lobo',
    style: 'Blackwork · Illustrativo',
    year: '2024',
    note: 'Brazo. Feroz, peludo, libre. Una criatura que ocupa su espacio.',
    src: '/Briza-Maldonado/portfolio/lobo.jpg',
    alt: 'Tatuaje de lobo en blackwork illustrativo en el brazo',
    orientation: 'portrait',
  },
  {
    num: '02',
    title: 'Lockets de Gatos',
    style: 'Mixed · Color',
    year: '2024',
    note: 'Antebrazo. Tres gatitos enmarcados en medallones colgantes de un moño. Delicado y personal.',
    src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg',
    alt: 'Tatuaje de medallones corazón con gatos colgantes en el antebrazo',
    orientation: 'portrait',
  },
  {
    num: '03',
    title: 'Vegan',
    style: 'Lettering · Fineline',
    year: '2024',
    note: 'Pie. Una declaración elegante en script cursivo. Lo que sos, escrito en la piel.',
    src: '/Briza-Maldonado/portfolio/vegan-script.jpg',
    alt: 'Tatuaje lettering script Vegan en el pie',
    orientation: 'landscape',
  },
  {
    num: '04',
    title: 'Mariposas',
    style: 'Blackwork · Traditional',
    year: '2023',
    note: 'Rodillas. Dos polillas simétricas, una más detallada que la otra. El cuerpo como lienzo.',
    src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg',
    alt: 'Tatuaje de mariposas y polillas en las rodillas en blackwork traditional',
    orientation: 'portrait',
  },
  {
    num: '05',
    title: 'Patchwork Sleeve',
    style: 'Traditional · Mixed',
    year: '2024',
    note: 'Antebrazo. Sol, delfín, vaquero, olas. Cada imagen un mundo. Juntas, una historia.',
    src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg',
    alt: 'Manga patchwork con sol, delfín, vaquero y olas en traditional blackwork',
    orientation: 'portrait',
  },
]

function StencilBorder({ isHovered }: { isHovered: boolean }) {
  const rectRef = useRef<SVGRectElement>(null)

  useEffect(() => {
    const rect = rectRef.current
    if (!rect) return
    const svgEl = rect.closest('svg')
    if (!svgEl) return
    const w = svgEl.clientWidth || 400
    const h = svgEl.clientHeight || 500
    const perimeter = 2 * (w + h)
    rect.style.strokeDasharray = String(perimeter)
    rect.style.strokeDashoffset = isHovered ? '0' : String(perimeter)
    rect.style.transition = isHovered
      ? 'stroke-dashoffset 0.9s cubic-bezier(0.77,0,0.175,1)'
      : 'stroke-dashoffset 0.4s ease'
  }, [isHovered])

  return (
    <svg
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 2, overflow: 'visible',
      }}
    >
      <rect
        ref={rectRef}
        x="4" y="4"
        width="calc(100% - 8px)" height="calc(100% - 8px)"
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
          setTimeout(() => setRevealed(true), index * 80)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
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
        minHeight: '90vh',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(60px)',
        transition: 'opacity 1.1s ease, transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)',
        borderTop: '1px solid rgba(28,28,28,0.1)',
      }}
    >
      {/* Image */}
      <div
        style={{
          order: isEven ? 0 : 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'none',
          minHeight: '70vh',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-hover
      >
        <Image
          src={work.src}
          alt={work.alt}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: work.orientation === 'landscape' ? 'center 30%' : 'center top',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
          sizes="50vw"
        />

        {/* Stencil border tracing on hover */}
        <StencilBorder isHovered={hovered} />

        {/* Hover label */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'white',
            backgroundColor: 'var(--mark)',
            padding: '0.4rem 0.8rem',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            zIndex: 3,
          }}
        >
          ✦ {work.num}
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          order: isEven ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(3rem, 6vw, 7rem) clamp(2.5rem, 5vw, 5.5rem)',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--mark)',
              marginBottom: '3rem',
            }}
          >
            {work.num}
          </p>
          <h3
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
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
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              marginBottom: '3.5rem',
            }}
          >
            {work.style}
          </p>
          <p
            className="font-display"
            style={{
              fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)',
              fontStyle: 'italic',
              lineHeight: 1.75,
              color: 'var(--ink-muted)',
              maxWidth: '22rem',
            }}
          >
            "{work.note}"
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: 'var(--ink-muted)',
              opacity: 0.4,
            }}
          >
            {work.year}
          </span>
          <div
            style={{
              height: '1px',
              width: hovered ? '4rem' : '0',
              backgroundColor: 'var(--mark)',
              transition: 'width 0.7s cubic-bezier(0.77,0,0.175,1)',
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
            fontSize: '0.65rem',
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
