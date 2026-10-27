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
          50: '#f2f7f4',
          100: '#e1ede4',
          200: '#c3dbca',
          300: '#9ec4a7',
          400: '#72a57e',
          500: '#4f875c',
          600: '#3c6d48',
          700: '#30563a',
          800: '#274530',
          900: '#1d3324',
          950: '#0e1d13',
        },
        clay: {
          50: '#fdf8f6',
          100: '#f2e8e3',
          200: '#e5d0c7',
          500: '#c86d51',
          600: '#b35639',
          700: '#944229',
        },
        moss: {
          50: '#f6f7f2',
          100: '#e9ece1',
          500: '#606c38',
          600: '#49522b',
          700: '#373e20',
          800: '#283618',
        },
      },
    },
  },
  plugins: [],
}
