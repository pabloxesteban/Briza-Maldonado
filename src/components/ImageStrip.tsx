// Big type marquee between the gallery and the notebook
const WORDS = ['Vegan tattoo artist', 'Buenos Aires', 'Palermo']

export default function ImageStrip() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="word-strip" aria-label="Vegan tattoo artist · Buenos Aires · Palermo">
      <div className="word-strip-track" aria-hidden>
        {[0, 1].map(k => (
          <div key={k} className="word-strip-set">
            {row.map((w, i) => (
              <span key={i} className="word-strip-item">
                <span className={i % 3 === 1 ? 'swash word-strip-accent' : ''}>{w}</span>
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
