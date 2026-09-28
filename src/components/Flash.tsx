'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Place = { x: number; y: number; s: number; rot: number } // x,s: fraction of page width · y: fraction of page height
type Note = { x: number; y: number; w: number } // x,w: fraction of width · y: fraction of height (snapped to a ruled line)
type FlashDef = {
  src: string; name: string; price: string; available: boolean
  p: Place; note: Note; fix: 'tape' | 'dots'
}

const BASE = '/Briza-Maldonado/flash/'
const PAGES: FlashDef[][] = [
  [
    { src: BASE + 'mariposa-daga.png', name: 'Mariposa con daga', price: '$50.000', available: true, fix: 'tape',
      p: { x: .06, y: .17, s: .5, rot: -4 }, note: { x: .56, y: .22, w: .42 } },
    { src: BASE + 'frutilla.png', name: 'Frutilla', price: '$40.000', available: true, fix: 'dots',
      p: { x: .52, y: .55, s: .4, rot: 6 }, note: { x: .1, y: .62, w: .38 } },
  ],
  [
    { src: BASE + 'corazon-vegan.png', name: 'Corazón vegan', price: '$55.000', available: true, fix: 'dots',
      p: { x: .08, y: .08, s: .5, rot: 5 }, note: { x: .62, y: .12, w: .35 } },
    { src: BASE + 'gorrion.png', name: 'Gorrión', price: '$60.000', available: false, fix: 'tape',
      p: { x: .5, y: .52, s: .46, rot: -6 }, note: { x: .1, y: .56, w: .34 } },
  ],
  [
    { src: BASE + 'flor-hojas.png', name: 'Flor con hojas', price: '$45.000', available: true, fix: 'tape',
      p: { x: .1, y: .08, s: .44, rot: -7 }, note: { x: .6, y: .14, w: .37 } },
    { src: BASE + 'cerdo-cabra.png', name: 'Cerdo & cabra', price: '$65.000', available: true, fix: 'dots',
      p: { x: .42, y: .5, s: .54, rot: 4 }, note: { x: .1, y: .58, w: .32 } },
  ],
  [
    { src: BASE + 'rosa-alambre-flash.png', name: 'Rosa con alambre', price: '$50.000', available: true, fix: 'tape',
      p: { x: .2, y: .07, s: .6, rot: 8 }, note: { x: .12, y: .6, w: .8 } },
  ],
]
const SHEETS = PAGES.length + 1 // cover + pages
const RATIO = 1100 / 1680 // width / height of the real notebook

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width), h = Math.round(e.contentRect.height)
      setSize(s => (s.w === w && s.h === h ? s : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

const HOLE_X = 16
const PAPER = '#f1eee2'
const PEN = '#26318c'
const GRAIN = `url(${BASE}paper-grain.png)`
const lineTop = (H: number) => Math.round(H * 0.075)
const lineGap = (W: number) => Math.max(21, Math.round(W * 0.062))
const holeYs = (H: number) => Array.from({ length: 16 }, (_, k) => H * 0.04 + (k * H * 0.92) / 15)
const snapToLine = (yFrac: number, W: number, H: number) => {
  const gap = lineGap(W), top = lineTop(H)
  return top + Math.max(1, Math.round((yFrac * H - top) / gap)) * gap
}

// ─── Paper: flat ivory, lighting, thin grey rules, slot holes ─────────────
function drawPaper(canvas: HTMLCanvasElement, W: number, H: number, seed: number, mirror: boolean) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
  if (mirror) { ctx.translate(W, 0); ctx.scale(-1, 1) }
  const r = rng(seed * 7919 + 13)

  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)

  // Very soft large-scale tone drift (daylight falling unevenly on the page)
  const g = document.createElement('canvas')
  g.width = 5; g.height = 7
  const gc = g.getContext('2d')!
  const id = gc.createImageData(5, 7)
  for (let i = 0; i < id.data.length; i += 4) {
    const v = 128 + (r() - 0.5) * 40
    id.data[i] = v; id.data[i + 1] = v; id.data[i + 2] = v - 4; id.data[i + 3] = 255
  }
  gc.putImageData(id, 0, 0)
  ctx.save()
  ctx.globalAlpha = 0.35
  ctx.globalCompositeOperation = 'soft-light'
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(g, -W * 0.2, -H * 0.2, W * 1.4, H * 1.4)
  ctx.restore()

  // Printed rules: thin, grey, slightly uneven ink
  const gap = lineGap(W)
  const x0 = HOLE_X + 14, x1 = W - 10
  for (let y = lineTop(H); y < H - gap * 0.6; y += gap) {
    let px = x0
    const yy = Math.round(y) + 0.5
    for (let x = x0 + 18; x <= x1 + 17; x += 18) {
      const nx = Math.min(x, x1)
      ctx.beginPath()
      ctx.moveTo(px, yy)
      ctx.lineTo(nx, yy)
      ctx.strokeStyle = `rgba(92,94,96,${0.34 + r() * 0.12})`
      ctx.lineWidth = 0.75
      ctx.stroke()
      px = nx
    }
  }

  // Slot holes for the twin-loop wire
  for (const y of holeYs(H)) {
    const w = 7, h = 11, x = HOLE_X - w / 2, top = y - h / 2
    ctx.beginPath()
    ctx.roundRect(x, top, w, h, 1.5)
    ctx.fillStyle = '#35302b'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x + 0.5, top + h + 0.6)
    ctx.lineTo(x + w - 0.5, top + h + 0.6)
    ctx.strokeStyle = 'rgba(255,255,255,.6)'
    ctx.lineWidth = 0.8
    ctx.stroke()
  }
}

