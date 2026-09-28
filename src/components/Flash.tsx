'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Place = { x: number; y: number; s: number; rot: number } // x,s: fraction of page width · y: fraction of page height
type FlashDef = { src: string; name: string; price: string; available: boolean; p: Place }

const BASE = '/Briza-Maldonado/flash/'
const PAGES: FlashDef[][] = [
  [
    { src: BASE + 'mariposa-daga.png', name: 'Mariposa con Daga', price: '$50.000', available: true,  p: { x: .08, y: .24, s: .44, rot: -6 } },
    { src: BASE + 'frutilla.png',      name: 'Frutilla',          price: '$40.000', available: true,  p: { x: .56, y: .30, s: .34, rot: 8 } },
    { src: BASE + 'corazon-vegan.png', name: 'Corazón Vegan',     price: '$55.000', available: true,  p: { x: .26, y: .60, s: .46, rot: -4 } },
  ],
  [
    { src: BASE + 'gorrion.png',       name: 'Gorrión',           price: '$60.000', available: false, p: { x: .07, y: .08, s: .44, rot: 7 } },
    { src: BASE + 'flor-hojas.png',    name: 'Flor con Hojas',    price: '$45.000', available: true,  p: { x: .55, y: .16, s: .38, rot: -9 } },
    { src: BASE + 'cerdo-cabra.png',   name: 'Cerdo & Cabra',     price: '$65.000', available: true,  p: { x: .22, y: .52, s: .50, rot: -4 } },
  ],
  [
    { src: BASE + 'rosa-alambre-flash.png', name: 'Rosa con Alambre', price: '$50.000', available: true, p: { x: .16, y: .08, s: .58, rot: 10 } },
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

const HOLE_X = 15
const COIL_GAP = 27
const lineTop = (H: number) => Math.round(H * 0.1)
const lineGap = (H: number) => Math.max(22, Math.round(H * 0.042))

// ─── Paper ────────────────────────────────────────────────────────────────
function drawPaper(canvas: HTMLCanvasElement, W: number, H: number, seed: number, mirror: boolean) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
  if (mirror) { ctx.translate(W, 0); ctx.scale(-1, 1) }
  const r = rng(seed * 7919 + 13)
  const marginX = Math.round(W * 0.14)

  ctx.fillStyle = '#f3eedf'
  ctx.fillRect(0, 0, W, H)

  const mottle = (cell: number, alpha: number) => {
    const gw = Math.ceil(W / cell) + 2, gh = Math.ceil(H / cell) + 2
    const g = document.createElement('canvas')
    g.width = gw; g.height = gh
    const gc = g.getContext('2d')!
    const id = gc.createImageData(gw, gh)
    for (let i = 0; i < id.data.length; i += 4) {
      const v = 110 + r() * 60
      id.data[i] = v + 8; id.data[i + 1] = v + 2; id.data[i + 2] = v - 10; id.data[i + 3] = 255
    }
    gc.putImageData(id, 0, 0)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.globalCompositeOperation = 'soft-light'
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(g, -cell, -cell, gw * cell, gh * cell)
    ctx.restore()
  }
  mottle(200, 0.55)
  mottle(64, 0.35)
  mottle(16, 0.22)

  ctx.save()
  ctx.lineCap = 'round'
  for (let i = 0; i < (W * H) / 900; i++) {
    const x = r() * W, y = r() * H, len = 3 + r() * 12, a = r() * Math.PI
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.quadraticCurveTo(x + Math.cos(a + 0.6) * len * 0.5, y + Math.sin(a + 0.6) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.strokeStyle = r() > 0.5 ? `rgba(255,255,250,${0.25 + r() * 0.3})` : `rgba(120,100,70,${0.05 + r() * 0.07})`
    ctx.lineWidth = 0.4 + r() * 0.5
    ctx.stroke()
  }
  ctx.restore()

  const inkLine = (x1: number, y1: number, x2: number, y2: number, rgb: string, base: number, width: number) => {
    const steps = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 14))
    let px = x1, py = y1
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const nx = x1 + (x2 - x1) * t + (x1 === x2 ? (r() - 0.5) * 0.35 : 0)
      const ny = y1 + (y2 - y1) * t + (y1 === y2 ? (r() - 0.5) * 0.25 : 0)
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(nx, ny)
      ctx.strokeStyle = `rgba(${rgb},${base * (0.7 + r() * 0.45)})`
      ctx.lineWidth = width * (0.85 + r() * 0.3)
      ctx.stroke()
      px = nx; py = ny
    }
  }
  const gap = lineGap(H)
  for (let y = lineTop(H); y < H - 16; y += gap) inkLine(0, y + 0.5, W, y + 0.5, '96,142,196', 0.42, 0.9)
  inkLine(marginX, 0, marginX, H, '208,62,72', 0.55, 1.1)
  inkLine(marginX + 3, 0, marginX + 3, H, '208,62,72', 0.3, 0.7)

  if (seed === 3 && !mirror) {
    const cx = W * 0.82, cy = H * 0.9, cr = W * 0.13
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    const fill = ctx.createRadialGradient(cx, cy, cr * 0.2, cx, cy, cr)
    fill.addColorStop(0, 'rgba(190,150,90,0.05)')
    fill.addColorStop(0.85, 'rgba(170,120,60,0.09)')
    fill.addColorStop(1, 'rgba(150,100,50,0)')
    ctx.fillStyle = fill
    ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill()
    for (let k = 0; k < 5; k++) {
      ctx.beginPath()
      const start = r() * Math.PI * 2, span = Math.PI * (1.1 + r() * 0.9)
      for (let a = start; a < start + span; a += 0.05) {
        const rr = cr * (0.96 + Math.sin(a * 3 + k) * 0.02 + (r() - 0.5) * 0.01)
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr
        a === start ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(140,90,40,${0.1 + r() * 0.1})`
      ctx.lineWidth = 0.8 + r() * 1.6
      ctx.stroke()
    }
    ctx.restore()
  }

  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  const sx = marginX + W * 0.1 + r() * W * 0.5, sy = H * (0.3 + r() * 0.5)
  const sm = ctx.createRadialGradient(sx, sy, 0, sx, sy, W * 0.22)
  sm.addColorStop(0, 'rgba(90,90,100,0.06)')
  sm.addColorStop(1, 'rgba(90,90,100,0)')
  ctx.fillStyle = sm
  ctx.fillRect(0, 0, W, H)
  ctx.restore()

  for (let y = 18; y < H - 8; y += COIL_GAP) {
    ctx.beginPath(); ctx.arc(HOLE_X, y, 4.6, 0, Math.PI * 2)
    ctx.fillStyle = '#2a2320'; ctx.fill()
    ctx.beginPath(); ctx.arc(HOLE_X + 0.8, y + 0.8, 4.6, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.8; ctx.stroke()
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  const id = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const d = id.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 9
    d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.9
  }
  ctx.putImageData(id, 0, 0)
}

function PaperCanvas({ w, h, seed, mirror = false }: { w: number; h: number; seed: number; mirror?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current && w > 0 && h > 0) drawPaper(ref.current, w, h, seed, mirror)
  }, [w, h, seed, mirror])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}

// ─── Wire spiral ──────────────────────────────────────────────────────────
function WireSpiral({ height }: { height: number }) {
  if (!height) return null
  const ys: number[] = []
  for (let y = 18; y < height - 8; y += COIL_GAP) ys.push(y)
  const o = 24
  const hx = HOLE_X + o
  return (
    <svg width={o * 2 + 20} height={height}
      style={{ position: 'absolute', left: -o, top: 0, zIndex: 200, overflow: 'visible', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="wire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a22" />
          <stop offset=".3" stopColor="#8a6a58" />
          <stop offset=".45" stopColor="#e8d4c4" />
          <stop offset=".6" stopColor="#6e5244" />
          <stop offset=".82" stopColor="#b8998a" />
          <stop offset="1" stopColor="#3a2a22" />
        </linearGradient>
        <filter id="wireShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      {ys.map(y => {
        const path = `M ${hx} ${y + 1} C ${hx - 10} ${y + 11}, ${o - 22} ${y + 9}, ${o - 20} ${y - 1} C ${o - 18} ${y - 10}, ${o - 2} ${y - 11}, ${o + 6} ${y - 6}`
        return (
          <g key={y}>
            <path d={path} transform="translate(3 4)" stroke="rgba(30,20,10,.35)" strokeWidth={3.6} fill="none" filter="url(#wireShadow)" />
            <path d={path} stroke="url(#wire)" strokeWidth={3.4} fill="none" strokeLinecap="round" />
            <path d={path} stroke="rgba(255,240,230,.5)" strokeWidth={0.8} fill="none" strokeLinecap="round" transform="translate(-.4 -.8)" />
          </g>
        )
      })}
    </svg>
  )
}

// ─── Masking tape ─────────────────────────────────────────────────────────
function tornPolygon(seed: number) {
  const r = rng(seed)
  const pts: string[] = []
  const teeth = 7
  for (let i = 0; i <= teeth; i++) pts.push(`${(r() * 7).toFixed(1)}% ${(i / teeth * 100).toFixed(1)}%`)
  for (let i = teeth; i >= 0; i--) pts.push(`${(100 - r() * 7).toFixed(1)}% ${(i / teeth * 100).toFixed(1)}%`)
  return `polygon(${pts.join(',')})`
}

function Tape({ seed, width, style }: { seed: number; width: number; style: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', zIndex: 3, pointerEvents: 'none', filter: 'drop-shadow(0 1px 1.5px rgba(60,40,10,.25))', ...style }}>
      <div style={{
        width, height: Math.max(14, width * 0.28),
        clipPath: tornPolygon(seed),
        background: `
          linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,0) 40%, rgba(0,0,0,.04)),
          repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 2px, rgba(0,0,0,.025) 2px 3px),
          rgba(232,221,186,.78)
        `,
      }} />
    </div>
  )
}

// ─── Sticker ──────────────────────────────────────────────────────────────
function Sticker({ flash, index, visible, W, H }: { flash: FlashDef; index: number; visible: boolean; W: number; H: number }) {
  const [active, setActive] = useState(false)
  const { p } = flash
  const size = p.s * W
  const twoTapes = (index + flash.name.length) % 3 === 0

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive(a => !a)}
      data-hover
      style={{
        position: 'absolute', left: p.x * W, top: p.y * H, width: size, height: size,
        opacity: visible ? 1 : 0,
        transform: `rotate(${active ? p.rot * 0.4 : p.rot}deg) translateY(${active ? -6 : 0}px) scale(${active ? 1.06 : 1})`,
        transition: 'transform .55s cubic-bezier(.2,.9,.25,1.15), opacity .4s ease',
        zIndex: active ? 20 : index + 1,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        filter: active
          ? 'drop-shadow(0 1px 1px rgba(40,25,10,.3)) drop-shadow(4px 14px 16px rgba(40,25,10,.28))'
          : 'drop-shadow(0 .5px .6px rgba(40,25,10,.45)) drop-shadow(1.5px 3px 4px rgba(40,25,10,.18))',
        transition: 'filter .35s ease',
      }}>
        <Image src={flash.src} alt={flash.name} fill draggable={false} style={{ objectFit: 'contain' }} sizes={`${Math.round(size)}px`} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          WebkitMaskImage: `url(${flash.src})`, maskImage: `url(${flash.src})`,
          WebkitMaskSize: 'contain', maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center', maskPosition: 'center',
          background: 'linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.38) 44%, rgba(255,255,255,0) 52%, rgba(255,255,255,0) 70%, rgba(255,255,255,.14) 78%, rgba(255,255,255,0) 84%)',
          backgroundSize: '220% 220%',
          backgroundPosition: active ? '0% 0%' : '60% 60%',
          transition: 'background-position .8s ease',
          mixBlendMode: 'screen',
        }} />
      </div>

      {twoTapes ? (
        <>
          <Tape seed={index * 31 + 1} width={size * 0.32} style={{ top: size * 0.1, left: size * 0.02, transform: 'rotate(-38deg)' }} />
          <Tape seed={index * 31 + 2} width={size * 0.32} style={{ bottom: size * 0.12, right: size * 0.02, transform: 'rotate(-40deg)' }} />
        </>
      ) : (
        <Tape seed={index * 31 + 3} width={size * 0.42} style={{ top: size * 0.04, left: '50%', transform: `translateX(-50%) rotate(${index % 2 ? 3 : -4}deg)` }} />
      )}

      <div style={{
        position: 'absolute', top: '100%', left: '50%', marginTop: 2,
        transform: `translateX(-50%) rotate(${-p.rot}deg)`,
        whiteSpace: 'nowrap', textAlign: 'center', pointerEvents: 'none',
        opacity: active ? 1 : 0, transition: 'opacity .25s ease',
        fontFamily: "'Caveat', cursive", lineHeight: 1,
      }}>
        <span style={{ fontSize: Math.max(16, W * 0.052), fontWeight: 700, color: flash.available ? '#1f2a7a' : '#8a8a8a', textDecoration: flash.available ? 'none' : 'line-through' }}>
          {flash.price}
        </span>
        {!flash.available && <span style={{ fontSize: Math.max(14, W * 0.042), color: '#b3262e', marginLeft: 6 }}>agotado</span>}
      </div>
    </div>
  )
}

// ─── Faces ────────────────────────────────────────────────────────────────
const ink = (W: number, k: number): React.CSSProperties => ({ fontFamily: "'Caveat', cursive", fontSize: W * k, lineHeight: 1 })

function PageFront({ n, W, H, visible }: { n: number; W: number; H: number; visible: boolean }) {
  const marginX = Math.round(W * 0.14)
  const top = lineTop(H), gap = lineGap(H)
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <PaperCanvas w={W} h={H} seed={n + 1} />

      {n === 0 && (
        <div style={{ position: 'absolute', left: marginX + 12, top: top - gap * 1.35, right: 12 }}>
          <p style={{ ...ink(W, 0.1), fontWeight: 700, color: '#1c2466', transform: 'rotate(-1.5deg)', transformOrigin: 'left', whiteSpace: 'nowrap' }}>
            Flash disponibles
          </p>
          <svg viewBox="0 0 300 14" preserveAspectRatio="none" style={{ display: 'block', width: W * 0.62, height: 10, marginTop: 2, overflow: 'visible' }}>
            <path d="M2 8 C 60 3, 140 11, 210 6 S 290 4, 298 7" stroke="#b3262e" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".8" />
          </svg>
          <p style={{ ...ink(W, 0.055), color: '#b3262e', marginTop: gap * 0.35 }}>consultá por turno → @bri.t4tts</p>
        </div>
      )}
      {n === 1 && (
        <p style={{ ...ink(W, 0.05), position: 'absolute', right: W * 0.08, bottom: H * 0.1, color: '#1c2466', transform: 'rotate(-3deg)', opacity: .8 }}>
          blackwork & traditional ✶
        </p>
      )}
      {n === 2 && (
        <div style={{ position: 'absolute', left: marginX + 12, right: 14, top: H * 0.58, color: '#1c2466' }}>
          <p style={{ ...ink(W, 0.062), transform: 'rotate(-2deg)' }}>1 diseño por cliente ✶</p>
          <p style={{ ...ink(W, 0.062), marginTop: gap * 0.7, transform: 'rotate(-1deg)', color: '#b3262e' }}>escribime → @bri.t4tts</p>
          <p style={{ ...ink(W, 0.048), marginTop: gap * 0.7, opacity: .7 }}>(tocá un flash para ver el precio)</p>
        </div>
      )}

      {PAGES[n].map((f, i) => <Sticker key={f.src} flash={f} index={i} visible={visible} W={W} H={H} />)}

      <p style={{ ...ink(W, 0.045), position: 'absolute', bottom: 10, right: 16, color: '#1c2466', opacity: .55 }}>{n + 1}</p>
    </div>
  )
}

function CoverFront() {
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '0 14px 14px 0', overflow: 'hidden', background: '#b7c1d7' }}>
      <Image src="/Briza-Maldonado/flash/cover.jpg" alt="Cuaderno de flashes" fill priority draggable={false} style={{ objectFit: 'cover' }} sizes="(max-width: 600px) 90vw, 460px" />
      {/* cardboard edge + soft sheen of a laminated cover */}
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
      backgroundColor: '#bcc5dc',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E")`,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
    }}>
      <Holes right />
    </div>
  )
}

