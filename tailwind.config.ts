import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C96A",
          muted: "#F5EDD8",
        },
        charcoal: {
          DEFAULT: "#1C1C1E",
          soft: "#2C2C2E",
        },
        surface: {
          DEFAULT: "#FAFAF8",
          raised: "#FFFFFF",
          sunken: "#F2F1EE",
        },
        border: {
          DEFAULT: "#E8E6E1",
          strong: "#D4D0C8",
        },
        success: {
          DEFAULT: "#2D7A4F",
          bg: "#EBF5EF",
        },
        danger: {
          DEFAULT: "#C0392B",
          bg: "#FBEAE9",
        },
        warning: {
          DEFAULT: "#B8860B",
          bg: "#FEF9EC",
        },
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        lg: "0 12px 40px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
        luxury: "0 4px 24px rgba(201, 168, 76, 0.15)",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
