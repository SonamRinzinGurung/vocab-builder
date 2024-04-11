/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        body: ["Inter", "sans-serif"],
        subHead: ["Fira Sans", "san-serif"],
        heading: ["Chakra Petch", "san-serif"],
        mono: ["DM Mono", "san-serif"],
      },
      colors: {
        primary: "#6187D1",
        darkPrimary: "#112D4E",
      },
    },
  },
  plugins: [],
};
