'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// aspect = height / width of the cut-out; dots = neon sticker dots (fractions of the cut-out box), like Briza's notebook
type FlashDef = { slug: string; name: string; price: string; cm: number; available: boolean; status?: 'reservado' | 'tatuado'; aspect?: number; dots?: number[][] }

const BASE = '/Briza-Maldonado/flash/'
const FLASHES: FlashDef[] = [
  { slug: 'mariposa-daga', name: 'Mariposa con daga', price: '$50.000', cm: 8, available: true, aspect: 1.308, dots: [[0.919, 0.272], [0.54, 0.929], [0.186, 0.622], [0.486, 0.03]] },
  { slug: 'frutilla', name: 'Frutilla', price: '$40.000', cm: 5, available: true, aspect: 1.243, dots: [[0.743, 0.705], [0.058, 0.555], [0.654, 0.049]] },
  { slug: 'corazon-vegan', name: 'Corazón vegan', price: '$55.000', cm: 7, available: true, aspect: 0.816, dots: [[0.95, 0.568], [0.627, 0.897], [0.037, 0.316], [0.622, 0.037]] },
  { slug: 'gorrion', name: 'Gorrión', price: '$60.000', cm: 9, available: false, aspect: 1.167, dots: [[0.943, 0.133], [0.731, 0.73], [0.049, 0.731], [0.435, 0.101]] },
  { slug: 'flor-hojas', name: 'Flor con hojas', price: '$45.000', cm: 6, available: true, aspect: 1.161, dots: [[0.925, 0.16], [0.339, 0.921], [0.075, 0.06]] },
  { slug: 'cerdo-cabra', name: 'Cerdo & cabra', price: '$65.000', cm: 9, available: true, aspect: 0.95, dots: [[0.947, 0.283], [0.541, 0.939], [0.039, 0.6], [0.485, 0.043]] },
  { slug: 'rosa-alambre-flash', name: 'Rosa con alambre', price: '$50.000', cm: 8, available: true, aspect: 1.003, dots: [[0.944, 0.122], [0.654, 0.686], [0.051, 0.703], [0.405, 0.31]] },
]
const img = (f: FlashDef) => `${BASE}${f.slug}.png`

type Placed = { id: number; f: number; x: number; y: number; size: number; rot: number }

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

function book(names: string | string[], preview?: string) {
  window.dispatchEvent(new CustomEvent('book:flash', { detail: { names: Array.isArray(names) ? names : [names], preview } }))
  setTimeout(() => document.getElementById('turno')?.scrollIntoView({ behavior: 'smooth' }), 100)
}

