/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{js,ts,tsx}",
    "./src/components/*.{js,ts,tsx}",
    "./src/screens/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  safelist: [
    "bg-[#FFFFFF]",
    "text-[#8517A4]",
    "bg-[#222222]",
    "text-[#D88DEE]",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
