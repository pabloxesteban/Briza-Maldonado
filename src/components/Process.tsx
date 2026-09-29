'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const STAGES = [
  { n: '01', t: 'La idea', d: 'Me contás qué querés: referencias, zona y tamaño. Lo anoto todo en el cuaderno.' },
  { n: '02', t: 'El dibujo', d: 'Lo diseño en el iPad, con línea firme y sombra de traditional.' },
  { n: '03', t: 'El stencil', d: 'El diseño pasa a stencil violeta y lo probamos sobre tu piel hasta que quede perfecto.' },
  { n: '04', t: 'La piel', d: 'Aguja, tinta y pulso. Del papel a la piel, una sola vez.' },
]

const DRAWING = '/Briza-Maldonado/flash/rosa-alambre-flash-paper.png'
const TATTOO = '/Briza-Maldonado/portfolio/rosa-alambre.jpg'
const ZZ = [{ x: 34, y: 8 }, { x: 64, y: 36 }, { x: 34, y: 64 }, { x: 64, y: 92 }]
// Hand-drawn S-stroke through the steps, like a line pulled with the machine
const INK_PATH = 'M34,8 C33,21 63,19 64,36 C65,53 35,47 34,64 C33,81 63,75 64,92'
const clamp = (v: number) => Math.min(1, Math.max(0, v))

export default function Process() {
  const ref = useRef<HTMLElement>(null)
  const [p, setP] = useState(0) // 0..1 through the pinned sequence
  const [still, setStill] = useState(false)
  const inkRef = useRef<SVGPathElement>(null)
  const [tip, setTip] = useState({ x: ZZ[0].x, y: ZZ[0].y })

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

  const ink = still ? 1 : Math.min(1, p * 1.12)
  useEffect(() => {
    const el = inkRef.current
    if (!el) return
    const pt = el.getPointAtLength(el.getTotalLength() * ink)
    setTip(t => (Math.abs(t.x - pt.x) + Math.abs(t.y - pt.y) < 0.05 ? t : { x: pt.x, y: pt.y }))
  }, [ink])

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
            {/* The steps hang off one hand-drawn ink stroke; a needle tip leads the ink as you scroll */}
            <div className="zz" role="list">
              <svg className="zz-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <path d={INK_PATH} className="zz-base" />
                <path ref={inkRef} d={INK_PATH} className="zz-ink" pathLength={1} style={{ strokeDashoffset: 1 - ink }} />
              </svg>
              <span className="zz-needle" aria-hidden style={{ left: `${tip.x}%`, top: `${tip.y}%`, opacity: ink > 0.005 && ink < 0.995 ? 1 : 0 }} />
              {STAGES.map((st, i) => {
                const n = ZZ[i]
                const state = still || i === active ? 'now' : i < active ? 'done' : ''
                return (
                  <div key={st.n} role="listitem" className={`zz-node ${state} ${n.x < 50 ? 'l' : 'r'}`} style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                    <span className="zz-dot" aria-hidden />
                    <div className="zz-label">
                      <p className="zz-title"><span className="zz-num swash">{st.n}</span>{st.t}</p>
                      <p className="zz-desc">{st.d}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p key={active} className="zz-caption">{STAGES[active].d}</p>
            <a href="#turno" className="cta-book process-cta" data-cursor="book" style={{ opacity: still || active === 3 ? 1 : 0, pointerEvents: still || active === 3 ? 'auto' : 'none' }}>
              Quiero el mío ●
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
