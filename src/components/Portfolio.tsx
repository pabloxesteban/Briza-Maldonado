'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

const gallery = [
  { title: 'La Garza',           style: 'Blackwork',    note: 'Antebrazo. Alas abiertas, plumas en capas.',      src: '/Briza-Maldonado/portfolio/garza.jpg' },
  { title: 'Polilla 777',        style: 'Ornamental',   note: 'Esterno. Grande, oscura, simétrica.',             src: '/Briza-Maldonado/portfolio/polilla-esterno.jpg' },
  { title: 'Cocodrilo',          style: 'Blackwork',    note: 'Antebrazo. Escamas en capas, cola enroscada.',    src: '/Briza-Maldonado/portfolio/cocodrilo.jpg' },
  { title: 'Alambre y Corazón',  style: 'Blackwork',    note: 'Brazo. Alambre de púas, corazón rojo, daga.',     src: '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg' },
  { title: 'Daga con Serpiente', style: 'Traditional',  note: 'Antebrazo. La daga como eje.',                    src: '/Briza-Maldonado/portfolio/daga-serpiente.jpg' },
  { title: 'Lockets de Gatos',   style: 'Fineline',     note: 'Antebrazo. Tres gatitos en medallones.',          src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg' },
  { title: 'El Lobo',            style: 'Blackwork',    note: 'Brazo. Feroz, peludo, libre.',                    src: '/Briza-Maldonado/portfolio/lobo.jpg' },
  { title: 'Mariposas Rodillas', style: 'Blackwork',    note: 'Rodillas. Dos polillas simétricas.',              src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg' },
  { title: 'Patchwork Sleeve',   style: 'Traditional',  note: 'Sol, delfín, vaquero, olas.',                    src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg' },
  { title: 'Moño y Corazón',     style: 'Ornamental',   note: 'Antebrazo. Un moño con corazón.',                src: '/Briza-Maldonado/portfolio/mono-corazon.jpg' },
  { title: 'Rosa',               style: 'Traditional',  note: 'Rosa con alambre de púas.',                       src: '/Briza-Maldonado/portfolio/rosa-alambre.jpg' },
  { title: 'Espinas',            style: 'Fineline',     note: 'Rama de espinas abstracta.',                      src: '/Briza-Maldonado/portfolio/espinas.jpg' },
  { title: 'Mariposa',           style: 'Blackwork',    note: 'Mariposa en pierna.',                             src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg' },
  { title: 'Conejo',             style: 'Illustrativo', note: 'Conejo tierno y extraño.',                        src: '/Briza-Maldonado/portfolio/conejo.jpg' },
  { title: 'Elefante Skater',    style: 'Cute',         note: 'Un elefante en skate.',                           src: '/Briza-Maldonado/portfolio/elefante-skate.jpg' },
  { title: 'Pingüino',           style: 'Fineline',     note: 'Pingüino con estrellitas.',                       src: '/Briza-Maldonado/portfolio/pinguino.jpg' },
  { title: 'Vegan',              style: 'Lettering',    note: 'Lettering en pie.',                               src: '/Briza-Maldonado/portfolio/vegan-script.jpg' },
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
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(10,8,8,0.98)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <button onClick={onClose} data-hover style={{
        position: 'absolute', top: '2rem', right: '2.5rem',
        background: 'none', border: 'none', color: 'rgba(250,232,240,0.25)',
        fontSize: '0.5rem', letterSpacing: '0.28em', textTransform: 'uppercase',
        cursor: 'none', zIndex: 10, transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.25)')}
      >
        cerrar ✦
      </button>

      <div style={{
        position: 'absolute', top: '2rem', left: '2.5rem',
        fontSize: '0.48rem', letterSpacing: '0.28em', color: 'rgba(250,232,240,0.18)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
      </div>

      {[{ dir: 'prev', fn: onPrev, ch: '←' }, { dir: 'next', fn: onNext, ch: '→' }].map(a => (
        <button key={a.dir} onClick={e => { e.stopPropagation(); a.fn() }} data-hover style={{
          position: 'absolute', [a.dir === 'prev' ? 'left' : 'right']: '1.5rem',
          top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: 'rgba(250,232,240,0.15)',
          fontSize: '1.6rem', cursor: 'none', padding: '1rem',
          transition: 'color 0.2s', zIndex: 10,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.15)')}
        >{a.ch}</button>
      ))}

      <div onClick={e => e.stopPropagation()} style={{
        display: 'flex', alignItems: 'center', gap: '3.5rem', maxWidth: '88vw', maxHeight: '90vh',
      }}>
        <div style={{ position: 'relative', height: 'min(82vh,700px)', width: 'min(48vw,460px)', flexShrink: 0 }}>
          <Image key={item.src} src={item.src} alt={item.title} fill
            style={{ objectFit: 'contain' }} sizes="48vw" priority />
        </div>
        <div style={{ maxWidth: '16rem' }}>
          <p style={{ fontSize: '0.48rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--mark)', marginBottom: '1.2rem' }}>
            ✦ {item.style}
          </p>
          <h3 className="font-display" style={{
            fontSize: 'clamp(2rem,4vw,3.5rem)', lineHeight: 0.95,
            letterSpacing: '-0.02em', fontStyle: 'italic', color: '#FAE8F0', marginBottom: '1rem',
          }}>
            {item.title}
          </h3>
          <p className="font-display" style={{
            fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.75, color: 'rgba(250,232,240,0.38)',
          }}>
            &ldquo;{item.note}&rdquo;
          </p>
          <div style={{ display: 'flex', gap: '5px', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {gallery.map((_, i) => (
              <div key={i} style={{
                width: i === index ? '20px' : '4px', height: '2px',
                background: i === index ? 'var(--mark)' : 'rgba(250,232,240,0.1)',
                transition: 'all 0.3s', borderRadius: '1px',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── HORIZONTAL SCROLL GALLERY ─── */
function HorizontalGallery({ onOpen }: { onOpen: (i: number) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
      const maxTranslate = (gallery.length - 1) * window.innerWidth * 0.72
      track.style.transform = `translateX(${-progress * maxTranslate}px)`
      setActiveIdx(Math.round(progress * (gallery.length - 1)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={sectionRef}
      style={{ height: `${gallery.length * 80}vh`, position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', backgroundColor: '#0C0A0A' }}>
        {/* progress indicator */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '6px', zIndex: 10,
        }}>
          {gallery.map((_, i) => (
            <div key={i} style={{
              width: i === activeIdx ? '24px' : '5px',
              height: '2px',
              background: i === activeIdx ? 'var(--mark)' : 'rgba(250,232,240,0.18)',
              transition: 'all 0.4s ease',
              borderRadius: '1px',
            }} />
          ))}
        </div>

        {/* horizontal track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            height: '100%',
            willChange: 'transform',
            transition: 'transform 0.05s linear',
          }}
        >
          {gallery.map((item, i) => (
            <GallerySlide key={i} item={item} index={i} onOpen={onOpen} isActive={i === activeIdx} />
          ))}
        </div>

        {/* scroll hint */}
        <div style={{
          position: 'absolute', right: '2.5rem', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          opacity: 0.25,
        }}>
          <div style={{ width: '1px', height: '48px', background: 'rgba(250,232,240,0.6)' }} />
          <span style={{ fontSize: '0.42rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#FAE8F0', writingMode: 'vertical-rl' }}>
            scroll
          </span>
        </div>
      </div>
    </div>
  )
}

function GallerySlide({ item, index, onOpen, isActive }: {
  item: typeof gallery[0]; index: number; onOpen: (i: number) => void; isActive: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onOpen(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        flexShrink: 0,
        width: '72vw',
        height: '100%',
        position: 'relative',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5vh 4vw',
        marginRight: '3px',
        overflow: 'hidden',
      }}
    >
      {/* slide number */}
      <div style={{
        position: 'absolute', top: '2.2rem', left: '2.5rem',
        fontSize: '0.48rem', letterSpacing: '0.3em',
        fontVariantNumeric: 'tabular-nums',
        transition: 'color 0.3s',
        color: isActive ? 'rgba(250,232,240,0.45)' : 'rgba(250,232,240,0.18)',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* style label top right */}
      <div style={{
        position: 'absolute', top: '2.1rem', right: '2.5rem',
        fontSize: '0.44rem', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: hovered ? 'var(--mark)' : 'rgba(250,232,240,0.18)',
        transition: 'color 0.3s',
      }}>
        {item.style}
      </div>

      {/* image — contained, full tattoo visible */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '85%',
        transform: hovered ? 'scale(1.025)' : 'scale(1)',
        transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        <Image
          src={item.src} alt={item.title} fill
          style={{ objectFit: 'contain' }}
          sizes="72vw"
        />
      </div>

      {/* title — bottom reveal on hover */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem',
        overflow: 'hidden',
      }}>
        <div style={{
          transform: hovered ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 0.5s cubic-bezier(0.77,0,0.175,1)',
        }}>
          <h3 className="font-display" style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.8rem)',
            fontStyle: 'italic', letterSpacing: '-0.02em',
            color: '#FAE8F0', lineHeight: 1,
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: '0.5rem', letterSpacing: '0.18em', color: 'rgba(250,232,240,0.4)',
            marginTop: '0.4rem',
          }}>
            {item.note}
          </p>
        </div>
      </div>

      {/* click cue */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: '2.8rem', right: '2.5rem',
          fontSize: '0.44rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--mark)', animation: 'fadeIn 0.2s ease',
        }}>
          ampliar ✦
        </div>
      )}
    </div>
  )
}

export default function Portfolio() {
  const [active, setActive] = useState<number | null>(null)
  const prev = useCallback(() => setActive(i => i !== null ? (i - 1 + gallery.length) % gallery.length : null), [])
  const next = useCallback(() => setActive(i => i !== null ? (i + 1) % gallery.length : null), [])
  const close = useCallback(() => setActive(null), [])

  return (
    <section id="obra" style={{ backgroundColor: '#0C0A0A' }}>
      {/* Header */}
      <div style={{
        padding: '7rem 2.5rem 4rem',
        borderBottom: '1px solid rgba(250,232,240,0.05)',
        overflow: 'hidden',
      }}>
        <div className="marquee" style={{ marginBottom: '2rem' }}>
          <div className="marquee-inner">
            {Array(10).fill(null).map((_, i) => (
              <span key={i} style={{
                fontSize: '0.48rem', letterSpacing: '0.42em', textTransform: 'uppercase',
                color: 'rgba(250,232,240,0.14)', whiteSpace: 'nowrap', paddingRight: '3.5rem',
              }}>
                ✦ Blackwork · Fineline · Ornamental · Traditional · Illustrativo ·&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="font-display" style={{
            fontSize: 'clamp(4rem, 13vw, 14rem)',
            lineHeight: 0.88, letterSpacing: '-0.04em', fontStyle: 'italic',
            color: 'rgba(250,232,240,0.92)',
          }}>
            Trabajos
          </h2>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '0.5rem', letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(250,232,240,0.18)',
            }}>
              {gallery.length} piezas
            </p>
            <p style={{
              fontSize: '0.5rem', letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(250,232,240,0.18)',
            }}>
              scroll horizontal →
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <HorizontalGallery onOpen={i => setActive(i)} />

      {active !== null && (
        <Lightbox index={active} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  )
}