// ─── The notebook: its cover swings open as you scroll into it ───────────
function Notebook({ onTry }: { onTry: (f: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const cover = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  // One sheet at a time, 4 big flashes per sheet; click/tap or swipe turns the page
  const PER = 4
  const pages = Math.ceil(FLASHES.length / PER)
  const [page, setPage] = useState(0)
  // A real page turn: the sheet lifts from the spiral and folds over in 3D, showing its back
  const [flip, setFlip] = useState<{ from: number; dir: 1 | -1 } | null>(null)
  const turn = ''
  const go = (d: number) => {
    if (flip) return
    const n = page + d >= pages ? 0 : page + d
    if (n < 0 || n === page) return
    if (n < page) d = -1
    setFlip({ from: page, dir: d > 0 ? 1 : -1 })
    setPage(n)
    setTimeout(() => setFlip(null), 900)
  }
  const touch = useRef<{ x: number; y: number } | null>(null)
  const [canDrag, setCanDrag] = useState(false)
  useEffect(() => { setCanDrag(window.matchMedia('(hover: hover) and (pointer: fine)').matches) }, [])
  // Desktop: press a flash and pull it off the page; drop it on your photo in "Probalo en tu cuerpo"
  const [lifted, setLifted] = useState<number | null>(null)
  // Flashes that are stuck on your photo leave their spot in the notebook empty
  const [placed, setPlaced] = useState<number[]>([])
  useEffect(() => {
    const on = (e: Event) => setPlaced((e as CustomEvent<number[]>).detail)
    window.addEventListener('flash:placed', on)
    return () => window.removeEventListener('flash:placed', on)
  }, [])
  const drag = useRef<{ i: number; x: number; y: number; ghost?: HTMLElement; moved: boolean } | null>(null)
  const startLift = (e: React.PointerEvent, i: number) => {
    if (!canDrag || !FLASHES[i].available || e.button !== 0) return
    e.preventDefault()
    drag.current = { i, x: e.clientX, y: e.clientY, moved: false }
    const src = (e.currentTarget.querySelector('.nb-cut') as HTMLElement)
    const move = (ev: PointerEvent) => {
      const d = drag.current
      if (!d) return
      if (!d.moved && Math.hypot(ev.clientX - d.x, ev.clientY - d.y) < 6) return
      if (!d.moved) {
        d.moved = true
        const r = src.getBoundingClientRect()
        const g = src.cloneNode(true) as HTMLElement
        g.className = 'nb-ghost'
        Object.assign(g.style, { width: `${r.width}px`, height: `${r.height}px`, left: '0', top: '0' })
        document.body.appendChild(g)
        d.ghost = g
        setLifted(d.i)
        document.querySelector('.try-area')?.classList.add('over')
      }
      const r = d.ghost!.getBoundingClientRect()
      d.ghost!.style.transform = `translate(${ev.clientX - r.width / 2}px, ${ev.clientY - r.height / 2}px) rotate(-6deg) scale(1.08)`
    }
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up)
      const d = drag.current; drag.current = null
      document.querySelector('.try-area')?.classList.remove('over')
      if (!d) return
      if (!d.moved) { go(1); return } // a plain click turns the page
      d.ghost?.remove(); setLifted(null)
      const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.try-area')
      if (target) window.dispatchEvent(new CustomEvent('flash:drop', { detail: { i: d.i, x: ev.clientX, y: ev.clientY } }))
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  const sheet = (pg: number) => (
    <div className="nb-sheet">
        <header className="nb-head">
          <p className="nb-kicker">Cuaderno · 2026</p>
          <h3 className="nb-title">Flashes <span className="swash">disponibles</span></h3>
          <p className="nb-sub">Diseños listos para tatuar. Cada uno se hace una sola vez.</p>
        </header>
        <ul className="nb-grid">
          {FLASHES.map((f, i) => ({ f, i })).slice(pg * PER, pg * PER + PER).map(({ f, i }) => (
            <li key={f.slug} className={`nb-item ${f.available ? '' : 'taken'}`} style={{ ['--i' as string]: i }}>
              <div className={`nb-art ${lifted === i || placed.includes(i) ? 'lifted' : ''} ${placed.includes(i) ? 'gone' : ''} ${canDrag && f.available && !placed.includes(i) ? 'grab' : ''}`}
                onPointerDown={e => { if (!placed.includes(i)) startLift(e, i) }}
                title={canDrag && f.available ? 'Arrastralo a tu foto' : undefined}>
                <span className="nb-cut" style={{ aspectRatio: `1 / ${f.aspect ?? 1}`, ...((f.aspect ?? 1) >= 1 ? { height: '92%' } : { width: '92%' }), transform: `rotate(${[-4, 3, -2, 5, -5, 2, 4][i % 7]}deg)` }}>
                  <Image src={`${BASE}${f.slug}-paper.png`} alt={f.name} fill sizes="200px" style={{ objectFit: 'contain' }} draggable={false} />
                  {(f.dots ?? []).map(([x, y], k) => <i key={k} className="nb-dot" style={{ left: `${(0.5 + (x - 0.5) * 0.84) * 100}%`, top: `${(0.5 + (y - 0.5) * 0.84) * 100}%` }} />)}
                </span>
                {placed.includes(i) && <span className="nb-gone">En tu foto</span>}
                {!f.available && <span className={`nb-stamp ${f.status === 'reservado' ? 'res' : ''}`}>{f.status === 'reservado' ? 'Reservado' : 'Tatuado'}</span>}
              </div>
              <p className="nb-name"><span className="nb-num">Nº {String(i + 1).padStart(2, '0')}</span>{f.name}</p>
              <p className="nb-facts"><span>{f.cm} cm</span>{f.available && <span>{f.price}</span>}</p>
              {f.available && (
                <div className="nb-actions">
                  {!canDrag && <button type="button" className="nb-try" onClick={() => onTry(i)}>Probar</button>}
                  <button type="button" className="nb-want" data-cursor="book" onClick={() => book(f.name)}>Lo quiero</button>
                </div>
              )}
            </li>
          ))}
        </ul>
    </div>
  )


  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, cur = 0
    const tick = () => {
      const el = ref.current
      if (el && cover.current) {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        // Opens between entering the screen and reaching its upper third
        // Starts once the whole cover has been seen (its top near the upper part of the screen) and
        // finishes as it reaches the nav
        const target = reduce ? 1 : clamp((vh * 0.3 - r.top) / Math.max(1, vh * 0.3 - 90))
        cur += (target - cur) * 0.12
        if (Math.abs(target - cur) < 0.001) cur = target
        cover.current.style.transform = `rotateY(${-cur * 172}deg)`
        cover.current.style.setProperty('--shade', String(cur))
        const isOpen = cur > 0.85
        setOpen(o => (o === isOpen ? o : isOpen))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={ref} className={`nb ${open ? 'open' : ''}`}>
      <div className={`nb-page ${turn ? `turn-${turn}` : ''}`}
        onClick={e => {
          if ((e.target as HTMLElement).closest('button, a, .nb-art.grab')) return
          const r = e.currentTarget.getBoundingClientRect()
          go(e.clientX - r.left < r.width * 0.2 && page > 0 ? -1 : 1)
        }}
        onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
        onTouchEnd={e => {
          const t = touch.current; touch.current = null
          if (!t) return
          const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1)
        }}>
        <span className="nb-spiral" aria-hidden />
        {sheet(page)}
        {flip && (
          <div className={`nb-flip ${flip.dir > 0 ? 'fwd' : 'back'}`} aria-hidden>
            <div className="nb-flip-front">{sheet(flip.dir > 0 ? flip.from : page)}</div>
            <div className="nb-flip-back" />
          </div>
        )}
        <nav className="nb-turn" aria-label="Páginas del cuaderno">
          <span>{page + 1} / {pages}</span>
        </nav>
      </div>

      {/* The cover: front art outside, plain board inside */}
      <div ref={cover} className="nb-cover" aria-hidden>
        <div className="nb-cover-front">
          <Image src={BASE + 'cover.jpg'} alt="" fill priority sizes="(max-width: 767px) 92vw, 44vw" style={{ objectFit: 'cover' }} />
          <span className="nb-cover-label">Flashes<br /><em className="swash">de Briza</em></span>
        </div>
        <div className="nb-cover-back" />
      </div>
    </div>
  )
}

// ─── Try it on: upload a photo, frame it, then drop stencils on it ──────
// Step 1 "Ajustá tu foto": drag / pinch (or the slider) to frame the zone, then Aplicar.
// Step 2: add flashes (drag from the notebook, "Probar", or the strip right here) and place them:
// one finger moves, two fingers resize + rotate; sliders do the same for mouse users.
type View = { x: number; y: number; zoom: number; rot?: number }
type Pt = { x: number; y: number }

function TryOn({ pending, clearPending }: { pending: number | null; clearPending: () => void }) {
  const area = useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [framing, setFraming] = useState(false)
  // Phones: once there's a photo, the try-on becomes a full-screen editor (like an Instagram story editor)
  const [full, setFull] = useState(false)
  useEffect(() => {
    if (!full) return
    window.dispatchEvent(new Event('lenis:stop'))
    document.body.style.overflow = 'hidden'
    return () => { window.dispatchEvent(new Event('lenis:start')); document.body.style.overflow = '' }
  }, [full])
  const [view, setView] = useState<View>({ x: 0, y: 0, zoom: 1 })
  const [items, setItems] = useState<Placed[]>([])
  const [sel, setSel] = useState<number | null>(null)
  const [over, setOver] = useState(false)
  const [nudge, setNudge] = useState(false)
  const nextId = useRef(1)
  const ptrs = useRef(new Map<number, Pt>())
  const gesture = useRef<{ kind: 'photo' | 'item'; id?: number; startPts: Pt[]; start: View | Placed; cur: View | Placed } | null>(null)
  const ready = !!photo && !framing

  // Undo / redo: every committed change keeps a snapshot
  const past = useRef<Placed[][]>([])
  const future = useRef<Placed[][]>([])
  const itemsRef = useRef<Placed[]>([])
  itemsRef.current = items
  useEffect(() => { window.dispatchEvent(new CustomEvent('flash:placed', { detail: items.map(i => i.f) })) }, [items])
  const [, bumpHist] = useState(0)
  const commit = useCallback((next: Placed[]) => {
    past.current.push(itemsRef.current); future.current = []
    setItems(next); bumpHist(n => n + 1)
  }, [])
  const undo = () => { const prev = past.current.pop(); if (!prev) return; future.current.push(itemsRef.current); setItems(prev); setSel(null); bumpHist(n => n + 1) }
  const redo = () => { const nxt = future.current.pop(); if (!nxt) return; past.current.push(itemsRef.current); setItems(nxt); setSel(null); bumpHist(n => n + 1) }
  const remove = (id: number) => { commit(itemsRef.current.filter(i => i.id !== id)); setSel(null) }

  const [dupe, setDupe] = useState('')
  // One of each flash per photo: adding one that's already there just selects it
  const add = useCallback((f: number, x = 0.5, y = 0.45) => {
    const existing = itemsRef.current.find(i => i.f === f)
    if (existing) { setSel(existing.id); setDupe(FLASHES[f].name); setTimeout(() => setDupe(''), 1800); return }
    const id = nextId.current++
    commit([...itemsRef.current, { id, f, x, y, size: 0.34, rot: 0 }])
    setSel(id)
  }, [commit])

  // Desktop: a flash pulled out of the notebook and dropped on the photo
  useEffect(() => {
    const onDrop = (e: Event) => {
      const { i, x, y } = (e as CustomEvent<{ i: number; x: number; y: number }>).detail
      if (!photo || framing) { setNudge(true); setTimeout(() => setNudge(false), 1800); return }
      const r = area.current!.getBoundingClientRect()
      add(i, clamp((x - r.left) / r.width), clamp((y - r.top) / r.height))
    }
    window.addEventListener('flash:drop', onDrop)
    return () => window.removeEventListener('flash:drop', onDrop)
  }, [add, photo, framing])

  // The try-on as a picture, to attach as a reference in the booking form
  const snapshot = async (): Promise<string | undefined> => {
    const el = area.current, ph = photoEl.current
    if (!el || !ph || !photo) return
    const W = 900, H = Math.round(W * el.clientHeight / el.clientWidth)
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const ctx = c.getContext('2d')!
    const load = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const im = new window.Image(); im.onload = () => res(im); im.onerror = rej; im.src = src })
    const pic = await load(photo)
    const cover = Math.max(W / pic.naturalWidth, H / pic.naturalHeight)
    ctx.save()
    ctx.translate(W / 2 + view.x * W, H / 2 + view.y * H)
    ctx.rotate(((view.rot ?? 0) * Math.PI) / 180)
    ctx.scale(view.zoom * cover, view.zoom * cover)
    ctx.drawImage(pic, -pic.naturalWidth / 2, -pic.naturalHeight / 2)
    ctx.restore()
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.82
    for (const it of itemsRef.current) {
      const ink = await load(`${BASE}ink/${FLASHES[it.f].slug}.png`)
      const w = it.size * W, h = w * ink.naturalHeight / ink.naturalWidth
      ctx.save(); ctx.translate(it.x * W, it.y * H); ctx.rotate((it.rot * Math.PI) / 180)
      ctx.drawImage(ink, -w / 2, -h / 2, w, h); ctx.restore()
    }
    return c.toDataURL('image/jpeg', 0.85)
  }

  // "Probar" from the notebook
  useEffect(() => {
    if (pending === null) return
    if (ready) add(pending)
    else { setNudge(true); setTimeout(() => setNudge(false), 1800) }
    clearPending()
    if (window.innerWidth < 900) area.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [pending, add, clearPending, ready])

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo) }, [photo])

  const onFile = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    setPhoto(p => { if (p) URL.revokeObjectURL(p); return URL.createObjectURL(file) })
    setView({ x: 0, y: 0, zoom: 1 })
    setItems([]); setSel(null); past.current = []; future.current = []
    setFraming(true)
    if (window.innerWidth < 900) setFull(true)
  }

  const size = () => area.current!.getBoundingClientRect()
  const rel = (p: Pt) => { const r = size(); return { x: (p.x - r.left) / r.width, y: (p.y - r.top) / r.height } }
  const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)
  const ang = (a: Pt, b: Pt) => Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI

  // Gestures write straight to the DOM on every frame (no React re-render per move) and commit on release
  const photoEl = useRef<HTMLImageElement>(null)
  const stencilEls = useRef(new Map<number, HTMLDivElement>())
  const frame = useRef(0)
  const photoStyle = (v: View) => `translate(${v.x * 100}%, ${v.y * 100}%) rotate(${v.rot ?? 0}deg) scale(${v.zoom})`
  const paint = (kind: 'photo' | 'item', id: number | undefined, v: View | Placed) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      if (kind === 'photo') { if (photoEl.current) photoEl.current.style.transform = photoStyle(v as View); return }
      const el = stencilEls.current.get(id!), it = v as Placed
      if (!el) return
      el.style.left = `${it.x * 100}%`; el.style.top = `${it.y * 100}%`; el.style.width = `${it.size * 100}%`
      el.style.transform = `translate(-50%, -50%) rotate(${it.rot}deg)`
    })
  }

  const begin = (kind: 'photo' | 'item', id?: number, from?: View | Placed) => {
    const pts = Array.from(ptrs.current.values())
    const start = from ?? (kind === 'photo' ? view : items.find(i => i.id === id)!)
    gesture.current = { kind, id, startPts: pts, start, cur: start }
  }

  const onDown = (e: React.PointerEvent, kind: 'photo' | 'item', id?: number) => {
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (kind === 'item' && sel !== id) setSel(id!)
    const g = gesture.current
    begin(kind, id, g && g.kind === kind && g.id === id ? g.cur : undefined)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId)) return
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (!g) return
    const pts = Array.from(ptrs.current.values())
    if (pts.length !== g.startPts.length) { begin(g.kind, g.id, g.cur); return }
    const r = size()
    const c0 = pts.length > 1 ? { x: (g.startPts[0].x + g.startPts[1].x) / 2, y: (g.startPts[0].y + g.startPts[1].y) / 2 } : g.startPts[0]
    const c1 = pts.length > 1 ? { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 } : pts[0]
    const dx = (c1.x - c0.x) / r.width, dy = (c1.y - c0.y) / r.height
    const k = pts.length > 1 ? dist(pts[0], pts[1]) / Math.max(1, dist(g.startPts[0], g.startPts[1])) : 1
    const dr = pts.length > 1 ? ang(pts[0], pts[1]) - ang(g.startPts[0], g.startPts[1]) : 0
    if (g.kind === 'photo') {
      const s = g.start as View
      g.cur = { x: s.x + dx, y: s.y + dy, zoom: clamp(s.zoom * k, 1, 4), rot: (s.rot ?? 0) + dr }
    } else {
      const s = g.start as Placed
      g.cur = { ...s, x: clamp(s.x + dx), y: clamp(s.y + dy), size: clamp(s.size * k, 0.06, 0.95), rot: s.rot + dr }
    }
    paint(g.kind, g.id, g.cur)
  }
  const onUp = (e: React.PointerEvent) => {
    ptrs.current.delete(e.pointerId)
    const g = gesture.current
    if (!g) return
    if (ptrs.current.size) { begin(g.kind, g.id, g.cur); return }
    gesture.current = null
    if (g.kind === 'photo') setView(g.cur as View)
    else { const c = g.cur as Placed; commit(itemsRef.current.map(it => (it.id === g.id ? c : it))) }
  }

  const current = items.find(i => i.id === sel) ?? null
  const update = (patch: Partial<Placed>) => setItems(list => list.map(it => (it.id === sel ? { ...it, ...patch } : it))) // sliders (desktop)
  const unique = Array.from(new Set(items.map(i => i.f)))

  return (
    <div className={`try ${full ? 'fs' : ''}`} data-hide-dock>
      {full && (
        <div className="try-fs-bar">
          <button type="button" onClick={() => setFull(false)} aria-label="Cerrar editor">✕</button>
          <span>{framing ? 'Ajustá tu foto' : 'Sumá flashes'}</span>
          <span className="try-fs-hint">{framing ? 'Arrastrá · pellizcá · girá' : '1 dedo mueve · 2 dedos giran'}</span>
        </div>
      )}
      <header className="try-head">
        <p className="nb-kicker">Nuevo</p>
        <h3 className="try-title">Probalo en <span className="swash">tu cuerpo</span></h3>
        <ol className="try-steps">
          <li className={!photo ? 'now' : 'done'}>Subí una foto</li>
          <li className={framing ? 'now' : ready ? 'done' : ''}>Ajustala</li>
          <li className={ready ? 'now' : ''}>Sumá flashes</li>
        </ol>
      </header>

      <div ref={area} className={`try-area ${over ? 'over' : ''} ${photo ? 'has' : ''} ${framing ? 'framing' : ''} ${nudge ? 'nudge' : ''}`}
        onDragOver={e => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={e => {
          e.preventDefault(); setOver(false)
          const f = e.dataTransfer.getData('text/flash')
          if (f !== '') {
            if (!ready) { setNudge(true); setTimeout(() => setNudge(false), 1800); return }
            const p = rel({ x: e.clientX, y: e.clientY }); add(Number(f), p.x, p.y); return
          }
          onFile(e.dataTransfer.files?.[0])
        }}
        onPointerDown={e => { if (framing) onDown(e, 'photo'); else setSel(null) }}
        onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {photo
          ? <img ref={photoEl} src={photo} alt="Tu foto" className="try-photo" draggable={false}
              style={{ transform: photoStyle(view) }} />
          : (
            <label className="try-empty">
              <span className="try-plus" aria-hidden>+</span>
              <b>Subí una foto</b>
              <span>brazo, pierna, costilla… o arrastrá acá una imagen</span>
              <input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
            </label>
          )}

        {ready && items.map(it => {
          const f = FLASHES[it.f]
          return (
            <div key={it.id} ref={el => { if (el) stencilEls.current.set(it.id, el); else stencilEls.current.delete(it.id) }}
              className={`try-stencil ${sel === it.id ? 'sel' : ''}`}
              style={{ left: `${it.x * 100}%`, top: `${it.y * 100}%`, width: `${it.size * 100}%`, transform: `translate(-50%, -50%) rotate(${it.rot}deg)` }}
              onPointerDown={e => onDown(e, 'item', it.id)}>
              <img src={`${BASE}ink/${f.slug}.png`} alt={f.name} draggable={false} />
              {sel === it.id && (
                <button type="button" className="try-x" aria-label={`Sacar ${f.name}`}
                  onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); remove(it.id) }}
                  style={{ transform: `rotate(${-it.rot}deg)` }}>✕</button>
              )}
            </div>
          )
        })}

        {framing && <p className="try-hint">Arrastrá · pellizcá para acercar · girá con 2 dedos</p>}
        {ready && !items.length && <p className="try-hint">Sacá un flash del cuaderno y soltalo acá<span className="try-hint-m"> o elegí uno de abajo</span></p>}
        {nudge && <p className="try-hint warn">Primero subí y aplicá tu foto</p>}
        {dupe && <p className="try-hint warn">{dupe} ya está en tu foto</p>}
        {ready && (
          <div className="try-hist" onPointerDown={e => e.stopPropagation()}>
            <button type="button" onClick={undo} disabled={!past.current.length} aria-label="Deshacer">↶</button>
            <button type="button" onClick={redo} disabled={!future.current.length} aria-label="Rehacer">↷</button>
          </div>
        )}
      </div>

      {photo && !full && <button type="button" className="try-reopen cta-book" onClick={() => setFull(true)}>Abrir editor ↗</button>}
      <div className="try-controls">
        {framing && (
          <>
            <label className="try-range try-desk">Zoom
              <input type="range" min={1} max={4} step={0.01} value={view.zoom} onChange={e => setView(v => ({ ...v, zoom: Number(e.target.value) }))} />
            </label>
            <label className="try-range try-desk">Rotación
              <input type="range" min={-180} max={180} step={1} value={Math.round(view.rot ?? 0)} onChange={e => setView(v => ({ ...v, rot: Number(e.target.value) }))} />
            </label>
            <div className="try-btns">
              <button type="button" className="try-remove" onClick={() => setView(v => ({ ...v, rot: ((v.rot ?? 0) + 90) % 360 }))}>Girar 90° ↻</button>
              <label className="try-remove try-change">Otra foto
                <input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
              </label>
              <button type="button" className="cta-book try-book" onClick={() => setFraming(false)}>Aplicar ✓</button>
            </div>
          </>
        )}

        {ready && (
          <>
            <div className="try-strip" role="list" aria-label="Flashes para probar">
              {FLASHES.map((f, i) => f.available && (
                <button key={f.slug} type="button" role="listitem" className={`try-thumb ${items.some(it => it.f === i) ? 'used' : ''}`} onClick={() => add(i)} aria-label={`Probar ${f.name}`}>
                  <Image src={img(f)} alt="" fill sizes="64px" style={{ objectFit: 'contain' }} />
                </button>
              ))}
            </div>

            {current && (
              <>
                <p className="try-now"><b>{FLASHES[current.f].name}</b> · {FLASHES[current.f].cm} cm · {FLASHES[current.f].price}</p>
                <label className="try-range try-desk">Tamaño
                  <input type="range" min={0.08} max={0.95} step={0.01} value={current.size} onChange={e => update({ size: Number(e.target.value) })} />
                </label>
                <label className="try-range try-desk">Rotación
                  <input type="range" min={-180} max={180} step={1} value={Math.round(((current.rot + 540) % 360) - 180)} onChange={e => update({ rot: Number(e.target.value) })} />
                </label>
              </>
            )}

            <div className="try-btns">
              
              <button type="button" className="try-remove" onClick={() => setFraming(true)}>Ajustar foto</button>
              {unique.length > 0 && (
                <button type="button" className="cta-book try-book" data-cursor="book" onClick={async () => { const pic = await snapshot().catch(() => undefined); setFull(false); book(unique.map(i => FLASHES[i].name), pic) }}>
                  {full ? (unique.length > 1 ? `Quiero estos ${unique.length} ●` : 'Lo quiero ●') : unique.length > 1 ? `Quiero estos ${unique.length} flashes ●` : `Quiero ${FLASHES[unique[0]].name} ●`}
                </button>
              )}
            </div>
          </>
        )}

        <p className="try-privacy">Tu foto queda solo en tu dispositivo: no se sube a ningún lado.</p>
      </div>
    </div>
  )
}

