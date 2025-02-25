/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
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
          950: '#052e16',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dae7',
          300: '#a6bcd3',
          400: '#7296ba',
          500: '#5079a2',
          600: '#3e5f87',
          700: '#344e6e',
          800: '#2e435c',
          900: '#2b394f',
          950: '#1a2331',
        },
        accent: {
          50: '#fff9eb',
          100: '#ffefc7',
          200: '#ffdc8a',
          300: '#ffc34d',
          400: '#ffa921',
          500: '#ff8800',
          600: '#e06400',
          700: '#b94a04',
          800: '#983a0c',
          900: '#7d310f',
          950: '#461703',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
} 