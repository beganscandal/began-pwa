/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './forum/**/*.html',
    './forum/**/*.js',
    './notifications/**/*.html',
    './notifications/**/*.js'
  ],

  theme: {
    extend: {
      colors: {
        surface: '#111111',
        accent: '#39FF14',
        dark: '#050505'
      }
    }
  },

  plugins: []
};
