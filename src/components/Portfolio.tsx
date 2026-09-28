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
  { title: 'Mariposa',          style: 'Blackwork',    note: 'Mariposa en pierna.',                             src: '/Briza-Maldonado/portfolio/mariposa-pierna.jpg' },
  { title: 'Conejo',             style: 'Illustrativo', note: 'Conejo tierno y extraño.',                        src: '/Briza-Maldonado/portfolio/conejo.jpg' },
  { title: 'Elefante Skater',    style: 'Cute',         note: 'Un elefante en skate.',                           src: '/Briza-Maldonado/portfolio/elefante-skate.jpg' },
  { title: 'Pingüino',           style: 'Fineline',     note: 'Pingüino con estrellitas.',                       src: '/Briza-Maldonado/portfolio/pinguino.jpg' },
  { title: 'Vegan',              style: 'Lettering',    note: 'Lettering en pie.',                               src: '/Briza-Maldonado/portfolio/vegan-script.jpg' },
]

// More disordered layout — varied positions, stronger rotations, some overlapping
const layout = [
  { left: '2%',   top: '2%',   rot: -9,  size: 'md', tape: 'center' },
  { left: '24%',  top: '0%',   rot: 5,   size: 'lg', tape: 'left' },
  { left: '51%',  top: '1%',   rot: -13, size: 'sm', tape: 'right' },
  { left: '72%',  top: '3%',   rot: 8,   size: 'md', tape: 'center' },
  { left: '6%',   top: '21%',  rot: 11,  size: 'sm', tape: 'left' },
  { left: '30%',  top: '19%',  rot: -6,  size: 'md', tape: 'center' },
  { left: '55%',  top: '22%',  rot: 3,   size: 'lg', tape: 'right' },
  { left: '78%',  top: '18%',  rot: -11, size: 'sm', tape: 'left' },
  { left: '0%',   top: '43%',  rot: -4,  size: 'lg', tape: 'center' },
  { left: '27%',  top: '40%',  rot: 14,  size: 'sm', tape: 'right' },
  { left: '52%',  top: '44%',  rot: -8,  size: 'md', tape: 'left' },
  { left: '76%',  top: '41%',  rot: 6,   size: 'lg', tape: 'center' },
  { left: '5%',   top: '64%',  rot: 10,  size: 'md', tape: 'right' },
  { left: '29%',  top: '62%',  rot: -15, size: 'lg', tape: 'center' },
  { left: '57%',  top: '66%',  rot: 4,   size: 'sm', tape: 'left' },
  { left: '78%',  top: '63%',  rot: -7,  size: 'md', tape: 'right' },
  { left: '38%',  top: '84%',  rot: 3,   size: 'md', tape: 'center' },
]

const sizeMap = { sm: 180, md: 215, lg: 255 }

/* ─── TAPE STRIP ─── */
function TapeStrip({ position }: { position: 'left' | 'right' | 'center' }) {
  const leftMap = { left: '15%', center: '42%', right: '65%' }
  return (
    <div style={{
      position: 'absolute',
      top: -10,
      left: leftMap[position],
      width: 38,
      height: 18,
      background: 'rgba(240,230,200,0.55)',
      transform: `rotate(${position === 'left' ? -8 : position === 'right' ? 6 : -2}deg)`,
      zIndex: 3,
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    }} />
  )
}

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
        background: 'rgba(10,8,8,0.97)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.22s ease',
        cursor: 'none',
      }}
    >
      {/* close */}
      <button onClick={onClose} data-hover style={{
        position: 'absolute', top: '2rem', right: '2.5rem',
        background: 'none', border: 'none', color: 'rgba(250,232,240,0.25)',
        fontSize: '0.5rem', letterSpacing: '0.3em', textTransform: 'uppercase',
        cursor: 'none', zIndex: 10, transition: 'color 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.25)')}
      >cerrar ✦</button>

      {/* counter */}
      <div style={{
        position: 'absolute', top: '2rem', left: '2.5rem',
        fontSize: '0.48rem', letterSpacing: '0.3em', color: 'rgba(250,232,240,0.18)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
      </div>

      {/* arrows */}
      {(['prev', 'next'] as const).map(dir => (
        <button key={dir} onClick={e => { e.stopPropagation(); dir === 'prev' ? onPrev() : onNext() }} data-hover style={{
          position: 'absolute', [dir === 'prev' ? 'left' : 'right']: '1.5rem',
          top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: 'rgba(250,232,240,0.15)',
          fontSize: '1.5rem', cursor: 'none', padding: '1.2rem',
          transition: 'color 0.2s', zIndex: 10,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FAE8F0')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,232,240,0.15)')}
        >
          {dir === 'prev' ? '←' : '→'}
        </button>
      ))}

      <div onClick={e => e.stopPropagation()} style={{
        display: 'flex', alignItems: 'center', gap: '4rem',
        maxWidth: '88vw', maxHeight: '90vh',
      }}>
        {/* polaroid frame in lightbox */}
        <div style={{
          background: '#F5F0E8',
          padding: '14px 14px 52px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          flexShrink: 0,
        }}>
          <div style={{ position: 'relative', width: 'min(44vw, 420px)', height: 'min(60vh, 520px)' }}>
            <Image key={item.src} src={item.src} alt={item.title} fill
              style={{ objectFit: 'contain' }} sizes="44vw" priority />
          </div>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.15rem', color: '#2a2218',
            textAlign: 'center', marginTop: '12px',
            letterSpacing: '0.02em',
          }}>
            {item.title}
          </p>
        </div>
        {/* info */}
        <div style={{ maxWidth: '15rem' }}>
          <p style={{
            fontSize: '0.46rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--mark)', marginBottom: '1.2rem',
          }}>✦ {item.style}</p>
          <h3 className="font-display" style={{
            fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 0.95,
            letterSpacing: '-0.02em', fontStyle: 'italic', color: '#FAE8F0', marginBottom: '1rem',
          }}>{item.title}</h3>
          <p className="font-display" style={{
            fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.8,
            color: 'rgba(250,232,240,0.35)',
          }}>&ldquo;{item.note}&rdquo;</p>
          {/* dot nav */}
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

