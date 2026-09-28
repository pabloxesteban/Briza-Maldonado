'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

const gallery = [
  { title: 'La Garza',           style: 'Blackwork',    note: 'Antebrazo. Alas abiertas, plumas en capas.',      src: '/Briza-Maldonado/portfolio/garza.jpg',             aspect: 1.35 },
  { title: 'Polilla 777',        style: 'Ornamental',   note: 'Esterno. Grande, oscura, simétrica.',             src: '/Briza-Maldonado/portfolio/polilla-esterno.jpg',   aspect: 1.1 },
  { title: 'Cocodrilo',          style: 'Blackwork',    note: 'Antebrazo. Escamas en capas, cola enroscada.',    src: '/Briza-Maldonado/portfolio/cocodrilo.jpg',          aspect: 0.85 },
  { title: 'Alambre y Corazón',  style: 'Blackwork',    note: 'Brazo. Alambre de púas, corazón rojo, daga.',     src: '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg', aspect: 1.5 },
  { title: 'Daga con Serpiente', style: 'Traditional',  note: 'Antebrazo. La daga como eje.',                    src: '/Briza-Maldonado/portfolio/daga-serpiente.jpg',    aspect: 1.2 },
  { title: 'Lockets de Gatos',   style: 'Fineline',     note: 'Antebrazo. Tres gatitos en medallones.',          src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg',     aspect: 0.75 },
  { title: 'El Lobo',            style: 'Blackwork',    note: 'Brazo. Feroz, peludo, libre.',                    src: '/Briza-Maldonado/portfolio/lobo.jpg',              aspect: 1.0 },
  { title: 'Mariposas Rodillas', style: 'Blackwork',    note: 'Rodillas. Dos polillas simétricas.',              src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg', aspect: 1.4 },
  { title: 'Patchwork Sleeve',   style: 'Traditional',  note: 'Sol, delfín, vaquero, olas.',                    src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg',  aspect: 0.9 },
  { title: 'Moño y Corazón',     style: 'Ornamental',   note: 'Antebrazo. Un moño con corazón.',                src: '/Briza-Maldonado/portfolio/mono-corazon.jpg',      aspect: 1.25 },
  { title: 'Rosa',               style: 'Traditional',  note: 'Rosa con alambre de púas.',                       src: '/Briza-Maldonado/portfolio/rosa-alambre.jpg',      aspect: 1.15 },
  { title: 'Espinas',            style: 'Fineline',     note: 'Rama de espinas abstracta.',                      src: '/Briza-Maldonado/portfolio/espinas.jpg',           aspect: 0.7 },
  { title: 'Mariposa',           style: 'Blackwork',    note: 'Mariposa en pierna.',                             src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg',   aspect: 1.3 },
  { title: 'Conejo',             style: 'Illustrativo', note: 'Conejo tierno y extraño.',                        src: '/Briza-Maldonado/portfolio/conejo.jpg',            aspect: 1.05 },
  { title: 'Elefante Skater',    style: 'Cute',         note: 'Un elefante en skate.',                           src: '/Briza-Maldonado/portfolio/elefante-skate.jpg',    aspect: 0.95 },
  { title: 'Pingüino',           style: 'Fineline',     note: 'Pingüino con estrellitas.',                       src: '/Briza-Maldonado/portfolio/pinguino.jpg',          aspect: 1.45 },
  { title: 'Vegan',              style: 'Lettering',    note: 'Lettering en pie.',                               src: '/Briza-Maldonado/portfolio/vegan-script.jpg',      aspect: 0.8 },
]

// Distribute into 4 columns for masonry
const COLS = 4
function buildColumns() {
  const cols: (typeof gallery[0] & { colIndex: number; globalIndex: number })[][] = Array.from({ length: COLS }, () => [])
  gallery.forEach((item, i) => {
    cols[i % COLS].push({ ...item, colIndex: i % COLS, globalIndex: i })
  })
  return cols
}
const columns = buildColumns()

/* ─── LIGHTBOX ─── */
function Lightbox({ index, onClose, onPrev, onNext }: {
  index: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  const item = gallery[index]

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
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(8,6,6,0.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
        cursor: 'none',
      }}
    >
      <button onClick={onClose} data-hover style={{
        position: 'absolute', top: '2rem', right: '2.5rem',
        background: 'none', border: 'none', color: 'rgba(250,232,240,0.22)',
        fontSize: '0.48rem', letterSpacing: '0.3em', textTransform: 'uppercase',
        cursor: 'none', zIndex: 10, transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.22)')}
      >esc · cerrar</button>

      <div style={{
        position: 'absolute', top: '2rem', left: '2.5rem',
        fontSize: '0.45rem', letterSpacing: '0.3em', color: 'rgba(250,232,240,0.14)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
      </div>

      {(['prev', 'next'] as const).map(dir => (
        <button key={dir} onClick={e => { e.stopPropagation(); dir === 'prev' ? onPrev() : onNext() }} data-hover style={{
          position: 'absolute', [dir === 'prev' ? 'left' : 'right']: '1.5rem',
          top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: 'rgba(250,232,240,0.12)',
          fontSize: '1.6rem', cursor: 'none', padding: '1.2rem',
          transition: 'color 0.2s', zIndex: 10,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.12)')}
        >
          {dir === 'prev' ? '←' : '→'}
        </button>
      ))}

      <div onClick={e => e.stopPropagation()} style={{
        display: 'flex', alignItems: 'center', gap: '5rem',
        maxWidth: '88vw', maxHeight: '92vh',
      }}>
        <div style={{
          position: 'relative',
          width: 'min(42vw, 400px)',
          height: 'min(62vh, 540px)',
          overflow: 'hidden',
        }}>
          <Image key={item.src} src={item.src} alt={item.title} fill
            style={{ objectFit: 'contain' }} sizes="42vw" priority />
        </div>

        <div style={{ maxWidth: '14rem' }}>
          <p style={{
            fontSize: '0.44rem', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'var(--mark)', marginBottom: '1.4rem',
          }}>✦ {item.style}</p>
          <h3 className="font-display" style={{
            fontSize: 'clamp(2rem,4vw,3.4rem)', lineHeight: 0.92,
            letterSpacing: '-0.02em', fontStyle: 'italic', color: '#FAE8F0', marginBottom: '1.2rem',
          }}>{item.title}</h3>
          <p className="font-display" style={{
            fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.9,
            color: 'rgba(250,232,240,0.3)',
          }}>&ldquo;{item.note}&rdquo;</p>
          <div style={{ display: 'flex', gap: '5px', marginTop: '2.8rem', flexWrap: 'wrap' }}>
            {gallery.map((_, i) => (
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

/* ─── MASONRY ITEM ─── */
function MasonryItem({ item, onOpen }: {
  item: typeof gallery[0] & { colIndex: number; globalIndex: number }
  onOpen: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), item.globalIndex * 40); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [item.globalIndex])

  // Alternate offset: even columns start slightly lower for staggered feel
  const colOffset = item.colIndex % 2 === 1 ? '2.2rem' : '0rem'

  return (
    <div
      ref={ref}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        marginTop: item.globalIndex < COLS ? colOffset : '0',
        marginBottom: '1.2rem',
        cursor: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${item.globalIndex * 35}ms, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${item.globalIndex * 35}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(item.aspect) * 100}%`,
        overflow: 'hidden',
        background: '#111',
      }}>
        <Image
          src={item.src}
          alt={item.title}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
          sizes="25vw"
        />

        {/* hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(8,6,6,0.88) 0%, rgba(8,6,6,0.3) 50%, transparent 75%)'
            : 'linear-gradient(to top, rgba(8,6,6,0.55) 0%, transparent 50%)',
          transition: 'background 0.4s ease',
        }} />

        {/* style tag — top left */}
        <div style={{
          position: 'absolute', top: '0.8rem', left: '0.8rem',
          fontSize: '0.38rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          color: hovered ? 'var(--mark)' : 'rgba(250,232,240,0.35)',
          transition: 'color 0.3s',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {item.style}
        </div>

        {/* index number — top right */}
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.8rem',
          fontSize: '0.38rem', letterSpacing: '0.15em',
          color: 'rgba(250,232,240,0.15)',
          fontVariantNumeric: 'tabular-nums',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {String(item.globalIndex + 1).padStart(2, '0')}
        </div>

        {/* title — bottom, slides up on hover */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '1.2rem 0.9rem 0.9rem',
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          opacity: hovered ? 1 : 0.6,
          transition: 'transform 0.35s ease, opacity 0.35s ease',
        }}>
          <p className="font-display" style={{
            fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
            fontStyle: 'italic',
            color: '#FAE8F0',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            {item.title}
          </p>
          <div style={{
            height: '1px',
            background: 'var(--mark)',
            width: hovered ? '100%' : '0%',
            transition: 'width 0.5s cubic-bezier(0.77,0,0.175,1)',
            marginTop: '0.4rem',
          }} />
        </div>
      </div>
    </div>
  )
}

/* ─── PORTFOLIO ─── */
export default function Portfolio() {
  const [active, setActive] = useState<number | null>(null)
  const prev = useCallback(() => setActive(i => i !== null ? (i - 1 + gallery.length) % gallery.length : null), [])
  const next = useCallback(() => setActive(i => i !== null ? (i + 1) % gallery.length : null), [])
  const close = useCallback(() => setActive(null), [])

  return (
    <section id="obra" style={{ backgroundColor: '#0C0A0A' }}>
      {/* Header */}
      <div style={{
        padding: '7rem 2.5rem 5rem',
        borderBottom: '1px solid rgba(250,232,240,0.05)',
        overflow: 'hidden',
      }}>
        <div className="marquee" style={{ marginBottom: '2.5rem' }}>
          <div className="marquee-inner">
            {Array(10).fill(null).map((_, i) => (
              <span key={i} style={{
                fontSize: '0.46rem', letterSpacing: '0.44em', textTransform: 'uppercase',
                color: 'rgba(250,232,240,0.1)', whiteSpace: 'nowrap', paddingRight: '3.5rem',
              }}>
                ✦ Blackwork · Fineline · Ornamental · Traditional · Illustrativo ·&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
          <h2 className="font-display" style={{
            fontSize: 'clamp(4rem, 13vw, 14rem)',
            lineHeight: 0.88, letterSpacing: '-0.04em', fontStyle: 'italic',
            color: 'rgba(250,232,240,0.92)',
          }}>
            Trabajos
          </h2>
          <p style={{
            fontSize: '0.5rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(250,232,240,0.18)', textAlign: 'right', lineHeight: 2,
          }}>
            {gallery.length} piezas<br />clic para ampliar
          </p>
        </div>
      </div>

      {/* MASONRY GRID */}
      <div style={{
        padding: '3rem 1.5rem 5rem',
        background: '#0C0A0A',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.2rem',
          alignItems: 'start',
        }}>
          {columns.map((col, ci) => (
            <div key={ci} style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: ci % 2 === 1 ? '3rem' : '0',
            }}>
              {col.map(item => (
                <MasonryItem
                  key={item.globalIndex}
                  item={item}
                  onOpen={() => setActive(item.globalIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {active !== null && (
        <Lightbox index={active} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  )
}
