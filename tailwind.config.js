/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        "weather-conatiner": "calc(100vh -  70px)",
      },
    },
  },
  plugins: [],
};
