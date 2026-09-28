'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Place = { x: number; y: number; s: number; rot: number }
type FlashDef = {
  src: string; name: string; price: string; available: boolean
  d: Place // desktop: x,s as fraction of width, y as fraction of area height
  m: Place // mobile
}

const flashes: FlashDef[] = [
  { src: '/Briza-Maldonado/flash/mariposa-daga.png',     name: 'Mariposa con Daga', price: '$50.000', available: true,
    d: { x: .04, y: .02, s: .26, rot: -6 }, m: { x: .01, y: .00, s: .48, rot: -6 } },
  { src: '/Briza-Maldonado/flash/frutilla.png',           name: 'Frutilla',          price: '$40.000', available: true,
    d: { x: .38, y: .00, s: .19, rot: 8 },  m: { x: .55, y: .04, s: .40, rot: 8 } },
  { src: '/Briza-Maldonado/flash/corazon-vegan.png',      name: 'Corazón Vegan',     price: '$55.000', available: true,
    d: { x: .66, y: .05, s: .24, rot: -5 }, m: { x: .05, y: .215, s: .44, rot: 5 } },
  { src: '/Briza-Maldonado/flash/gorrion.png',            name: 'Gorrión',           price: '$60.000', available: false,
    d: { x: .12, y: .38, s: .24, rot: 7 },  m: { x: .50, y: .27, s: .46, rot: -7 } },
  { src: '/Briza-Maldonado/flash/flor-hojas.png',         name: 'Flor con Hojas',    price: '$45.000', available: true,
    d: { x: .55, y: .35, s: .22, rot: -9 }, m: { x: .03, y: .47, s: .42, rot: -9 } },
  { src: '/Briza-Maldonado/flash/cerdo-cabra.png',        name: 'Cerdo & Cabra',     price: '$65.000', available: true,
    d: { x: .02, y: .68, s: .26, rot: -4 }, m: { x: .47, y: .52, s: .50, rot: 4 } },
  { src: '/Briza-Maldonado/flash/rosa-alambre-flash.png', name: 'Rosa con Alambre',  price: '$50.000', available: true,
    d: { x: .50, y: .66, s: .26, rot: 10 }, m: { x: .10, y: .72, s: .52, rot: -8 } },
]

// Deterministic PRNG so the paper looks identical on every visit
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

const LINE_TOP = 96
const LINE_GAP = 30
const HOLE_X = 15
const COIL_GAP = 27

// ─── Paper ────────────────────────────────────────────────────────────────
function drawPaper(canvas: HTMLCanvasElement, W: number, H: number, marginX: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
  const r = rng(1987)

  ctx.fillStyle = '#f3eedf'
  ctx.fillRect(0, 0, W, H)

  // Multi-scale mottling: tiny random grids upscaled with smoothing = soft value noise
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
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(g, -cell, -cell, gw * cell, gh * cell)
    ctx.restore()
  }
  mottle(220, 0.55)
  mottle(70, 0.35)
  mottle(18, 0.25)

  // Paper fibers
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

  // Ink lines: drawn in short segments so pressure/absorption varies along the rule
  const inkLine = (x1: number, y1: number, x2: number, y2: number, rgb: string, base: number, width: number) => {
    const len = Math.hypot(x2 - x1, y2 - y1)
    const steps = Math.max(1, Math.round(len / 14))
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
  for (let y = LINE_TOP; y < H - 16; y += LINE_GAP) inkLine(0, y + 0.5, W, y + 0.5, '96,142,196', 0.42, 0.9)
  inkLine(marginX, 0, marginX, H, '208,62,72', 0.55, 1.1)
  inkLine(marginX + 3, 0, marginX + 3, H, '208,62,72', 0.3, 0.7)

  // Coffee ring: several imperfect arcs + a faint fill
  const cx = W * 0.9, cy = H * 0.985, cr = Math.min(W, 520) * 0.12
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

  // Graphite smudge near the margin
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  const sm = ctx.createRadialGradient(marginX + 40, H * 0.55, 0, marginX + 40, H * 0.55, 90)
  sm.addColorStop(0, 'rgba(90,90,100,0.07)')
  sm.addColorStop(1, 'rgba(90,90,100,0)')
  ctx.fillStyle = sm
  ctx.fillRect(0, 0, W, H)
  ctx.restore()

  // Punched holes (the wire passes through these)
  for (let y = 18; y < H - 8; y += COIL_GAP) {
    ctx.save()
    ctx.beginPath(); ctx.arc(HOLE_X, y, 4.6, 0, Math.PI * 2)
    ctx.fillStyle = '#2a2320'; ctx.fill()
    ctx.beginPath(); ctx.arc(HOLE_X + 0.8, y + 0.8, 4.6, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 0.8; ctx.stroke()
    ctx.restore()
  }

  // Fine grain last so it sits on top of ink, like a scan
  const id = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const d = id.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 9
    d[i] += n; d[i + 1] += n; d[i + 2] += n * 0.9
  }
  ctx.putImageData(id, 0, 0)
}

