/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5b4ee0',
          dark: '#4a3fd1',
          light: '#eceafd',
        },
        savings: '#d0292f',
        badge: '#5b4ee0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
