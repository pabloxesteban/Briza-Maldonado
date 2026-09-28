'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

const gallery = [
  { title: 'La Garza', style: 'Blackwork', note: 'Antebrazo. Alas abiertas, plumas en capas.', src: '/Briza-Maldonado/portfolio/garza.jpg' },
  { title: 'Polilla 777', style: 'Ornamental', note: 'Esterno. Grande, oscura, simétrica.', src: '/Briza-Maldonado/portfolio/polilla-esterno.jpg' },
  { title: 'Cocodrilo', style: 'Blackwork', note: 'Antebrazo. Escamas en capas, cola enroscada.', src: '/Briza-Maldonado/portfolio/cocodrilo.jpg' },
  { title: 'Alambre y Corazón', style: 'Blackwork', note: 'Brazo. Alambre de púas, corazón rojo, daga.', src: '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg' },
  { title: 'Daga con Serpiente', style: 'Traditional', note: 'Antebrazo. La daga como eje.', src: '/Briza-Maldonado/portfolio/daga-serpiente.jpg' },
  { title: 'Lockets de Gatos', style: 'Fineline', note: 'Antebrazo. Tres gatitos en medallones.', src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg' },
  { title: 'El Lobo', style: 'Blackwork', note: 'Brazo. Feroz, peludo, libre.', src: '/Briza-Maldonado/portfolio/lobo.jpg' },
  { title: 'Mariposas Rodillas', style: 'Blackwork', note: 'Rodillas. Dos polillas simétricas.', src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg' },
  { title: 'Patchwork Sleeve', style: 'Traditional', note: 'Sol, delfín, vaquero, olas.', src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg' },
  { title: 'Moño y Corazón', style: 'Ornamental', note: 'Antebrazo. Un moño con corazón.', src: '/Briza-Maldonado/portfolio/mono-corazon.jpg' },
  { title: 'Rosa', style: 'Traditional', note: 'Rosa con alambre de púas.', src: '/Briza-Maldonado/portfolio/rosa-alambre.jpg' },
  { title: 'Espinas', style: 'Fineline', note: 'Rama de espinas abstracta.', src: '/Briza-Maldonado/portfolio/espinas.jpg' },
  { title: 'Mariposa', style: 'Blackwork', note: 'Mariposa en pierna.', src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg' },
  { title: 'Conejo', style: 'Illustrativo', note: 'Conejo tierno y extraño.', src: '/Briza-Maldonado/portfolio/conejo.jpg' },
  { title: 'Elefante Skater', style: 'Cute', note: 'Un elefante en skate.', src: '/Briza-Maldonado/portfolio/elefante-skate.jpg' },
  { title: 'Pingüino', style: 'Fineline', note: 'Pingüino con estrellitas.', src: '/Briza-Maldonado/portfolio/pinguino.jpg' },
  { title: 'Vegan', style: 'Lettering', note: 'Lettering en pie.', src: '/Briza-Maldonado/portfolio/vegan-script.jpg' },
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
        background: 'rgba(12,10,10,0.97)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Close */}
      <button
        onClick={onClose} data-hover
        style={{
          position: 'absolute', top: '2rem', right: '2.5rem',
          background: 'none', border: 'none', color: 'rgba(250,232,240,0.3)',
          fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
          cursor: 'none', zIndex: 10, transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.3)')}
      >
        cerrar ✦
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute', top: '2.1rem', left: '2.5rem',
        fontSize: '0.5rem', letterSpacing: '0.25em', color: 'rgba(250,232,240,0.2)',
      }}>
        {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
      </div>

      {/* Nav arrows */}
      {[{ dir: 'prev', pos: 'left: 1.5rem', fn: onPrev, ch: '←' }, { dir: 'next', pos: 'right: 1.5rem', fn: onNext, ch: '→' }].map(a => (
        <button key={a.dir} onClick={e => { e.stopPropagation(); a.fn() }} data-hover
          style={{
            position: 'absolute', [a.dir === 'prev' ? 'left' : 'right']: '1.5rem',
            top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'rgba(250,232,240,0.18)',
            fontSize: '1.6rem', cursor: 'none', padding: '1rem',
            transition: 'color 0.2s', zIndex: 10,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.18)')}
        >{a.ch}</button>
      ))}

      {/* Image + info */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', alignItems: 'center', gap: '3.5rem', maxWidth: '88vw', maxHeight: '90vh' }}
      >
        <div style={{ position: 'relative', height: 'min(82vh,700px)', width: 'min(48vw,460px)', flexShrink: 0 }}>
          <Image key={item.src} src={item.src} alt={item.title} fill
            style={{ objectFit: 'contain' }} sizes="48vw" priority />
        </div>
        <div style={{ maxWidth: '16rem' }}>
          <p style={{ fontSize: '0.5rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--mark)', marginBottom: '1.2rem' }}>
            ✦ {item.style}
          </p>
          <h3 className="font-display" style={{
            fontSize: 'clamp(2rem,4vw,3.5rem)', lineHeight: 0.95,
            letterSpacing: '-0.02em', fontStyle: 'italic', color: '#FAE8F0', marginBottom: '1rem',
          }}>
            {item.title}
          </h3>
          <p className="font-display" style={{
            fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.75, color: 'rgba(250,232,240,0.4)',
          }}>
            "{item.note}"
          </p>
          {/* Dot nav */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {gallery.map((_, i) => (
              <div key={i} style={{
                width: i === index ? '18px' : '4px', height: '2px',
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

/* ─── GALLERY ITEM ─── */
function GalleryItem({ item, index, onClick }: { item: typeof gallery[0]; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const tall = index === 0 || index === 3 || index === 7 || index === 12

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), (index % 4) * 75); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        position: 'relative',
        gridRow: tall ? 'span 2' : 'span 1',
        overflow: 'hidden',
        cursor: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
        backgroundColor: '#0a0808',
      }}
    >
      <Image
        src={item.src} alt={item.title} fill
        style={{
          objectFit: 'cover', objectPosition: 'center 25%',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 1s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      {/* Hover caption */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(12,10,10,0.85) 0%, transparent 55%)'
          : 'linear-gradient(to top, rgba(12,10,10,0.45) 0%, transparent 70%)',
        transition: 'background 0.4s ease',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem 1rem',
        transform: hovered ? 'translateY(0)' : 'translateY(5px)',
        transition: 'transform 0.35s ease',
      }}>
        <p className="font-display" style={{
          fontSize: '0.9rem', fontStyle: 'italic', color: 'white',
          lineHeight: 1.1, marginBottom: '0.2rem',
          opacity: hovered ? 1 : 0.55, transition: 'opacity 0.3s',
        }}>
          {item.title}
        </p>
        <p style={{
          fontSize: '0.4rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: hovered ? 'var(--mark)' : 'rgba(255,255,255,0.3)',
          transition: 'color 0.3s',
        }}>
          {item.style}
        </p>
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', top: '0.8rem', right: '0.8rem',
          fontSize: '0.6rem', color: 'var(--mark)', animation: 'fadeIn 0.2s ease',
        }}>✦</div>
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
      {/* Section header — big editorial */}
      <div style={{
        padding: '7rem 2.5rem 4rem',
        borderBottom: '1px solid rgba(250,232,240,0.05)',
        overflow: 'hidden',
      }}>
        {/* Marquee label */}
        <div className="marquee" style={{ marginBottom: '2rem' }}>
          <div className="marquee-inner" style={{ gap: '3rem' }}>
            {Array(8).fill(null).map((_, i) => (
              <span key={i} style={{
                fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase',
                color: 'rgba(250,232,240,0.2)', whiteSpace: 'nowrap', paddingRight: '3rem',
              }}>
                ✦ Portfolio · Obra · Trabajos · Blackwork · Fineline · Ornamental ·&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(4rem, 13vw, 14rem)',
              lineHeight: 0.88, letterSpacing: '-0.04em', fontStyle: 'italic',
              color: 'rgba(250,232,240,0.92)',
            }}
          >
            Trabajos
          </h2>
          <p style={{
            fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(250,232,240,0.2)', textAlign: 'right',
          }}>
            {gallery.length} piezas<br />clic para ampliar
          </p>
        </div>
      </div>

      {/* Gallery grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: '340px',
        gap: '3px',
      }}>
        {gallery.map((item, i) => (
          <GalleryItem key={i} item={item} index={i} onClick={() => setActive(i)} />
        ))}
      </div>

      {/* Footer hint */}
      <div style={{ padding: '1.2rem 2.5rem', borderTop: '1px solid rgba(250,232,240,0.04)' }}>
        <p style={{
          fontSize: '0.45rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(250,232,240,0.12)', textAlign: 'center',
        }}>
          usá las flechas del teclado para navegar
        </p>
      </div>

      {active !== null && (
        <Lightbox index={active} onClose={close} onPrev={prev} onNext={next} />
      )}
    </section>
  )
}
