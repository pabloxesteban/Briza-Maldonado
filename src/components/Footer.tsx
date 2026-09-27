export default function Footer() {
  return (
    <footer
      className="py-8 px-6 md:px-12 border-t"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'rgba(240,40,122,0.15)',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display font-bold text-lg" style={{ color: 'var(--black)' }}>
          Briza Maldonado
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Buenos Aires · Blackwork · Tatuajes con alma
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
