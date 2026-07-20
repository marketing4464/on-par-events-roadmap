import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201d",
        muted: "#65716d",
        moss: "#12633d",
        lime: "#d7f269",
        sand: "#f6f8f5"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(23, 32, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
