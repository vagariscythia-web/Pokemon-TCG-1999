/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pkmn-green': '#1e4822',
        'pkmn-darkgreen': '#112d14',
        'pkmn-gold': '#ffcb05',
        'pkmn-blue': '#2a75bb',
        'pkmn-darkblue': '#1b4a78',
        'pkmn-red': '#c41e3a',
        'pkmn-felt': '#245a32'
      },
      boxShadow: {
        'card': '0 8px 16px -4px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        'card-glow': '0 0 15px 3px rgba(255, 203, 5, 0.75)',
        'card-target': '0 0 15px 3px rgba(239, 68, 68, 0.8)'
      }
    },
  },
  plugins: [],
}
