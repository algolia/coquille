/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

/**
 * This tailwind config contains everything used in Coquille and in the demo
 * When building the Coquille, src/Coquille/tailwind.config.cjs is used to remove every classes
 * related to demo.
 */
module.exports = {
  prefix: 'cq-',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      mono: ['JetBrains Mono', 'SFMono-Regular'],
    },
    gridTemplateColumns: {
      'auto-full': 'auto 100%',
      '2-auto-1fr': 'auto auto 1fr',
    },
    maxHeight: {
      '50p': '50%',
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
      });
    }),
  ],
};
