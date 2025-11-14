import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'anthracite': {
          DEFAULT: '#2C2C2C',
          dark: '#3A3A3A',
        },
        'gold': {
          DEFAULT: '#D4AF37',
          light: '#FFD700',
        },
        'off-white': '#F3F3F3',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
        script: ['var(--font-parisienne)', 'cursive'],
      },
    },
  },
  plugins: [],
}
export default config