function PaperCanvas({ w, h, marginX }: { w: number; h: number; marginX: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current && w > 0 && h > 0) drawPaper(ref.current, w, h, marginX)
  }, [w, h, marginX])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}

// ─── Wire spiral ──────────────────────────────────────────────────────────
function WireSpiral({ height, offset = 22 }: { height: number; offset?: number }) {
  if (!height) return null
  const ys: number[] = []
  for (let y = 18; y < height - 8; y += COIL_GAP) ys.push(y)
  const hx = HOLE_X + offset
  return (
    <svg
      width={offset + 30} height={height}
      style={{ position: 'absolute', left: -offset, top: 0, zIndex: 6, overflow: 'visible', pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="wire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1d1f" />
          <stop offset=".28" stopColor="#8d8f94" />
          <stop offset=".42" stopColor="#f4f5f7" />
          <stop offset=".58" stopColor="#6c6e73" />
          <stop offset=".8" stopColor="#c9cbcf" />
          <stop offset="1" stopColor="#2a2a2c" />
        </linearGradient>
        <filter id="wireShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      {ys.map(y => {
        const path = `M ${hx} ${y + 1} C ${hx - 10} ${y + 11}, ${offset - 20} ${y + 9}, ${offset - 18} ${y - 1} C ${offset - 16} ${y - 10}, ${offset - 2} ${y - 11}, ${offset + 6} ${y - 6}`
        return (
          <g key={y}>
            <path d={path} transform="translate(3 4)" stroke="rgba(30,20,10,.35)" strokeWidth={3.6} fill="none" filter="url(#wireShadow)" />
            <path d={path} stroke="url(#wire)" strokeWidth={3.4} fill="none" strokeLinecap="round" />
            <path d={path} stroke="rgba(255,255,255,.55)" strokeWidth={0.8} fill="none" strokeLinecap="round" transform="translate(-.4 -.8)" />
          </g>
        )
      })}
    </svg>
  )
}

// ─── Masking tape with torn ends ──────────────────────────────────────────
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
        width, height: Math.max(16, width * 0.28),
        clipPath: tornPolygon(seed),
        background: `
          linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,0) 40%, rgba(0,0,0,.04)),
          repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 2px, rgba(0,0,0,.025) 2px 3px),
          rgba(232,221,186,.78)
        `,
        backdropFilter: 'saturate(.85)',
      }} />
    </div>
  )
}

// ─── Sticker ──────────────────────────────────────────────────────────────
function FlashItem({ flash, index, visible, place, areaW, areaH }: {
  flash: FlashDef; index: number; visible: boolean; place: Place; areaW: number; areaH: number
}) {
  const [active, setActive] = useState(false)
  const size = place.s * areaW
  const twoTapes = index % 3 === 1

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive(a => !a)}
      data-hover
      style={{
        position: 'absolute',
        left: place.x * areaW,
        top: place.y * areaH,
        width: size, height: size,
        opacity: visible ? 1 : 0,
        transform: visible
          ? `rotate(${active ? place.rot * 0.4 : place.rot}deg) translateY(${active ? -6 : 0}px) scale(${active ? 1.06 : 1})`
          : `rotate(${place.rot + 6}deg) translateY(-30px) scale(1.12)`,
        transition: 'transform .55s cubic-bezier(.2,.9,.25,1.15), opacity .45s ease',
        transitionDelay: visible && !active ? `${index * 90}ms` : '0ms',
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
        <Image src={flash.src} alt={flash.name} fill style={{ objectFit: 'contain' }} sizes={`${Math.round(size)}px`} />
        {/* Vinyl sheen, masked to the sticker's own silhouette */}
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
          <Tape seed={index * 31 + 1} width={size * 0.32} style={{ top: -4, left: -8, transform: 'rotate(-38deg)' }} />
          <Tape seed={index * 31 + 2} width={size * 0.32} style={{ bottom: 2, right: -8, transform: 'rotate(-40deg)' }} />
        </>
      ) : (
        <Tape seed={index * 31 + 3} width={size * 0.42} style={{ top: -8, left: '50%', transform: `translateX(-50%) rotate(${index % 2 ? 3 : -4}deg)` }} />
      )}

      {/* Handwritten price */}
      <div style={{
        position: 'absolute', top: '100%', left: '50%', marginTop: 4,
        transform: `translateX(-50%) rotate(${-place.rot}deg)`,
        whiteSpace: 'nowrap', textAlign: 'center', pointerEvents: 'none',
        opacity: active ? 1 : 0, transition: 'opacity .25s ease',
        fontFamily: "'Caveat', cursive", lineHeight: 1,
      }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: flash.available ? '#1f2a7a' : '#8a8a8a', textDecoration: flash.available ? 'none' : 'line-through' }}>
          {flash.price}
        </span>
        {!flash.available && <span style={{ fontSize: '1rem', color: '#b3262e', marginLeft: 6 }}>agotado</span>}
      </div>
    </div>
  )
}

