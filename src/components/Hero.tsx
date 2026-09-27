'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Stagger letter animation
    const title = titleRef.current
    if (!title) return

    const text = title.innerText
    title.innerHTML = text
      .split('')
      .map((char, i) =>
        char === ' '
          ? '<span style="display:inline-block;width:0.3em"> </span>'
          : `<span class="letter" style="display:inline-block;opacity:0;transform:translateY(60px);transition:opacity 0.6s ease ${i * 0.04}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s">${char}</span>`
      )
      .join('')

    setTimeout(() => {
      title.querySelectorAll('.letter').forEach((el) => {
        ;(el as HTMLElement).style.opacity = '1'
        ;(el as HTMLElement).style.transform = 'translateY(0)'
      })
    }, 200)

    // Subtitle fade
    const subtitle = subtitleRef.current
    if (subtitle) {
      subtitle.style.opacity = '0'
      subtitle.style.transform = 'translateY(20px)'
      setTimeout(() => {
        subtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
        subtitle.style.opacity = '1'
        subtitle.style.transform = 'translateY(0)'
      }, 900)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: 'var(--accent-pink)' }}
      />
      <div
        className="absolute bottom-32 left-10 w-48 h-48 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: 'var(--accent-blue)' }}
      />

      {/* Marquee top */}
      <div className="absolute top-28 left-0 right-0 overflow-hidden py-2 opacity-30">
        <div className="marquee">
          <div className="marquee-inner">
            {Array(2).fill(null).map((_, i) => (
              <span key={i} className="flex items-center gap-4 mr-4">
                {['BLACKWORK', 'BUENOS AIRES', 'TRADICIONAL', 'ILUSTRACIÓN', 'VEGAN', 'BLACKWORK', 'BUENOS AIRES', 'TRADICIONAL', 'ILUSTRACIÓN', 'VEGAN'].map((word, j) => (
                  <span key={j} className="flex items-center gap-4">
                    <span className="text-xs font-medium tracking-widest" style={{ color: 'var(--accent-hot)' }}>{word}</span>
                    <span style={{ color: 'var(--accent-pink)' }}>✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="text-center max-w-4xl relative z-10">
        <p
          className="text-sm font-medium tracking-widest uppercase mb-6 opacity-0"
          style={{
            color: 'var(--accent-hot)',
            animation: 'fadeIn 0.6s ease 0.1s forwards',
          }}
        >
          Tatuajes · Buenos Aires
        </p>

        <h1
          ref={titleRef}
          className="font-display font-black leading-none mb-2"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            color: 'var(--black)',
            letterSpacing: '-0.02em',
          }}
        >
          Briza
        </h1>
        <h1
          className="font-display font-black leading-none mb-8"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            color: 'transparent',
            WebkitTextStroke: '2px var(--black)',
            letterSpacing: '-0.02em',
          }}
        >
          Maldonado
        </h1>

        <p
          ref={subtitleRef}
          className="text-base md:text-lg max-w-md mx-auto leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          Cada tatuaje es un capítulo. Arte que toma partido. Blackwork con alma.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contacto"
            className="px-8 py-3.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: 'var(--accent-hot)',
              color: 'white',
              boxShadow: '0 4px 24px rgba(240, 40, 122, 0.35)',
            }}
          >
            Reservar turno
          </a>
          <a
            href="#portfolio"
            className="px-8 py-3.5 rounded-full font-medium text-sm tracking-wide border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: 'var(--black)',
              color: 'var(--black)',
              backgroundColor: 'transparent',
            }}
          >
            Ver portfolio
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>Scroll</span>
        <div
          className="w-px h-12 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(240,40,122,0.2)' }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-full"
            style={{
              backgroundColor: 'var(--accent-hot)',
              animation: 'scrollLine 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  )
}
