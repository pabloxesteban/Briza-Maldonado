import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Process from '@/components/Process'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Proceso — Briza Maldonado',
  description: 'Cómo trabaja Briza Maldonado: del concepto al iPad, del boceto a la piel. Diseño digital, stencil y técnica artesanal en Palermo, Buenos Aires.',
  keywords: 'proceso tattoo, cómo me tatúo, diseño digital tatuaje, tatuadora Buenos Aires, iPad tattoo design',
  openGraph: {
    title: 'Proceso — Briza Maldonado',
    description: 'Del concepto al iPad, del boceto a la piel. Así trabajo en Palermo, Buenos Aires.',
    type: 'website',
  },
}

export default function ProcesoPage() {
  return (
    <main>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Process />
      <Footer />
    </main>
  )
}
