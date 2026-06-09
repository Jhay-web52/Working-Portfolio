/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        bgDark: "#121212",
        textPara: "#E0E2EC" ,
        heading: "#3182CE",
        textWhite: "#FAF7F2",
        textLight: "#9ca3af",
        darkHover: "#18191E",
      },
      keyframes: {
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(15deg)' },
          '30%': { transform: 'rotate(-10deg)' },
          '45%': { transform: 'rotate(15deg)' },
          '60%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(15deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        wave: 'wave 2s infinite',
      },
      transformOrigin: {
        '70-70': '70% 70%',
      },
    },
  },
  plugins: [],
};

module.exports = config;
