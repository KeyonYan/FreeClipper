/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts}'],
  theme: {
    data: {
      show: 'ui~="show"',
      hidden: 'ui~="hidden"',
    },
    extend: {},
  },
  plugins: [],
}
