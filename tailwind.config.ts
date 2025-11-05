import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F9F9F0',
        vintage: '#D4C5A9',
        brown: '#8B7355',
      },
      fontFamily: {
        typewriter: ['Courier Prime', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
