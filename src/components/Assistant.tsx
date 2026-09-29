'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Chat bubble for Briza's booking assistant (agent/ worker). It answers questions, offers open slots
// and prepares the WhatsApp request; Briza confirms every booking herself.
const URL_ = process.env.NEXT_PUBLIC_AGENT_URL

type Block = { type: string; text?: string; source?: { type: string; url: string } }
type Msg = { role: 'user' | 'assistant'; content: string | Block[] }
type Action = { summary: string }

const SUGGEST = ['Quiero un flash', 'Tengo una idea propia', '¿Qué turnos hay?']

// Reference photos: resized in the browser, stored by the worker, then shown to the assistant
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, 1280 / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  return await new Promise(res => c.toBlob(b => res(b!), 'image/jpeg', 0.82))
}

const imagesOf = (m: Msg) => (typeof m.content === 'string' ? [] : m.content.filter(b => b.type === 'image' && b.source).map(b => b.source!.url))

// ─── Demo mode (?demo in the URL, while the real assistant isn't connected) ─────
// A scripted stand-in so the experience can be reviewed. It is labelled as a demo and sends nothing.
const nextDay = (wd: number, h: number) => {
  const d = new Date(); d.setHours(h, 0, 0, 0)
  do d.setDate(d.getDate() + 1); while (d.getDay() !== wd)
  return d
}
const label = (d: Date) => `${d.toLocaleDateString('es-AR', { weekday: 'long' })} ${d.getDate()}/${d.getMonth() + 1} a las ${String(d.getHours()).padStart(2, '0')}:00`
type Demo = { idea?: string; slot?: string; name?: string; contact?: string; askedDeposit?: boolean }

// Same numbers as the notebook on the site (Nº 01…); only available ones are offered
const FLASH_NAMES = ['Mariposa con daga', 'Frutilla', 'Corazón vegan', 'Gorrión', 'Flor con hojas', 'Cerdo & cabra', 'Rosa con alambre']
const FLASH_TAKEN = new Set(['Gorrión'])
const flashMenu = FLASH_NAMES.map((n, i) => (FLASH_TAKEN.has(n) ? '' : `${i + 1}. ${n}`)).filter(Boolean).join('\n')

