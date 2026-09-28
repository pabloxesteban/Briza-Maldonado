import manifest from './imageManifest.json'

const BASE = '/Briza-Maldonado'
const variants = manifest as Record<string, number[]>

// Maps next/image requests to the pre-generated WebP variants (see tools/optimize_images.py)
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const rel = src.startsWith(BASE) ? src.slice(BASE.length) : src
  const widths = variants[rel]
  if (!widths) return src
  const w = widths.find(v => v >= width) ?? widths[widths.length - 1]
  return `${BASE}/_img${rel.replace(/\.(jpe?g|png)$/i, '')}-${w}.webp`
}
