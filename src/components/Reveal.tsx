'use client'

import { useEffect } from 'react'

// Section blocks slide up as they enter: headings and paragraphs outside pinned/animated areas
const SELECTOR = [
  '#sobre-mi h2', '#sobre-mi p', '#sobre-mi .font-display',
  '#turno h2', '#turno .booking-grid > div:first-child > p',
  '#flash > div:first-child', 'footer > *',
].join(',')

export default function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
    els.forEach((el, i) => { el.classList.add('reveal-up'); el.style.setProperty('--d', `${(i % 4) * 0.08}s`) })
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { rootMargin: '0px 0px -8% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
