import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Archive from '@/components/Archive'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Obra — Briza Maldonado',
  description: 'Portfolio de tatuajes de Briza Maldonado. Traditional, black & white y color. Trabajos únicos hechos en Palermo, Buenos Aires.',
  keywords: 'traditional tattoo, tatuajes blackwork, tatuajes color, portfolio tatuajes, Buenos Aires, Palermo',
  openGraph: {
    title: 'Obra — Briza Maldonado',
    description: 'Portfolio de tatuajes únicos. Traditional, black & white y color. Palermo, Buenos Aires.',
    type: 'website',
  },
}

export default function ObraPage() {
  return (
    <main>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Archive />
      <Footer />
    </main>
  )
}
