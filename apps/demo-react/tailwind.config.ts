import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  // Preserve .dark class - not detected by JIT (no dark:* utilities used)
  safelist: ["dark"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/react/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hive: {
          red: "hsl(var(--hive-red))",
          dark: "hsl(var(--hive-dark))",
          background: "hsl(var(--hive-background))",
          foreground: "hsl(var(--hive-foreground))",
          border: "hsl(var(--hive-border))",
          ring: "hsl(var(--hive-ring))",
          card: "hsl(var(--hive-card))",
          "card-foreground": "hsl(var(--hive-card-foreground))",
          popover: "hsl(var(--hive-popover))",
          "popover-foreground": "hsl(var(--hive-popover-foreground))",
          muted: "hsl(var(--hive-muted))",
          "muted-foreground": "hsl(var(--hive-muted-foreground))",
          success: "hsl(var(--hive-success))",
          warning: "hsl(var(--hive-warning))",
          destructive: "hsl(var(--hive-destructive))",
          "destructive-foreground":
            "hsl(var(--hive-destructive-foreground))",
        },
        background: "hsl(var(--hive-background))",
        foreground: "hsl(var(--hive-foreground))",
        card: {
          DEFAULT: "hsl(var(--hive-card))",
          foreground: "hsl(var(--hive-card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--hive-popover))",
          foreground: "hsl(var(--hive-popover-foreground))",
        },
        border: "hsl(var(--hive-border))",
        muted: {
          DEFAULT: "hsl(var(--hive-muted))",
          foreground: "hsl(var(--hive-muted-foreground))",
        },
        ring: "hsl(var(--hive-ring))",
      },
    },
  },
  plugins: [animate],
};

export default config;
