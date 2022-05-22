const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/pages/**/*.{js,tsx}', './src/components/**/*.{js,tsx}'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: 'white',
      gray: colors.gray,
      orange: { DEFAULT: '#ff6205' },
      blue: {
        DEFAULT: '#0000ff',
        500: colors.blue[500],
      },
      red: { DEFAULT: '#ff0000' },
      green: { DEFAULT: '#00df62' },
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        mono: ['"Regio mono"', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
