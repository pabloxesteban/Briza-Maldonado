import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title: 'Briza Maldonado — Tatuajes Buenos Aires',
  description: 'Tatuadora basada en Palermo, Buenos Aires. Traditional, black & white y color.',
  keywords: 'tatuajes, traditional, blackwork, color, Buenos Aires, Palermo, tatuadora, flash tattoo',
  openGraph: {
    title: 'Briza Maldonado ✦',
    description: 'Del iPad a la piel. Palermo, Buenos Aires.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="grain">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
