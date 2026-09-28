import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Portfolio from '@/components/Portfolio'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Obra — Briza Maldonado',
  description: 'Portfolio de tatuajes de Briza Maldonado. Blackwork, fineline, ornamental y traditional. Trabajos únicos hechos en Palermo, Buenos Aires.',
  keywords: 'tatuajes blackwork, fineline tattoo, ornamental tattoo, portfolio tatuajes, Buenos Aires, Palermo',
  openGraph: {
    title: 'Obra — Briza Maldonado',
    description: 'Portfolio de tatuajes únicos. Blackwork, fineline y ornamental. Palermo, Buenos Aires.',
    type: 'website',
  },
}

export default function ObraPage() {
  return (
    <main>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Portfolio />
      <Footer />
    </main>
  )
}
