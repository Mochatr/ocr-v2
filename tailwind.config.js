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
          50: '#E5F2FF',
          100: '#CCE4FF',
          200: '#99C9FF',
          300: '#66ADFF',
          400: '#3392FF',
          500: '#007AFF',
          600: '#0062CC',
          700: '#004999',
          800: '#003166',
          900: '#001833',
          light: '#007AFF',
          dark: '#0056B3',
        },
        background: {
          main: '#FFFFFF',
          secondary: '#F5F5F7',
          tertiary: '#E3F2FD',
          highlight: '#FFF8E1',
        },
        dark: {
          bg: {
            primary: '#121212',
            secondary: '#1E1E1E',
            elevated: '#2D2D2D',
            highlight: '#2C2C2C',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#A0A0A0',
          },
        },
        gray: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#868E96',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
        'elevation-dark-1': '0 1px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.35)',
        'elevation-dark-2': '0 3px 6px rgba(0,0,0,0.30), 0 2px 4px rgba(0,0,0,0.25)',
        'elevation-dark-3': '0 10px 20px rgba(0,0,0,0.30), 0 3px 6px rgba(0,0,0,0.20)',
      },
    },
  },
  plugins: [],
};