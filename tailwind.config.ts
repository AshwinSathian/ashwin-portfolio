import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/lib/**/*.{ts,tsx,js,jsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0B1020", soft: "#0F1530" },
        text: {
          primary: "#E9ECF2",
          secondary: "#B4BDD1",
          muted: "#8C94AA",
        },
        accent: { DEFAULT: "#8B5CF6", hover: "#7C3AED", soft: "#A78BFA" },
        outline: "#23304E",
        success: "#10B981",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(139,92,246,.15)",
      },
    },
  },
  plugins: [],
};

export default config;
