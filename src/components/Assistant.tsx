'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Chat bubble for Briza's booking assistant (agent/ worker). It answers questions, offers open slots
// and prepares the WhatsApp request; Briza confirms every booking herself.
const URL_ = process.env.NEXT_PUBLIC_AGENT_URL

type Block = { type: string; text?: string; source?: { type: string; url: string } }
type Msg = { role: 'user' | 'assistant'; content: string | Block[] }
type Action = { summary: string }

const SUGGEST = ['¿Qué turnos tenés libres?', '¿Qué flashes hay disponibles?', 'Quiero un diseño propio']

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
type Demo = { slot?: string; name?: string; contact?: string; askedDeposit?: boolean }

function demoReply(t: string, st: Demo, hasPics: boolean): { reply: string; action?: Action } {
  const q = t.toLowerCase()
  const slots = [nextDay(4, 15), nextDay(6, 12), nextDay(2, 11)].map(label)
  if (hasPics) return { reply: 'Qué lindas referencias ✦ Veo un diseño traditional con línea negra firme, ideal para antebrazo o pierna. ¿De qué tamaño lo imaginás?' }
  if (st.askedDeposit && /\b(si|sí|dale|acepto|ok|de acuerdo|perfecto)\b/.test(q)) {
    return {
      reply: 'Listo, tu solicitud le llegó a Briza ✦ Queda pendiente hasta que la confirme (24–48 h). Cuando la acepta te llega el link de Mercado Pago para la seña.',
      action: { summary: `Solicitud enviada a Briza ✦\n\nNombre: ${st.name ?? 'Vos'}\nIdea: Frutilla (flash)\nZona: Antebrazo\nTamaño: 5 cm\nTurno pedido: ${st.slot ?? slots[0]}\nSeña 40%: aceptada` },
    }
  }
  if (st.slot && !st.name) { st.name = t.split(/[ ,]/)[0]; return { reply: `Genial, ${st.name}. ¿Me pasás tu WhatsApp o tu usuario de Instagram para que Briza te confirme?` } }
  if (st.slot && st.name && !st.contact) {
    st.contact = t; st.askedDeposit = true
    return { reply: 'Última cosa: todas las reservas se confirman con una seña de al menos el 40% del costo total, que se paga por Mercado Pago cuando Briza acepta. ¿Estás de acuerdo?' }
  }
  const pick = slots.find(s => q.includes(s.split(' ')[0])) || (/(\d{1,2}[:.]\d{2}|primero|segundo|ese|el de)/.test(q) ? slots[0] : '')
  if (pick && !st.slot) { st.slot = pick; return { reply: `Perfecto, te reservo el ${pick} (queda pendiente hasta que Briza lo confirme). ¿Cómo te llamás?` } }
  if (/turno|libre|fecha|cu[aá]ndo|disponib/.test(q)) return { reply: `Tengo libres:\n• ${slots[0]}\n• ${slots[1]}\n• ${slots[2]}\n¿Cuál te sirve?` }
  if (/flash/.test(q)) return { reply: 'Hay disponibles: Mariposa con daga (8 cm, $50.000), Frutilla (5 cm, $40.000), Corazón vegan (7 cm, $55.000), Flor con hojas (6 cm, $45.000), Cerdo & cabra (9 cm, $65.000) y Rosa con alambre (8 cm, $50.000). El Gorrión ya está tatuado. ¿Te gusta alguno?' }
  if (/propio|precio|cu[aá]nto|sale|cuesta|presupuesto/.test(q)) return { reply: 'Un diseño propio depende del tamaño, la zona y el detalle: te puedo dar un rango orientativo y el precio final lo define Briza al ver tu idea. Si querés mandame referencias con el 📎. ¿Qué tenés en mente y de qué tamaño?' }
  if (/cuidad|cura|pica|crema/.test(q)) return { reply: 'Los primeros días: lavá con agua tibia y jabón neutro, secá con toques suaves y poné una capa fina de crema. Nada de sol, pileta ni mar por 2–3 semanas y no rasques. Si tenés fiebre, pus o enrojecimiento que se expande, consultá a un médico y avisale a Briza.' }
  if (/se[nñ]a|adelanto/.test(q)) return { reply: 'Todas las reservas se confirman con una seña de al menos el 40% del costo total. Cuando Briza acepta tu solicitud te llega el link de Mercado Pago.' }
  if (/frutilla|mariposa|coraz|flor|cerdo|rosa/.test(q)) return { reply: `¡Buena elección! Tengo estos turnos: ${slots[0]} o ${slots[1]}. ¿Cuál preferís?` }
  return { reply: 'Te puedo ayudar con turnos, flashes, precios orientativos, cuidados o la seña. ¿Qué necesitás?' }
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
      <button type="button" className={`ai-fab ${open ? 'hide' : ''}`} onClick={() => setOpen(true)} aria-label="Abrir asistente" data-hover>
        <Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={40} height={48} />
        <span>¿Dudas? <b>Preguntame</b></span>
      </button>

      <div className={`ai-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Asistente de Briza" aria-hidden={!open}>
        <header className="ai-head">
          <Image src="/Briza-Maldonado/brand/sirena-arch.png" alt="" width={40} height={48} />
          <div>
            <p className="ai-name">Asistente de Briza</p>
            <p className="ai-sub">{demo ? 'Modo demo · no se envía nada' : 'Reservo tu turno · Briza lo confirma'}</p>
          </div>
          <button type="button" className="ai-x" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
        </header>

        <div ref={list} className="ai-list" aria-live="polite">
          <p className="ai-msg bot">¡Hola! Soy la asistente de Briza. Puedo contarte qué flashes hay, mostrarte turnos libres, darte un precio orientativo, ver tus fotos de referencia (📎) y reservarte un turno (Briza lo confirma). ¿En qué te ayudo?</p>
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
