'use client'

import { useEffect, useRef, useState } from 'react'

const stages = [
  {
    num: '01',
    label: 'Idea',
    description: 'Todo empieza como una imagen en la mente. Una conversación. Un flash de inspiración.',
    color: '#F5E6EC',
    icon: '◯',
  },
  {
    num: '02',
    label: 'Diseño',
    description: 'Del concepto al iPad. El boceto toma forma digital antes de tocar ninguna piel.',
    color: '#EBE6F5',
    icon: '△',
  },
  {
    num: '03',
    label: 'Stencil',
    description: 'El diseño se imprime, se recorta, se prueba sobre el cuerpo. El mapa antes del viaje.',
    color: '#E6F5EB',
    icon: '□',
  },
  {
    num: '04',
    label: 'Agujas',
    description: 'La aguja toca la piel. El trazo se vuelve permanente. La mano guía.',
    color: '#F5EBE6',
    icon: '✦',
  },
  {
    num: '05',
    label: 'Obra',
    description: 'Curado, fotografiado, eterno. Del iPad a la piel. El proceso completo.',
    color: '#FAE8F0',
    icon: '✿',
  },
]

export default function Process() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const pct = el.scrollLeft / (el.scrollWidth - el.clientWidth)
      const idx = Math.round(pct * (stages.length - 1))
      setActive(Math.max(0, Math.min(stages.length - 1, idx)))
    }

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      startX.current = e.pageX - el.offsetLeft
      scrollStart.current = el.scrollLeft
      el.style.cursor = 'grabbing'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const x = e.pageX - el.offsetLeft
      el.scrollLeft = scrollStart.current - (x - startX.current)
    }
    const onMouseUp = () => {
      isDragging.current = false
      el.style.cursor = 'grab'
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <section
      id="proceso"
      style={{
        borderTop: '1px solid rgba(28,28,28,0.1)',
        paddingTop: '5rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0 2.5rem 4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <p
          className="font-display"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
          }}
        >
          Del iPad <span style={{ fontStyle: 'italic' }}>a la piel</span>
        </p>
      </div>

      {/* Stage indicators */}
      <div
        style={{
          padding: '0 2.5rem 2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {stages.map((s, i) => (
          <div
            key={i}
            onClick={() => {
              const el = scrollRef.current
              if (!el) return
              const pct = i / (stages.length - 1)
              el.scrollTo({ left: pct * (el.scrollWidth - el.clientWidth), behavior: 'smooth' })
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              opacity: active === i ? 1 : 0.3,
              transition: 'opacity 0.3s ease',
            }}
            data-hover
          >
            <div
              style={{
                width: active === i ? '2rem' : '0.4rem',
                height: '1px',
                backgroundColor: active === i ? 'var(--mark)' : 'var(--ink)',
                transition: 'width 0.4s cubic-bezier(0.77,0,0.175,1)',
              }}
            />
            <span
              style={{
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: active === i ? 'var(--mark)' : 'var(--ink-muted)',
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollRef}
        className="h-scroll-container"
        data-cursor="drag"
        style={{
          display: 'flex',
          padding: '0 2.5rem 5rem',
          gap: '1.5rem',
        }}
      >
        {stages.map((stage, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 'clamp(280px, 35vw, 420px)',
              backgroundColor: stage.color,
              padding: '3.5rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '420px',
              position: 'relative',
              transition: 'transform 0.3s ease',
              transform: active === i ? 'translateY(-8px)' : 'translateY(0)',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  marginBottom: '2rem',
                }}
              >
                {stage.num}
              </p>
              <div
                style={{
                  fontSize: '3rem',
                  color: active === i ? 'var(--mark)' : 'var(--ink)',
                  opacity: active === i ? 0.6 : 0.15,
                  marginBottom: '2rem',
                  transition: 'color 0.3s ease, opacity 0.3s ease',
                  lineHeight: 1,
                }}
              >
                {stage.icon}
              </div>
              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                  fontStyle: i % 2 === 0 ? 'normal' : 'italic',
                  marginBottom: '1.5rem',
                }}
              >
                {stage.label}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  color: 'var(--ink-muted)',
                }}
              >
                {stage.description}
              </p>
            </div>

            {/* Active indicator */}
            {active === i && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  right: '2rem',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: 'var(--mark)',
                  textTransform: 'uppercase',
                }}
              >
                ✦
              </div>
            )}
          </div>
        ))}

        {/* End spacer */}
        <div style={{ flexShrink: 0, width: '2.5rem' }} />
      </div>

      {/* Drag hint */}
      <div
        style={{
          padding: '0 2.5rem 5rem',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <p
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            opacity: 0.4,
          }}
        >
          ← arrastrar →
        </p>
      </div>
    </section>
  )
}
