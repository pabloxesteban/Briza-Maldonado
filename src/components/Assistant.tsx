'use client'

import { useEffect, useRef, useState } from 'react'
import LilaAvatar from './LilaAvatar'

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
type Demo = { idea?: string; slot?: string; name?: string; ig?: string; email?: string; news?: boolean; step?: 'news' | 'deposit' }

// Same numbers and prices as the notebook on the site (Nº 01…); only available ones are offered
const FLASHES_DEMO = [
  { name: 'Mariposa con daga', cm: 8, price: 50000, ok: true },
  { name: 'Frutilla', cm: 5, price: 40000, ok: true },
  { name: 'Corazón vegan', cm: 7, price: 55000, ok: true },
  { name: 'Gorrión', cm: 9, price: 60000, ok: false },
  { name: 'Flor con hojas', cm: 6, price: 45000, ok: true },
  { name: 'Cerdo & cabra', cm: 9, price: 65000, ok: true },
  { name: 'Rosa con alambre', cm: 8, price: 50000, ok: true },
]
const ars = (n: number) => `$${n.toLocaleString('es-AR')}`
const flashMenu = FLASHES_DEMO.map((f, i) => (f.ok ? `${i + 1}. ${f.name}` : '')).filter(Boolean).join('\n')
const plain = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

