'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type FlashDef = { slug: string; name: string; price: string; cm: number; available: boolean }

const BASE = '/Briza-Maldonado/flash/'
const FLASHES: FlashDef[] = [
  { slug: 'mariposa-daga', name: 'Mariposa con daga', price: '$50.000', cm: 8, available: true },
  { slug: 'frutilla', name: 'Frutilla', price: '$40.000', cm: 5, available: true },
  { slug: 'corazon-vegan', name: 'Corazón vegan', price: '$55.000', cm: 7, available: true },
  { slug: 'gorrion', name: 'Gorrión', price: '$60.000', cm: 9, available: false },
  { slug: 'flor-hojas', name: 'Flor con hojas', price: '$45.000', cm: 6, available: true },
  { slug: 'cerdo-cabra', name: 'Cerdo & cabra', price: '$65.000', cm: 9, available: true },
  { slug: 'rosa-alambre-flash', name: 'Rosa con alambre', price: '$50.000', cm: 8, available: true },
]
const img = (f: FlashDef) => `${BASE}${f.slug}.png`

type Placed = { id: number; f: number; x: number; y: number; size: number; rot: number }

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

function book(name: string) {
  window.dispatchEvent(new CustomEvent('book:flash', { detail: name }))
  setTimeout(() => document.getElementById('turno')?.scrollIntoView({ behavior: 'smooth' }), 100)
}

