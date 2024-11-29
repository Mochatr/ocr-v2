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
          main: '#F8F9FA',
          secondary: '#F1F3F5',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};