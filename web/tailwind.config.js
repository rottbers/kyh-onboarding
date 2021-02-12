const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'media',
  theme: {
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
      brand: { DEFAULT: '#ff6205', 'opacity-70': 'rgba(255,98,5,.7)' },
      'brand-blue': { DEFAULT: '#0000ff' },
      'brand-red': { DEFAULT: '#ff0000', 'opacity-70': 'rgba(255,23,48,.7)' },
      'brand-green': { DEFAULT: '#00df62' },
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
      textColor: ['disabled', 'hover'],
      borderColor: ['disabled'],
      borderWidth: ['hover', 'focus'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
