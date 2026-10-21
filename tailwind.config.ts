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
        // Consolidated body-copy greys. Several components previously used
        // ad-hoc arbitrary hexes (#4a473c, #55523f, #6a674f, #9a9780, ...)
        // for what was meant to be the same two tones. Standardized here so
        // every page draws from the same two muted text colors.
        muted: '#4a473c',
        'muted-soft': '#6a674f',
      },
      fontFamily: {
        head: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-poppins)', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        site: '1200px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        // Used by Modal.tsx. Previously referenced as an arbitrary-value
        // utility (animate-[fadeIn_.3s_ease]) with no matching @keyframes
        // anywhere, so it never actually animated. Defining it here (and
        // switching Modal to the named `animate-fadeIn` utility) fixes that.
        fadeIn: 'fadeIn .25s ease-out',
      },
      transitionTimingFunction: {
        'reveal': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
