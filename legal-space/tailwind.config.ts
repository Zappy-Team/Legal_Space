import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "home-hero": "url('../public/images/bg-1.jpg')",
        "practice-hero": "url('../public/images/practice.jpg')",
        "attorney-hero": "url('../public/images/attorney.jpg')",
        "blog-hero": "url('../public/images/blog1.jpg')",
      },
      colors: {
        "main-green-light": "#DAD7CD",
        "main-green-medium": "#588157",
        "main-green-dark": "#344E41",
      },
    },
  },
  plugins: [],
};
export default config;
