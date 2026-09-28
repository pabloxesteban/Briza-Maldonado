'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const exhibition = [
  {
    num: '01',
    title: 'La Garza',
    style: 'Blackwork',
    placement: 'Antebrazo',
    note: 'Alas abiertas, plumas en capas. Un vuelo permanente.',
    src: '/Briza-Maldonado/portfolio/garza.jpg',
  },
  {
    num: '02',
    title: 'Polilla 777',
    style: 'Ornamental',
    placement: 'Esterno',
    note: 'Grande, oscura, simétrica. El centro del cuerpo.',
    src: '/Briza-Maldonado/portfolio/polilla-esterno.jpg',
  },
  {
    num: '03',
    title: 'Daga & Serpiente',
    style: 'Traditional',
    placement: 'Antebrazo',
    note: 'La daga como eje. La serpiente como vida.',
    src: '/Briza-Maldonado/portfolio/daga-serpiente.jpg',
  },
  {
    num: '04',
    title: 'El Lobo',
    style: 'Blackwork',
    placement: 'Brazo',
    note: 'Feroz, peludo, libre. Sin domesticar.',
    src: '/Briza-Maldonado/portfolio/lobo.jpg',
  },
  {
    num: '05',
    title: 'Patchwork',
    style: 'Traditional',
    placement: 'Manga completa',
    note: 'Sol, delfín, vaquero, olas. Una vida en la piel.',
    src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg',
  },
]

