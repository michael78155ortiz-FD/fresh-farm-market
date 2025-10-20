import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-white",
    "bg-green-600",
    "bg-green-700",
    "hover:bg-green-700",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
