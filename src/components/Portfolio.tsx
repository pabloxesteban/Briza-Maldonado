'use client'

import { useEffect, useRef, useState } from 'react'

const categories = ['Todo', 'Dark', 'Kawaii', 'Traditional', 'Flash']

const works = [
  { id: 1, title: 'Lobo textural', category: 'Dark', size: 'large', color: '#E8D5DB' },
  { id: 2, title: 'Polilla · 777', category: 'Dark', size: 'small', color: '#D5E8E0' },
  { id: 3, title: 'Elefante en patineta', category: 'Kawaii', size: 'small', color: '#D5DCE8' },
  { id: 4, title: 'Cocodrilo', category: 'Traditional', size: 'large', color: '#E8E0D5' },
  { id: 5, title: 'Corazón Vegan', category: 'Flash', size: 'small', color: '#E8D5E0' },
  { id: 6, title: 'Oso anarquista', category: 'Kawaii', size: 'small', color: '#D5E8DC' },
  { id: 7, title: 'Garza japonesa', category: 'Traditional', size: 'large', color: '#DCE8D5' },
  { id: 8, title: 'Mariposa + daga', category: 'Dark', size: 'small', color: '#E8DDD5' },
  { id: 9, title: 'Pingüino patinador', category: 'Kawaii', size: 'small', color: '#D5E5E8' },
  { id: 10, title: 'Rosa con alambre', category: 'Traditional', size: 'large', color: '#E8D5D8' },
  { id: 11, title: 'Moño con corazón', category: 'Flash', size: 'small', color: '#EAD5E8' },
  { id: 12, title: 'Conejo kawaii', category: 'Kawaii', size: 'small', color: '#D5E8E8' },
]

export default function Portfolio() {
  const [active, setActive] = useState('Todo')
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const filtered = active === 'Todo' ? works : works.filter(w => w.category === active)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.15 }
    )

    itemsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [filtered])

  return (
    <section id="portfolio" className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent-hot)' }}>
          Portfolio
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--black)', lineHeight: 1.05 }}
          >
            El trabajo
          </h2>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: active === cat ? 'var(--accent-hot)' : 'rgba(240,40,122,0.08)',
                  color: active === cat ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${active === cat ? 'transparent' : 'rgba(240,40,122,0.2)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((work, i) => (
          <div
            key={work.id}
            ref={(el) => { itemsRef.current[i] = el }}
            className={`clip-reveal group relative overflow-hidden rounded-2xl cursor-pointer ${
              work.size === 'large' ? 'col-span-2 row-span-2' : ''
            }`}
            style={{
              backgroundColor: work.color,
              aspectRatio: work.size === 'large' ? '1/1' : '3/4',
            }}
            data-cursor
          >
            {/* Placeholder — real images go here */}
            <div className="absolute inset-0 flex items-end p-4">
              <div
                className="opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-2 group-hover:translate-y-0"
                style={{ transitionDuration: '0.4s' }}
              >
                <p className="text-xs font-medium tracking-wide uppercase mb-1" style={{ color: 'var(--accent-hot)' }}>
                  {work.category}
                </p>
                <p className="font-display text-sm font-bold" style={{ color: 'var(--black)' }}>
                  {work.title}
                </p>
              </div>
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: 'rgba(250, 232, 240, 0.4)' }}
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <a
          href="#contacto"
          className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-4"
          style={{ color: 'var(--accent-hot)' }}
        >
          ¿Querés una pieza tuya? Escribime
          <span>→</span>
        </a>
      </div>
    </section>
  )
}
