'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { WORKS } from '@/data/works'

const INSTAGRAM = 'bri.t4tts'
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

// ─── Columns: 4 (3 on phones) that glide in opposite directions, driven only by scroll ─
// No autoplay, no drag: the wall moves exactly as much as you scroll, so it never gets dizzy.

function Columns({ list, mobile, onOpen }: { list: number[]; mobile: boolean; onOpen: (i: number, el: HTMLElement) => void }) {
  const sec = useRef<HTMLDivElement>(null)
  const colRefs = useRef<(HTMLDivElement | null)[]>([])
  const [hover, setHover] = useState<number | null>(null)
  const C = mobile ? 3 : 4
  // Deal the pieces into columns, repeating so every column is tall enough to travel
  const columns = useMemo(() => {
    const per = Math.max(5, Math.ceil(list.length / C) + 2)
    // Each column owns its own pieces (no neighbour shows the same one), then repeats them
    return Array.from({ length: C }, (_, c) => {
      const own = list.filter((_, k) => k % C === c)
      const src = own.length ? own : [list[c % list.length]]
      return Array.from({ length: per }, (_, r) => src[r % src.length])
    })
  }, [list, C])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Eased toward the scroll position so a fast flick glides instead of whipping the columns
    let raf = 0, last = -1, p = -1
    const tick = () => {
      const el = sec.current
      if (el) {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        if (r.bottom > -vh && r.top < vh * 2) {
          const target = reduce ? 0.5 : Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)))
          p = p < 0 ? target : p + (target - p) * 0.06
          if (Math.abs(target - p) < 0.0001) p = target
          if (p !== last) {
            last = p
            colRefs.current.forEach((col, c) => {
              if (!col) return
              const travel = Math.max(0, col.scrollHeight - vh)
              const y = c % 2 ? -travel * (1 - p) : -travel * p
              col.style.transform = `translate3d(0, ${y}px, 0)`
            })
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [columns])

  const h = hover !== null ? WORKS[hover] : null

  return (
    <div ref={sec} className="co" style={{ height: mobile ? '480vh' : '440vh' }}>
      <div className={`co-stage ${hover !== null ? 'hovering' : ''}`} style={{ gridTemplateColumns: `repeat(${C}, 1fr)` }}>
        {columns.map((col, c) => (
          <div key={c} ref={el => { colRefs.current[c] = el }} className="co-col">
            {col.map((i, r) => {
              const w = WORKS[i]
              const first = r === 0 || col.indexOf(i) === r
              return (
                <button key={r} type="button" className={`co-tile ${hover === i ? 'on' : ''}`}
                  data-work={first ? w.slug : undefined} aria-hidden={!first} tabIndex={first ? 0 : -1} aria-label={w.title}
                  data-cursor="view"
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  onClick={e => onOpen(i, e.currentTarget.querySelector('.g-img') as HTMLElement)}>
                  <span className="g-img"><Image src={w.src} alt="" fill sizes={mobile ? '34vw' : '25vw'} style={{ objectFit: 'cover' }} /></span>
                  {mobile && <span className="co-cap">{w.title}</span>}
                </button>
              )
            })}
          </div>
        ))}
        {!mobile && (
          <div className="co-hud" aria-hidden>
            {h
              ? <p key={h.slug} className="co-label"><span className="co-name">{h.title}</span><span className="co-meta">{h.style} · {h.zone}</span></p>
              : <p className="co-label"><span className="co-hint">Pasá el mouse para ver cada pieza · clic para abrirla</span></p>}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Desktop: a stories-style theatre ─────────────────────────────────────
// The current piece sits centre stage with its neighbours peeking in at the sides; the whole room
// takes on the photo's colour through a soft duotone. Plays itself like stories (pause on hover),
// with big labelled arrows, a close pill and a thumbnail rail that always shows where you are.
const VIEW_MS = 6000

function Detail({ index, list, from, onIndex, onClose, onBook }: {
  index: number; list: number[]; from: Rect | null
  onIndex: (i: number) => void; onClose: () => void; onBook: (i: number) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const cards = useRef<Map<number, HTMLButtonElement>>(new Map())
  const [playing, setPlaying] = useState(true)
  const [hold, setHold] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const pos = Math.max(0, list.indexOf(index))
  const n = list.length
  const w = WORKS[index]

  const step = useCallback((d: number) => onIndex(list[(pos + d + n) % n]), [pos, n, list, onIndex])
  const close = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    setTimeout(onClose, 420)
  }, [leaving, onClose])

  // Open: the clicked tile flies into centre stage
  useLayoutEffect(() => {
    const el = cards.current.get(index)
    if (!el || !from) return
    const r = el.getBoundingClientRect()
    const a = el.animate([
      { transform: `translate(${from.left - r.left}px, ${from.top - r.top}px) scale(${from.width / r.width}, ${from.height / r.height})`, transformOrigin: '0 0' },
      { transform: 'none', transformOrigin: '0 0' },
    ], { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' })
    return () => a.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-advance, drawn by the progress bar
  useEffect(() => {
    const el = bar.current
    if (!el || !playing || hold) return
    const a = el.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: VIEW_MS, easing: 'linear', fill: 'forwards' })
    a.onfinish = () => step(1)
    return () => a.cancel()
  }, [index, playing, hold, step])

  useEffect(() => {
    // Centre the active thumbnail by scrolling the rail only (scrollIntoView would also shift the page sideways)
    const r = rail.current, on = r?.querySelector('.on') as HTMLElement | null
    if (r && on) r.scrollTo({ left: on.offsetLeft - r.clientWidth / 2 + on.offsetWidth / 2, behavior: 'smooth' })
  }, [index])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === ' ') { e.preventDefault(); setPlaying(p => !p) }
    }
    const back = () => close()
    window.addEventListener('keydown', key)
    window.addEventListener('archive:close', back)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('archive:close', back) }
  }, [close, step])

  // Wheel / trackpad swipe moves one piece at a time
  const wheelLock = useRef(0)
  const onWheel = (e: React.WheelEvent) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (Math.abs(d) < 25 || Date.now() - wheelLock.current < 700) return
    wheelLock.current = Date.now()
    step(d > 0 ? 1 : -1)
  }

  return (
    <div ref={root} className={`vw ${leaving ? 'out' : ''}`} role="dialog" aria-modal="true" aria-label={w.title} onWheel={onWheel}>
      {/* The room takes the colour of the piece */}
      <div className="vw-bg" aria-hidden>
        <Image key={w.slug} src={w.src} alt="" fill sizes="30vw" className="vw-bg-img" style={{ objectFit: 'cover' }} />
      </div>

      <header className="vw-top">
        <div className="vw-bars" aria-hidden>
          {list.map((i, k) => (
            <span key={i} className="vw-bar">
              {k < pos && <span className="vw-fill" style={{ transform: 'scaleX(1)' }} />}
              {k === pos && <span ref={bar} key={index} className="vw-fill" />}
            </span>
          ))}
        </div>
        <div className="vw-topline">
          <span className="vw-who"><Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={40} height={48} /> Diseños tatuados <em>{pos + 1} de {n}</em></span>
          <div className="vw-tools">
            <button type="button" className="vw-play" data-hover onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pausar' : 'Reproducir'}>
              {playing ? '❚❚ Pausa' : '▶ Reproducir'}
            </button>
            <button type="button" className="vw-close" data-hover onClick={close}>Cerrar <span aria-hidden>✕</span></button>
          </div>
        </div>
      </header>

      {/* Centre stage with the neighbours peeking in */}
      <div className="vw-stage" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
        {list.map((i, k) => {
          let d = k - pos
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const far = Math.abs(d) > 1
          return (
            <button key={WORKS[i].slug} ref={el => { if (el) cards.current.set(i, el); else cards.current.delete(i) }}
              type="button" className={`vw-card ${d === 0 ? 'on' : ''}`} tabIndex={d === 0 || Math.abs(d) === 1 ? 0 : -1}
              aria-label={d === 0 ? WORKS[i].title : d < 0 ? 'Anterior' : 'Siguiente'}
              style={{ ['--d' as string]: d, visibility: far ? 'hidden' : undefined }}
              data-cursor={d === 0 ? undefined : 'view'}
              onClick={() => d !== 0 && onIndex(i)}>
              <Image src={WORKS[i].src} alt={WORKS[i].title} fill priority={Math.abs(d) <= 1} sizes="40vw" style={{ objectFit: 'cover' }} />
            </button>
          )
        })}
      </div>

      <button type="button" className="vw-nav prev" data-hover onClick={() => step(-1)}>
        <span className="vw-nav-btn" aria-hidden>←</span><span className="vw-nav-lbl">Anterior</span>
      </button>
      <button type="button" className="vw-nav next" data-hover onClick={() => step(1)}>
        <span className="vw-nav-btn" aria-hidden>→</span><span className="vw-nav-lbl">Siguiente</span>
      </button>

      <div key={w.slug} className="vw-info">
        <p className="vw-meta">{w.style} · {w.zone}</p>
        <div className="vw-title-mask"><h3 className="vw-title">{w.title}</h3></div>
        {w.note && <p className="vw-note">{w.note}</p>}
        <button type="button" className="cta-book vw-book" data-cursor="book" onClick={() => { close(); onBook(index) }}>Quiero algo así ●</button>
      </div>

      <div ref={rail} className="vw-rail">
        {list.map(i => (
          <button key={WORKS[i].slug} type="button" aria-label={WORKS[i].title} data-hover
            className={i === index ? 'on' : ''} onClick={() => onIndex(i)}>
            <Image src={WORKS[i].src} alt="" fill sizes="80px" style={{ objectFit: 'cover' }} />
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
  const [open, setOpen] = useState<{ i: number; from: Rect | null } | null>(null)
  const pushed = useRef(false)

  const list = useMemo(() => WORKS.map((_, i) => i), [])

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
        <p className="g-lede">Bajá y las columnas se deslizan con vos. Tocá la pieza que te guste para verla de cerca o pedir algo parecido.</p>
      </header>



      <Columns list={list} mobile={mobile} onOpen={onOpen} />

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