function demoReply(t: string, st: Demo, hasPics: boolean): { reply: string; action?: Action } {
  const q = plain(t)
  const slots = [nextDay(4, 15), nextDay(6, 12), nextDay(2, 11)].map(label)
  const offerSlots = `Tengo estos turnos:\n• ${slots[0]}\n• ${slots[1]}\n• ${slots[2]}\n¿Cuál te queda mejor?`
  const yes = /\b(si|dale|acepto|ok|de una|obvio|perfecto|listo|bueno|claro)\b/.test(q)

  if (hasPics) { st.idea = st.idea ?? 'Diseño propio (con referencias)'; return { reply: 'Uff, qué lindas referencias 🖤 Veo algo traditional con línea bien firme, re va en antebrazo o pierna. ¿De qué tamaño lo imaginás más o menos?' } }

  // Booking flow: name → Instagram → email → newsletter → deposit
  if (st.step === 'deposit') {
    if (!yes) return { reply: 'Sin la seña no puedo dejar el turno reservado 🙏 ¿Te va el 40% por Mercado Pago cuando Briza acepte?' }
    return {
      reply: `¡Listo, ya le llegó a Briza! 🙌 Queda pendiente hasta que la confirme (24–48 h). Te va a llegar la confirmación a ${st.email} con el link de Mercado Pago para la seña. ¡Nos vemos en Palermo!`,
      action: { summary: `Solicitud enviada a Briza ✦\n\nNombre: ${st.name}\nContacto: ${st.ig}\nMail: ${st.email}\nIdea: ${st.idea ?? 'A charlar con Briza'}\nTurno pedido: ${st.slot}\nNovedades y descuentos: ${st.news ? 'sí' : 'no'}\nSeña 40%: aceptada` },
    }
  }
  if (st.step === 'news') {
    st.news = yes && !/\bno\b/.test(q); st.step = 'deposit'
    return { reply: `${st.news ? '¡Genial, quedás anotada/o! ✨' : 'Dale, sin problema.'} Última cosita: todas las reservas se confirman con una seña de al menos el 40% del total, que se paga por Mercado Pago cuando Briza acepta. ¿Te va?` }
  }
  if (st.slot && st.name && st.ig && !st.email) {
    const m = t.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)
    if (!m) return { reply: 'Mmm, ese mail no me cierra 🤔 ¿Me lo pasás de nuevo?' }
    st.email = m[0]; st.step = 'news'
    return { reply: '¡Gracias! ¿Querés que te avisemos de descuentos y próximos eventos de Briza (flash days, guest spots)? Es un mail de vez en cuando, nada de spam 💌 ¿Sí o no?' }
  }
  if (st.slot && st.name && !st.ig) {
    const digits = t.replace(/\D/g, '')
    if (digits.length >= 8 && !/[a-z]/i.test(t)) { st.ig = `WhatsApp +${digits}`; return { reply: 'Dale, te anoto el WhatsApp 👍 ¿Y un mail para mandarte la confirmación del turno?' } }
    if (/\bno\b|no tengo|no uso|prefiero/.test(q)) return { reply: 'Todo bien 🙌 Entonces pasame tu WhatsApp y Briza te escribe por ahí.' }
    const h = t.trim().match(/@?([a-z0-9._]{2,30})/i)
    if (!h) return { reply: '¿Me pasás tu usuario de Instagram? (tipo @tuusuario)' }
    st.ig = `@${h[1]}`
    return { reply: `¡Buenísimo! Briza te escribe por Instagram (${st.ig}). ¿Y un mail para mandarte la confirmación del turno?` }
  }
  if (st.slot && !st.name) { st.name = t.trim().split(/[ ,]/)[0]; return { reply: `¡Un gusto, ${st.name}! Todo el contacto es por Instagram 📲 ¿Cuál es tu usuario? (si no usás Instagram, decime y lo vemos por WhatsApp)` } }

  // Picking one or more flashes by number (or name) → names, sizes and prices
  const timeLike = /\d{1,2}[:.]\d{2}/.test(q)
  const nums = timeLike ? [] : Array.from(q.matchAll(/\b([1-7])\b/g)).map(m => Number(m[1]) - 1)
  const names = FLASHES_DEMO.map((f, i) => (q.includes(plain(f.name).split(' ')[0]) ? i : -1)).filter(i => i >= 0)
  const picked = Array.from(new Set([...nums, ...names]))
  if (picked.length && !st.slot) {
    const taken = picked.filter(i => !FLASHES_DEMO[i].ok)
    const ok = picked.filter(i => FLASHES_DEMO[i].ok)
    if (!ok.length) return { reply: `Uh, ${FLASHES_DEMO[taken[0]].name} ya se tatuó 💔 ¿Querés otro?\n${flashMenu}` }
    const lines = ok.map(i => `• Nº ${String(i + 1).padStart(2, '0')} ${FLASHES_DEMO[i].name} · ${FLASHES_DEMO[i].cm} cm · ${ars(FLASHES_DEMO[i].price)}`)
    const total = ok.reduce((n, i) => n + FLASHES_DEMO[i].price, 0)
    st.idea = ok.map(i => `Nº ${String(i + 1).padStart(2, '0')} ${FLASHES_DEMO[i].name}`).join(' + ')
    return { reply: `¡Qué buena elección! 🖤\n${lines.join('\n')}${ok.length > 1 ? `\nTotal: ${ars(total)}` : ''}${taken.length ? `\n(${FLASHES_DEMO[taken[0]].name} ya se tatuó)` : ''}\n\n${offerSlots}` }
  }

  // Picking a slot
  const pick = slots.find(s => q.includes(plain(s.split(' ')[0]))) || (/(\d{1,2}[:.]\d{2}|primero|segundo|tercero|ese|el de)/.test(q) ? slots[/segundo/.test(q) ? 1 : /tercero/.test(q) ? 2 : 0] : '')
  if (pick && !st.slot) { st.slot = pick; return { reply: `Dale, te anoto el ${pick} (queda pendiente hasta que Briza lo confirme). ¿Cómo te llamás?` } }

  // Topics (flashes first: "¿qué flashes hay disponibles?" is about flashes, not slots)
  if (/flash/.test(q)) return { reply: `¡Sí! Estos flashes del cuaderno están disponibles:\n${flashMenu}\n\nDecime el número (podés elegir más de uno) y te paso el precio 😉` }
  if (/propio|personalizado|mi idea|presupuesto|cotiz/.test(q)) { st.idea = st.idea ?? 'Diseño propio'; return { reply: 'Me encanta 🙌 Los diseños propios los charlás con Briza, pero te tiro un estimativo: uno chico en black & white arranca más o menos desde $40.000 y sube según tamaño, zona y color. Si tenés referencias mandalas con el 📎. ¿Qué tenés en mente y de qué tamaño?' } }
  if (/precio|cuanto|sale|cuesta/.test(q)) return { reply: `¿Es un flash o un diseño propio? Si es flash decime el número y te paso el precio:\n${flashMenu}` }
  if (/turno|libre|fecha|cuando|disponib|agenda/.test(q)) return { reply: offerSlots }
  if (/cuidad|cura|pica|crema/.test(q)) return { reply: 'Los primeros días: lavalo con agua tibia y jabón neutro, secá con toquecitos y una capa finita de crema. Nada de sol, pile ni mar por 2–3 semanas, y no te rasques 🙏 Si tenés fiebre, pus o se pone muy rojo, consultá a un médico y avisale a Briza.' }
  if (/sena|adelanto/.test(q)) return { reply: 'Todas las reservas se confirman con una seña de al menos el 40% del total. Cuando Briza acepta te llega el link de Mercado Pago, re fácil 💳' }
  if (/whats|telefono|numero|celular/.test(q)) return { reply: 'Briza atiende todo por Instagram 📲 (@bri.t4tts). Si querés, te reservo turno desde acá y te escribe ella por ahí.' }
  if (/donde|direccion|palermo|zona del estudio/.test(q)) return { reply: 'El estudio está en Palermo, CABA 🌿 La dirección exacta te llega con la confirmación del turno.' }
  if (/hola|buenas|hey/.test(q)) return { reply: '¡Holaa! 🖤 ¿Buscás un flash del cuaderno o tenés una idea propia?' }
  return { reply: 'Te ayudo con flashes, diseños propios, turnos, cuidados o la seña. ¿Por dónde arrancamos? ✨' }
}

