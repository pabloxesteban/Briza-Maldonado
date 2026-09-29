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

  if (!URL_) return null

  const attach = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true); setError('')
    try {
      for (const f of Array.from(files).slice(0, 3 - pics.length)) {
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
    try {
      const res = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) })
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
    .filter(m => !(m.role === 'user' && typeof m.content !== 'string'))
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
            <p className="ai-sub">Reservo tu turno · Briza lo confirma</p>
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