// 7 · Live availability/prices from Briza's Google Sheet (published as CSV): nombre, cm, precio, disponible.
// Rows are matched by name; images stay in the repo. Without the sheet, the list above is used.
const SHEET = process.env.NEXT_PUBLIC_FLASH_SHEET
function useLiveFlashes() {
  const [, bump] = useState(0)
  useEffect(() => {
    if (!SHEET) return
    fetch(SHEET).then(r => (r.ok ? r.text() : '')).then(csv => {
      const norm = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
      for (const row of csv.trim().split(/\r?\n/).slice(1)) {
        const [name, cm, price, avail] = row.split(',').map(c => c.replace(/^"|"$/g, '').trim())
        const f = FLASHES.find(x => norm(x.name) === norm(name ?? ''))
        if (!f) continue
        if (Number(cm)) f.cm = Number(cm)
        if (price) f.price = price
        f.available = /^(si|sí|yes|true|1|x)$/i.test(avail ?? '')
      }
      bump(n => n + 1)
    }).catch(() => {})
  }, [])
}

// Reserved / tattooed, from Briza's confirmed bookings (worker reads her calendar)
const AGENT = process.env.NEXT_PUBLIC_AGENT_URL
function useFlashStatus() {
  const [, bump] = useState(0)
  useEffect(() => {
    if (!AGENT) return
    fetch(`${AGENT}/flash-status`).then(r => (r.ok ? r.json() : {})).then((st: Record<string, 'reservado' | 'tatuado'>) => {
      const key = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      for (const f of FLASHES) { const s = st[key(f.name)]; if (s) { f.status = s; f.available = false } }
      bump(n => n + 1)
    }).catch(() => {})
  }, [])
}

export default function Flash() {
  useLiveFlashes()
  useFlashStatus()
  const [pending, setPending] = useState<number | null>(null)
  const clear = useCallback(() => setPending(null), [])
  return (
    <section id="flash" className="fl">
      <Notebook onTry={setPending} />
      <TryOn pending={pending} clearPending={clear} />
    </section>
  )
}
