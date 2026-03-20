/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)', filter: 'drop-shadow(2px 0 0 red) drop-shadow(-2px 0 0 blue)' },
          '40%': { transform: 'translate(-2px, -2px)', filter: 'drop-shadow(2px 0 0 red) drop-shadow(-2px 0 0 blue)' },
          '60%': { transform: 'translate(2px, 2px)', filter: 'drop-shadow(-2px 0 0 red) drop-shadow(2px 0 0 blue)' },
          '80%': { transform: 'translate(2px, -2px)', filter: 'drop-shadow(-2px 0 0 red) drop-shadow(2px 0 0 blue)' },
          '100%': { transform: 'translate(0)' },
        },
        scanlines: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'glitch': 'glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
        'scanlines': 'scanlines 10s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
