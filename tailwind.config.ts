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
        ieee: {
          snowflake: "#7AABC3",
          ice: "#3386B7",
          wind: "#214664",
          night: "#0C101C",
          miracle: "#E7B95A",
          sunrise: "#F2C873",
          pale: "#FFE6A7",
        },
      },

      keyframes: {
        moonGlow: {
          "0%": {
            background:
              "radial-gradient(circle at 30% 30%, #FFE6A7, #F2C873 55%, transparent 72%)",
          },
          "50%": {
            background:
              "radial-gradient(circle at 40% 40%, #F8F4E8, #D9E6F2 55%, transparent 72%)",
          },
          "100%": {
            background:
              "radial-gradient(circle at 30% 30%, #FFE6A7, #F2C873 55%, transparent 72%)",
          },
        },

        moonBreath: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.25" },
          "50%": { transform: "scale(1.08)", opacity: "0.45" },
        },

        moonLightPulse: {
          "0%": { transform: "scale(0.96)", opacity: "0.14" },
          "50%": { transform: "scale(1.08)", opacity: "0.45" },
          "100%": { transform: "scale(0.96)", opacity: "0.14" },
        },
      },

      animation: {
        moon: "moonGlow 12s ease-in-out infinite, moonBreath 6s ease-in-out infinite",
        moonLight: "moonLightPulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;