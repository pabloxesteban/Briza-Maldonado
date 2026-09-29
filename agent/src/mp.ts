// 5 · Deposit payments with Mercado Pago Checkout Pro
const API = 'https://api.mercadopago.com'

export async function createDepositLink(token: string, o: { eventId: string; title: string; amount: number; notifyUrl: string }) {
  const res = await fetch(`${API}/checkout/preferences`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ title: o.title.slice(0, 250), quantity: 1, unit_price: o.amount, currency_id: 'ARS' }],
      external_reference: o.eventId,
      notification_url: o.notifyUrl,
      expires: true,
      expiration_date_to: new Date(Date.now() + 72 * 3600e3).toISOString(),
    }),
  })
  if (!res.ok) throw new Error(`mercadopago ${res.status}`)
  return ((await res.json()) as { init_point: string }).init_point
}

export async function getPayment(token: string, id: string) {
  const res = await fetch(`${API}/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`mercadopago ${res.status}`)
  return await res.json() as { status: string; external_reference?: string; transaction_amount?: number }
}
