import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  // Preserve .dark class - not detected by JIT (no dark:* utilities used)
  safelist: ["dark"],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/solid/src/**/*.{ts,tsx}",
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
        primary: {
          DEFAULT: "hsl(var(--hive-primary))",
          foreground: "hsl(var(--hive-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--hive-secondary))",
          foreground: "hsl(var(--hive-secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--hive-accent))",
          foreground: "hsl(var(--hive-accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--hive-destructive))",
          foreground: "hsl(var(--hive-destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--hive-card))",
          foreground: "hsl(var(--hive-card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--hive-popover))",
          foreground: "hsl(var(--hive-popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--hive-muted))",
          foreground: "hsl(var(--hive-muted-foreground))",
        },
        success: "hsl(var(--hive-success))",
        warning: "hsl(var(--hive-warning))",
        border: "hsl(var(--hive-border))",
        input: "hsl(var(--hive-input))",
        ring: "hsl(var(--hive-ring))",
      },
      borderRadius: {
        lg: "var(--hive-radius)",
        md: "calc(var(--hive-radius) - 2px)",
        sm: "calc(var(--hive-radius) - 4px)",
      },
    },
  },
  plugins: [animate, typography],
};

export default config;