// ─── The notebook: its cover swings open as you scroll into it ───────────
function Notebook({ onTry }: { onTry: (f: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const cover = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, cur = 0
    const tick = () => {
      const el = ref.current
      if (el && cover.current) {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        // Opens between entering the screen and reaching its upper third
        const target = reduce ? 1 : clamp((vh * 0.95 - r.top) / (vh * 0.7))
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
      <div className="nb-page">
        <span className="nb-spiral" aria-hidden />
        <header className="nb-head">
          <p className="nb-kicker">Cuaderno · 2026</p>
          <h3 className="nb-title">Flashes <span className="swash">disponibles</span></h3>
          <p className="nb-sub">Diseños listos para tatuar. Cada uno se hace una sola vez.</p>
        </header>
        <ul className="nb-grid">
          {FLASHES.map((f, i) => (
            <li key={f.slug} className={`nb-item ${f.available ? '' : 'taken'}`} style={{ ['--i' as string]: i }}>
              <div className="nb-art" draggable={f.available}
                onDragStart={e => { e.dataTransfer.setData('text/flash', String(i)); e.dataTransfer.effectAllowed = 'copy' }}
                title={f.available ? 'Arrastralo a tu foto' : undefined}>
                <Image src={img(f)} alt={f.name} fill sizes="160px" style={{ objectFit: 'contain' }} draggable={false} />
                {!f.available && <span className="nb-stamp">Tatuado</span>}
              </div>
              <p className="nb-name">{f.name}</p>
              <p className="nb-facts"><span>{f.cm} cm</span><span>{f.price}</span></p>
              {f.available && (
                <div className="nb-actions">
                  <button type="button" className="nb-try" data-hover onClick={() => onTry(i)}>Probar</button>
                  <button type="button" className="nb-want" data-cursor="book" onClick={() => book(f.name)}>Lo quiero</button>
                </div>
              )}
            </li>
          ))}
        </ul>
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

// ─── Try it on: upload a photo, drop stencils on it ─────────────────────
function TryOn({ pending, clearPending }: { pending: number | null; clearPending: () => void }) {
  const area = useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [items, setItems] = useState<Placed[]>([])
  const [sel, setSel] = useState<number | null>(null)
  const [over, setOver] = useState(false)
  const nextId = useRef(1)
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null)

  const add = useCallback((f: number, x = 0.5, y = 0.45) => {
    const id = nextId.current++
    setItems(list => [...list, { id, f, x, y, size: 0.34, rot: 0 }])
    setSel(id)
  }, [])

  // "Probar" from the notebook
  useEffect(() => {
    if (pending === null) return
    add(pending)
    clearPending()
    if (window.innerWidth < 900) area.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [pending, add, clearPending])

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo) }, [photo])

  const onFile = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    setPhoto(p => { if (p) URL.revokeObjectURL(p); return URL.createObjectURL(file) })
  }

  const rel = (cx: number, cy: number) => {
    const r = area.current!.getBoundingClientRect()
    return { x: clamp((cx - r.left) / r.width), y: clamp((cy - r.top) / r.height) }
  }

  const onDown = (e: React.PointerEvent, it: Placed) => {
    e.stopPropagation()
    setSel(it.id)
    const p = rel(e.clientX, e.clientY)
    drag.current = { id: it.id, dx: p.x - it.x, dy: p.y - it.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const p = rel(e.clientX, e.clientY)
    setItems(list => list.map(it => (it.id === d.id ? { ...it, x: clamp(p.x - d.dx), y: clamp(p.y - d.dy) } : it)))
  }
  const onUp = () => { drag.current = null }

  const current = items.find(i => i.id === sel) ?? null
  const update = (patch: Partial<Placed>) => setItems(list => list.map(it => (it.id === sel ? { ...it, ...patch } : it)))

  return (
    <div className="try">
      <header className="try-head">
        <p className="nb-kicker">Nuevo</p>
        <h3 className="try-title">Probalo en <span className="swash">tu cuerpo</span></h3>
        <p className="try-sub">Subí una foto de la zona, arrastrá un flash del cuaderno encima y acomodalo como si fuera el stencil.</p>
      </header>

      <div ref={area} className={`try-area ${over ? 'over' : ''} ${photo ? 'has' : ''}`}
        onDragOver={e => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={e => {
          e.preventDefault(); setOver(false)
          const f = e.dataTransfer.getData('text/flash')
          if (f !== '') { const p = rel(e.clientX, e.clientY); add(Number(f), p.x, p.y); return }
          onFile(e.dataTransfer.files?.[0])
        }}
        onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onPointerDown={() => setSel(null)}>
        {photo
          ? <img src={photo} alt="Tu foto" className="try-photo" draggable={false} />
          : (
            <label className="try-empty">
              <span className="try-plus" aria-hidden>+</span>
              <b>Subí una foto</b>
              <span>brazo, pierna, costilla… o arrastrá acá una imagen</span>
              <input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
            </label>
          )}

        {items.map(it => {
          const f = FLASHES[it.f]
          return (
            <div key={it.id} className={`try-stencil ${sel === it.id ? 'sel' : ''}`}
              style={{ left: `${it.x * 100}%`, top: `${it.y * 100}%`, width: `${it.size * 100}%`, transform: `translate(-50%, -50%) rotate(${it.rot}deg)` }}
              onPointerDown={e => onDown(e, it)}>
              <img src={img(f)} alt={f.name} draggable={false} />
            </div>
          )
        })}

        {!items.length && <p className="try-hint">Arrastrá un flash acá o tocá <b>Probar</b> en el cuaderno</p>}
      </div>

      <div className="try-controls">
        {current ? (
          <>
            <p className="try-now"><b>{FLASHES[current.f].name}</b> · {FLASHES[current.f].cm} cm · {FLASHES[current.f].price}</p>
            <label className="try-range">Tamaño
              <input type="range" min={0.12} max={0.8} step={0.01} value={current.size} onChange={e => update({ size: Number(e.target.value) })} />
            </label>
            <label className="try-range">Rotación
              <input type="range" min={-180} max={180} step={1} value={current.rot} onChange={e => update({ rot: Number(e.target.value) })} />
            </label>
            <div className="try-btns">
              <button type="button" className="try-remove" data-hover onClick={() => { setItems(l => l.filter(i => i.id !== sel)); setSel(null) }}>Quitar</button>
              <button type="button" className="cta-book try-book" data-cursor="book" onClick={() => book(FLASHES[current.f].name)}>Quiero este flash ●</button>
            </div>
          </>
        ) : (
          <div className="try-btns">
            {photo && (
              <label className="try-remove try-change">Cambiar foto
                <input type="file" accept="image/*" onChange={e => onFile(e.target.files?.[0])} />
              </label>
            )}
            <p className="try-privacy">Tu foto queda solo en tu dispositivo: no se sube a ningún lado.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Flash() {
  const [pending, setPending] = useState<number | null>(null)
  const clear = useCallback(() => setPending(null), [])
  return (
    <section id="flash" className="fl">
      <Notebook onTry={setPending} />
      <TryOn pending={pending} clearPending={clear} />
    </section>
  )
}