// ─── Notebook interior ────────────────────────────────────────────────────
function NotebookInterior({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(false)
  const [itemsVisible, setItemsVisible] = useState(false)
  const [pageRef, page] = useSize<HTMLDivElement>()
  const [areaRef, area] = useSize<HTMLDivElement>()

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 40)
    const t2 = setTimeout(() => setItemsVisible(true), 450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const mobile = page.w > 0 && page.w < 560
  const marginX = mobile ? 40 : 72
  const areaH = area.w * (mobile ? 1.92 : 0.86)

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(14px) rotate(-.6deg)',
      transition: 'opacity .5s ease, transform .6s cubic-bezier(.25,.46,.45,.94)',
      width: '100%', maxWidth: 820, margin: '0 auto',
      paddingLeft: 22,
    }}>
      <div style={{ position: 'relative', transform: 'rotate(-.4deg)' }}>
        {/* Page stack + back cover for physical thickness */}
        <div style={{ position: 'absolute', inset: 0, transform: 'translate(9px, 10px)', background: 'var(--mark)', borderRadius: '0 10px 10px 0', boxShadow: '0 30px 60px rgba(40,10,20,.35), 0 8px 18px rgba(40,10,20,.25)' }} />
        {[6, 4, 2].map(o => (
          <div key={o} style={{ position: 'absolute', inset: 0, transform: `translate(${o}px, ${o * 0.8}px)`, background: o === 6 ? '#e3dcc8' : '#ece6d3', borderRadius: '0 6px 6px 0', boxShadow: 'inset -1px -1px 0 rgba(0,0,0,.08)' }} />
        ))}

        {/* Top page */}
        <div ref={pageRef} style={{ position: 'relative', borderRadius: '0 6px 6px 0', overflow: 'hidden', boxShadow: '1px 1px 2px rgba(0,0,0,.12)' }}>
          <PaperCanvas w={page.w} h={page.h} marginX={marginX} />

          <div style={{ position: 'relative', zIndex: 1, padding: `${LINE_TOP - 62}px ${mobile ? 14 : 36}px 40px ${marginX + 14}px` }}>
            {/* Title written on the lines */}
            <div style={{ position: 'relative', height: LINE_GAP * 2, marginBottom: 6 }}>
              <p style={{
                fontFamily: "'Caveat', cursive", fontWeight: 700,
                fontSize: mobile ? '2.3rem' : '3.1rem', lineHeight: 1, whiteSpace: 'nowrap',
                color: '#1c2466', transform: 'rotate(-1.5deg)', transformOrigin: 'left',
                textShadow: '0 0 .6px rgba(28,36,102,.6)',
              }}>
                Flash disponibles
              </p>
              <svg viewBox="0 0 300 14" preserveAspectRatio="none" style={{ position: 'absolute', left: -4, top: mobile ? 40 : 52, width: mobile ? 230 : 330, height: 12, overflow: 'visible' }}>
                <path d="M2 8 C 60 3, 140 11, 210 6 S 290 4, 298 7" stroke="#b3262e" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".8" />
                <path d="M30 12 C 90 8, 170 13, 250 9" stroke="#b3262e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".55" />
              </svg>
            </div>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: mobile ? '1.15rem' : '1.3rem', color: '#b3262e', lineHeight: `${LINE_GAP}px`, marginBottom: LINE_GAP * 0.6 }}>
              consultá por turno → @bri.t4tts
            </p>

            {/* Sticker area */}
            <div ref={areaRef} style={{ position: 'relative', width: '100%', height: areaH || 600 }}>
              {area.w > 0 && flashes.map((f, i) => (
                <FlashItem key={f.src} flash={f} index={i} visible={itemsVisible}
                  place={mobile ? f.m : f.d} areaW={area.w} areaH={areaH} />
              ))}
            </div>

            <p style={{
              fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: '#1c2466',
              textAlign: 'right', transform: 'rotate(-2deg)', marginTop: 18, opacity: .8,
            }}>
              1 diseño por cliente ✶ {mobile ? 'tocá' : 'pasá el mouse'} para ver precio
            </p>

            <div style={{ textAlign: 'center', marginTop: 22 }}>
              <button
                onClick={onClose}
                data-hover
                style={{
                  background: 'none', border: 'none', cursor: 'none',
                  fontFamily: "'Caveat', cursive", fontSize: '1.25rem', color: '#b3262e',
                  textDecoration: 'underline', textDecorationStyle: 'wavy', textUnderlineOffset: 5,
                }}
              >
                cerrar cuaderno ↑
              </button>
            </div>
          </div>

          {/* Global lighting: page curves into the binding, soft light from top-left */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', mixBlendMode: 'multiply',
            background: `
              linear-gradient(90deg, rgba(60,40,20,.28) 0, rgba(60,40,20,.10) 14px, rgba(60,40,20,0) 46px),
              linear-gradient(270deg, rgba(60,40,20,.10) 0, rgba(60,40,20,0) 24px),
              radial-gradient(120% 90% at 18% 0%, rgba(255,255,255,0) 40%, rgba(90,60,30,.12) 100%)
            `,
          }} />
          <div style={{
            position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', mixBlendMode: 'screen',
            background: 'radial-gradient(70% 45% at 25% 8%, rgba(255,250,235,.22), rgba(255,250,235,0) 70%)',
          }} />
        </div>

        <WireSpiral height={page.h} />
      </div>
    </div>
  )
}

