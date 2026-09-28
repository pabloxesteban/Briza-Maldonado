'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { WORKS, num, type Work } from '@/data/works'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

type Rect = { left: number; top: number; width: number; height: number }

function useViewport() {
  const [vp, setVp] = useState({ w: 1280, h: 800, mobile: false })
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight, mobile: window.innerWidth < 768 })
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return vp
}

// Progress (0..1) of a tall element scrolling past the viewport
function useScrollProgress(ref: React.RefObject<HTMLElement>, mode: 'pin' | 'pass') {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect(), vh = window.innerHeight
      setP(mode === 'pin'
        ? clamp(-r.top / Math.max(1, r.height - vh))
        : clamp((vh - r.top) / (r.height + vh)))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [ref, mode])
  return p
}

// ─── Act 1: the entrance ──────────────────────────────────────────────────
function Entrance({ still, mobile }: { still: boolean; mobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const p = useScrollProgress(ref, 'pin')
  const cols = mobile ? 2 : 3
  const rows = 4
  const tiles = WORKS.slice(0, cols * rows)
  const inP = ease(seg(p, 0, 0.42))        // columns arrive from opposite directions
  const openP = ease(seg(p, 0.42, 0.86))   // the grid zooms and opens a space in the middle
  const titleP = ease(seg(p, 0.66, 0.92))
  const mid = (cols - 1) / 2

  if (still) return null

  return (
    <div ref={ref} className="arch-entrance" style={{ height: mobile ? '230vh' : '260vh' }}>
      <div className="arch-stage">
        <div className="arch-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, transform: `scale(${1 + openP * (mobile ? 0.4 : 0.32)})` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="arch-col" style={{
              transform: `translate(${(c - mid) * openP * (mobile ? 58 : 78)}%, ${(1 - inP) * (c % 2 ? -70 : 70)}vh)`,
            }}>
              {Array.from({ length: rows }).map((_, r) => {
                const w = tiles[r * cols + c]
                const centre = !mobile && c === 1
                return (
                  <div key={r} className="arch-tile" style={{
                    transform: centre ? `translateY(${(r < 2 ? -1 : 1) * openP * 150}%)` : undefined,
                    opacity: 0.25 + inP * 0.75,
                  }}>
                    <Image src={w.src} alt="" fill sizes={mobile ? '50vw' : '30vw'} style={{ objectFit: 'cover' }} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="arch-entrance-title" style={{ opacity: titleP, transform: `translateY(${(1 - titleP) * 24}px)` }}>
          <h2 className="font-display">Trabajos</h2>
          <p>{WORKS.length} piezas · Traditional · Black &amp; white · Color</p>
        </div>
      </div>
    </div>
  )
}

// ─── Act 2: the wall ──────────────────────────────────────────────────────
function Wall({ still, mobile, onOpen }: { still: boolean; mobile: boolean; onOpen: (i: number, el: HTMLElement) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const p = useScrollProgress(ref, 'pass')
  const cols = mobile ? 2 : 3
  const speeds = mobile ? [-40, 60] : [-70, 110, -30]
  const columns: { w: Work; i: number }[][] = Array.from({ length: cols }, () => [])
  WORKS.forEach((w, i) => columns[i % cols].push({ w, i }))

  return (
    <div ref={ref} className="arch-wall" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {columns.map((col, c) => (
        <div key={c} className="arch-wall-col" style={{
          transform: still ? undefined : `translateY(${(p - 0.5) * speeds[c]}px)`,
          marginTop: !mobile && c === 1 ? '14vh' : mobile && c === 1 ? '9vh' : 0,
        }}>
          {col.map(({ w, i }) => (
            <button key={w.slug} type="button" className="arch-item" data-cursor="view" data-work={w.slug}
              onClick={e => onOpen(i, (e.currentTarget.querySelector('.arch-img') as HTMLElement))}>
              <span className="arch-img">
                <Image src={w.src} alt={w.title} fill sizes={mobile ? '48vw' : '31vw'} style={{ objectFit: 'cover' }} />
              </span>
              <span className="arch-cap">
                <span className="arch-num">Nº {num(i)}</span>
                <span className="arch-name font-display">{w.title}</span>
                <span className="arch-style">{w.style}</span>
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Index view ───────────────────────────────────────────────────────────
function Index({ onOpen }: { onOpen: (i: number, el: HTMLElement) => void }) {
  const [hover, setHover] = useState<number | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (preview.current) preview.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px)`
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div className="arch-index" onMouseLeave={() => setHover(null)}>
      {WORKS.map((w, i) => (
        <button key={w.slug} type="button" className="arch-row" data-cursor="view" data-work={w.slug}
          onMouseEnter={() => setHover(i)}
          onClick={e => onOpen(i, e.currentTarget.querySelector('.arch-row-thumb') as HTMLElement)}>
          <span className="arch-num">Nº {num(i)}</span>
          <span className="arch-row-name font-display">{w.title}</span>
          <span className="arch-row-meta">{w.style} · {w.zone}</span>
          <span className="arch-row-thumb"><Image src={w.src} alt="" fill sizes="96px" style={{ objectFit: 'cover' }} /></span>
        </button>
      ))}
      <div ref={preview} className={`arch-preview ${hover !== null ? 'on' : ''}`} aria-hidden>
        {hover !== null && <Image key={hover} src={WORKS[hover].src} alt="" fill sizes="280px" style={{ objectFit: 'cover' }} />}
      </div>
    </div>
  )
}

// ─── Act 3: the piece ─────────────────────────────────────────────────────
function frameRect(mobile: boolean): Rect {
  const w = window.innerWidth, h = window.innerHeight
  if (mobile) {
    // leave room below for the name, details and the booking button
    const height = Math.max(200, Math.min(h - 72 - 290, (w - 32) * 1.25))
    const width = Math.min(w - 32, height * 0.8)
    return { left: (w - width) / 2, top: 72, width, height }
  }
  const height = h * 0.78
  const width = Math.min(height * 0.8, w * 0.46)
  return { left: w * 0.07, top: h * 0.13, width, height }
}

const px = (r: Rect) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` })

function Detail({ index, from, mobile, onIndex, onClose }: {
  index: number; from: Rect | null; mobile: boolean
  onIndex: (i: number) => void; onClose: () => void
}) {
  const frame = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(!from)
  const closing = useRef(false)
  const w = WORKS[index]
  const target = frameRect(mobile)

  // Open: grow from the thumbnail to the frame
  useLayoutEffect(() => {
    const el = frame.current
    if (!el) return
    if (!from) { setReady(true); return }
    const a = el.animate([{ ...px(from), borderRadius: '2px' }, { ...px(target), borderRadius: '4px' }],
      { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' })
    const t = setTimeout(() => setReady(true), 260)
    return () => { a.cancel(); clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    setReady(false)
    const el = frame.current
    const thumb = document.querySelector(`[data-work="${WORKS[index].slug}"] .arch-img, [data-work="${WORKS[index].slug}"] .arch-row-thumb`) as HTMLElement | null
    const r = thumb?.getBoundingClientRect()
    const visible = r && r.bottom > 0 && r.top < window.innerHeight && r.width > 0
    if (el && visible) {
      const a = el.animate([{ ...px(frameRect(mobile)) }, { ...px({ left: r.left, top: r.top, width: r.width, height: r.height }) }],
        { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' })
      a.onfinish = onClose
    } else if (el) {
      const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' })
      a.onfinish = onClose
    } else onClose()
  }, [index, mobile, onClose])

  const step = useCallback((d: number) => onIndex((index + d + WORKS.length) % WORKS.length), [index, onIndex])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const back = () => close()
    window.addEventListener('keydown', key)
    window.addEventListener('archive:close', back)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('archive:close', back) }
  }, [close, step])

  // Swipe between pieces on touch
  const touch = useRef<{ x: number; y: number } | null>(null)

  const book = () => {
    close()
    window.dispatchEvent(new CustomEvent('book:idea', { detail: `Algo como "${w.title}"` }))
    setTimeout(() => document.getElementById('turno')?.scrollIntoView({ behavior: 'smooth' }), 750)
  }

  return (
    <div className="arch-detail" role="dialog" aria-modal="true" aria-label={w.title}
      onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
      onTouchEnd={e => {
        const t = touch.current; touch.current = null
        if (!t) return
        const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1)
      }}>
      <div className={`arch-detail-bg ${ready ? 'on' : ''}`} onClick={close} />
      <div ref={frame} className="arch-frame" style={px(target)}>
        <Image key={w.slug} src={w.src} alt={w.title} fill priority sizes={mobile ? '100vw' : '46vw'} className="arch-frame-img" style={{ objectFit: 'cover' }} />
      </div>

      {ready && (
        <div key={w.slug} className="arch-meta">
          <p className="arch-num">Nº {num(index)} <span>/ {num(WORKS.length - 1)}</span></p>
          <h3 className="font-display">{w.title}</h3>
          <p className="arch-meta-line">{w.style} · {w.zone}</p>
          {w.note && <p className="arch-meta-note">{w.note}</p>}
          <button type="button" className="cta-book" data-cursor="book" onClick={book}>Quiero algo así ✦</button>
        </div>
      )}

      <div className={`arch-controls ${ready ? 'on' : ''}`}>
        <button type="button" className="arch-close" data-hover onClick={close}>← Volver</button>
        <div className="arch-arrows">
          <button type="button" data-hover aria-label="Anterior" onClick={() => step(-1)}>←</button>
          <button type="button" data-hover aria-label="Siguiente" onClick={() => step(1)}>→</button>
        </div>
      </div>
    </div>
  )
}

// ─── The archive ──────────────────────────────────────────────────────────
export default function Archive() {
  const { mobile } = useViewport()
  const [still, setStill] = useState(false)
  const [view, setView] = useState<'wall' | 'index'>('wall')
  const [open, setOpen] = useState<{ i: number; from: Rect | null } | null>(null)
  const pushed = useRef(false)

  useEffect(() => { setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])

  // Deep links (#obra-lobo) and the browser back button
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#obra-(.+)$/)
      const i = m ? WORKS.findIndex(w => w.slug === m[1]) : -1
      if (i >= 0) setOpen(o => (o ? { ...o, i } : { i, from: null }))
      else { pushed.current = false; window.dispatchEvent(new Event('archive:close')) }
    }
    fromHash()
    window.addEventListener('popstate', fromHash)
    return () => window.removeEventListener('popstate', fromHash)
  }, [])

  // Freeze the page behind the piece
  useEffect(() => {
    if (!open) return
    window.dispatchEvent(new Event('lenis:stop'))
    document.body.style.overflow = 'hidden'
    return () => { window.dispatchEvent(new Event('lenis:start')); document.body.style.overflow = '' }
  }, [open])

  const onOpen = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    setOpen({ i, from: { left: r.left, top: r.top, width: r.width, height: r.height } })
    history.pushState(null, '', `#obra-${WORKS[i].slug}`)
    pushed.current = true
  }
  const onIndex = (i: number) => {
    setOpen(o => (o ? { ...o, i } : o))
    history.replaceState(null, '', `#obra-${WORKS[i].slug}`)
  }
  const onClose = () => {
    setOpen(null)
    if (location.hash.startsWith('#obra-')) {
      if (pushed.current) { pushed.current = false; history.back() }
      else history.replaceState(null, '', location.pathname + location.search)
    }
  }

  return (
    <section id="obra" className="archive">
      <Entrance still={still} mobile={mobile} />

      <div className="arch-bar">
        <p className="arch-bar-title"><span className="font-display">Trabajos</span> <span className="arch-count">{WORKS.length}</span></p>
        <div className="arch-toggle" role="tablist" aria-label="Vista">
          <button type="button" role="tab" aria-selected={view === 'wall'} data-hover onClick={() => setView('wall')}>Pared</button>
          <button type="button" role="tab" aria-selected={view === 'index'} data-hover onClick={() => setView('index')}>Índice</button>
        </div>
      </div>

      <div key={view} className="arch-view">
        {view === 'wall' ? <Wall still={still} mobile={mobile} onOpen={onOpen} /> : <Index onOpen={onOpen} />}
      </div>

      {open && <Detail key="detail" index={open.i} from={open.from} mobile={mobile} onIndex={onIndex} onClose={onClose} />}
    </section>
  )
}
