// Per-visitor limits kept in Workers KV (binding RATE). Counters are approximate, which is fine for
// keeping out bots and spam. Without the binding, limits are skipped.
export const LIMITS = {
  chatPerHour: 25,     // assistant messages per IP per hour
  chatPerDay: 80,      // assistant messages per IP per day
  requestsPerDay: 2,   // booking requests per IP per day (chat + form together)
}

export async function hit(kv: KVNamespace | undefined, key: string, max: number, ttl: number) {
  if (!kv) return true
  const n = Number(await kv.get(key)) || 0
  if (n >= max) return false
  await kv.put(key, String(n + 1), { expirationTtl: ttl })
  return true
}

export const hourKey = (ip: string, kind: string) => `${kind}:${ip}:${new Date().toISOString().slice(0, 13)}`
export const dayKey = (ip: string, kind: string) => `${kind}:${ip}:${new Date().toISOString().slice(0, 10)}`