const textOf = (m: Msg) => (typeof m.content === 'string' ? m.content
  : m.content.filter(b => b.type === 'text' && b.text).map(b => b.text).join('\n')).trim()

// What Lila says depends on what you're looking at
const CONTEXT: Record<string, { say: string[]; chips: string[] }> = {
  top: { say: ['Hola, soy Lila ✦ ¿te ayudo?', '¿Buscás turno? Te lo armo en 1 minuto', '¿Flash o idea propia?'], chips: ['Quiero un flash', 'Tengo una idea propia'] },
  flash: { say: ['¿Te gustó alguno? Te paso el precio', 'Decime el número y te lo reservo ✦', '¿Lo querés probar en tu cuerpo?'], chips: ['¿Qué flashes hay?', 'Quiero reservar uno'] },
  obra: { say: ['¿Querés algo así? Contame tu idea', '¿Viste alguno que te guste? 🖤', 'Te paso un estimativo al toque'], chips: ['Quiero algo parecido', '¿Cuánto sale?'] },
  proceso: { say: ['¿Dudas del proceso? Preguntame', 'Primero charlamos tu idea ✦', '¿Cuánto dura una sesión? Te cuento'], chips: ['¿Cómo es el proceso?', '¿Qué cuidados lleva?'] },
  turno: { say: ['¿Querés que te lo arme yo?', 'Te busco un turno libre ✦', 'Más rápido por acá 😉'], chips: ['¿Qué turnos hay?', 'Quiero un flash'] },
}