const gridWork = [
  { title: 'Alambre y Corazón', style: 'Blackwork',    src: '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg' },
  { title: 'Cocodrilo',          style: 'Blackwork',    src: '/Briza-Maldonado/portfolio/cocodrilo.jpg' },
  { title: 'Lockets de Gatos',   style: 'Fineline',     src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg' },
  { title: 'Mariposas',          style: 'Blackwork',    src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg' },
  { title: 'Moño y Corazón',     style: 'Ornamental',   src: '/Briza-Maldonado/portfolio/mono-corazon.jpg' },
  { title: 'Rosa',               style: 'Traditional',  src: '/Briza-Maldonado/portfolio/rosa-alambre.jpg' },
  { title: 'Espinas',            style: 'Fineline',     src: '/Briza-Maldonado/portfolio/espinas.jpg' },
  { title: 'Mariposa',           style: 'Blackwork',    src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg' },
  { title: 'Conejo',             style: 'Illustrativo', src: '/Briza-Maldonado/portfolio/conejo.jpg' },
  { title: 'Elefante Skater',    style: 'Cute',         src: '/Briza-Maldonado/portfolio/elefante-skate.jpg' },
  { title: 'Pingüino',           style: 'Fineline',     src: '/Briza-Maldonado/portfolio/pinguino.jpg' },
  { title: 'Vegan',              style: 'Lettering',    src: '/Briza-Maldonado/portfolio/vegan-script.jpg' },
]

const allWork = [
  ...exhibition.map(e => ({ title: e.title, style: e.style, src: e.src })),
  ...gridWork,
]

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────

function Lightbox({ index, onClose, onPrev, onNext }: {
  index: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  const item = allWork[index]
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(8,6,6,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease', cursor: 'none',
    }}>
      <button onClick={onClose} data-hover style={{
        position: 'absolute', top: '2rem', right: '2.5rem',
        background: 'none', border: 'none', color: 'rgba(250,232,240,0.2)',
        fontSize: '0.48rem', letterSpacing: '0.3em', textTransform: 'uppercase',
        cursor: 'none', zIndex: 10, transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.2)')}
      >esc · cerrar</button>

      <div style={{
        position: 'absolute', top: '2rem', left: '2.5rem',
        fontSize: '0.45rem', letterSpacing: '0.3em', color: 'rgba(250,232,240,0.14)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(index + 1).padStart(2, '0')} / {String(allWork.length).padStart(2, '0')}
      </div>

      {(['prev', 'next'] as const).map(dir => (
        <button key={dir} onClick={e => { e.stopPropagation(); dir === 'prev' ? onPrev() : onNext() }}
          data-hover style={{
            position: 'absolute', [dir === 'prev' ? 'left' : 'right']: '1.5rem',
            top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'rgba(250,232,240,0.1)',
            fontSize: '1.6rem', cursor: 'none', padding: '1.2rem',
            transition: 'color 0.2s', zIndex: 10,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.1)')}
        >
          {dir === 'prev' ? '←' : '→'}
        </button>
      ))}

      <div onClick={e => e.stopPropagation()} style={{
        display: 'flex', alignItems: 'center', gap: '4rem',
        maxWidth: '88vw', maxHeight: '92vh',
      }}>
        <div style={{ position: 'relative', width: 'min(42vw, 420px)', height: 'min(62vh, 560px)' }}>
          <Image key={item.src} src={item.src} alt={item.title} fill
            style={{ objectFit: 'contain' }} sizes="42vw" priority />
        </div>
        <div style={{ maxWidth: '13rem' }}>
          <p style={{
            fontSize: '0.44rem', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'var(--mark)', marginBottom: '1.4rem',
          }}>✦ {item.style}</p>
          <h3 className="font-display" style={{
            fontSize: 'clamp(2rem,4vw,3.4rem)', lineHeight: 0.92,
            letterSpacing: '-0.02em', fontStyle: 'italic', color: '#FAE8F0', marginBottom: '1.2rem',
          }}>{item.title}</h3>
          <div style={{ display: 'flex', gap: '5px', marginTop: '2.8rem', flexWrap: 'wrap' }}>
            {allWork.map((_, i) => (
              <div key={i} style={{
                width: i === index ? '22px' : '4px', height: '2px',
                background: i === index ? 'var(--mark)' : 'rgba(250,232,240,0.08)',
                transition: 'all 0.3s', borderRadius: '1px',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── EXHIBITION PIECE ──────────────────────────────────────────────────────────

function ExhibitionPiece({ piece, index, onOpen }: {
  piece: typeof exhibition[0]; index: number; onOpen: () => void
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  // Reveal on entry
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setRevealed(true); obs.disconnect() }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !imgWrapRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      imgWrapRef.current.style.transform = `translateY(${progress * -80}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const delay = (ms: number) => `${ms}ms`

  return (
    <div ref={sectionRef} style={{ height: '200vh', position: 'relative' }}>
      {/* STICKY PANEL */}
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'grid',
        gridTemplateColumns: '38% 62%',
        background: '#0C0A0A',
        overflow: 'hidden',
      }}>

        {/* ── LEFT: text column ────────────────────── */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem 0 3rem 3rem',
          zIndex: 2,
          borderRight: '1px solid rgba(250,232,240,0.04)',
        }}>
          {/* top meta: style + index */}
          <div ref={metaRef} style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(-12px)',
            transition: `opacity 0.8s ease ${delay(index * 60 + 200)}, transform 0.8s ease ${delay(index * 60 + 200)}`,
          }}>
            <p style={{
              fontSize: '0.42rem', letterSpacing: '0.4em', textTransform: 'uppercase',
              color: 'var(--mark)', marginBottom: '0.6rem',
            }}>✦ {piece.style}</p>
            <p style={{
              fontSize: '0.4rem', letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(250,232,240,0.25)',
            }}>{piece.placement}</p>
          </div>

          {/* center: number — oversized */}
          <div ref={numRef} style={{
            lineHeight: 0.85,
            opacity: revealed ? 1 : 0,
            transition: `opacity 1.2s ease ${delay(index * 60 + 100)}`,
          }}>
            <span className="font-display" style={{
              fontSize: 'clamp(7rem, 16vw, 18rem)',
              fontWeight: 900,
              letterSpacing: '-0.06em',
              color: 'rgba(250,232,240,0.06)',
              display: 'block',
              lineHeight: 0.85,
            }}>
              {piece.num}
            </span>
          </div>

          {/* bottom: title + note + cta */}
          <div>
            <div ref={titleRef} style={{ overflow: 'hidden', marginBottom: '1.2rem' }}>
              <h2 className="font-display" style={{
                fontSize: 'clamp(2rem, 4vw, 4rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                fontStyle: 'italic',
                color: 'rgba(250,232,240,0.9)',
                display: 'block',
                transform: revealed ? 'translateY(0)' : 'translateY(110%)',
                transition: `transform 1s cubic-bezier(0.77,0,0.175,1) ${delay(index * 60 + 300)}`,
              }}>
                {piece.title}
              </h2>
            </div>
            <p style={{
              fontSize: '0.75rem',
              lineHeight: 1.7,
              color: 'rgba(250,232,240,0.3)',
              fontStyle: 'italic',
              fontFamily: "'Playfair Display', serif",
              maxWidth: '22rem',
              marginBottom: '2rem',
              opacity: revealed ? 1 : 0,
              transition: `opacity 0.8s ease ${delay(index * 60 + 500)}`,
            }}>
              {piece.note}
            </p>
            <button
              onClick={onOpen}
              data-cursor="view"
              data-hover
              style={{
                background: 'none', border: 'none', cursor: 'none',
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                opacity: revealed ? 1 : 0,
                transition: `opacity 0.8s ease ${delay(index * 60 + 600)}`,
              }}
            >
              <span style={{
                fontSize: '0.42rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(250,232,240,0.4)',
              }}>
                Ver obra
              </span>
              <div style={{
                width: '2rem', height: '1px', background: 'rgba(250,232,240,0.2)',
              }} />
            </button>
          </div>
        </div>

        {/* ── RIGHT: image panel ───────────────────── */}
        <div
          onClick={onOpen}
          data-cursor="view"
          style={{
            position: 'relative',
            overflow: 'hidden',
            cursor: 'none',
          }}
        >
          {/* image with parallax */}
          <div ref={imgWrapRef} style={{
            position: 'absolute',
            inset: '-10% 0 -10% 0',
            willChange: 'transform',
          }}>
            <Image
              src={piece.src}
              alt={piece.title}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center top',
                transform: revealed ? 'scale(1)' : 'scale(1.06)',
                transition: 'transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                filter: 'brightness(0.82)',
              }}
              sizes="62vw"
              priority={index === 0}
            />
          </div>

          {/* clip reveal overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: '#0C0A0A',
            transform: revealed ? 'translateY(-100%)' : 'translateY(0)',
            transition: `transform 1.1s cubic-bezier(0.77,0,0.175,1) ${delay(index * 60 + 80)}`,
            zIndex: 2,
          }} />

          {/* left blend */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(12,10,10,0.7) 0%, transparent 30%)',
            zIndex: 1,
          }} />

          {/* bottom gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(12,10,10,0.65) 0%, transparent 40%)',
            zIndex: 1,
          }} />

          {/* vertical style tag — right edge */}
          <div style={{
            position: 'absolute', right: '1.5rem', top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            fontSize: '0.38rem', letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'rgba(250,232,240,0.18)',
            transformOrigin: 'center',
            zIndex: 3,
            opacity: revealed ? 1 : 0,
            transition: `opacity 1s ease ${delay(index * 60 + 700)}`,
          }}>
            {piece.style} — Briza Maldonado
          </div>

          {/* piece number bled over right edge */}
          <div style={{
            position: 'absolute', bottom: '1.5rem', right: '2rem',
            fontSize: '0.4rem', letterSpacing: '0.15em',
            color: 'rgba(250,232,240,0.2)',
            fontVariantNumeric: 'tabular-nums',
            zIndex: 3,
          }}>
            {piece.num} / 05
          </div>
        </div>

        {/* ── BOTTOM BORDER ─── thin pink line as separator when next piece loads */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: 'rgba(232,24,95,0.12)',
        }} />
      </div>
    </div>
  )
}

// ─── GRID ITEM ────────────────────────────────────────────────────────────────

function GridItem({ item, index, onOpen }: {
  item: typeof gridWork[0]; index: number; onOpen: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), (index % 4) * 60); obs.disconnect() } },
      { threshold: 0.05 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="view"
      style={{
        position: 'relative',
        aspectRatio: '3/4',
        overflow: 'hidden',
        cursor: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s ease ${(index % 4) * 55}ms, transform 0.7s ease ${(index % 4) * 55}ms`,
      }}
    >
      <Image
        src={item.src} alt={item.title} fill
        style={{
          objectFit: 'cover', objectPosition: 'center top',
          transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          filter: 'brightness(0.78)',
        }}
        sizes="25vw"
      />

      {/* hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,6,6,0.85) 0%, rgba(8,6,6,0.2) 45%, transparent 70%)',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.4s ease',
      }} />

      {/* style tag */}
      <div style={{
        position: 'absolute', top: '0.9rem', left: '0.9rem',
        fontSize: '0.38rem', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: hovered ? 'var(--mark)' : 'rgba(250,232,240,0.3)',
        transition: 'color 0.3s',
      }}>
        {item.style}
      </div>

      {/* title */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '1rem 0.9rem 0.85rem',
        transform: hovered ? 'translateY(0)' : 'translateY(6px)',
        opacity: hovered ? 1 : 0.5,
        transition: 'transform 0.35s ease, opacity 0.35s ease',
      }}>
        <p className="font-display" style={{
          fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
          fontStyle: 'italic',
          color: '#FAE8F0',
          lineHeight: 1.1,
        }}>
          {item.title}
        </p>
        <div style={{
          height: '1px', background: 'var(--mark)',
          width: hovered ? '3rem' : '0',
          transition: 'width 0.45s cubic-bezier(0.77,0,0.175,1)',
          marginTop: '0.4rem',
        }} />
      </div>
    </div>
  )
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [active, setActive] = useState<number | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVis, setHeaderVis] = useState(false)

  const prev = useCallback(() => setActive(i => i !== null ? (i - 1 + allWork.length) % allWork.length : null), [])
  const next = useCallback(() => setActive(i => i !== null ? (i + 1) % allWork.length : null), [])
  const close = useCallback(() => setActive(null), [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVis(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="obra" style={{ background: '#0C0A0A' }}>

      {/* ── SECTION HEADER ─── */}
      <div ref={headerRef} style={{
        padding: '8rem 3rem 6rem',
        borderBottom: '1px solid rgba(250,232,240,0.05)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* background ghost text */}
        <div style={{
          position: 'absolute', right: '-2%', bottom: '-10%',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(8rem, 20vw, 22rem)',
          fontStyle: 'italic', fontWeight: 900,
          color: 'rgba(250,232,240,0.03)',
          lineHeight: 0.8, letterSpacing: '-0.05em',
          pointerEvents: 'none', userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>Obra</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
          <div>
            <p style={{
              fontSize: '0.44rem', letterSpacing: '0.4em', textTransform: 'uppercase',
              color: 'rgba(250,232,240,0.2)', marginBottom: '2rem',
              opacity: headerVis ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}>
              ✦ Obra seleccionada
            </p>
            <div style={{ overflow: 'hidden' }}>
              <h2 className="font-display" style={{
                fontSize: 'clamp(3.5rem, 10vw, 12rem)',
                lineHeight: 0.88, letterSpacing: '-0.04em', fontStyle: 'italic',
                color: 'rgba(250,232,240,0.92)',
                display: 'block',
                transform: headerVis ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 1.1s cubic-bezier(0.77,0,0.175,1) 0.1s',
              }}>
                Trabajos
              </h2>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{
              fontSize: '0.44rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(250,232,240,0.15)', lineHeight: 2.2,
              opacity: headerVis ? 1 : 0,
              transition: 'opacity 0.8s ease 0.3s',
            }}>
              {allWork.length} piezas<br />
              scroll para descubrir<br />
              clic para ampliar
            </p>
          </div>
        </div>

        {/* marquee */}
        <div className="marquee" style={{ marginTop: '3rem', borderTop: '1px solid rgba(250,232,240,0.05)', paddingTop: '1.5rem' }}>
          <div className="marquee-inner">
            {Array(8).fill(null).map((_, i) => (
              <span key={i} style={{
                fontSize: '0.42rem', letterSpacing: '0.5em', textTransform: 'uppercase',
                color: 'rgba(250,232,240,0.08)', whiteSpace: 'nowrap', paddingRight: '4rem',
              }}>
                Blackwork · Fineline · Ornamental · Traditional · Illustrativo ✦&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXHIBITION PIECES ─── */}
      {exhibition.map((piece, i) => (
        <ExhibitionPiece
          key={piece.num}
          piece={piece}
          index={i}
          onOpen={() => setActive(i)}
        />
      ))}

      {/* ── MORE WORK HEADER ─── */}
      <div style={{
        padding: '5rem 3rem 3rem',
        borderTop: '1px solid rgba(250,232,240,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontStyle: 'italic',
          color: 'rgba(250,232,240,0.5)',
          lineHeight: 1,
        }}>
          Más obra
        </p>
        <p style={{
          fontSize: '0.42rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(250,232,240,0.15)',
        }}>
          {gridWork.length} piezas
        </p>
      </div>

      {/* ── GRID ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
        padding: '0 0 2px',
        background: '#0C0A0A',
      }}>
        {gridWork.map((item, i) => (
          <GridItem
            key={i}
            item={item}
            index={i}
            onOpen={() => setActive(exhibition.length + i)}
          />
        ))}
      </div>

      {active !== null && (
        <Lightbox index={active} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  )
}
