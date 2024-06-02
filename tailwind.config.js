/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'signup': "url('src/assets/signup.jpg')",
      },
      colors: {
        'greyText': "#9c9b9a"
      }
    },
  },
  plugins: [],
}