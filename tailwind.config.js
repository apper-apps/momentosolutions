/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6FB5",
        secondary: "#845EC2",
        accent: "#00C9A7",
        warning: "#F9F871",
        error: "#FF6B6B",
        info: "#4ECDC4",
        surface: "#FFFFFF",
        background: "#FFF5FB",
      },
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
        'pill': '999px',
      },
      boxShadow: {
        'soft': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(255, 111, 181, 0.3)',
        'accent-glow': '0 0 20px rgba(0, 201, 167, 0.3)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}