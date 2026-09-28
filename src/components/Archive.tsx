'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { WORKS, num, type Work } from '@/data/works'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

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


// Runs fn(progress) on every frame while mounted, easing toward the real scroll position.
// Writes go straight to the DOM (no React state), so scrolling never re-renders the gallery.
function useSmoothProgress(ref: React.RefObject<HTMLElement>, fn: (p: number) => void, deps: unknown[]) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    let raf = 0, cur = -1
    const tick = () => {
      const el = ref.current
      const r = el?.getBoundingClientRect()
      if (el && r && r.bottom > -200 && r.top < window.innerHeight + 200) {
        const target = clamp(-r.top / Math.max(1, r.height - window.innerHeight))
        cur = cur < 0 ? target : cur + (target - cur) * 0.12
        if (Math.abs(target - cur) < 0.0002) cur = target
        fnRef.current(cur)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a))

// ─── Act 1: the entrance — big photos open around the title ───────────────
function Entrance({ mobile }: { mobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const colEls = useRef<(HTMLDivElement | null)[]>([])
  const title = useRef<HTMLDivElement>(null)
  const cols = mobile ? 2 : 3
  const rows = 3
  const tiles = WORKS.slice(0, cols * rows)
  const mid = (cols - 1) / 2

  useSmoothProgress(ref, p => {
    // Starts already filling the screen (no empty start), then opens a space for the title
    const open = smooth(seg(p, 0.08, 0.78))
    const t = smooth(seg(p, 0.45, 0.85))
    if (grid.current) grid.current.style.transform = `scale(${1.28 - open * 0.2})`
    colEls.current.forEach((el, c) => {
      if (!el) return
      const side = c - mid
      el.style.transform = side === 0
        ? `translate3d(0, ${-open * 6}%, 0)`
        : `translate3d(${side * open * (mobile ? 40 : 55)}%, ${(c % 2 ? 1 : -1) * open * 8}%, 0)`
      el.style.opacity = side === 0 ? String(1 - open) : '1'
    })
    if (title.current) {
      title.current.style.opacity = String(t)
      title.current.style.transform = `translate3d(0, ${(1 - t) * 20}px, 0)`
    }
  }, [mobile])

  return (
    <div ref={ref} className="arch-entrance" style={{ height: mobile ? '190vh' : '220vh' }}>
      <div className="arch-stage">
        <div ref={grid} className="arch-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} ref={el => { colEls.current[c] = el }} className="arch-col">
              {Array.from({ length: rows }).map((_, r) => {
                const w = tiles[r * cols + c]
                return (
                  <div key={r} className="arch-tile">
                    <Image src={w.src} alt="" fill sizes={mobile ? '60vw' : '40vw'} style={{ objectFit: 'cover' }} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div ref={title} className="arch-entrance-title" style={{ opacity: 0 }}>
          <h2 className="font-display">Trabajos</h2>
          <p>{WORKS.length} piezas · Traditional · Black &amp; white · Color</p>
        </div>
      </div>
    </div>
  )
}

// ─── Act 2: the wall — alternate column scroll ────────────────────────────
// One column scrolls with the page; the others stay pinned and run the opposite way, so the
// columns cross. Movement is eased toward the scroll position so it glides instead of jolting.
function Wall({ still, mobile, onOpen }: { still: boolean; mobile: boolean; onOpen: (i: number, el: HTMLElement) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const colRefs = useRef<(HTMLDivElement | null)[]>([])
  const cols = mobile ? 2 : 3
  const flowing = mobile ? 0 : 1
  const columns: { w: Work; i: number }[][] = Array.from({ length: cols }, () => [])
  WORKS.forEach((w, i) => columns[i % cols].push({ w, i }))

  useSmoothProgress(ref, p => {
    if (still) return
    const vh = window.innerHeight
    colRefs.current.forEach((el, c) => {
      if (!el || c === flowing) return
      const travel = Math.max(0, el.scrollHeight - vh)
      el.style.transform = `translate3d(0, ${-travel * (1 - p)}px, 0)`
    })
  }, [still, cols])

  return (
    <div ref={ref} className={`arch-wall ${still ? 'still' : ''}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {columns.map((col, c) => {
        const pinned = !still && c !== flowing
        return (
          <div key={c} className={pinned ? 'arch-wall-pin' : 'arch-wall-flow'}>
            <div ref={el => { colRefs.current[c] = el }} className="arch-wall-col"
              style={pinned ? { flexDirection: 'column-reverse' } : undefined}>
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
          </div>
        )
      })}
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
      {!still && <Entrance mobile={mobile} />}
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
