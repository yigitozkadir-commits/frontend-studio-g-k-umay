import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chess-light': '#f0d9b5',
        'chess-dark': '#b58863',
        'highlight': '#baca44',
        'selected': '#7fc97f',
      },
      keyframes: {
        'piece-move': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'piece-move': 'piece-move 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
export default config
