/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5ECE7B',
        secondary: '#1D1F22',
        accent: '#FBEBB5',
        dark: '#1D1F22',
        light: '#FFFFFF',
        gray: {
          100: '#F1F2F3',
          200: '#E5E5E5',
          300: '#8D8F9A',
          400: '#43464E',
        }
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
        serif: ['Roboto', 'serif'],
      },
    },
  },
  plugins: [],
} 