// tailwind.config.js

const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'heading' userà la variabile CSS --font-maven-pro (da layout.tsx)
        heading: ['var(--font-maven-pro)', ...fontFamily.sans],
        // 'sans' (il font di default per tutto il testo) userà la variabile CSS --font-open-sans
        sans: ['var(--font-open-sans)', ...fontFamily.sans], // Questa riga è FONDAMENTALE per Open Sans
      },
      colors: {
        primary: '#38b5ad', // Colore dell'header, utile come utility
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Ricorda di installarlo se non lo hai fatto
  ],
}