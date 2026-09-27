'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

const gallery = [
  { title: 'Garza', style: 'Blackwork · Traditional', note: 'Antebrazo. Alas abiertas, plumas en capas. Un vuelo que nunca termina.', src: '/Briza-Maldonado/portfolio/garza.jpg', alt: 'Tatuaje de garza en vuelo blackwork traditional' },
  { title: 'Moño', style: 'Ornamental · Fineline', note: 'Antebrazo. Un moño con corazón en el centro. Lo más ella en un solo trazo.', src: '/Briza-Maldonado/portfolio/mono-corazon.jpg', alt: 'Tatuaje de moño ornamental con corazón en fineline' },
  { title: 'Cocodrilo', style: 'Blackwork · Traditional', note: 'Antebrazo. Escamas en capas, cola enroscada, boca abierta. Peso y precisión.', src: '/Briza-Maldonado/portfolio/cocodrilo.jpg', alt: 'Tatuaje de cocodrilo blackwork traditional' },
  { title: 'Polilla 777', style: 'Blackwork · Illustrativo', note: 'Esterno. Grande, oscura, simétrica. Antenas 777. Presencia total.', src: '/Briza-Maldonado/portfolio/polilla-esterno.jpg', alt: 'Tatuaje de polilla blackwork en el esternón con 777' },
  { title: 'Lockets de Gatos', style: 'Mixed · Color', note: 'Antebrazo. Tres gatitos en medallones colgantes de un moño. Delicado y personal.', src: '/Briza-Maldonado/portfolio/lockets-gatos.jpg', alt: 'Tatuaje de medallones con gatos en el antebrazo' },
  { title: 'Daga con Serpiente', style: 'Blackwork · Traditional', note: 'Antebrazo. La daga como eje. La serpiente como movimiento. Clásico sin cliché.', src: '/Briza-Maldonado/portfolio/daga-serpiente.jpg', alt: 'Tatuaje de daga con serpiente traditional blackwork' },
  { title: 'Alambre y Corazón', style: 'Blackwork · Color', note: 'Brazo. Alambre de púas, corazón rojo, daga. Rebelde por dentro, delicado por fuera.', src: '/Briza-Maldonado/portfolio/alambre-daga-corazon.jpg', alt: 'Tatuaje de alambre con daga y corazón rojo' },
  { title: 'Lobo', style: 'Blackwork · Illustrativo', note: 'Brazo. Feroz, peludo, libre. Una criatura que ocupa su espacio con todo.', src: '/Briza-Maldonado/portfolio/lobo.jpg', alt: 'Tatuaje de lobo en blackwork illustrativo' },
  { title: 'Mariposas', style: 'Blackwork · Traditional', note: 'Rodillas. Dos polillas simétricas, una más detallada que la otra. El cuerpo como lienzo.', src: '/Briza-Maldonado/portfolio/mariposas-rodillas.jpg', alt: 'Tatuaje de mariposas en las rodillas en blackwork' },
  { title: 'Patchwork Sleeve', style: 'Traditional · Mixed', note: 'Antebrazo. Sol, delfín, vaquero, olas. Cada imagen un mundo. Juntas, una historia.', src: '/Briza-Maldonado/portfolio/patchwork-sleeve.jpg', alt: 'Manga patchwork con sol, delfín, vaquero y olas' },
  { title: 'Rosa', style: 'Traditional', note: 'Rosa con alambre de púas. Belleza con filo.', src: '/Briza-Maldonado/portfolio/rosa-alambre.jpg', alt: 'Rosa traditional con alambre de púas' },
  { title: 'Espinas', style: 'Fineline', note: 'Rama de espinas abstracta. Línea fina, tensión visible.', src: '/Briza-Maldonado/portfolio/espinas.jpg', alt: 'Rama de espinas abstracta fineline' },
  { title: 'Mariposa', style: 'Blackwork', note: 'Mariposa en pierna. Alas que se abren con el movimiento.', src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg', alt: 'Mariposa blackwork en pierna' },
  { title: 'Conejo', style: 'Illustrativo', note: 'Conejo tierno y extraño a la vez. Ilustrativo, preciso.', src: '/Briza-Maldonado/portfolio/conejo.jpg', alt: 'Conejo illustrativo en brazo' },
  { title: 'Elefante Skater', style: 'Cute', note: 'Un elefante en skate. Porque el arte también puede reír.', src: '/Briza-Maldonado/portfolio/elefante-skate.jpg', alt: 'Elefante en skate' },
  { title: 'Pingüino', style: 'Fineline', note: 'Pingüino con estrellitas. Pequeño, perfecto.', src: '/Briza-Maldonado/portfolio/pinguino.jpg', alt: 'Pingüino con estrellitas' },
  { title: 'Vegan', style: 'Lettering', note: 'Lettering en pie. Una declaración que se lleva con cada paso.', src: '/Briza-Maldonado/portfolio/vegan-script.jpg', alt: 'Lettering Vegan en pie' },
]

function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
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
        backgroundColor: 'rgba(10,8,8,0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        data-hover
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2.5rem',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.55rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          cursor: 'none',
          zIndex: 10,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
      >
        cerrar ✦
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        top: '2.1rem',
        left: '2.5rem',
        fontSize: '0.55rem',
        letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.3)',
      }}>
        {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
      </div>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        data-hover
        style={{
          position: 'absolute',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '1.4rem',
          cursor: 'none',
          padding: '1rem',
          transition: 'color 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >
        ←
      </button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        data-hover
        style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '1.4rem',
          cursor: 'none',
          padding: '1rem',
          transition: 'color 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >
        →
      </button>

      {/* Content */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3rem',
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          height: 'min(80vh, 680px)',
          width: 'min(50vw, 480px)',
          flexShrink: 0,
        }}>
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            style={{ objectFit: 'contain' }}
            sizes="50vw"
            priority
          />
        </div>

        {/* Info */}
        <div style={{ maxWidth: '18rem' }}>
          <p style={{
            fontSize: '0.5rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--mark)',
            marginBottom: '1.5rem',
          }}>
            ✦ {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="font-display" style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            fontStyle: 'italic',
            color: 'white',
            marginBottom: '0.75rem',
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '2rem',
          }}>
            {item.style}
          </p>
          {item.note && (
            <p className="font-display" style={{
              fontSize: '0.9rem',
              fontStyle: 'italic',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.5)',
            }}>
              "{item.note}"
            </p>
          )}
          {/* Dot nav */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '2.5rem', flexWrap: 'wrap', maxWidth: '12rem' }}>
            {gallery.map((_, i) => (
              <div key={i} style={{
                width: i === index ? '16px' : '4px',
                height: '2px',
                backgroundColor: i === index ? 'var(--mark)' : 'rgba(255,255,255,0.2)',
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
          setTimeout(() => setRevealed(true), (index % 4) * 80)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
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
        aspectRatio: '3/4',
        overflow: 'hidden',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
        cursor: 'none',
        backgroundColor: 'rgba(28,28,28,0.05)',
      }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center top',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(10,8,8,0.75) 0%, rgba(10,8,8,0.1) 50%, transparent 100%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Info on hover */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1.25rem',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        <p className="font-display" style={{
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: 'white',
          lineHeight: 1.1,
          marginBottom: '0.2rem',
        }}>
          {item.title}
        </p>
        <p style={{
          fontSize: '0.45rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}>
          {item.style}
        </p>
      </div>

      {/* Index number */}
      <div style={{
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        fontSize: '0.45rem',
        letterSpacing: '0.15em',
        color: 'rgba(255,255,255,0.4)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>
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
    <section id="obra" style={{ marginTop: '6rem' }}>
      {/* Header */}
      <div style={{
        padding: '0 2.5rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <h2 className="font-display" style={{
          fontSize: '0.65rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
        }}>
          ✦ Obra
        </h2>
        <div style={{ textAlign: 'right' }}>
          <p className="font-display" style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            fontStyle: 'italic',
          }}>
            Trabajos
          </p>
          <p style={{
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            opacity: 0.5,
            marginTop: '0.5rem',
          }}>
            {gallery.length} piezas — clic para ampliar
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        padding: '0 2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.75rem',
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
