'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Lines rise from behind a mask, after the logo intro when it plays
    const introPlaying = document.documentElement.dataset.intro === 'playing' || (() => { try { return sessionStorage.getItem('bm-intro') !== '1' } catch { return false } })()
    const start = introPlaying ? 2300 : 250
    const lines = nameRef.current?.querySelectorAll<HTMLElement>('[data-line]')
    lines?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.clipPath = 'inset(0 0% 0 0)'
        el.style.transform = 'translateY(0)'
      }, start + i * 180)
    })
    nameRef.current?.style.setProperty('--hero-delay', `${start / 1000 + 0.45}s`)
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Portrait — far right */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '46%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        <Image
          src="/Briza-Maldonado/briza-portrait.jpg"
          alt="Briza Maldonado"
          fill priority
          style={{
            objectFit: 'cover',
            objectPosition: '30% 55%',
            opacity: 0,
            animation: 'fadeIn 2.2s ease 0.5s forwards',
          }}
          sizes="46vw"
        />
        {/* left fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, var(--bg) 0%, rgba(245,232,238,0.5) 15%, transparent 45%)',
        }} />
        {/* bottom fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg) 0%, transparent 22%)',
        }} />
      </div>

      {/* Name */}
      <div
        ref={nameRef}
        style={{
          position: 'relative', zIndex: 10,
          padding: '0 2.5rem 5rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {/* BRIZA */}
        <div style={{ overflow: 'hidden', lineHeight: 0.85 }}>
          <h1 className="font-display" data-line style={{
            fontSize: 'clamp(4.2rem, 18vw, 20rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: 'var(--ink)', lineHeight: 0.85, display: 'block',
            clipPath: 'inset(0 0% 0 0)', opacity: 0, transform: 'translateY(105%)',
            transition: 'transform 1.1s cubic-bezier(0.22,1,0.36,1), opacity 0.01s',
          }}>
            Briza
          </h1>
        </div>

        {/* MALDONADO */}
        <div style={{ overflow: 'hidden', lineHeight: 0.88, paddingLeft: 'clamp(1rem, 8vw, 9rem)' }}>
          <h1 className="font-display" data-line style={{
            fontSize: 'clamp(3.3rem, 14vw, 16rem)',
            fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.03em',
            color: 'var(--ink)', lineHeight: 0.88, display: 'block',
            clipPath: 'inset(0 0% 0 0)', opacity: 0, transform: 'translateY(105%)',
            transition: 'transform 1.1s cubic-bezier(0.22,1,0.36,1), opacity 0.01s',
          }}>
            Maldonado
          </h1>
        </div>

        {/* What she does, where, and the two ways forward */}
        <div style={{ opacity: 0, animation: 'riseIn 0.9s var(--ease) var(--hero-delay, 1.3s) forwards', marginTop: '1.8rem', paddingLeft: 'clamp(0rem, 1vw, 1rem)' }}>
          <p style={{ fontSize: 'clamp(.8rem, 1.2vw, .95rem)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink)', lineHeight: 1.5, textShadow: '0 0 12px var(--bg), 0 0 4px var(--bg)' }}>
            <span style={{ display: 'block' }}>Tatuadora <span style={{ color: 'var(--mark)' }}>✦</span> Traditional &amp; blackwork</span>
            <span style={{ display: 'block', color: 'var(--ink-muted)', marginTop: '.35em' }}>Palermo, Buenos Aires</span>
          </p>
          <div className="hero-cta">
            <a href="#turno" className="cta-book" data-cursor="book" style={{ padding: '.95rem 1.5rem', fontSize: '.74rem' }}>Pedir turno ✦</a>
            <a href="#obra" className="ghost-link" data-cursor="view">Ver trabajos ↓</a>
          </div>
        </div>

        {/* scroll indicator only */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          marginTop: '2.5rem',
          opacity: 0, animation: 'fadeIn 0.9s ease 1.8s forwards',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '1px', height: '48px', backgroundColor: 'var(--ink-muted)',
              opacity: 0.28, transformOrigin: 'top',
              animation: 'drawH 1s ease 2.8s both',
            }} />
            <span style={{
              fontSize: '0.42rem', letterSpacing: '0.38em',
              textTransform: 'uppercase', color: 'var(--ink-muted)', opacity: 0.35,
            }}>
              scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
