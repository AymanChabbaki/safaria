/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Morocco-inspired color palette
        desert: {
          50: '#fef9f3',
          100: '#fdf2e7',
          200: '#fae5cf',
          300: '#f6d2a9',
          400: '#f0b376',
          500: '#e89344',
          600: '#d87a2e',
          700: '#b66126',
          800: '#924f26',
          900: '#764222',
        },
        sand: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f4ead1',
          300: '#ead9a8',
          400: '#dfc271',
          500: '#d4ab44',
          600: '#c69534',
          700: '#a5782d',
          800: '#86612a',
          900: '#6f5126',
        },
        chefchaouen: {
          50: '#eff8ff',
          100: '#dff0ff',
          200: '#b8e3ff',
          300: '#78d0ff',
          400: '#2fb9ff',
          500: '#06a0f1',
          600: '#007fce',
          700: '#0065a7',
          800: '#00558a',
          900: '#064772',
        },
        oasis: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        morocco: {
          red: '#C1272D',
          gold: '#D4AF37',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
