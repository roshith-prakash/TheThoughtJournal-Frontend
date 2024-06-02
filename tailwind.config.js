/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'signup': "url('src/assets/signup.jpg')",
        'login': "url('src/assets/login.jpg')",
        'paper': "url('src/assets/paper.jpg')",
      },
      colors: {
        'greyText': "#9c9b9a",
        "ink": "#16264c"
      }
    },
  },
  plugins: [],
}