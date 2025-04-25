/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#1E1E2F',
        card: '#2D2E4A',
        text: '#F0F0F3',
        healthy: '#00C49A',
        alert: '#FF6B6B',
        warning: '#FFD166',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neumorphic': '8px 8px 16px #1a1a2e, -8px -8px 16px #22223a',
        'neumorphic-sm': '4px 4px 8px #1a1a2e, -4px -4px 8px #22223a',
      },
    },
  },
  plugins: [],
} 