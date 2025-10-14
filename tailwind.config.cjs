/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0D1117', // A deep, GitHub-like dark
        'secondary': '#161B22', // A slightly lighter container background
        'accent': {
          'pink': '#F72585',
          'purple': '#7209B7',
        },
        'brand-text': '#C9D1D9',
        'brand-subtle': '#8B949E',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(to right, #F72585, #B5179E, #7209B7)',
      },
      borderColor: {
        'default': '#30363D',
      }
    },
  },
  plugins: [],
}
