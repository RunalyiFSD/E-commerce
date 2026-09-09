/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          50: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        amazon: {
          blue: '#131921',
          light_blue: '#232f3e',
          yellow: '#febd69',
          orange: '#f08804',
          gold: '#e47911',
          dark_orange: '#b12704',
          gray: '#eaeded',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 24px -10px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
