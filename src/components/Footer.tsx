'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const WHATSAPP = '5491156233929'
const INSTAGRAM = 'bri.t4tts'

const NAV = [
  { label: 'Flashes', href: '#flash' },
  { label: 'Diseños tatuados', href: '#obra' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Pedir turno', href: '#turno' },
]

export default function Footer() {
  const word = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)

  // The name spans the full width, whatever the font metrics
  useEffect(() => {
    const fit = () => {
      const w = word.current, t = text.current
      if (!w || !t) return
      t.style.fontSize = '100px'
      const n = t.getBoundingClientRect().width
      if (n) t.style.fontSize = `${(100 * w.clientWidth) / n}px`
    }
    fit(); document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <footer className="ft">
      <div className="ft-cta">
        <p className="ft-kicker">¿Lo hacemos?</p>
        <h2 className="ft-title">Tu próximo tatuaje <span className="swash">empieza acá.</span></h2>
        <div className="ft-cta-row">
          <a href="#turno" className="ft-book" data-cursor="book">Pedir turno ●</a>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" className="ft-link">WhatsApp ↗</a>
        </div>
      </div>

      <div className="ft-cols">
        <div className="ft-brand">
          <Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={400} height={480} className="ft-arch" />
          <p>Tatuadora traditional.<br />Black &amp; white y color.<br />Vegan tattoo artist.</p>
        </div>
        <nav className="ft-col" aria-label="Secciones">
          <p className="ft-h">Explorar</p>
          {NAV.map(n => <a key={n.href} href={n.href} data-hover>{n.label}</a>)}
        </nav>
        <div className="ft-col">
          <p className="ft-h">Contacto</p>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" data-hover>WhatsApp ↗</a>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" data-hover>@{INSTAGRAM} ↗</a>
        </div>
        <div className="ft-col">
          <p className="ft-h">Estudio</p>
          <p>Palermo, Buenos Aires</p>
          <p>Solo con turno</p>
          <p>Tintas veganas</p>
        </div>
      </div>

      <div ref={word} className="ft-word" aria-hidden>
        <span ref={text}>BRIZA<em className="swash">Maldonado</em></span>
      </div>

      <div className="ft-bottom">
        <p>© {new Date().getFullYear()} Briza Maldonado · Buenos Aires</p>
        <button type="button" className="ft-top" data-hover onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Volver arriba ↑</button>
      </div>
    </footer>
  )
}