function demoReply(t: string, st: Demo, hasPics: boolean): { reply: string; action?: Action } {
  const q = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const slots = [nextDay(4, 15), nextDay(6, 12), nextDay(2, 11)].map(label)
  const offerSlots = `Tengo estos turnos:\n• ${slots[0]}\n• ${slots[1]}\n• ${slots[2]}\n¿Cuál te queda mejor?`

  if (hasPics) { st.idea = st.idea ?? 'Diseño propio (con referencias)'; return { reply: 'Uff, qué lindas referencias 🖤 Veo algo traditional con línea bien firme, re va en antebrazo o pierna. ¿De qué tamaño lo imaginás más o menos?' } }

  // Booking flow
  if (st.askedDeposit && /\b(si|dale|acepto|ok|de una|obvio|perfecto|listo)\b/.test(q)) {
    return {
      reply: '¡Listo, ya le llegó a Briza! 🙌 Queda pendiente hasta que la confirme (24–48 h). Cuando la acepta te llega el link de Mercado Pago para la seña. ¡Nos vemos en Palermo!',
      action: { summary: `Solicitud enviada a Briza ✦\n\nNombre: ${st.name ?? 'Vos'}\nIdea: ${st.idea ?? 'A charlar con Briza'}\nTurno pedido: ${st.slot ?? slots[0]}\nSeña 40%: aceptada` },
    }
  }
  if (st.slot && !st.name) { st.name = t.trim().split(/[ ,]/)[0]; return { reply: `¡Buenísimo, ${st.name}! ¿Me pasás tu WhatsApp o tu usuario de Instagram así Briza te confirma?` } }
  if (st.slot && st.name && !st.contact) {
    st.contact = t; st.askedDeposit = true
    return { reply: 'Última cosita: todas las reservas se confirman con una seña de al menos el 40% del total, que se paga por Mercado Pago cuando Briza acepta. ¿Te va?' }
  }

  // Picking a flash by number or name
  const num = q.match(/\b([1-7])\b/)?.[1]
  const byName = FLASH_NAMES.find(n => q.includes(n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ')[0]))
  const chosen = st.idea ? undefined : (num && !/\d{1,2}[:.]\d{2}/.test(q) ? FLASH_NAMES[Number(num) - 1] : byName)
  if (chosen) {
    if (FLASH_TAKEN.has(chosen)) return { reply: `Uh, el ${chosen} ya se tatuó 💔 ¿Querés otro?\n${flashMenu}` }
    st.idea = `Flash Nº ${String(FLASH_NAMES.indexOf(chosen) + 1).padStart(2, '0')} · ${chosen}`
    return { reply: `¡Qué lindo el ${chosen}! 🖤 El precio y el tamaño están en el cuaderno de la web. ${offerSlots}` }
  }

  // Picking a slot
  const pick = slots.find(s => q.includes(s.split(' ')[0].normalize('NFD').replace(/[̀-ͯ]/g, ''))) || (/(\d{1,2}[:.]\d{2}|primero|segundo|tercero|ese|el de)/.test(q) ? slots[/segundo/.test(q) ? 1 : /tercero/.test(q) ? 2 : 0] : '')
  if (pick && !st.slot) { st.slot = pick; return { reply: `Dale, te anoto el ${pick} (queda pendiente hasta que Briza lo confirme). ¿Cómo te llamás?` } }

  // Topics (flashes first: "¿qué flashes hay disponibles?" is about flashes, not slots)
  if (/flash/.test(q)) return { reply: `¡Sí! ¿Querés algún flash del cuaderno? Estos están disponibles:\n${flashMenu}\n\nDecime el número 😉 (precios y tamaños los tenés en el cuaderno de la web).` }
  if (/propio|personalizado|mi idea|presupuesto|cotiz/.test(q)) { st.idea = st.idea ?? 'Diseño propio'; return { reply: 'Me encanta 🙌 Los diseños propios los charlás con Briza, pero te tiro un estimativo: uno chico en black & white arranca más o menos desde $40.000 y sube según tamaño, zona y color. Si tenés referencias mandalas con el 📎. ¿Qué tenés en mente y de qué tamaño?' } }
  if (/precio|cuanto|sale|cuesta/.test(q)) return { reply: 'Si es un flash, el precio ya está en el cuaderno de la web 💸 Si es un diseño propio te paso un estimativo y el final lo define Briza. ¿Flash o diseño propio?' }
  if (/turno|libre|fecha|cuando|disponib|agenda/.test(q)) return { reply: offerSlots }
  if (/cuidad|cura|pica|crema/.test(q)) return { reply: 'Los primeros días: lavalo con agua tibia y jabón neutro, secá con toquecitos y una capa finita de crema. Nada de sol, pile ni mar por 2–3 semanas, y no te rasques 🙏 Si tenés fiebre, pus o se pone muy rojo, consultá a un médico y avisale a Briza.' }
  if (/sena|adelanto/.test(q)) return { reply: 'Todas las reservas se confirman con una seña de al menos el 40% del total. Cuando Briza acepta te llega el link de Mercado Pago, re fácil 💳' }
  if (/donde|direccion|palermo|zona del estudio/.test(q)) return { reply: 'El estudio está en Palermo, CABA 🌿 La dirección exacta te la pasa Briza cuando confirma el turno.' }
  if (/hola|buenas|hey/.test(q)) return { reply: '¡Holaa! 🖤 ¿Buscás un flash del cuaderno o tenés una idea propia?' }
  return { reply: 'Te ayudo con flashes, diseños propios, turnos, cuidados o la seña. ¿Por dónde arrancamos? ✨' }
}

const textOf = (m: Msg) => (typeof m.content === 'string' ? m.content
  : m.content.filter(b => b.type === 'text' && b.text).map(b => b.text).join('\n')).trim()

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<Msg[]>([])
  const [action, setAction] = useState<Action | null>(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [pics, setPics] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const [demo, setDemo] = useState(false)
  const demoState = useRef<Demo>({})
  useEffect(() => { if (!URL_ && new URLSearchParams(location.search).has('demo')) setDemo(true) }, [])

  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' }) }, [history, busy, action])
  // "Pedir turno" anywhere on the page opens the assistant
  useEffect(() => {
    const o = () => setOpen(true)
    window.addEventListener('assistant:open', o)
    return () => window.removeEventListener('assistant:open', o)
  }, [])

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  if (!URL_ && !demo) return null

  const attach = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true); setError('')
    try {
      for (const f of Array.from(files).slice(0, 3 - pics.length)) {
        if (demo) { setPics(p => [...p, URL.createObjectURL(f)]); continue }
        const blob = await shrink(f)
        const res = await fetch(`${URL_}/upload`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: blob })
        const data = await res.json() as { url?: string }
        if (!res.ok || !data.url) throw new Error()
        setPics(p => [...p, data.url!])
      }
    } catch { setError('No pude subir la foto. Probá con otra.') } finally { setUploading(false) }
  }

  const send = async (text: string) => {
    const t = text.trim() || (pics.length ? 'Te mando mis referencias.' : '')
    if (!t || busy || uploading) return
    const turn: Msg = pics.length
      ? { role: 'user', content: [...pics.map(url => ({ type: 'image', source: { type: 'url', url } })), { type: 'text', text: t }] }
      : { role: 'user', content: t }
    const next: Msg[] = [...history, turn]
    setHistory(next); setInput(''); setPics([]); setBusy(true); setError('')
    if (demo) {
      const out = demoReply(t, demoState.current, pics.length > 0)
      setTimeout(() => {
        setHistory([...next, { role: 'assistant', content: out.reply }])
        if (out.action) setAction(out.action)
        setBusy(false)
      }, 700 + Math.random() * 500)
      return
    }
    try {
      const res = await fetch(URL_!, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) })
      const data = await res.json() as { messages?: Msg[]; reply: string; action?: Action; error?: string }
      if (data.error === 'limit') { setHistory(history); setError(data.reply); return }
      if (!res.ok || !data.messages) throw new Error(String(res.status))
      setHistory(data.messages)
      if (data.action) setAction(data.action)
    } catch {
      setHistory(history) // drop the unsent turn so it can be retried
      setInput(t); setPics(imagesOf(turn))
      setError('No pude responder ahora. Probá de nuevo en un rato o escribí por Instagram @bri.t4tts.')
    } finally { setBusy(false) }
  }

  // Only show the visitor's words and the assistant's text (tool traffic stays hidden)
  const bubbles = history
    .filter(m => !(m.role === 'user' && typeof m.content !== 'string' && m.content.some(b => b.type === 'tool_result')))
    .map(m => ({ role: m.role, text: textOf(m), imgs: m.role === 'user' ? imagesOf(m) : [] }))
    .filter(b => b.text || b.imgs.length)

  return (
    <>
      <button type="button" className={`ai-fab ${open ? 'hide' : ''}`} onClick={() => setOpen(true)} aria-label="Hablar con Lila" data-hover>
        <Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={40} height={48} />
        <span>¿Dudas? <b>Hablá con Lila</b></span>
      </button>

      <div className={`ai-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Lila, asistente de Briza" aria-hidden={!open}>
        <header className="ai-head">
          <Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={40} height={48} />
          <div>
            <p className="ai-name">Lila <span>· asistente de Briza</span></p>
            <p className="ai-sub">{demo ? 'Modo demo · no se envía nada' : 'Reservo tu turno · Briza lo confirma'}</p>
          </div>
          <button type="button" className="ai-x" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
        </header>

        <div ref={list} className="ai-list" aria-live="polite">
          <p className="ai-msg bot">¡Holaa! Soy Lila, la asistente de Briza 🖤 Te ayudo a elegir un flash o a armar tu idea, te paso precios estimativos, miro tus referencias (📎) y te reservo turno (Briza lo confirma). ¿Qué tenés ganas de tatuarte?</p>
          {bubbles.map((b, i) => (
            <div key={i} className={`ai-msg ${b.role === 'user' ? 'me' : 'bot'}`}>
              {b.imgs.length > 0 && <span className="ai-imgs">{b.imgs.map(u => <img key={u} src={u} alt="Referencia" />)}</span>}
              {b.text}
            </div>
          ))}
          {busy && <p className="ai-msg bot ai-typing" aria-label="Escribiendo"><i /><i /><i /></p>}
          {action && (
            <div className="ai-action">
              <p className="ai-action-lbl">✓ Solicitud enviada</p>
              <pre>{action.summary}</pre>
              <p className="ai-note">Queda pendiente hasta que Briza la confirme (24–48 h). Cuando la acepta te llega el link de Mercado Pago para la seña del 40%.</p>
            </div>
          )}
          {error && <p className="ai-err">{error}</p>}
        </div>

        {!history.length && (
          <div className="ai-suggest">
            {SUGGEST.map(s => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}
          </div>
        )}

        {pics.length > 0 && (
          <div className="ai-pics">
            {pics.map(u => (
              <span key={u}><img src={u} alt="" /><button type="button" aria-label="Quitar foto" onClick={() => setPics(p => p.filter(x => x !== u))}>✕</button></span>
            ))}
          </div>
        )}
        <form className="ai-form" onSubmit={e => { e.preventDefault(); send(input) }}>
          <label className={`ai-clip ${uploading ? 'busy' : ''}`} aria-label="Adjuntar fotos de referencia" title="Adjuntar referencias">
            <input type="file" accept="image/*" multiple onChange={e => { attach(e.target.files); e.target.value = '' }} disabled={pics.length >= 3 || uploading} />
            {uploading ? '…' : '📎'}
          </label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribí tu consulta…" maxLength={1500} aria-label="Tu mensaje" />
          <button type="submit" disabled={busy || uploading || (!input.trim() && !pics.length)} aria-label="Enviar">↑</button>
        </form>
      </div>
    </>
  )
}
