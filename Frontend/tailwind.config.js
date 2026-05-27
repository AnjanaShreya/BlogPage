module.exports = {
  mode: "jit", 
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  theme: {
    extend: {
      colors: {
        primary: "#4A3AFF",
        gold: {
          light: "#ecc260",
          DEFAULT: "#ecc260",
          dark: "#e0b24c",
        },
        navy: {
          light: "#155966",
          DEFAULT: "#002a32",
          dark: "#001a1f",
        }
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        Hero: "url('assets/img3.jpg')", 
      },
    },
  },
  plugins: [require('@tailwindcss/typography')], 
};
