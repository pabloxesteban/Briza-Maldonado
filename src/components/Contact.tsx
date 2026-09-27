'use client'

import { useState } from 'react'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', idea: '', placement: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section
      id="contacto"
      className="py-24 px-6 md:px-12"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent-hot)' }}>
          Contacto
        </p>
        <h2
          className="font-display font-bold mb-4"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--black)', lineHeight: 1.05 }}
        >
          Contame tu idea
        </h2>
        <p className="text-sm mb-12 max-w-md" style={{ color: 'var(--text-secondary)' }}>
          Cada proyecto empieza con una conversación. Contame qué querés contar.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'name', label: 'Tu nombre', type: 'text', placeholder: '¿Cómo te llamás?' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'Para responder tu consulta' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium tracking-wide mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 focus:scale-[1.01]"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--black)',
                    border: '1px solid rgba(240,40,122,0.15)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-hot)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(240,40,122,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(240,40,122,0.15)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium tracking-wide mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                Tu idea
              </label>
              <textarea
                placeholder="¿Qué querés tatuar? ¿Tiene algún significado? ¿Tenés referencias?"
                rows={5}
                value={form.idea}
                onChange={(e) => setForm({ ...form, idea: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 resize-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--black)',
                  border: '1px solid rgba(240,40,122,0.15)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-hot)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(240,40,122,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(240,40,122,0.15)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wide mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                ¿Dónde lo querés?
              </label>
              <input
                type="text"
                placeholder="Zona del cuerpo aproximada"
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--black)',
                  border: '1px solid rgba(240,40,122,0.15)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-hot)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(240,40,122,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(240,40,122,0.15)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{
                backgroundColor: 'var(--accent-hot)',
                color: 'white',
                boxShadow: '0 4px 24px rgba(240,40,122,0.3)',
              }}
            >
              Enviar consulta
            </button>
          </form>
        ) : (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <p className="text-4xl mb-4">✦</p>
            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--black)' }}>
              ¡Recibido!
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Te respondo en las próximas 48 horas.
            </p>
          </div>
        )}

        {/* Social links */}
        <div className="mt-16 pt-8 border-t flex items-center justify-between" style={{ borderColor: 'rgba(240,40,122,0.15)' }}>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            También en Instagram
          </p>
          <a
            href="https://instagram.com/brizamaldonado"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-all duration-300 hover:gap-3 flex items-center gap-2"
            style={{ color: 'var(--accent-hot)' }}
          >
            @brizamaldonado
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
