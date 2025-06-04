import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#4E6B4E', // For headings, accents
        'brand-blue': '#5B8EAE',  // For headings, links, accents
        'brand-beige': '#F5F2EA', // Backgrounds
        'brand-gold': '#D3B67A',  // Accents, borders
        'brand-coral': '#FFBC9A', // Code, accent
        'brand-body': '#444444',  // Main body text
      },
      fontFamily: {
        sans: ['Lato', 'Open Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        script: ['Pacifico', 'Dancing Script', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.brand-body'),
            fontFamily: theme('fontFamily.sans').join(','),
            h1: {
              color: theme('colors.brand-green'),
              fontFamily: theme('fontFamily.serif').join(','),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.brand-blue'),
              fontFamily: theme('fontFamily.serif').join(','),
              fontWeight: '700',
            },
            h3: {
              color: theme('colors.brand-green'),
              fontFamily: theme('fontFamily.serif').join(','),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.brand-blue'),
              fontFamily: theme('fontFamily.serif').join(','),
              fontWeight: '600',
            },
            a: {
              color: theme('colors.brand-blue'),
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.brand-gold'),
                backgroundColor: theme('colors.brand-blue'),
                textDecoration: 'underline',
              },
            },
            strong: { color: theme('colors.brand-green') },
            blockquote: {
              color: theme('colors.brand-blue'),
              borderLeftColor: theme('colors.brand-gold'),
              fontStyle: 'italic',
              backgroundColor: theme('colors.brand-gold') + '22',
              padding: '0.5rem 1rem',
            },
            code: { color: theme('colors.brand-coral') },
            'ul > li::marker': {
              color: theme('colors.brand-green'),
            },
            'ol > li::marker': {
              color: theme('colors.brand-gold'),
            },
            hr: { borderColor: theme('colors.brand-gold') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
