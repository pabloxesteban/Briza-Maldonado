import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import Portfolio from '@/components/Portfolio'
import Process from '@/components/Process'
import Flash from '@/components/Flash'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Manifesto />
      <Portfolio />
      <Process />
      <Flash />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
