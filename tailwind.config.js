/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          500: '#115234',
          700: '#063925',
          900: '#021a0f',
        },
        gold: {
          400: '#d4af37',
          600: '#b8860b',
        },
        cream: {
          100: '#fdfbf7',
          300: '#faf8f5',
        },
        charcoal: '#212121', // Dark text replacement for black
        emerald: '#0B2117',  // Alternative dark variant
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
