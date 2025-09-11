/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2EC4B6',
        'primary-dark': '#0A6E65',
        secondary: '#FF9F1C',
        'secondary-dark': '#B36F13',
        background: '#011627',
        'background-light': '#022c49',
        'text': '#FDFFFC',
        'text-secondary': '#E0E0E0',
        danger: '#E71D36',
        white: '#FFFFFF',
        black: '#000000',
        gray: '#adb5bd',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      lineClamp: {
        2: '2',
        3: '3',
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} 