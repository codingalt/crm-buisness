/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        light: {
          layout: {},
          colors: {
            primary: {
              DEFAULT: "#01ab8e",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          layout: {},
          colors: {
            primary: {
              DEFAULT: "#01ab8e",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};
