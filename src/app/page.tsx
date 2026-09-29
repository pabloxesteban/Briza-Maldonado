import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Statement from '@/components/Statement'
import Archive from '@/components/Archive'
import ImageStrip from '@/components/ImageStrip'
import Process from '@/components/Process'
import Flash from '@/components/Flash'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import CustomCursor from '@/components/CustomCursor'
import Intro from '@/components/Intro'
import Reveal from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Briza Maldonado — Tatuadora en Palermo, Buenos Aires',
  description: 'Tatuadora vegana en Palermo, Buenos Aires. Traditional y blackwork. Diseño en iPad, cada pieza una sola vez. Consultá por @bri.t4tts.',
  keywords: 'tatuadora Buenos Aires, traditional tattoo Buenos Aires, blackwork Buenos Aires, tatuajes color Buenos Aires, tatuajes Palermo, tatuadora vegana, flash tattoo',
  openGraph: {
    title: 'Briza Maldonado ✦ Tatuadora',
    description: 'Traditional y blackwork. Palermo, Buenos Aires. Pedí tu turno.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <main>
      <Intro />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Statement />
      <Flash />
      <Archive />
      <ImageStrip />
      <div className="band" style={{ ['--band' as string]: 'var(--c-blue)' }}><Process /></div>
      <div className="band" style={{ ['--band' as string]: 'var(--c-pink)' }}><Contact /></div>
      <Footer />
      <Reveal />
    </main>
  )
}
