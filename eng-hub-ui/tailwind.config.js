/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Catppuccin Mocha Palette
        'mocha-base': '#1e1e2e', // Base background
        'mocha-text': '#cdd6f4', // Text color
        'mocha-lavender': '#b4befe', // Accent Lavender
        'mocha-sapphire': '#74c7ec', // Accent Sapphire
        'mocha-rose': '#f38ba8',    // Accent Rose
        'mocha-peach': '#fab387',   // Accent Peach
        'mocha-yellow': '#f9e2af',  // Accent Yellow
        'mocha-green': '#a6e3a1',   // Accent Green
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Para mejor renderizado de Markdown
  ],
}