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

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <ImageStrip />
      <Portfolio />
      <Process />
      <Flash />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