function Holes({ right = false }: { right?: boolean }) {
  const [ref, { h }] = useSize<HTMLDivElement>()
  const ys: number[] = []
  for (let y = 18; y < h - 8; y += COIL_GAP) ys.push(y)
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {ys.map(y => (
        <div key={y} style={{
          position: 'absolute', top: y - 4.6, [right ? 'right' : 'left']: HOLE_X - 4.6,
          width: 9.2, height: 9.2, borderRadius: '50%', background: '#2a2320',
          boxShadow: '.8px .8px 0 rgba(255,255,255,.5)',
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
              <div key={o} style={{ position: 'absolute', top: 4, bottom: 4, left: 0, right: 4, transform: `translate(${o}px, ${o * 0.6}px)`, background: o === 5 ? '#e3dcc8' : '#eee8d6', borderRadius: '0 4px 4px 0', boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.08)' }} />
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
                      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: i === 0 ? '0 14px 14px 0' : '0 4px 4px 0', overflow: 'hidden' }}>
                        {i === 0 ? <CoverFront /> : <PageFront n={i - 1} W={W} H={H} visible={turned >= i - 1} />}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(90deg, rgba(40,25,10,${0.25 + shade * 0.3}) 0, rgba(40,25,10,${0.06 + shade * 0.25}) ${W * 0.08}px, rgba(40,25,10,${shade * 0.2}) 100%)`, mixBlendMode: 'multiply' }} />
                        {i === turned && i > 0 && i < SHEETS - 1 && !drag && (
                          <div style={{ position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, pointerEvents: 'none', background: 'linear-gradient(315deg, rgba(0,0,0,0) 50%, #d8d0b8 50%, #f7f2e3 72%, #e6dec8 100%)', boxShadow: '-2px -2px 5px rgba(0,0,0,.12)', borderTopLeftRadius: 2, animation: hinted ? 'none' : 'nbCorner 2.4s ease-in-out infinite' }} />
                        )}
                      </div>
                      {/* Back */}
                      <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: i === 0 ? '14px 0 0 14px' : '4px 0 0 4px', overflow: 'hidden' }}>
                        {i === 0 ? <CoverBack /> : <PaperCanvas w={W} h={H} seed={i + 40} mirror />}
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
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');
        @keyframes nbPeek { 0%, 70%, 100% { transform: rotateY(0deg) } 80% { transform: rotateY(-16deg) } 88% { transform: rotateY(-4deg) } }
        @keyframes nbCorner { 0%, 100% { width: 22px; height: 22px } 50% { width: 38px; height: 38px } }
      `}</style>
    </section>
  )
}
