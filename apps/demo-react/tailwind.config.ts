import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  // Preserve .dark class - not detected by JIT (no dark:* utilities used)
  safelist: ["dark"],
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/react/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hive: {
          red: "#E31337",
          dark: "#1A1A1A",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        border: "hsl(var(--border))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [animate],
};

export default config;
