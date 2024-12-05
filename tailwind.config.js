/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          light: '#47A9FF',
          dark: '#0056B3',
        },
        background: {
          main: '#FFFFFF',
          secondary: '#F5F5F7',
        },
      },
    },
  },
  plugins: [],
};