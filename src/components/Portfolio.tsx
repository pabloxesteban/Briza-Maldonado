'use client'

import { useEffect, useRef } from 'react'

const works = [
  { num: '001', title: 'Mariposas', style: 'Blackwork', year: '2024', color: '#E8D5E0' },
  { num: '002', title: 'Polilla', style: 'Fineline', year: '2024', color: '#D5E0E8' },
  { num: '003', title: 'Corazón de alambres', style: 'Illustrativo', year: '2024', color: '#E8E0D5' },
  { num: '004', title: 'Garza', style: 'Watercolor', year: '2023', color: '#D5E8E0' },
  { num: '005', title: 'Moño', style: 'Ornamental', year: '2024', color: '#E8D5D5' },
  { num: '006', title: 'Patchwork', style: 'Mixed', year: '2024', color: '#E0D5E8' },
]

function WorkItem({ work, index }: { work: typeof works[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(60px)',
        transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
        transitionDelay: `${index * 0.05}s`,
        display: 'grid',
        gridTemplateColumns: isEven ? '1fr 1fr' : '1fr 1fr',
        gap: '0',
        borderTop: '1px solid rgba(28,28,28,0.12)',
      }}
    >
      {/* Image block */}
      <div
        className="overflow-hidden"
        style={{
          order: isEven ? 0 : 1,
          aspectRatio: '4/5',
          backgroundColor: work.color,
          position: 'relative',
        }}
      >
        <div
          className="img-hover w-full h-full flex items-center justify-center"
          style={{ fontSize: '4rem', opacity: 0.2 }}
        >
          ✦
        </div>
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(240,40,122,0.08)',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
        >
          <span className="font-display italic text-2xl" style={{ color: 'var(--accent-hot)' }}>
            ver
          </span>
        </div>
      </div>

      {/* Text block */}
      <div
        style={{
          order: isEven ? 1 : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(2rem, 5vw, 5rem)',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}
          >
            {work.num} — {work.style}
          </p>
          <h3
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              lineHeight: 1,
              color: 'var(--text-primary)',
              fontStyle: 'italic',
            }}
          >
            {work.title}
          </h3>
        </div>
        <p
          className="text-xs tracking-widest"
          style={{ color: 'var(--text-secondary)' }}
        >
          {work.year}
        </p>
      </div>
    </div>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" style={{ marginTop: '8rem' }}>
      {/* Section header */}
      <div
        style={{
          padding: '0 2.5rem 4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid rgba(28,28,28,0.12)',
        }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          ✦ Trabajos
        </h2>
        <p
          className="font-display italic"
          style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1, color: 'var(--text-primary)' }}
        >
          Obra
        </p>
      </div>

      {/* Works */}
      <div>
        {works.map((work, i) => (
          <WorkItem key={work.num} work={work} index={i} />
        ))}
      </div>
    </section>
  )
}