// ─── Cover ────────────────────────────────────────────────────────────────
function NotebookCover({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [ref, size] = useSize<HTMLDivElement>()

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto', paddingLeft: 22 }}>
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-hover
        style={{
          position: 'relative', width: '100%', aspectRatio: '3/4', cursor: 'none',
          transform: hovered ? 'rotate(-1.5deg) translateY(-6px)' : 'rotate(-.5deg)',
          transition: 'transform .5s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        {[6, 3].map(o => (
          <div key={o} style={{ position: 'absolute', inset: 0, transform: `translate(${o}px, ${o}px)`, background: o === 6 ? '#e3dcc8' : '#ece6d3', borderRadius: '0 8px 8px 0' }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0, backgroundColor: 'var(--mark)', borderRadius: '0 8px 8px 0', overflow: 'hidden',
          boxShadow: hovered ? '0 34px 60px rgba(60,10,25,.4), 0 8px 18px rgba(0,0,0,.25)' : '0 20px 44px rgba(60,10,25,.32), 0 5px 12px rgba(0,0,0,.2)',
          transition: 'box-shadow .4s',
        }}>
          {/* Cardboard/leatherette texture */}
          <div style={{
            position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: .5,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,.28) 0, rgba(0,0,0,0) 40px), radial-gradient(90% 70% at 25% 15%, rgba(255,255,255,.16), transparent 60%), radial-gradient(80% 60% at 90% 100%, rgba(0,0,0,.22), transparent 60%)',
          }} />
          {/* Worn corner */}
          <div style={{ position: 'absolute', right: 0, bottom: 0, width: 60, height: 60, background: 'radial-gradient(circle at 100% 100%, rgba(255,230,210,.25), transparent 70%)' }} />

          {/* Label sticker */}
          <div style={{
            position: 'absolute', top: '24%', left: '50%', width: '72%',
            transform: 'translateX(-46%) rotate(-2.5deg)',
            background: '#f1ead6', padding: '1.1rem 1rem 1.3rem', textAlign: 'center',
            boxShadow: '0 1px 1px rgba(0,0,0,.25), 2px 5px 10px rgba(0,0,0,.22)',
            borderRadius: 3,
          }}>
            <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(179,38,46,.35)', borderRadius: 2 }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 7vw, 3.2rem)', color: '#140E0E', lineHeight: 1, letterSpacing: '-.02em' }}>Flash</p>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: '#1c2466', marginTop: 4, transform: 'rotate(-2deg)' }}>disponibles ✶</p>
          </div>
          <Tape seed={77} width={90} style={{ top: 'calc(24% - 12px)', left: '18%', transform: 'rotate(-30deg)' }} />

          <p style={{
            position: 'absolute', bottom: '7%', width: '100%', textAlign: 'center',
            fontFamily: "'Caveat', cursive", fontSize: '1.25rem', color: 'rgba(255,240,245,.85)',
            opacity: hovered ? 1 : .7, transition: 'opacity .3s',
          }}>
            abrir ↓
          </p>
        </div>
        <WireSpiral height={size.h} />
      </div>
    </div>
  )
}

export default function Flash() {
  const [open, setOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <section
      id="flash"
      ref={sectionRef}
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

      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0 3rem' }}>
        {open ? <NotebookInterior onClose={() => setOpen(false)} /> : <NotebookCover onClick={handleOpen} />}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');`}</style>
    </section>
  )
}
