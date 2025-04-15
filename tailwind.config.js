/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx,tsx}",
    "./components/**/*.{js,jsx,tsx}",
    "./app/**/*.{js,jsx,tsx}",
    "./src/**/*.{js,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        paper: "url('src/assets/paper.jpg')",
        bg1: "url('src/assets/bg1.jpg')",
        bg2: "url('src/assets/bg2.jpg')",
      },
      colors: {
        greyText: "#9c9b9a",
        ink: "#16264c",
        error: "#f72a2a",
        blueink: "#004e98",
        bgwhite: "#F9F4F5",
        cta: "#9b0ced",
        hovercta: "#7123b0",
        darkgrey: "#1f1e1e",
        lightpink: "#dcbbf0",
        darkbg: "#04080f",
        secondarydarkbg: "#211f1f",
        darkmodetext: "#E4E4E4",
        darkmodeCTA: "#b458ff",
      },
      fontFamily: {
        blogTitle: ["Bebas Neue", "sans-serif"],
        body: ["Roboto", "sans-serif"],
        navigation: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