function PaperCanvas({ w, h, seed, mirror = false }: { w: number; h: number; seed: number; mirror?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current && w > 0 && h > 0) drawPaper(ref.current, w, h, seed, mirror)
  }, [w, h, seed, mirror])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}

// Grain photographed from the real notebook, layered with overlay blend
function Grain({ opacity = 0.9, size = 300 }: { opacity?: number; size?: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: GRAIN, backgroundSize: `${size}px ${size}px`,
      mixBlendMode: 'overlay', opacity,
    }} />
  )
}

function Paper({ W, H, seed, mirror = false }: { W: number; H: number; seed: number; mirror?: boolean }) {
  return (
    <>
      <PaperCanvas w={W} h={H} seed={seed} mirror={mirror} />
      <Grain />
      {/* Warm daylight from the top, slight falloff at the bottom */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply',
        background: 'radial-gradient(130% 80% at 60% 0%, rgba(255,255,255,0) 45%, rgba(120,110,90,.10) 100%)',
      }} />
    </>
  )
}

// ─── Twin-loop wire binding ───────────────────────────────────────────────
function WireSpiral({ height }: { height: number }) {
  if (!height) return null
  const o = 24
  const hx = HOLE_X + o
  const loop = (y: number) =>
    `M ${hx - 1} ${y} C ${hx - 12} ${y + 2}, ${o - 20} ${y + 3}, ${o - 21} ${y - 2} C ${o - 22} ${y - 7}, ${o - 4} ${y - 8}, ${o + 7} ${y - 5}`
  return (
    <svg width={o * 2 + 20} height={height}
      style={{ position: 'absolute', left: -o, top: 0, zIndex: 200, overflow: 'visible', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="wire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#231c18" />
          <stop offset=".35" stopColor="#5e4d42" />
          <stop offset=".5" stopColor="#c9b3a2" />
          <stop offset=".65" stopColor="#4e3f36" />
          <stop offset="1" stopColor="#1e1814" />
        </linearGradient>
        <filter id="wireShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      {holeYs(height).map(y => (
        <g key={y}>
          {[-3, 3].map(dy => (
            <path key={'s' + dy} d={loop(y + dy)} transform="translate(2.5 3.5)" stroke="rgba(30,20,10,.3)" strokeWidth={2.4} fill="none" filter="url(#wireShadow)" />
          ))}
          {[-3, 3].map(dy => (
            <g key={dy}>
              <path d={loop(y + dy)} stroke="url(#wire)" strokeWidth={2.2} fill="none" strokeLinecap="round" />
              <path d={loop(y + dy)} stroke="rgba(255,240,228,.45)" strokeWidth={0.6} fill="none" strokeLinecap="round" transform="translate(-.3 -.6)" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}

// ─── Fasteners: masking tape and neon dot stickers ────────────────────────
function tornEnds(seed: number) {
  const r = rng(seed)
  const pts: string[] = []
  const teeth = 9
  for (let i = 0; i <= teeth; i++) pts.push(`${(r() * 3.5).toFixed(1)}% ${(i / teeth * 100).toFixed(1)}%`)
  for (let i = teeth; i >= 0; i--) pts.push(`${(100 - r() * 3.5).toFixed(1)}% ${(i / teeth * 100).toFixed(1)}%`)
  return `polygon(${pts.join(',')})`
}

function Tape({ seed, w, h, style }: { seed: number; w: number; h: number; style: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', zIndex: 3, pointerEvents: 'none', filter: 'drop-shadow(0 .6px .6px rgba(70,60,30,.22))', ...style }}>
      <div style={{
        position: 'relative', width: w, height: h, clipPath: tornEnds(seed),
        background: `
          repeating-linear-gradient(${88 + (seed % 5)}deg, rgba(255,255,255,.07) 0 1px, rgba(120,110,70,.05) 1px 2.5px),
          linear-gradient(160deg, rgba(255,255,245,.35), rgba(255,255,245,0) 55%),
          rgba(236,229,190,.66)
        `,
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '160px', mixBlendMode: 'overlay', opacity: .7 }} />
      </div>
    </div>
  )
}

function Dot({ d, style }: { d: number; style: React.CSSProperties }) {
  return (
    <div style={{
      position: 'absolute', zIndex: 3, pointerEvents: 'none', width: d, height: d, borderRadius: '50%',
      background: 'linear-gradient(160deg, #6ff852, #5cf03f)',
      boxShadow: '0 .5px .5px rgba(0,50,0,.3)',
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundImage: GRAIN, backgroundSize: '120px', mixBlendMode: 'overlay', opacity: .35 }} />
    </div>
  )
}

// ─── Cut-out paper flash ──────────────────────────────────────────────────
function PaperFlash({ flash, index, W, H }: { flash: FlashDef; index: number; W: number; H: number }) {
  const [lift, setLift] = useState(false)
  const { p } = flash
  const size = p.s * W
  const tw = size * 0.3, th = size * 0.12, dot = Math.max(16, W * 0.07)
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${flash.src})`, maskImage: `url(${flash.src})`,
    WebkitMaskSize: 'contain', maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center', maskPosition: 'center',
  }

  return (
    <div
      onMouseEnter={() => setLift(true)}
      onMouseLeave={() => setLift(false)}
      data-hover
      style={{
        position: 'absolute', left: p.x * W, top: p.y * H, width: size, height: size,
        transform: `rotate(${p.rot}deg) translateY(${lift ? -2 : 0}px)`,
        transition: 'transform .4s ease',
        zIndex: index + 1,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        // Paper lies flat: a tight contact shadow, barely any ambient shadow
        filter: lift
          ? 'drop-shadow(0 .6px .5px rgba(40,30,20,.3)) drop-shadow(1px 4px 5px rgba(60,50,30,.18))'
          : 'drop-shadow(0 .5px .4px rgba(40,30,20,.32)) drop-shadow(.5px 1.5px 2px rgba(60,50,30,.12))',
        transition: 'filter .4s ease',
      }}>
        <Image src={flash.src} alt={flash.name} fill draggable={false} sizes={`${Math.round(size)}px`}
          style={{ objectFit: 'contain', filter: 'contrast(1.12) saturate(.8) brightness(1.04)' }} />
        {/* Printer-paper grain + toner sitting on the fibres */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...mask, backgroundImage: GRAIN, backgroundSize: '220px', mixBlendMode: 'multiply', opacity: .18 }} />
      </div>

      {flash.fix === 'tape' ? (
        <>
          <Tape seed={index * 17 + 3} w={tw} h={th} style={{ top: size * 0.02, right: size * 0.12, transform: 'rotate(38deg)' }} />
          <Tape seed={index * 17 + 5} w={tw} h={th} style={{ bottom: size * 0.06, left: size * 0.06, transform: 'rotate(40deg)' }} />
          {index % 2 === 0 && <Tape seed={index * 17 + 7} w={tw * 0.9} h={th} style={{ top: size * 0.42, left: -size * 0.04, transform: 'rotate(-8deg)' }} />}
        </>
      ) : (
        <>
          <Dot d={dot} style={{ top: size * 0.04, left: size * 0.34 }} />
          <Dot d={dot} style={{ top: size * 0.46, right: size * 0.02 }} />
          <Dot d={dot} style={{ bottom: size * 0.06, left: size * 0.12 }} />
        </>
      )}
    </div>
  )
}

// ─── Ballpoint notes ──────────────────────────────────────────────────────
const hand = (gap: number): React.CSSProperties => ({
  fontFamily: "'Nothing You Could Do', cursive",
  fontSize: gap * 0.74, lineHeight: `${gap}px`, color: PEN,
  textShadow: `0 0 .4px ${PEN}`, whiteSpace: 'nowrap',
})

function Underline({ w, double = false }: { w: number; double?: boolean }) {
  return (
    <svg width={w} height={8} viewBox={`0 0 ${w} 8`} style={{ position: 'absolute', left: -2, bottom: 1, overflow: 'visible' }}>
      <path d={`M1 3 C ${w * 0.3} 1.5, ${w * 0.7} 4.5, ${w - 1} 2.5`} stroke={PEN} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      {double && <path d={`M${w * 0.2} 7 C ${w * 0.5} 5.5, ${w * 0.8} 7.5, ${w - 3} 6`} stroke={PEN} strokeWidth={1} fill="none" strokeLinecap="round" />}
    </svg>
  )
}

function FlashNote({ flash, W, H }: { flash: FlashDef; W: number; H: number }) {
  const gap = lineGap(W)
  const top = snapToLine(flash.note.y, W, H) - gap + 3
  return (
    <div style={{ position: 'absolute', left: flash.note.x * W, top, width: flash.note.w * W, transform: 'rotate(-.6deg)' }}>
      <p style={{ ...hand(gap), position: 'relative', display: 'inline-block' }}>
        {flash.name}
        <Underline w={Math.min(flash.note.w * W, flash.name.length * gap * 0.36)} />
      </p>
      <p style={{ ...hand(gap), paddingLeft: gap * 0.5 }}>
        · {flash.available ? 'disponible ✓' : <span style={{ textDecoration: 'line-through' }}>disponible</span>}
        {!flash.available && ' agotado'}
      </p>
      <p style={{ ...hand(gap), paddingLeft: gap * 0.5, position: 'relative', display: 'inline-block', fontSize: gap * 0.82 }}>
        {flash.price}
        {flash.available && <Underline w={gap * 2.9} />}
      </p>
    </div>
  )
}

// ─── Faces ────────────────────────────────────────────────────────────────
function PageFront({ n, W, H }: { n: number; W: number; H: number }) {
  const gap = lineGap(W)
  const last = n === PAGES.length - 1
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Paper W={W} H={H} seed={n + 1} />

      {n === 0 && (
        <div style={{ position: 'absolute', left: W * 0.14, top: lineTop(H) + gap * 0 - gap + 4, transform: 'rotate(-1deg)' }}>
          <p style={{ ...hand(gap), fontSize: gap * 0.9, position: 'relative', display: 'inline-block' }}>
            Flash disponibles
            <Underline w={gap * 6.4} double />
          </p>
        </div>
      )}
      <p style={{ ...hand(gap), position: 'absolute', right: W * 0.07, top: lineTop(H) - gap + 4, fontSize: gap * 0.6, opacity: .85 }}>
        flash 2026
      </p>

      {PAGES[n].map((f, i) => <PaperFlash key={f.src} flash={f} index={i} W={W} H={H} />)}
      {PAGES[n].map(f => <FlashNote key={f.src + 'n'} flash={f} W={W} H={H} />)}

      {last && (
        <div style={{ position: 'absolute', left: W * 0.12, top: snapToLine(0.8, W, H) - gap + 3, transform: 'rotate(-.8deg)' }}>
          <p style={hand(gap)}>1 diseño por cliente ♡</p>
          <p style={hand(gap)}>escribime → @bri.t4tts</p>
        </div>
      )}
    </div>
  )
}

function PageBack({ n, W, H }: { n: number; W: number; H: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Paper W={W} H={H} seed={n + 40} mirror />
    </div>
  )
}

function CoverFront() {
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '0 14px 14px 0', overflow: 'hidden', background: '#b7c1d7' }}>
      <Image src="/Briza-Maldonado/flash/cover.jpg" alt="Cuaderno de flashes" fill priority draggable={false} style={{ objectFit: 'cover' }} sizes="(max-width: 600px) 90vw, 460px" />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12), inset -2px -2px 3px rgba(0,0,0,.12), inset 2px 2px 2px rgba(255,255,255,.35)',
        background: 'linear-gradient(125deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 60%, rgba(255,255,255,.07) 75%, rgba(255,255,255,0) 90%)',
      }} />
      <Holes />
    </div>
  )
}

function CoverBack() {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '14px 0 0 14px', overflow: 'hidden',
      backgroundColor: '#bcc5dc', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
    }}>
      <Grain opacity={.6} />
      <Holes right />
    </div>
  )
}

function Holes({ right = false }: { right?: boolean }) {
  const [ref, { h }] = useSize<HTMLDivElement>()
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {h > 0 && holeYs(h).map(y => (
        <div key={y} style={{
          position: 'absolute', top: y - 5.5, [right ? 'right' : 'left']: HOLE_X - 3.5,
          width: 7, height: 11, borderRadius: 1.5, background: '#2a2320',
          boxShadow: '0 .8px 0 rgba(255,255,255,.5)',
        }} />
      ))}
    </div>
  )
}

// ─── Notebook ─────────────────────────────────────────────────────────────
export default function Flash() {
  const [wrapRef, wrap] = useSize<HTMLDivElement>()
  const [turned, setTurned] = useState(0) // how many sheets are flipped; 0 = closed
  const [drag, setDrag] = useState<{ sheet: number; angle: number } | null>(null)
  const [moving, setMoving] = useState<number | null>(null)
  const [hinted, setHinted] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const gesture = useRef<{ x: number; y: number; t: number; dragging: boolean; sheet: number; dir: 1 | -1 } | null>(null)
  const suppressClick = useRef(false)
  const wheelAcc = useRef(0)
  const wheelLock = useRef(0)

  const W = Math.max(0, Math.min(460, wrap.w - 30))
  const H = W / RATIO
  const spread = wrap.w >= W * 2 + 80
  const open = turned > 0

  const go = useCallback((dir: 1 | -1) => {
    setTurned(t => {
      const next = Math.min(SHEETS - 1, Math.max(0, t + dir))
      if (next !== t) {
        setMoving(dir === 1 ? t : t - 1)
        setHinted(true)
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (moving === null) return
    const id = setTimeout(() => setMoving(null), 900)
    return () => clearTimeout(id)
  }, [moving, turned])

  // Horizontal trackpad scroll turns pages
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      if (Date.now() < wheelLock.current) return
      wheelAcc.current += e.deltaX
      if (Math.abs(wheelAcc.current) > 50) {
        go(wheelAcc.current > 0 ? 1 : -1)
        wheelAcc.current = 0
        wheelLock.current = Date.now() + 750
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go, W])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    gesture.current = { x: e.clientX, y: e.clientY, t: performance.now(), dragging: false, sheet: -1, dir: 1 }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.x, dy = e.clientY - g.y
    if (!g.dragging) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) {
        if (Math.abs(dy) > 12) gesture.current = null // vertical scroll wins
        return
      }
      const dir: 1 | -1 = dx < 0 ? 1 : -1
      const sheet = dir === 1 ? turned : turned - 1
      if (sheet < 0 || sheet > SHEETS - 2) { gesture.current = null; return }
      g.dragging = true; g.sheet = sheet; g.dir = dir
      stageRef.current?.setPointerCapture(e.pointerId)
    }
    const k = Math.min(1, Math.max(0, (g.dir === 1 ? -dx : dx) / (W * 1.1)))
    setDrag({ sheet: g.sheet, angle: g.dir === 1 ? -180 * k : -180 + 180 * k })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current
    gesture.current = null
    if (!g) return
    if (g.dragging) {
      suppressClick.current = true
      setTimeout(() => (suppressClick.current = false), 0)
      const dx = e.clientX - g.x
      const v = dx / Math.max(1, performance.now() - g.t)
      const k = Math.min(1, Math.max(0, (g.dir === 1 ? -dx : dx) / (W * 1.1)))
      const commit = k > 0.3 || (g.dir === 1 ? v < -0.35 : v > 0.35)
      setDrag(null)
      setMoving(g.sheet)
      if (commit) { setTurned(t => t + g.dir); setHinted(true) }
      return
    }
    // Tap: cover opens; page edges turn
    const rect = stageRef.current!.getBoundingClientRect()
    const rel = (e.clientX - rect.left) / W
    const onSticker = (e.target as HTMLElement).closest('[data-hover]') && turned > 0
    if (onSticker) return
    if (turned === 0) go(1)
    else if (rel < 0 || rel < 0.12) go(-1)
    else if (rel > 0.8) go(1)
  }

  const angleOf = (i: number) => (drag?.sheet === i ? drag.angle : i < turned ? -180 : 0)
  const shift = spread && (open || (drag && drag.sheet === 0)) ? W / 2 : 0

  return (
    <section
      id="flash"
      style={{
        borderTop: '1px solid rgba(28,28,28,0.1)',
        padding: '5rem clamp(1rem, 4vw, 2.5rem) 6rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ marginBottom: '3rem' }}>
        <p className="font-display" style={{
          fontSize: 'clamp(2.5rem, 6vw, 6rem)', lineHeight: 1, letterSpacing: '-0.03em',
          color: 'var(--ink)', fontStyle: 'italic',
        }}>
          Flash disponibles
        </p>
      </div>

      <div ref={wrapRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem 0 2rem' }}>
        {W > 0 && (
          <div style={{
            position: 'relative', width: W, height: H, marginLeft: 24,
            transform: `translateX(${shift}px)`,
            transition: 'transform .8s cubic-bezier(.3,.7,.2,1)',
          }}>
            {/* Page block + back cover under the right side */}
            <div style={{ position: 'absolute', inset: 0, transform: 'translate(7px, 8px)', background: '#aeb9d3', borderRadius: '0 14px 14px 0', boxShadow: '0 30px 60px rgba(40,30,60,.35), 0 8px 18px rgba(40,30,60,.25)' }} />
            {turned < SHEETS - 1 && [5, 3.5, 2].map(o => (
              <div key={o} style={{ position: 'absolute', top: 4, bottom: 4, left: 0, right: 4, transform: `translate(${o}px, ${o * 0.6}px)`, background: o === 5 ? '#dedbcd' : '#ebe8db', borderRadius: '0 16px 16px 0', boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.08)' }} />
            ))}
            {/* Left-side block once opened (visible on wide screens) */}
            {open && (
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: '100%', width: W, transform: 'translate(-7px, 8px)', background: '#aeb9d3', borderRadius: '14px 0 0 14px', boxShadow: '0 30px 60px rgba(40,30,60,.3)' }} />
            )}

            <div
              ref={stageRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => { gesture.current = null; setDrag(null) }}
              onClickCapture={e => { if (suppressClick.current) { e.stopPropagation(); e.preventDefault() } }}
              data-cursor="drag"
              style={{
                position: 'absolute', inset: 0,
                perspective: W * 3.2, perspectiveOrigin: '0% 50%',
                touchAction: 'pan-y', userSelect: 'none', WebkitUserSelect: 'none',
              }}
            >
              {Array.from({ length: SHEETS }).map((_, i) => {
                const angle = angleOf(i)
                const shade = Math.sin((Math.abs(angle) * Math.PI) / 180)
                const live = drag?.sheet === i
                const z = live || moving === i ? 100 : i < turned ? 10 + i : 60 - i
                const peek = i === 0 && turned === 0 && !drag && !hinted
                return (
                  <div key={i} style={{
                    position: 'absolute', inset: 0, zIndex: z,
                    transformStyle: 'preserve-3d', transformOrigin: '0 50%',
                    transform: `rotateY(${angle}deg)`,
                    transition: live ? 'none' : 'transform .85s cubic-bezier(.3,.7,.2,1)',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: '0 50%',
                      animation: peek ? 'nbPeek 4.5s ease-in-out 1.5s infinite' : 'none',
                    }}>
                      {/* Front */}
                      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: i === 0 ? '0 14px 14px 0' : '0 16px 16px 0', overflow: 'hidden' }}>
                        {i === 0 ? <CoverFront /> : <PageFront n={i - 1} W={W} H={H} />}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(90deg, rgba(40,25,10,${0.12 + shade * 0.3}) 0, rgba(40,25,10,${0.02 + shade * 0.25}) ${W * 0.08}px, rgba(40,25,10,${shade * 0.2}) 100%)`, mixBlendMode: 'multiply' }} />
                      </div>
                      {/* Back */}
                      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: i === 0 ? '14px 0 0 14px' : '16px 0 0 16px', overflow: 'hidden' }}>
                        {i === 0 ? <CoverBack /> : <PageBack n={i - 1} W={W} H={H} />}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(270deg, rgba(40,25,10,${0.22 + shade * 0.3}) 0, rgba(40,25,10,${shade * 0.15}) ${W * 0.1}px, rgba(40,25,10,0) 100%)`, mixBlendMode: 'multiply' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <WireSpiral height={H} />
          </div>
        )}
      </div>

      <style>{`
        @font-face { font-family: 'Nothing You Could Do'; src: url('/Briza-Maldonado/flash/nothing-you-could-do.ttf') format('truetype'); font-display: swap; }
        @keyframes nbPeek { 0%, 70%, 100% { transform: rotateY(0deg) } 80% { transform: rotateY(-16deg) } 88% { transform: rotateY(-4deg) } }
      `}</style>
    </section>
  )
}
