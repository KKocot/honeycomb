export const CSS_VARIABLES = [
  // Brand
  {
    name: "--hive-red",
    light: "350 82% 48%",
    dark: "350 82% 48%",
    desc: "Brand primary color",
    section: "Brand",
  },
  {
    name: "--hive-dark",
    light: "0 0% 10%",
    dark: "0 0% 10%",
    desc: "Brand dark color",
    section: "Brand",
  },

  // Layout
  {
    name: "--hive-background",
    light: "0 0% 100%",
    dark: "0 0% 7%",
    desc: "Page background",
    section: "Layout",
  },
  {
    name: "--hive-foreground",
    light: "0 0% 9%",
    dark: "0 0% 95%",
    desc: "Primary text color",
    section: "Layout",
  },
  {
    name: "--hive-border",
    light: "0 0% 90%",
    dark: "0 0% 20%",
    desc: "Border color",
    section: "Layout",
  },
  {
    name: "--hive-ring",
    light: "350 82% 48%",
    dark: "350 82% 48%",
    desc: "Focus ring color",
    section: "Layout",
  },

  // Card
  {
    name: "--hive-card",
    light: "0 0% 100%",
    dark: "0 0% 10%",
    desc: "Card background",
    section: "Card",
  },
  {
    name: "--hive-card-foreground",
    light: "0 0% 9%",
    dark: "0 0% 95%",
    desc: "Card text color",
    section: "Card",
  },

  // Popover
  {
    name: "--hive-popover",
    light: "0 0% 100%",
    dark: "0 0% 10%",
    desc: "Popover background",
    section: "Popover",
  },
  {
    name: "--hive-popover-foreground",
    light: "0 0% 9%",
    dark: "0 0% 95%",
    desc: "Popover text color",
    section: "Popover",
  },

  // Muted
  {
    name: "--hive-muted",
    light: "0 0% 96%",
    dark: "0 0% 15%",
    desc: "Muted background",
    section: "Muted",
  },
  {
    name: "--hive-muted-foreground",
    light: "0 0% 45%",
    dark: "0 0% 65%",
    desc: "Muted text color",
    section: "Muted",
  },

  // Status
  {
    name: "--hive-success",
    light: "142 76% 36%",
    dark: "142 71% 45%",
    desc: "Success state (connected, healthy)",
    section: "Status",
  },
  {
    name: "--hive-warning",
    light: "38 92% 50%",
    dark: "48 96% 53%",
    desc: "Warning state (connecting, reconnecting)",
    section: "Status",
  },
  {
    name: "--hive-destructive",
    light: "0 84% 60%",
    dark: "0 63% 31%",
    desc: "Destructive state (error, disconnected)",
    section: "Status",
  },
  {
    name: "--hive-destructive-foreground",
    light: "0 0% 100%",
    dark: "0 0% 95%",
    desc: "Destructive text color",
    section: "Status",
  },
];

export const CODE = {
  cssVariables: `@layer base {
  :root {
    /* Brand */
    --hive-red: 350 82% 48%;
    --hive-dark: 0 0% 10%;

    /* Layout */
    --hive-background: 0 0% 100%;
    --hive-foreground: 0 0% 9%;
    --hive-border: 0 0% 90%;
    --hive-ring: 350 82% 48%;

    /* Card */
    --hive-card: 0 0% 100%;
    --hive-card-foreground: 0 0% 9%;

    /* Popover */
    --hive-popover: 0 0% 100%;
    --hive-popover-foreground: 0 0% 9%;

    /* Muted */
    --hive-muted: 0 0% 96%;
    --hive-muted-foreground: 0 0% 45%;

    /* Status */
    --hive-success: 142 76% 36%;
    --hive-warning: 38 92% 50%;
    --hive-destructive: 0 84% 60%;
    --hive-destructive-foreground: 0 0% 100%;
  }

  .dark {
    /* Layout */
    --hive-background: 0 0% 7%;
    --hive-foreground: 0 0% 95%;
    --hive-border: 0 0% 20%;

    /* Card */
    --hive-card: 0 0% 10%;
    --hive-card-foreground: 0 0% 95%;

    /* Popover */
    --hive-popover: 0 0% 10%;
    --hive-popover-foreground: 0 0% 95%;

    /* Muted */
    --hive-muted: 0 0% 15%;
    --hive-muted-foreground: 0 0% 65%;

    /* Status */
    --hive-success: 142 71% 45%;
    --hive-warning: 48 96% 53%;
    --hive-destructive: 0 63% 31%;
    --hive-destructive-foreground: 0 0% 95%;
  }
}`,
  tailwindConfig: `// tailwind.config.ts
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        hive: {
          // Brand
          red: "hsl(var(--hive-red))",
          dark: "hsl(var(--hive-dark))",

          // Layout
          background: "hsl(var(--hive-background))",
          foreground: "hsl(var(--hive-foreground))",
          border: "hsl(var(--hive-border))",
          ring: "hsl(var(--hive-ring))",

          // Card
          card: "hsl(var(--hive-card))",
          "card-foreground": "hsl(var(--hive-card-foreground))",

          // Popover
          popover: "hsl(var(--hive-popover))",
          "popover-foreground": "hsl(var(--hive-popover-foreground))",

          // Muted
          muted: "hsl(var(--hive-muted))",
          "muted-foreground": "hsl(var(--hive-muted-foreground))",

          // Status
          success: "hsl(var(--hive-success))",
          warning: "hsl(var(--hive-warning))",
          destructive: "hsl(var(--hive-destructive))",
          "destructive-foreground": "hsl(var(--hive-destructive-foreground))",
        },
      },
    },
  },
};`,
  usage: `// Layout colors - auto adapt to light/dark mode
<div className="bg-hive-background text-hive-foreground border-hive-border">
  <p className="text-hive-muted-foreground">Muted text</p>
</div>

// Card component
<div className="bg-hive-card text-hive-card-foreground border-hive-border border rounded-lg p-4">
  Card content
</div>

// Status colors
<div className="bg-hive-success/10 text-hive-success">Connected</div>
<div className="bg-hive-warning/10 text-hive-warning">Connecting...</div>
<div className="bg-hive-destructive/10 text-hive-destructive">Error</div>

// Brand colors
<button className="bg-hive-red text-white hover:bg-hive-red/90">
  Vote on Hive
</button>`,
  customization: `// In your app's globals.css, override any variable:
:root {
  --hive-red: 220 90% 56%; /* Blue instead of red */
  --hive-success: 160 80% 45%; /* Custom green */
}

.dark {
  --hive-background: 222 47% 11%; /* Darker background */
  --hive-card: 217 33% 17%; /* Slate card background */
}`,
};