/* ─── POLAROID CARD ─── */
function PolaroidCard({ item, pos, index, onOpen }: {
  item: typeof gallery[0]
  pos: typeof layout[0]
  index: number
  onOpen: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const imgW = sizeMap[pos.size as keyof typeof sizeMap]
  const imgH = Math.round(imgW * 1.22)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), index * 55); obs.disconnect() } },
      { threshold: 0.02 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        width: imgW + 24,
        cursor: 'none',
        transform: hovered
          ? `rotate(0deg) scale(1.08) translateY(-12px)`
          : visible
            ? `rotate(${pos.rot}deg) scale(1)`
            : `rotate(${pos.rot}deg) scale(0.88) translateY(20px)`,
        opacity: visible ? 1 : 0,
        transition: hovered
          ? 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease, box-shadow 0.3s ease, z-index 0s'
          : 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s ease',
        boxShadow: hovered
          ? '0 28px 60px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.4)'
          : '0 8px 28px rgba(0,0,0,0.5)',
        zIndex: hovered ? 50 : index % 4 + 1,
      }}
    >
      {/* tape strip */}
      <TapeStrip position={pos.tape as 'left' | 'right' | 'center'} />

      {/* polaroid frame */}
      <div style={{
        background: '#F7F2E8',
        padding: '10px 10px 44px',
      }}>
        {/* image */}
        <div style={{
          position: 'relative',
          width: imgW,
          height: imgH,
          background: '#111',
          overflow: 'hidden',
        }}>
          <Image
            src={item.src} alt={item.title} fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: hovered ? 'brightness(1.05)' : 'brightness(0.92)',
              transition: 'filter 0.4s ease',
            }}
            sizes={`${imgW}px`}
          />
        </div>

        {/* handwritten caption */}
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: `${Math.round(imgW * 0.075)}px`,
          color: '#2a2218',
          textAlign: 'center',
          marginTop: '8px',
          lineHeight: 1.1,
          letterSpacing: '0.01em',
        }}>
          {item.title}
        </p>
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: `${Math.round(imgW * 0.055)}px`,
          color: hovered ? '#E8185F' : '#8a7a6a',
          textAlign: 'center',
          marginTop: '2px',
          transition: 'color 0.3s',
          letterSpacing: '0.02em',
        }}>
          {item.style}
        </p>
      </div>
    </div>
  )
}

/* ─── WALL ─── */
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
                color: 'rgba(250,232,240,0.12)', whiteSpace: 'nowrap', paddingRight: '3.5rem',
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
            color: 'rgba(250,232,240,0.2)', textAlign: 'right', lineHeight: 2,
          }}>
            {gallery.length} piezas<br />clic para ampliar
          </p>
        </div>
      </div>

      {/* WALL */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '2000px',
        background: '#0C0A0A',
        backgroundImage: `radial-gradient(ellipse at 20% 40%, rgba(232,24,95,0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(107,79,87,0.06) 0%, transparent 50%)`,
        padding: '80px 3% 120px',
        overflow: 'visible',
      }}>
        {/* grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }} />

        {/* watermark text */}
        <div style={{
          position: 'absolute', bottom: '8%', right: '3%',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(5rem, 14vw, 16rem)',
          fontStyle: 'italic', fontWeight: 900,
          color: 'rgba(250,232,240,0.025)',
          lineHeight: 1, letterSpacing: '-0.04em',
          pointerEvents: 'none', userSelect: 'none', zIndex: 0,
        }}>
          Obra
        </div>

        {/* polaroids */}
        {gallery.map((item, i) => (
          <PolaroidCard
            key={i}
            item={item}
            pos={layout[i]}
            index={i}
            onOpen={() => setActive(i)}
          />
        ))}
      </div>

      {active !== null && (
        <Lightbox index={active} onClose={close} onPrev={prev} onNext={next} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');
      `}</style>
    </section>
  )
}