export default function Assistant() {
  const [demo, setDemo] = useState(false)
  const [open, setOpen] = useState(false)
  // A friendly nudge a few seconds after the visitor starts exploring (once per visit, dismissible)
  const [teaser, setTeaser] = useState(false)
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('lila-teaser') === '1' } catch { /* noop */ }
    if (seen) return
    const t = setTimeout(() => setTeaser(true), 2500)
    return () => clearTimeout(t)
  }, [])
  // Lila waits until the hero is behind, so she doesn't sit on top of its buttons
  const [past, setPast] = useState(false)
  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight * 0.6)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const hideTeaser = () => { setTeaser(false); try { sessionStorage.setItem('lila-teaser', '1') } catch { /* noop */ } }

  // Section in view → contextual lines, typed out one letter at a time
  const [ctx, setCtx] = useState('top')
  useEffect(() => {
    const ids = ['flash', 'obra', 'proceso', 'turno']
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setCtx(e.target.id) }), { rootMargin: '-45% 0px -45% 0px' })
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  const [typed, setTyped] = useState('')
  useEffect(() => {
    const lines = CONTEXT[ctx]?.say ?? CONTEXT.top.say
    let li = 0, ch = 0, alive = true, t: ReturnType<typeof setTimeout>
    const step = () => {
      if (!alive) return
      const line = lines[li % lines.length]
      if (ch <= line.length) { setTyped(line.slice(0, ch++)); t = setTimeout(step, 38) }
      else { t = setTimeout(() => { ch = 0; li++; step() }, 3600) }
    }
    step()
    return () => { alive = false; clearTimeout(t) }
  }, [ctx])

  // The orb leans towards the cursor (magnetic) and looks alive
  const orb = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const el = orb.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy)
      const k = 0 // no magnetic pull: kept calm
      el.style.setProperty('--mx', `${dx * k}px`); el.style.setProperty('--my', `${dy * k}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [demo, past])
  const quick = (t: string) => { hideTeaser(); setOpen(true); setTimeout(() => sendRef.current?.(t), 250) }
  const sendRef = useRef<((t: string) => void) | null>(null)
  const [history, setHistory] = useState<Msg[]>([])
  const [action, setAction] = useState<Action | null>(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [pics, setPics] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const list = useRef<HTMLDivElement>(null)
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

  sendRef.current = (t: string) => { void send(t) }
  async function send(text: string) {
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
      <div className={`lila-dock ${open || !past ? 'hide' : ''}`}>
        {teaser && !open && (
          <div className="lila-bubble" role="status">
            <button type="button" className="lila-bubble-x" aria-label="Ocultar" onClick={hideTeaser}>✕</button>
            <button type="button" className="lila-bubble-text" onClick={() => { hideTeaser(); setOpen(true) }}>
              {typed}<i className="lila-caret" aria-hidden />
            </button>
            <div className="lila-chips">
              {(CONTEXT[ctx] ?? CONTEXT.top).chips.map(c => <button key={c} type="button" onClick={() => quick(c)}>{c}</button>)}
            </div>
          </div>
        )}
        <button ref={orb} type="button" className="lila-orb" onClick={() => { hideTeaser(); setOpen(true) }} aria-label="Hablar con Lila" data-hover>
          <span className="lila-cf" aria-hidden />
          <span className="lila-face"><LilaAvatar size={56} /></span>
        </button>
      </div>

      <div className={`ai-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Lila, asistente de Briza" aria-hidden={!open}>
        <header className="ai-head">
          <LilaAvatar size={40} />
          <div>
            <p className="ai-name">Lila <span className="ai-verified" aria-label="Asistente de Briza">✓</span></p>
            <p className="ai-sub"><i className="ai-dot" />{demo ? 'Activa ahora · demo' : 'Activa ahora'}</p>
          </div>
          <button type="button" className="ai-x" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
        </header>

        <div ref={list} className="ai-list" aria-live="polite">
          <div className="ai-row"><LilaAvatar size={28} /><p className="ai-msg bot">¡Holaa! Soy Lila, la asistente de Briza 🖤 Te ayudo a elegir flashes (con precio) o a armar tu idea, te paso estimativos, miro tus referencias (📎) y te reservo turno (Briza lo confirma). ¿Qué tenés ganas de tatuarte?</p></div>
          {bubbles.map((b, i) => (
            <div key={i} className={`ai-row ${b.role === 'user' ? 'me' : ''}`}>
              {b.role !== 'user' && <LilaAvatar size={28} />}
              <div className={`ai-msg ${b.role === 'user' ? 'me' : 'bot'}`}>
                {b.imgs.length > 0 && <span className="ai-imgs">{b.imgs.map(u => <img key={u} src={u} alt="Referencia" />)}</span>}
                {b.text}
              </div>
            </div>
          ))}
          {busy && <div className="ai-row"><LilaAvatar size={28} /><p className="ai-msg bot ai-typing" aria-label="Lila está escribiendo"><i /><i /><i /></p></div>}
          {action && (
            <div className="ai-action">
              <p className="ai-action-lbl">✓ Solicitud enviada</p>
              <pre>{action.summary}</pre>
              <p className="ai-note">Queda pendiente hasta que Briza la confirme (24–48 h). Te llega la confirmación por mail, con el link de Mercado Pago para la seña del 40%.</p>
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
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Mensaje…" maxLength={1500} aria-label="Tu mensaje" />
          <button type="submit" disabled={busy || uploading || (!input.trim() && !pics.length)} aria-label="Enviar">↑</button>
        </form>
      </div>
    </>
  )
}
