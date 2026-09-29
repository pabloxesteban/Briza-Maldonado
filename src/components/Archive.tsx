'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { WORKS } from '@/data/works'

const INSTAGRAM = 'bri.t4tts'
const FILTERS = ['Todos', 'Traditional', 'Black & white', 'Color'] as const
type Filter = typeof FILTERS[number]
type Rect = { left: number; top: number; width: number; height: number }

function useMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setM(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return m
}

// ─── Canvas: an endless wall of pieces you drag around (and drift through as you scroll) ─
const wrap = (v: number, m: number) => ((v % m) + m) % m

function Canvas({ filter, setFilter, mobile, onOpen }: { filter: Filter; setFilter: (f: Filter) => void; mobile: boolean; onOpen: (i: number, el: HTMLElement) => void }) {
  const section = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const tiles = useRef<(HTMLButtonElement | null)[]>([])
  const label = useRef<HTMLParagraphElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const C = mobile ? 3 : 6
  const R = mobile ? 6 : 4
  // Spread the pieces so the same one never sits next to itself
  const cells = useMemo(() => Array.from({ length: C * R }, (_, k) => {
    const r = Math.floor(k / C), c = k % C
    return { r, c, i: (r * 5 + c * 3) % WORKS.length }
  }), [C, R])

  useEffect(() => {
    const st = stage.current, sec = section.current
    if (!st || !sec) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tw = 0, th = 0, gap = 0, W = 0, H = 0
    const measure = () => {
      const vw = st.clientWidth
      tw = mobile ? vw * 0.46 : Math.max(220, vw * 0.19)
      th = tw * 1.25
      gap = mobile ? 10 : Math.max(16, vw * 0.018)
      W = C * (tw + gap); H = R * (th + gap)
      tiles.current.forEach(el => { if (el) { el.style.width = `${tw}px`; el.style.height = `${th}px` } })
    }
    measure()
    window.addEventListener('resize', measure)

    // Drag with inertia
    let x = 0, y = 0, vx = 0, vy = 0, down = false, lx = 0, ly = 0, moved = 0, auto = 1
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.cv-filters')) return
      down = true; moved = 0; lx = e.clientX; ly = e.clientY; vx = vy = 0; auto = 0
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - lx, dy = e.clientY - ly
      lx = e.clientX; ly = e.clientY
      moved += Math.abs(dx) + Math.abs(dy)
      if (moved > 6) setDragging(true)
      vx = dx; vy = dy; x += dx; y += dy
    }
    const onUp = () => { down = false; setTimeout(() => { setDragging(false); moved = 0 }, 0) }
    // Swallow the click that ends a drag
    const onClick = (e: MouseEvent) => { if (moved > 6) { e.stopPropagation(); e.preventDefault() } }
    st.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    st.addEventListener('click', onClick, true)

    let raf = 0, sp = 0, scale = 1, lastScroll = -1
    const tick = () => {
      const r = sec.getBoundingClientRect()
      const vh = window.innerHeight
      const onScreen = r.bottom > 0 && r.top < vh
      if (onScreen) {
        // Scroll through the section drifts the wall diagonally
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)))
        const scrollShift = reduce ? 0 : p * H * 0.9
        if (!down) { vx *= 0.93; vy *= 0.93; x += vx; y += vy; if (!reduce) { auto = Math.min(1, auto + 0.004); x -= 0.25 * auto } }
        const speed = Math.hypot(vx, vy) + Math.abs(scrollShift - (lastScroll < 0 ? scrollShift : lastScroll)) * 0.6
        lastScroll = scrollShift
        sp += (speed - sp) * 0.15
        const target = reduce ? 1 : 1 - Math.min(0.1, sp * 0.004)
        scale += (target - scale) * 0.15
        const ox = x - scrollShift * 0.25, oy = y - scrollShift
        cells.forEach((cell, k) => {
          const el = tiles.current[k]
          if (!el) return
          const colShift = cell.c % 2 ? (th + gap) / 2 : 0
          const tx = wrap(cell.c * (tw + gap) + ox, W) - (tw + gap)
          const ty = wrap(cell.r * (th + gap) + colShift + oy, H) - (th + gap)
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      st.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      st.removeEventListener('click', onClick, true)
    }
  }, [C, R, cells, mobile])

  const h = hover !== null ? WORKS[hover] : null
  const seen = new Set<number>()

  return (
    <div ref={section} className="cv">
      <div ref={stage} className={`cv-stage ${dragging ? 'drag' : ''} ${hover !== null ? 'hovering' : ''}`} data-cursor="drag">
        {cells.map((cell, k) => {
          const w = WORKS[cell.i]
          const off = filter !== 'Todos' && w.style !== filter
          const first = !seen.has(cell.i); seen.add(cell.i)
          return (
            <button key={k} ref={el => { tiles.current[k] = el }} type="button"
              className={`cv-tile ${off ? 'off' : ''} ${hover === cell.i ? 'on' : ''}`}
              data-work={first ? w.slug : undefined} aria-hidden={!first || off} tabIndex={first && !off ? 0 : -1}
              aria-label={w.title}
              onMouseEnter={() => !off && setHover(cell.i)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(cell.i)} onBlur={() => setHover(null)}
              onClick={e => { if (!off) onOpen(cell.i, e.currentTarget.querySelector('.g-img') as HTMLElement) }}>
              <span className="g-img">
                <Image src={w.src} alt="" fill draggable={false} sizes={mobile ? '46vw' : '20vw'} style={{ objectFit: 'cover' }} />
              </span>
            </button>
          )
        })}

        <div className="g-filters cv-filters" role="tablist" aria-label="Filtrar por estilo">
          {FILTERS.map(f => (
            <button key={f} type="button" role="tab" aria-selected={filter === f} data-hover onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div className="cv-hud" aria-hidden>
          <p ref={label} key={h?.slug ?? 'hint'} className="cv-label">
            {h ? <><span className="cv-name">{h.title}</span><span className="cv-meta">{h.style} · {h.zone}</span></>
              : <span className="cv-hint">{mobile ? 'Deslizá para explorar · tocá una pieza' : 'Arrastrá para explorar · clic para ver'}</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Desktop: the piece, grown from its tile, with a filmstrip to move around ─
function frameRect(): Rect {
  const w = window.innerWidth, h = window.innerHeight
  const height = h - 190
  const width = Math.min(height * 0.8, w * 0.44)
  return { left: w * 0.08, top: 88, width, height }
}
const px = (r: Rect) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` })

function Detail({ index, list, from, onIndex, onClose, onBook }: {
  index: number; list: number[]; from: Rect | null
  onIndex: (i: number) => void; onClose: () => void; onBook: (i: number) => void
}) {
  const frame = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(!from)
  const closing = useRef(false)
  const w = WORKS[index]
  const pos = Math.max(0, list.indexOf(index))

  useLayoutEffect(() => {
    const el = frame.current
    if (!el || !from) { setReady(true); return }
    const a = el.animate([{ ...px(from) }, { ...px(frameRect()) }], { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' })
    const t = setTimeout(() => setReady(true), 260)
    return () => { a.cancel(); clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the current thumbnail in view
  useEffect(() => {
    strip.current?.querySelector('.on')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [index])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    setReady(false)
    const el = frame.current
    const r = (document.querySelector(`[data-work="${WORKS[index].slug}"] .g-img`) as HTMLElement | null)?.getBoundingClientRect()
    if (el && r && r.bottom > 0 && r.top < window.innerHeight) {
      const a = el.animate([{ ...px(frameRect()) }, { ...px(r) }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' })
      a.onfinish = onClose
    } else if (el) {
      const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' })
      a.onfinish = onClose
    } else onClose()
  }, [index, onClose])

  const step = useCallback((d: number) => onIndex(list[(pos + d + list.length) % list.length]), [pos, list, onIndex])

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

  return (
    <div className="arch-detail" role="dialog" aria-modal="true" aria-label={w.title}>
      <div className={`arch-detail-bg ${ready ? 'on' : ''}`} onClick={close} />
      <div ref={frame} className="arch-frame" style={px(frameRect())}>
        <Image key={w.slug} src={w.src} alt={w.title} fill priority sizes="44vw" className="arch-frame-img" style={{ objectFit: 'cover' }} />
      </div>

      {ready && (
        <div key={w.slug} className="arch-meta">
          <p className="arch-meta-line">{w.style} · {w.zone}</p>
          <h3>{w.title}</h3>
          {w.note && <p className="arch-meta-note">{w.note}</p>}
          <button type="button" className="cta-book" data-cursor="book" onClick={() => { close(); onBook(index) }}>Quiero algo así ●</button>
        </div>
      )}

      <div className={`arch-controls ${ready ? 'on' : ''}`}>
        <button type="button" className="arch-close" data-hover onClick={close}>← Volver a la galería</button>
        <div className="arch-arrows">
          <button type="button" data-hover aria-label="Anterior" onClick={() => step(-1)}>←</button>
          <button type="button" data-hover aria-label="Siguiente" onClick={() => step(1)}>→</button>
        </div>
      </div>

      <div ref={strip} className={`d-strip ${ready ? 'on' : ''}`}>
        {list.map(i => (
          <button key={WORKS[i].slug} type="button" aria-label={WORKS[i].title} data-hover
            className={i === index ? 'on' : ''} onClick={() => onIndex(i)}>
            <Image src={WORKS[i].src} alt="" fill sizes="64px" style={{ objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Phones: stories, like on Instagram ───────────────────────────────────
const STORY_MS = 5200

function Stories({ index, list, onIndex, onClose, onBook }: {
  index: number; list: number[]
  onIndex: (i: number) => void; onClose: () => void; onBook: (i: number) => void
}) {
  const pos = Math.max(0, list.indexOf(index))
  const w = WORKS[index]
  const bar = useRef<HTMLSpanElement>(null)
  const [paused, setPaused] = useState(false)
  const [drag, setDrag] = useState(0)
  const touch = useRef<{ x: number; y: number; t: number } | null>(null)

  const step = useCallback((d: number) => {
    const n = pos + d
    if (n < 0) return
    if (n >= list.length) { onClose(); return }
    onIndex(list[n])
  }, [pos, list, onIndex, onClose])

  // Auto-advance, drawn by the progress bar itself
  useEffect(() => {
    const el = bar.current
    if (!el || paused) return
    const a = el.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: STORY_MS, easing: 'linear', fill: 'forwards' })
    a.onfinish = () => step(1)
    return () => a.cancel()
  }, [index, paused, step])

  useEffect(() => {
    const back = () => onClose()
    window.addEventListener('archive:close', back)
    return () => window.removeEventListener('archive:close', back)
  }, [onClose])

  return (
    <div className="st" role="dialog" aria-modal="true" aria-label={w.title}
      style={{ transform: drag ? `translateY(${drag}px) scale(${1 - drag / 3000})` : undefined, opacity: drag ? 1 - drag / 900 : undefined }}
      onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() }; setPaused(true) }}
      onTouchMove={e => { const t = touch.current; if (t) setDrag(Math.max(0, e.touches[0].clientY - t.y)) }}
      onTouchEnd={e => {
        const t = touch.current; touch.current = null
        setPaused(false)
        if (!t) return
        const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y
        setDrag(0)
        if (dy > 110) { onClose(); return }
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { step(dx < 0 ? 1 : -1); return }
        // A quick tap: left third goes back, the rest goes forward (the booking area handles its own taps)
        if (Date.now() - t.t < 250 && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          const target = e.target as HTMLElement
          if (target.closest('button, a')) return
          step(t.x < window.innerWidth / 3 ? -1 : 1)
        }
      }}>
      <div className="st-bars" aria-hidden>
        {list.map((i, k) => (
          <span key={i} className="st-bar">
            {k < pos && <span className="st-fill" style={{ transform: 'scaleX(1)' }} />}
            {k === pos && <span ref={bar} key={index} className="st-fill" />}
          </span>
        ))}
      </div>
      <div className="st-head">
        <span className="st-who"><Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={40} height={48} /> @{INSTAGRAM}</span>
        <button type="button" className="st-x" aria-label="Cerrar" onClick={onClose}>✕</button>
      </div>
      <div key={w.slug} className="st-img">
        <Image src={w.src} alt={w.title} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className="st-foot">
        <p className="st-style">{w.style} · {w.zone}</p>
        <h3 className="st-title">{w.title}</h3>
        <button type="button" className="cta-book st-book" onClick={() => { onClose(); onBook(index) }}>Quiero algo así ●</button>
      </div>
    </div>
  )
}

// ─── The gallery ─────────────────────────────────────────────────────────
export default function Archive() {
  const mobile = useMobile()
  const [filter, setFilter] = useState<Filter>('Todos')
  const [open, setOpen] = useState<{ i: number; from: Rect | null } | null>(null)
  const pushed = useRef(false)

  const list = useMemo(() => WORKS.map((_, i) => i).filter(i => filter === 'Todos' || WORKS[i].style === filter), [filter])

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
  const onIndex = useCallback((i: number) => {
    setOpen(o => (o ? { ...o, i } : o))
    history.replaceState(null, '', `#obra-${WORKS[i].slug}`)
  }, [])
  const onClose = useCallback(() => {
    setOpen(null)
    if (location.hash.startsWith('#obra-')) {
      if (pushed.current) { pushed.current = false; history.back() }
      else history.replaceState(null, '', location.pathname + location.search)
    }
  }, [])
  const onBook = useCallback((i: number) => {
    window.dispatchEvent(new CustomEvent('book:idea', { detail: `Algo como "${WORKS[i].title}"` }))
    setTimeout(() => document.getElementById('turno')?.scrollIntoView({ behavior: 'smooth' }), 750)
  }, [])

  const viewList = open && list.includes(open.i) ? list : WORKS.map((_, i) => i)

  return (
    <section id="obra" className="archive g">
      <header className="g-head">
        <h2 className="g-title"><span className="arch-t1">Diseños</span> <span className="arch-t2 swash">tatuados</span></h2>
        <p className="g-lede">Una pared sin fin con todo lo que tatué. Arrastrala en cualquier dirección, filtrá por estilo y abrí la pieza que te guste para pedir algo parecido.</p>
      </header>


      <Canvas filter={filter} setFilter={setFilter} mobile={mobile} onOpen={onOpen} />

      <div className="g-more">
        <p>Hay más en mi Instagram: trabajos recién hechos, flashes y fechas libres.</p>
        <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" className="g-ig" data-hover>@{INSTAGRAM} ↗</a>
      </div>

      {open && (mobile
        ? <Stories index={open.i} list={viewList} onIndex={onIndex} onClose={onClose} onBook={onBook} />
        : <Detail key="detail" index={open.i} list={viewList} from={open.from} onIndex={onIndex} onClose={onClose} onBook={onBook} />)}
    </section>
  )
}
