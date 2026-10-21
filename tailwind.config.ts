import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F3EFE6',
        'cream-deep': '#ECE5D3',
        'header-bg': '#E3D7B8',
        ink: '#2E2B22',
        'headline-green': '#37452F',
        olive: '#6B6420',
        pine: '#33474A',
        mustard: '#B9791E',
        terracotta: '#A34A31',
        tan: '#A87A4E',
        'slate-blue': '#55657D',
        'deep-red': '#7A2214',
        'philosophy-green': '#52543C',
        'expertise-terracotta': '#A35637',
        gold: '#C79A3E',
        'gold-dark': '#A98333',
        'footer-gold': '#A78442',
      },
      fontFamily: {
        head: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-poppins)', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
