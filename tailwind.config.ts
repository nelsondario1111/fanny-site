import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#2F4A35',
        'brand-blue': '#315F78',
        'brand-beige': '#FAF8F5',
        'brand-gold': '#D3B67A',
        'brand-coral': '#E6A887',
        'brand-body': '#2F3B3D',
      },
      fontFamily: {
        sans: ["var(--font-lato)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "Times New Roman", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.07)",
        card: "0 10px 30px rgba(0,0,0,0.08)",
        innerSoft: "inset 0 1px 0 rgba(255,255,255,0.5)",
      },
      maxWidth: {
        content: "72rem", // ~1152px
        narrow: "56rem",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { lg: "1120px", xl: "1200px" },
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.brand-body'),
            a: {
              color: theme('colors.brand-blue'),
              '&:hover': { color: theme('colors.brand-green') },
            },
            h1: { color: theme('colors.brand-green') },
            h2: { color: theme('colors.brand-green') },
            h3: { color: theme('colors.brand-blue') },
            blockquote: {
              color: theme('colors.brand-blue'),
              borderLeftColor: theme('colors.brand-gold'),
            },
            strong: { color: theme('colors.brand-green') },
            code: { color: theme('colors.brand-blue') },
          },
        },
      }),
      animation: {
        'fade-in': 'fadeIn 0.8s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
