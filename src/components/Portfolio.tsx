'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

const gallery = [
  { title: 'La Garza',           style: 'Blackwork',    note: 'Antebrazo. Alas abiertas, plumas en capas.',         src: '/Briza-Maldonado/portfolio/garza.jpg' },
  { title: 'Polilla 777',        style: 'Ornamental',   note: 'Esterno. Grande, oscura, simétrica.',                src: '/Briza-Maldonado/portfolio/polilla-esterno.jpg' },
  { title: 'Cocodrilo',          style: 'Blackwork',    note: 'Antebrazo. Escamas en capas, cola enroscada.',       src: '/Briza-Maldonado/portfolio/cocodrilo.jpg' },
  { title: 'Alambre y Corazón',  style: 'Blackwork',    note: 'Brazo. Alambre de púas, corazón rojo, daga.',        src: '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg' },
  { title: 'Daga con Serpiente', style: 'Traditional',  note: 'Antebrazo. La daga como eje.',                       src: '/Briza-Maldonado/portfolio/daga-serpiente.jpg' },
  { title: 'Lockets de Gatos',   style: 'Fineline',     note: 'Antebrazo. Tres gatitos en medallones.',             src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg' },
  { title: 'El Lobo',            style: 'Blackwork',    note: 'Brazo. Feroz, peludo, libre.',                       src: '/Briza-Maldonado/portfolio/lobo.jpg' },
  { title: 'Mariposas Rodillas', style: 'Blackwork',    note: 'Rodillas. Dos polillas simétricas.',                 src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg' },
  { title: 'Patchwork Sleeve',   style: 'Traditional',  note: 'Sol, delfín, vaquero, olas.',                       src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg' },
  { title: 'Moño y Corazón',     style: 'Ornamental',   note: 'Antebrazo. Un moño con corazón.',                   src: '/Briza-Maldonado/portfolio/mono-corazon.jpg' },
  { title: 'Rosa',               style: 'Traditional',  note: 'Rosa con alambre de púas.',                          src: '/Briza-Maldonado/portfolio/rosa-alambre.jpg' },
  { title: 'Espinas',            style: 'Fineline',     note: 'Rama de espinas abstracta.',                         src: '/Briza-Maldonado/portfolio/espinas.jpg' },
  { title: 'Mariposa',           style: 'Blackwork',    note: 'Mariposa en pierna.',                                src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg' },
  { title: 'Conejo',             style: 'Illustrativo', note: 'Conejo tierno y extraño.',                           src: '/Briza-Maldonado/portfolio/conejo.jpg' },
  { title: 'Elefante Skater',    style: 'Cute',         note: 'Un elefante en skate.',                              src: '/Briza-Maldonado/portfolio/elefante-skate.jpg' },
  { title: 'Pingüino',           style: 'Fineline',     note: 'Pingüino con estrellitas.',                          src: '/Briza-Maldonado/portfolio/pinguino.jpg' },
  { title: 'Vegan',              style: 'Lettering',    note: 'Lettering en pie.',                                  src: '/Briza-Maldonado/portfolio/vegan-script.jpg' },
]

// Bento layout: span 1 or 2 columns, tall or short rows
// 3-column grid. span:2 = full-width feature cell
const bento: { span: 1 | 2; tall: boolean }[] = [
  { span: 2, tall: true  },  // 0 La Garza — hero piece
  { span: 1, tall: true  },  // 1
  { span: 1, tall: false },  // 2
  { span: 1, tall: false },  // 3
  { span: 1, tall: true  },  // 4
  { span: 2, tall: false },  // 5 Lockets — wide
  { span: 1, tall: true  },  // 6
  { span: 1, tall: false },  // 7
  { span: 1, tall: false },  // 8
  { span: 2, tall: true  },  // 9 Moño — hero
  { span: 1, tall: false },  // 10
  { span: 1, tall: true  },  // 11
  { span: 1, tall: false },  // 12
  { span: 1, tall: true  },  // 13
  { span: 2, tall: false },  // 14 Elefante — wide
  { span: 1, tall: false },  // 15
  { span: 1, tall: true  },  // 16
]

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
        {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
      </div>

      {(['prev', 'next'] as const).map(dir => (
        <button key={dir} onClick={e => { e.stopPropagation(); dir === 'prev' ? onPrev() : onNext() }} data-hover style={{
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
        <div style={{
          position: 'relative',
          width: 'min(42vw, 420px)',
          height: 'min(62vh, 560px)',
        }}>
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

/* ─── BENTO CELL ─── */
function BentoCell({ item, layout, index, onOpen }: {
  item: typeof gallery[0]
  layout: typeof bento[0]
  index: number
  onOpen: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), (index % 6) * 60); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  const height = layout.tall ? '420px' : '280px'

  return (
    <div
      ref={ref}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        gridColumn: `span ${layout.span}`,
        position: 'relative',
        height,
        overflow: 'hidden',
        cursor: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.75s ease ${(index % 6) * 55}ms, transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${(index % 6) * 55}ms`,
      }}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center top',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        sizes={layout.span === 2 ? '66vw' : '33vw'}
      />

      {/* permanent subtle gradient bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,6,6,0.72) 0%, rgba(8,6,6,0.1) 40%, transparent 65%)',
        transition: 'opacity 0.4s ease',
        opacity: hovered ? 1 : 0.6,
      }} />

      {/* index — top right */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1rem',
        fontSize: '0.4rem', letterSpacing: '0.1em',
        color: 'rgba(250,232,240,0.25)',
        fontVariantNumeric: 'tabular-nums',
        transition: 'opacity 0.3s',
        opacity: hovered ? 0 : 1,
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* style tag — top right on hover */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1rem',
        fontSize: '0.38rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--mark)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        {item.style}
      </div>

      {/* title — bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '1.5rem 1.2rem 1.1rem',
        transform: hovered ? 'translateY(0)' : 'translateY(6px)',
        transition: 'transform 0.4s ease',
      }}>
        <p className="font-display" style={{
          fontSize: layout.span === 2
            ? 'clamp(1.2rem, 2.5vw, 2rem)'
            : 'clamp(0.9rem, 1.5vw, 1.25rem)',
          fontStyle: 'italic',
          color: '#FAE8F0',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.3s',
        }}>
          {item.title}
        </p>
        <div style={{
          height: '1px',
          background: 'var(--mark)',
          marginTop: '0.5rem',
          width: hovered ? (layout.span === 2 ? '8rem' : '4rem') : '0',
          transition: 'width 0.5s cubic-bezier(0.77,0,0.175,1)',
        }} />
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

      {/* BENTO GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '3px',
        background: '#0C0A0A',
      }}>
        {gallery.map((item, i) => (
          <BentoCell
            key={i}
            item={item}
            layout={bento[i]}
            index={i}
            onOpen={() => setActive(i)}
          />
        ))}
      </div>

      {active !== null && (
        <Lightbox index={active} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  )
}
