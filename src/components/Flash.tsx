'use client'

import { useEffect, useRef } from 'react'

const flashItems = [
  { id: 1, title: 'Pájaro con flores', available: true, color: '#F9D5E5' },
  { id: 2, title: 'Corazón Vegan', available: true, color: '#D5E8F9' },
  { id: 3, title: 'Flor en alambre', available: false, color: '#E8F9D5' },
  { id: 4, title: 'Mariposa + daga', available: true, color: '#F9E8D5' },
  { id: 5, title: 'Frutilla', available: true, color: '#E8D5F9' },
  { id: 6, title: 'Flor suelta', available: false, color: '#D5F9E8' },
]

export default function Flash() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = cardsRef.current
            cards.forEach((card, i) => {
              if (card) {
                setTimeout(() => {
                  card.style.opacity = '1'
                  card.style.transform = 'translateY(0)'
                }, i * 80)
              }
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="flash"
      className="py-24 px-6 md:px-12"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent-hot)' }}>
            Flash disponible
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--black)', lineHeight: 1.05 }}
            >
              Diseños listos
              <br />
              <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--black)' }}>para llevarte</span>
            </h2>
            <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Piezas únicas. Una vez tatuadas, se retiran de la lista. Los tachados ya tienen dueño.
            </p>
          </div>
        </div>

        {/* Flash grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {flashItems.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => { cardsRef.current[i] = el }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                backgroundColor: item.color,
                aspectRatio: '3/4',
                opacity: 0,
                transform: 'translateY(30px)',
                transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
              data-cursor
            >
              {/* Available badge */}
              <div className="absolute top-3 right-3 z-10">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: item.available ? 'var(--accent-hot)' : 'rgba(28,28,28,0.15)',
                    color: item.available ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {item.available ? 'Disponible' : 'Tatuado'}
                </span>
              </div>

              {/* Strike through if taken */}
              {!item.available && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-10 opacity-30"
                >
                  <div className="w-full h-px rotate-12" style={{ backgroundColor: 'var(--black)' }} />
                </div>
              )}

              {/* Card content */}
              <div className="absolute inset-0 flex items-end p-4">
                <p
                  className="font-display text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: 'var(--black)' }}
                >
                  {item.title}
                </p>
              </div>

              {/* Hover: reserve button */}
              {item.available && (
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"
                  style={{ backgroundColor: 'rgba(240, 40, 122, 0.08)' }}
                >
                  <a
                    href="#contacto"
                    className="px-5 py-2 rounded-full text-xs font-medium tracking-wide transform scale-90 group-hover:scale-100 transition-transform duration-300"
                    style={{ backgroundColor: 'var(--accent-hot)', color: 'white' }}
                  >
                    Lo quiero
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
