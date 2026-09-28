/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Briza-Maldonado',
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
}

module.exports = nextConfig
