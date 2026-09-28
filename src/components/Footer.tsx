'use client'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '3rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <span
          className="font-display"
          style={{
            fontStyle: 'italic',
            fontSize: '0.85rem',
            color: 'var(--ink)',
          }}
        >
          Briza Maldonado
        </span>
        <span style={{ color: 'var(--mark)', marginLeft: '0.5rem', fontSize: '0.7rem' }}>✦</span>
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <a
          href="https://instagram.com/bri.t4tts"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            textDecoration: 'none',
          }}
        >
          Instagram
        </a>
        <span
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            opacity: 0.35,
          }}
        >
          Buenos Aires — {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
