// WhatsApp notice to Briza (to her own number only) through CallMeBot: free, no WhatsApp Business
// account needed. Briza activates it once by messaging the CallMeBot number (see README).
export async function whatsappToBriza(phone: string, apikey: string, text: string) {
  const q = new URLSearchParams({ phone, text, apikey })
  const res = await fetch(`https://api.callmebot.com/whatsapp.php?${q}`)
  if (!res.ok) throw new Error(`callmebot ${res.status}`)
}
