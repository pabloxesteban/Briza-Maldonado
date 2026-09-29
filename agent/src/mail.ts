// Emails to clients (confirmation, reminders, aftercare) through Resend. Optional: without the key,
// nothing is mailed and Briza gets the texts ready to send instead.
export async function sendMail(key: string, from: string, to: string, subject: string, text: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text }),
  })
  if (!res.ok) throw new Error(`resend ${res.status}`)
}
