'use client'

import Image from 'next/image'

const WHATSAPP = '5491156233929'
const INSTAGRAM = 'bri.t4tts'

// A quiet sign-off: the page already said everything
export default function Footer() {
  return (
    <footer className="ft2">
      <p className="ft2-brand">
        <Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={400} height={480} className="ft2-arch" />
        Briza Maldonado <span>· Palermo, Buenos Aires · © {new Date().getFullYear()}</span>
      </p>
      <nav className="ft2-links" aria-label="Contacto">
        <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" data-hover>Instagram</a>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" data-hover>WhatsApp</a>
        <button type="button" data-hover onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Arriba ↑</button>
      </nav>
    </footer>
  )
}
