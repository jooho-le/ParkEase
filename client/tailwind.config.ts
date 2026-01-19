import type { Config } from 'tailwindcss';

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        muted: "hsl(210 40% 96.1%)",
        mutedForeground: "hsl(215.4 16.3% 46.9%)",
        primary: "hsl(142 33% 28%)",
        primaryForeground: "hsl(0 0% 100%)",
        secondary: "hsl(210 40% 96.1%)",
        secondaryForeground: "hsl(222.2 47.4% 11.2%)",
        accent: "hsl(143 38% 70%)",
        accentForeground: "hsl(222.2 47.4% 11.2%)",
        border: "hsl(214.3 31.8% 91.4%)",
      },
      boxShadow: {
        soft: "0 10px 30px -20px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
