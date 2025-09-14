/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#ffffff',
          dark: '#1f2937'
        },
        text: {
          light: '#111827',
          dark: '#f9fafb'
        },
        border: {
          light: '#e5e7eb',
          dark: '#374151'
        }
      }
    },
  },
  plugins: [],
}