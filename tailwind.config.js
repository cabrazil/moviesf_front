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
      }
    },
  },
  plugins: [],
} 