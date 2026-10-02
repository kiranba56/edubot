/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D1117',
        'bg-secondary': '#161B22',
        'bg-tertiary': '#21262D',
        'accent': '#2F81F7',
        'accent-secondary': '#7C3AED',
        'text-primary': '#E6EDF3',
        'text-secondary': '#8B949E',
        'border-custom': '#30363D',
        'success': '#3FB950',
        'user-bubble': '#1C2128',
        'bot-bubble': '#0D1117',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
