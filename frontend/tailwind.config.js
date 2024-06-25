// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       fill: (theme) => ({
//         "sky-500": theme("colors.sky.500"),
//       }),
//     },
//   },
//   plugins: [],
// };
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fill: (theme) => ({
        "sky-500": theme("colors.sky.500"),
      }),
    },
  },
  variants: {
    fill: ["responsive", "hover", "focus"],
  },
  plugins: [],
};
