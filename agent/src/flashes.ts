// 7 · Live flashes. Briza edits a Google Sheet (Archivo → Compartir → Publicar en la web → CSV) with the
// columns: nombre, cm, precio, disponible (si/no). FLASH_SHEET_URL points to that CSV. Without it the
// fallback below is used. Keep the names equal to the site's notebook.
export type Flash = { name: string; cm: number; price: string; available: boolean }

export const FALLBACK: Flash[] = [
  { name: 'Mariposa con daga', cm: 8, price: '$50.000', available: true },
  { name: 'Frutilla', cm: 5, price: '$40.000', available: true },
  { name: 'Corazón vegan', cm: 7, price: '$55.000', available: true },
  { name: 'Gorrión', cm: 9, price: '$60.000', available: false },
  { name: 'Flor con hojas', cm: 6, price: '$45.000', available: true },
  { name: 'Cerdo & cabra', cm: 9, price: '$65.000', available: true },
  { name: 'Rosa con alambre', cm: 8, price: '$50.000', available: true },
]

export function parseSheet(csv: string): Flash[] {
  const rows = csv.trim().split(/\r?\n/).map(r => r.split(',').map(c => c.replace(/^"|"$/g, '').trim()))
  return rows.slice(1).filter(r => r[0]).map(r => ({
    name: r[0], cm: Number(r[1]) || 0, price: r[2] ?? '', available: /^(si|sí|yes|true|1|x)$/i.test(r[3] ?? ''),
  }))
}

export async function loadFlashes(url?: string): Promise<Flash[]> {
  if (!url) return FALLBACK
  try {
    const res = await fetch(url, { cf: { cacheTtl: 120 } } as RequestInit)
    if (!res.ok) return FALLBACK
    const list = parseSheet(await res.text())
    return list.length ? list : FALLBACK
  } catch { return FALLBACK }
}
