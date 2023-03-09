/** @type {import('tailwindcss').Config} */
const tailwindConfig = require('../../tailwind.config.cjs');

module.exports = {
  ...tailwindConfig,
  content: ['src/Coquille/**/*.{html,js,jsx,ts,tsx}'],
};
