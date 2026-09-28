import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Sacar Turno — Briza Maldonado',
  description: 'Pedí tu turno con Briza Maldonado, tatuadora en Palermo, Buenos Aires. Diseños personalizados, flash disponibles y consultas por Instagram.',
  keywords: 'sacar turno tatuaje, turno tatuadora, reserva tatuaje Buenos Aires, Palermo, @bri.t4tts',
  openGraph: {
    title: 'Sacar Turno — Briza Maldonado',
    description: 'Pedí tu turno. Diseños personalizados y flash disponibles. Palermo, Buenos Aires.',
    type: 'website',
  },
}

export default function TurnoPage() {
  return (
    <main>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Contact />
      <Footer />
    </main>
  )
}
