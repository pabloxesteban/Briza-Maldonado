// Vercel serves the site at the domain root; GitHub Pages serves it under /Briza-Maldonado
const basePath = process.env.VERCEL ? '' : '/Briza-Maldonado'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
}

module.exports = nextConfig
