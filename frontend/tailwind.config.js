/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',   // Bleu FAST
        secondary: '#c8a951', // Or FAST
      },
    },
  },
  plugins: [],
}
