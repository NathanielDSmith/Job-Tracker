/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          bg: {
            primary: '#060912',
            secondary: '#0a0f1c',
            tertiary: '#141d33',
            card: 'rgba(13, 18, 34, 0.85)',
          },
          neon: {
            violet: '#8b5cf6',
            'violet-light': '#a78bfa',
            indigo: '#6366f1',
            cyan: '#22d3ee',
            'cyan-light': '#67e8f9',
            pink: '#f472b6',
          },
        },
        fontFamily: {
          sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        },
        backgroundImage: {
          'gradient-neon': 'linear-gradient(120deg, #8b5cf6 0%, #22d3ee 55%, #f472b6 100%)',
        },
      },
    },
    plugins: [],
  }
