/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
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
        dark: {
          bg: {
            primary: '#121212',
            secondary: '#1E1E1E',
            elevated: '#2D2D2D',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#A0A0A0',
          },
        },
      },
    },
  },
  plugins: [],
};