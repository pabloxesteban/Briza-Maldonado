'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const STAGES = [
  { n: '01', t: 'La idea', d: 'Me contás qué querés: referencias, zona y tamaño. Lo anoto todo en el cuaderno.' },
  { n: '02', t: 'El dibujo', d: 'Lo dibujo a mano, con línea firme y sombra de traditional.' },
  { n: '03', t: 'El stencil', d: 'El diseño pasa a stencil violeta y lo probamos sobre tu piel hasta que quede perfecto.' },
  { n: '04', t: 'La piel', d: 'Aguja, tinta y pulso. Del papel a la piel, una sola vez.' },
]

const DRAWING = '/Briza-Maldonado/flash/rosa-alambre-flash-paper.png'
const TATTOO = '/Briza-Maldonado/portfolio/rosa-alambre.jpg'
const clamp = (v: number) => Math.min(1, Math.max(0, v))

export default function Process() {
  const ref = useRef<HTMLElement>(null)
  const [p, setP] = useState(0) // 0..1 through the pinned sequence
  const [still, setStill] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStill(true); return }
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      setP(clamp(-r.top / Math.max(1, total)))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Each stage owns a quarter of the scroll; local progress drives its transition
  const seg = (i: number) => clamp((p - i / 4) * 4)
  const active = Math.min(3, Math.floor(p * 4 + 0.0001))
  const draw = still ? 1 : seg(1)       // pen reveals the drawing
  const stencil = still ? 0 : seg(2)    // drawing turns violet
  const skin = still ? 0 : seg(3)       // tattoo spreads from the centre
  const note = still ? 0 : 1 - clamp(seg(1) * 2)

  return (
    <section ref={ref} id="proceso" className="process" style={{ height: still ? 'auto' : '420vh' }}>
      <div className="process-pin">
        <header className="process-head">
          <p className="process-kicker">Proceso</p>
          <h2 className="font-display process-title">Del papel <em>a la piel.</em></h2>
        </header>

        <div className="process-body">
          {/* The piece, changing state */}
          <div className="process-frame" aria-hidden>
            <div className="process-paper" />
            <p className="process-note" style={{ opacity: note, transform: `translateY(${(1 - note) * -10}px)` }}>
              rosa + alambre de púas<br />antebrazo · 8 cm<br />traditional, sombra negra ✶
            </p>
            <div className="process-art" style={{ clipPath: `inset(0 ${100 - draw * 100}% 0 0)` }}>
              <Image src={DRAWING} alt="" fill sizes="(max-width: 860px) 80vw, 40vw" style={{ objectFit: 'contain', opacity: 1 - stencil }} />
              <Image src={DRAWING} alt="" fill sizes="(max-width: 860px) 80vw, 40vw" className="process-stencil" style={{ objectFit: 'contain', opacity: stencil }} />
            </div>
            <div className="process-skin" style={{ clipPath: `circle(${skin * 75}% at 50% 50%)` }}>
              <Image src={TATTOO} alt="Rosa con alambre tatuada en el brazo" fill sizes="(max-width: 860px) 80vw, 40vw" style={{ objectFit: 'cover', transform: `scale(${1.12 - skin * 0.12})` }} />
            </div>
          </div>

          {/* Words for the current stage */}
          <div className="process-copy">
            <ol className="process-rail">
              {STAGES.map((s, i) => (
                <li key={s.n} className={i <= active ? 'on' : ''}><span>{s.n}</span><i style={{ transform: `scaleX(${still ? 1 : seg(i)})` }} /></li>
              ))}
            </ol>
            {(still ? STAGES : [STAGES[active]]).map(s => (
              <div key={s.n} className="process-stage">
                <p className="process-num">{s.n}</p>
                <h3 className="font-display">{s.t}</h3>
                <p className="process-desc">{s.d}</p>
              </div>
            ))}
            <a href="#turno" className="cta-book process-cta" data-cursor="book" style={{ opacity: still || active === 3 ? 1 : 0, pointerEvents: still || active === 3 ? 'auto' : 'none' }}>
              Quiero el mío ✦
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
