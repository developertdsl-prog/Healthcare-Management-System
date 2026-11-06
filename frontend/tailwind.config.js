/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        healthcare: {
          dark: '#1e293b',
          lighter: '#0f172a',
          accent: '#3b82f6',
          light: '#f1f5f9',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      }
    }
  },
  plugins: [],
}