/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-background': '#FFF9F5',
        'brand-dark': '#4F342B',
        'brand-text-muted': '#8D7B75',
        'brand-pink': {
          DEFAULT: '#F78CB6',
          light: '#FFDDEE',
          dark: '#E0729A',
        },
        'brand-surface': '#FFFFFF',
        'brand-border': '#FBE9E4',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        'button-primary': '0 4px 20px -2px rgb(247 140 182 / 40%)',
        'button-primary-hover': '0 6px 25px -2px rgb(224 114 154 / 50%)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down-fade': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'slide-down-fade': 'slide-down-fade 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};