import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Flash from '@/components/Flash'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Flash — Briza Maldonado',
  description: 'Flash tattoos disponibles de Briza Maldonado. Diseños únicos de blackwork y traditional listos para tatuar. Palermo, Buenos Aires.',
  keywords: 'flash tattoo, flash disponible, tatuajes flash, blackwork flash, Buenos Aires, Palermo, tatuadora',
  openGraph: {
    title: 'Flash — Briza Maldonado',
    description: 'Flash tattoos disponibles. Diseños únicos listos para tatuar. Palermo, Buenos Aires.',
    type: 'website',
  },
}

export default function FlashPage() {
  return (
    <main>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Flash />
      <Footer />
    </main>
  )
}
