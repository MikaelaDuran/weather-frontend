export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        baskervville: ['"Baskervville"', 'serif'],
      },
    },
  },
  plugins: [],
}

const textShadow = require('tailwindcss-textshadow');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'], // justera vid behov
  theme: {
    extend: {
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.25)',
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        lg: '3px 3px 6px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [textShadow],
};
