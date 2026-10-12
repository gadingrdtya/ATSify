/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // Teal 500
        accent: "#0f766e", // Teal 700
        background: "#f8fafc", // Slate 50
        surface: "#ffffff",
        "text-primary": "#0f172a", // Slate 900
        "text-secondary": "#475569", // Slate 600
        border: "#e2e8f0", // Slate 200
        success: "#10b981", // Emerald 500
        error: "#ef4444", // Red 500
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        cv: ['Arial', 'Helvetica', 'sans-serif'], // Font spesifik untuk Kertas CV
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
