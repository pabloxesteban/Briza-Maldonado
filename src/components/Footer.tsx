export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(28,28,28,0.12)',
        padding: '3rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span
        className="font-display italic"
        style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}
      >
        Briza Maldonado ✦
      </span>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <a
          href="https://instagram.com/bri.t4tts"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          @bri.t4tts
        </a>
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            opacity: 0.5,
          }}
        >
          © 2024
        </span>
      </div>
    </footer>
  )
}
