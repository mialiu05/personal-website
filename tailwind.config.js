/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{tsx,ts}',
    '!./node_modules/**',
  ],
  theme: {
    extend: {
      colors: {
        'swiss-red': '#FF3333',
        'off-black': '#0A0A0A',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
