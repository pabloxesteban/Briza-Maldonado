'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

const gallery = [
  { title: 'Garza', style: 'Blackwork · Traditional', note: 'Antebrazo. Alas abiertas, plumas en capas. Un vuelo que nunca termina.', src: '/Briza-Maldonado/portfolio/garza.jpg', featured: true },
  { title: 'Moño', style: 'Ornamental · Fineline', note: 'Antebrazo. Un moño con corazón en el centro. Lo más ella en un solo trazo.', src: '/Briza-Maldonado/portfolio/mono-corazon.jpg', featured: false },
  { title: 'Cocodrilo', style: 'Blackwork · Traditional', note: 'Antebrazo. Escamas en capas, cola enroscada, boca abierta. Peso y precisión.', src: '/Briza-Maldonado/portfolio/cocodrilo.jpg', featured: false },
  { title: 'Polilla 777', style: 'Blackwork · Illustrativo', note: 'Esterno. Grande, oscura, simétrica. Antenas 777. Presencia total.', src: '/Briza-Maldonado/portfolio/polilla-esterno.jpg', featured: true },
  { title: 'Lockets de Gatos', style: 'Mixed · Color', note: 'Antebrazo. Tres gatitos en medallones colgantes de un moño. Delicado y personal.', src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg', featured: false },
  { title: 'Daga con Serpiente', style: 'Blackwork · Traditional', note: 'Antebrazo. La daga como eje. La serpiente como movimiento. Clásico sin cliché.', src: '/Briza-Maldonado/portfolio/daga-serpiente.jpg', featured: false },
  { title: 'Alambre y Corazón', style: 'Blackwork · Color', note: 'Brazo. Alambre de púas, corazón rojo, daga. Rebelde por dentro, delicado por fuera.', src: '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg', featured: true },
  { title: 'Lobo', style: 'Blackwork · Illustrativo', note: 'Brazo. Feroz, peludo, libre. Una criatura que ocupa su espacio con todo.', src: '/Briza-Maldonado/portfolio/lobo.jpg', featured: false },
  { title: 'Mariposas', style: 'Blackwork · Traditional', note: 'Rodillas. Dos polillas simétricas, una más detallada que la otra. El cuerpo como lienzo.', src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg', featured: false },
  { title: 'Patchwork Sleeve', style: 'Traditional · Mixed', note: 'Antebrazo. Sol, delfín, vaquero, olas. Cada imagen un mundo. Juntas, una historia.', src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg', featured: false },
  { title: 'Rosa', style: 'Traditional', note: 'Rosa con alambre de púas. Belleza con filo.', src: '/Briza-Maldonado/portfolio/rosa-alambre.jpg', featured: false },
  { title: 'Espinas', style: 'Fineline', note: 'Rama de espinas abstracta. Línea fina, tensión visible.', src: '/Briza-Maldonado/portfolio/espinas.jpg', featured: true },
  { title: 'Mariposa', style: 'Blackwork', note: 'Mariposa en pierna. Alas que se abren con el movimiento.', src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg', featured: false },
  { title: 'Conejo', style: 'Illustrativo', note: 'Conejo tierno y extraño a la vez. Ilustrativo, preciso.', src: '/Briza-Maldonado/portfolio/conejo.jpg', featured: false },
  { title: 'Elefante Skater', style: 'Cute', note: 'Un elefante en skate. Porque el arte también puede reír.', src: '/Briza-Maldonado/portfolio/elefante-skate.jpg', featured: false },
  { title: 'Pingüino', style: 'Fineline', note: 'Pingüino con estrellitas. Pequeño, perfecto.', src: '/Briza-Maldonado/portfolio/pinguino.jpg', featured: false },
  { title: 'Vegan', style: 'Lettering', note: 'Lettering en pie. Una declaración que se lleva con cada paso.', src: '/Briza-Maldonado/portfolio/vegan-script.jpg', featured: false },
]

function Lightbox({ index, onClose, onPrev, onNext }: {
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const item = gallery[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(8,6,6,0.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        data-hover
        style={{
          position: 'absolute', top: '2rem', right: '2.5rem',
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.55rem', letterSpacing: '0.25em',
          textTransform: 'uppercase', cursor: 'none', zIndex: 10,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
      >
        cerrar ✦
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute', top: '2.1rem', left: '2.5rem',
        fontSize: '0.5rem', letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.25)',
      }}>
        {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
      </div>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        data-hover
        style={{
          position: 'absolute', left: '1.5rem', top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '1.5rem', cursor: 'none', padding: '1rem',
          transition: 'color 0.2s', zIndex: 10,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
      >←</button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        data-hover
        style={{
          position: 'absolute', right: '1.5rem', top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '1.5rem', cursor: 'none', padding: '1rem',
          transition: 'color 0.2s', zIndex: 10,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
      >→</button>

      {/* Content */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3.5rem',
          maxWidth: '88vw',
          maxHeight: '88vh',
        }}
      >
        <div style={{
          position: 'relative',
          height: 'min(82vh, 700px)',
          width: 'min(48vw, 460px)',
          flexShrink: 0,
        }}>
          <Image
            key={item.src}
            src={item.src}
            alt={item.title}
            fill
            style={{ objectFit: 'contain' }}
            sizes="48vw"
            priority
          />
        </div>

        <div style={{ maxWidth: '17rem' }}>
          <p style={{
            fontSize: '0.5rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'var(--mark)',
            marginBottom: '1.5rem',
          }}>
            ✦ {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="font-display" style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 0.95, letterSpacing: '-0.02em',
            fontStyle: 'italic', color: 'white', marginBottom: '0.75rem',
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: '0.5rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
            marginBottom: '2rem',
          }}>
            {item.style}
          </p>
          <p className="font-display" style={{
            fontSize: '0.9rem', fontStyle: 'italic',
            lineHeight: 1.75, color: 'rgba(255,255,255,0.45)',
          }}>
            "{item.note}"
          </p>
          {/* Progress */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {gallery.map((_, i) => (
              <div key={i} style={{
                width: i === index ? '18px' : '4px',
                height: '2px',
                backgroundColor: i === index ? 'var(--mark)' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
                borderRadius: '1px',
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GalleryItem({ item, index, onClick }: {
  item: typeof gallery[0]
  index: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), (index % 3) * 100)
          obs.disconnect()
        }
      },
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
        gridRow: item.featured ? 'span 2' : 'span 1',
        overflow: 'hidden',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
        cursor: 'none',
        backgroundColor: '#111',
      }}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center top',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
          filter: hovered ? 'brightness(0.75)' : 'brightness(0.55)',
        }}
        sizes="33vw"
      />

      {/* Info — always slightly visible, stronger on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(8,6,6,0.8) 0%, rgba(8,6,6,0.1) 50%, transparent 100%)'
          : 'linear-gradient(to top, rgba(8,6,6,0.55) 0%, transparent 60%)',
        transition: 'background 0.4s ease',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1.25rem 1rem',
        transform: hovered ? 'translateY(0)' : 'translateY(4px)',
        transition: 'transform 0.4s ease',
      }}>
        <p className="font-display" style={{
          fontSize: '0.9rem', fontStyle: 'italic',
          color: 'white', lineHeight: 1.1,
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease',
          marginBottom: '0.2rem',
        }}>
          {item.title}
        </p>
        <p style={{
          fontSize: '0.42rem', letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: hovered ? 'var(--mark)' : 'rgba(255,255,255,0.4)',
          transition: 'color 0.3s ease',
        }}>
          {item.style}
        </p>
      </div>

      {/* Hover mark */}
      {hovered && (
        <div style={{
          position: 'absolute', top: '1rem', right: '1rem',
          fontSize: '0.6rem', color: 'var(--mark)',
          animation: 'fadeIn 0.2s ease',
        }}>
          ✦
        </div>
      )}
    </div>
  )
}

export default function Portfolio() {
  const [active, setActive] = useState<number | null>(null)

  const prev = useCallback(() => {
    setActive(i => i !== null ? (i - 1 + gallery.length) % gallery.length : null)
  }, [])

  const next = useCallback(() => {
    setActive(i => i !== null ? (i + 1) % gallery.length : null)
  }, [])

  const close = useCallback(() => setActive(null), [])

  return (
    <section
      id="obra"
      style={{
        backgroundColor: '#0C0A0A',
        marginTop: '6rem',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '5rem 2.5rem 3.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{
          fontSize: '0.6rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>
          ✦ Obra
        </h2>
        <div style={{ textAlign: 'right' }}>
          <p className="font-display" style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'white',
            fontStyle: 'italic',
          }}>
            Trabajos
          </p>
          <p style={{
            fontSize: '0.5rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
            marginTop: '0.5rem',
          }}>
            {gallery.length} piezas — clic para ampliar
          </p>
        </div>
      </div>

      {/* Masonry grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: '280px',
        gap: '2px',
      }}>
        {gallery.map((item, i) => (
          <GalleryItem
            key={i}
            item={item}
            index={i}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <Lightbox
          index={active}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  )
}
