import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Portfolio from '@/components/Portfolio'
import ImageStrip from '@/components/ImageStrip'
import Process from '@/components/Process'
import Flash from '@/components/Flash'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import CustomCursor from '@/components/CustomCursor'

export const metadata: Metadata = {
  title: 'Briza Maldonado — Tatuadora en Palermo, Buenos Aires',
  description: 'Tatuadora vegana en Palermo, Buenos Aires. Traditional y blackwork. Diseño en iPad, cada pieza una sola vez. Consultá por @bri.t4tts.',
  keywords: 'tatuadora Buenos Aires, traditional tattoo Buenos Aires, blackwork Buenos Aires, fineline Buenos Aires, tatuajes Palermo, tatuadora vegana, flash tattoo',
  openGraph: {
    title: 'Briza Maldonado ✦ Tatuadora',
    description: 'Traditional y blackwork. Palermo, Buenos Aires. Pedí tu turno.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Portfolio />
      <ImageStrip />
      <Flash />
      <Process />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
