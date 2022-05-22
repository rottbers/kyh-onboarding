const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/pages/**/*.{js,tsx}', './src/components/**/*.{js,tsx}'],
  darkMode: false,
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: 'white',
      gray: colors.gray,
      orange: { DEFAULT: '#ff6205', 'opacity-70': 'rgba(255,98,5,.7)' },
      blue: {
        DEFAULT: '#0000ff',
        'opacity-70': 'rgba(0,0,255,.7)',
        500: colors.blue[500],
      },
      red: { DEFAULT: '#ff0000', 'opacity-70': 'rgba(255,23,48,.7)' },
      green: { DEFAULT: '#00df62' },
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        mono: ['"Regio mono"', 'monospace'],
      },
    },
  },
  variants: {
    extend: {
      cursor: ['disabled', 'hover'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      borderColor: ['disabled'],
      display: ['motion-reduce'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
