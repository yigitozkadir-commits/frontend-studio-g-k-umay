import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Chess board colors - professional standard
        'chess': {
          'light': '#f0d9b5',        // Light square (creamy)
          'dark': '#b58863',         // Dark square (brown)
          'light-hover': '#f5e3c1',  // Light hover
          'dark-hover': '#c49a73',   // Dark hover
        },
        // Highlight states with better contrast
        'chess-highlight': {
          'valid': '#baca44',        // Valid move (lime green)
          'selected': '#7fc97f',     // Selected square (sage green)
          'check': '#ff6b6b',        // Check state (red)
          'last-move': '#f39c12',    // Last move (orange/gold)
          'capture': '#e74c3c',      // Capture highlight (crimson)
          'valid-alt': '#a8d844',    // Alternative valid move
          'check-subtle': '#ff9999', // Subtle check
        },
        // Piece capture display
        'capture': {
          'bg': '#f8f9fa',
          'dark-bg': '#1f2937',
        },
        // Additional dark mode colors
        'dark-chess': {
          'light': '#c5b89f',        // Dark mode light squares
          'dark': '#7a6f63',         // Dark mode dark squares
        },
      },
      fontFamily: {
        'serif': ['Merriweather', 'Georgia', 'serif'],
        'display': ['Playfair Display', 'serif'],
        'mono': ['Space Mono', 'monospace'],
      },
      spacing: {
        'board-desktop': '400px',
        'board-tablet': '320px',
        'board-mobile': '280px',
      },
      keyframes: {
        // Piece movement animation (smooth curve)
        'piece-move': {
          '0%': { transform: 'scale(1) translateZ(0)', opacity: '1' },
          '50%': { transform: 'scale(1.08) translateZ(0)' },
          '100%': { transform: 'scale(1) translateZ(0)', opacity: '1' },
        },
        // Smooth position transition
        'slide-smooth': {
          '0%': { transform: 'translate(0, 0) translateZ(0)', opacity: '1' },
          '100%': { transform: 'translate(0, 0) translateZ(0)', opacity: '1' },
        },
        // Glow effect for selected square (softer pulse)
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(127, 201, 127, 0.5), inset 0 0 10px rgba(127, 201, 127, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(127, 201, 127, 0.8), inset 0 0 15px rgba(127, 201, 127, 0.3)' },
        },
        // Valid move pulse with scale
        'valid-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
        // Check animation (red border shake)
        'check-shake': {
          '0%, 100%': { transform: 'translateX(0)', borderColor: '#ff6b6b' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        // Piece fade out when captured
        'fade-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.8)' },
        },
        // Board flip animation (3D effect)
        'board-flip': {
          '0%': { transform: 'rotateY(0deg) rotateZ(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        // Bounce for valid moves
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        // Last move highlight fade
        'last-move-pulse': {
          '0%, 100%': { backgroundColor: '#f39c12', opacity: '0.3' },
          '50%': { backgroundColor: '#f39c12', opacity: '0.5' },
        },
        // Piece hover lift effect
        'piece-hover-lift': {
          '0%': { transform: 'translateY(0) scale(1) translateZ(0)', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' },
          '100%': { transform: 'translateY(-4px) scale(1.05) translateZ(0)', filter: 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3))' },
        },
        // New animations for enhanced UX
        'square-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'ring-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(186, 202, 68, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(186, 202, 68, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(186, 202, 68, 0)' },
        },
        'check-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 107, 107, 0.6)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 107, 107, 0.9)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.95) translateY(-10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'piece-move': 'piece-move 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-smooth': 'slide-smooth 0.3s ease-in-out',
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
        'valid-pulse': 'valid-pulse 0.6s ease-in-out infinite',
        'check-shake': 'check-shake 0.5s ease-in-out',
        'fade-out': 'fade-out 0.4s ease-in',
        'board-flip': 'board-flip 0.8s ease-in-out',
        'bounce-gentle': 'bounce-gentle 0.5s ease-in-out',
        'last-move-pulse': 'last-move-pulse 1s ease-in-out infinite',
        'piece-hover-lift': 'piece-hover-lift 0.2s ease-out forwards',
        'square-pulse': 'square-pulse 0.8s ease-in-out infinite',
        'ring-pulse': 'ring-pulse 1.5s ease-out infinite',
        'check-pulse': 'check-pulse 1s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'piece-hover': '0 8px 16px rgba(0, 0, 0, 0.25)',
        'piece-drag': '0 12px 24px rgba(0, 0, 0, 0.3)',
        'board': '0 10px 40px rgba(0, 0, 0, 0.2)',
        'board-dark': '0 10px 40px rgba(0, 0, 0, 0.5)',
        'glow-green': '0 0 15px rgba(127, 201, 127, 0.4)',
        'glow-red': '0 0 15px rgba(255, 107, 107, 0.4)',
        'glow-yellow': '0 0 15px rgba(243, 156, 18, 0.4)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
        'panel': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'panel-dark': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-board': 'linear-gradient(135deg, #f0d9b5 0%, #b58863 100%)',
        'gradient-board-dark': 'linear-gradient(135deg, #c5b89f 0%, #7a6f63 100%)',
      },
    },
  },
  plugins: [],
}
export default config
