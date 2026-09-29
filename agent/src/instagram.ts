// 9 · Instagram DMs through the Instagram API with Instagram Login (professional account).
const GRAPH = 'https://graph.instagram.com/v21.0'

export async function verifySignature(appSecret: string, raw: string, header: string | null) {
  if (!header?.startsWith('sha256=')) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(appSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw))
  const hex = Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, '0')).join('')
  return hex === header.slice(7)
}

export async function sendDM(token: string, igUserId: string, recipient: string, text: string) {
  // Instagram caps a message at 1000 characters
  for (let i = 0; i < text.length; i += 950) {
    const res = await fetch(`${GRAPH}/${igUserId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient: { id: recipient }, message: { text: text.slice(i, i + 950) } }),
    })
    if (!res.ok) throw new Error(`instagram ${res.status}`)
  }
}

export async function username(token: string, sid: string) {
  try {
    const res = await fetch(`${GRAPH}/${sid}?fields=username&access_token=${encodeURIComponent(token)}`)
    if (!res.ok) return ''
    return ((await res.json()) as { username?: string }).username ?? ''
  } catch { return '' }
}
