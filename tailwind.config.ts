import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg-primary': '#FAE8F0',
        'bg-secondary': '#FFF0F5',
        'accent-hot': '#F0287A',
        'accent-pink': '#F472B6',
        'accent-red': '#E57373',
        'accent-blue': '#93C5FD',
        'accent-yellow': '#FDE68A',
        'accent-green': '#A7F3D0',
      },
    },
  },
  plugins: [],
}

export default config
