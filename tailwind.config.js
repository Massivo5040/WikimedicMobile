/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,ts,tsx}",
    "./app/components/*.{js,ts,tsx}",
    "./app/screens/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  safelist: [
    "bg-[#FFFFFF]",
    "text-[#8517A4]",
    "bg-[#222222]",
    "text-[#D88DEE]",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["OpenSans_400Regular"],
        sansBold: ["OpenSans_700Bold"],
      },
    },
  },
  plugins: [],
};
