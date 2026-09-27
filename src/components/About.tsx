'use client'

import { useEffect, useRef } from 'react'

const lines = [
  'Soy Briza.',
  'Tatuadora, activista, patinadora.',
  'Creo que cada tatuaje cuenta algo.',
  'Trabajo en blackwork —',
  'desde lo más oscuro hasta lo más tierno.',
  'No tatúo decoración.',
  'Tatúo capítulos.',
]

export default function About() {
  const linesRef = useRef<(HTMLSpanElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            linesRef.current.forEach((el, i) => {
              if (el) {
                setTimeout(() => {
                  el.style.opacity = '1'
                  el.style.transform = 'translateY(0)'
                }, i * 120)
              }
            })
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="sobre-mi"
      className="py-24 px-6 md:px-12 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-8" style={{ color: 'var(--accent-hot)' }}>
            Sobre mí
          </p>

          <div className="space-y-1 mb-10">
            {lines.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <span
                  ref={(el) => { linesRef.current[i] = el }}
                  className="block font-display"
                  style={{
                    fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                    color: i === lines.length - 1 ? 'var(--accent-hot)' : 'var(--black)',
                    fontWeight: i === lines.length - 1 ? 700 : 400,
                    fontStyle: i % 3 === 1 ? 'italic' : 'normal',
                    opacity: 0,
                    transform: 'translateY(40px)',
                    transition: `opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)`,
                    lineHeight: 1.3,
                  }}
                >
                  {line}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {['Vegan', 'Blackwork', 'Buenos Aires', 'Patineta', 'Roller', 'Activista'].map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(240,40,122,0.08)',
                  color: 'var(--accent-hot)',
                  border: '1px solid rgba(240,40,122,0.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-4"
            style={{ color: 'var(--accent-hot)' }}
          >
            Trabajemos juntos
            <span>→</span>
          </a>
        </div>

        {/* Visual side */}
        <div className="relative">
          {/* Placeholder for Briza's photo */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              aspectRatio: '4/5',
              backgroundColor: '#F2C4D8',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Foto de Briza</p>
            </div>

            {/* Decorative label */}
            <div
              className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl"
              style={{ backgroundColor: 'rgba(255,240,245,0.9)', backdropFilter: 'blur(8px)' }}
            >
              <p className="font-display text-lg font-bold" style={{ color: 'var(--black)' }}>Briza Maldonado</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Tatuadora · Buenos Aires · Disponible para guest spots
              </p>
            </div>
          </div>

          {/* Floating badge */}
          <div
            className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center text-center p-2"
            style={{
              backgroundColor: 'var(--accent-hot)',
              animation: 'spin 12s linear infinite',
            }}
          >
            <p className="text-white text-xs font-bold leading-tight tracking-wide">
              BsAS · ARG
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
