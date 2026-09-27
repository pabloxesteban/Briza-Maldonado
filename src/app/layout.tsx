import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'

export const metadata: Metadata = {
  title: 'Briza Maldonado — Tatuajes Buenos Aires',
  description: 'Tatuadora especializada en blackwork, traditional e ilustración. Buenos Aires. Cada tatuaje es un capítulo.',
  keywords: 'tatuajes, blackwork, traditional, Buenos Aires, tatuadora, flash tattoo',
  openGraph: {
    title: 'Briza Maldonado — Tatuajes Buenos Aires',
    description: 'Arte que toma partido. Blackwork con alma.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="grain">
        <Cursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
