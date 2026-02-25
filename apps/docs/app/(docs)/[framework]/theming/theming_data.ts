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
  cssVariables: `:root {
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
}`,
  tailwindTheme: `/* Import in your app.css alongside tailwindcss */
@import "tailwindcss";
@import "@barddev/honeycomb-<framework>/theme.css";

/* Optional: map hive vars to Tailwind semantic colors */
@theme inline {
  --color-background: hsl(var(--hive-background));
  --color-foreground: hsl(var(--hive-foreground));
  --color-border: hsl(var(--hive-border));
  --color-muted: hsl(var(--hive-muted));
  --color-muted-foreground: hsl(var(--hive-muted-foreground));
  --color-card: hsl(var(--hive-card));
  --color-card-foreground: hsl(var(--hive-card-foreground));
}`,
  usage: {
    react: `// Layout colors - auto adapt to light/dark mode
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
    solid: `// Layout colors - auto adapt to light/dark mode
<div class="bg-hive-background text-hive-foreground border-hive-border">
  <p class="text-hive-muted-foreground">Muted text</p>
</div>

// Card component
<div class="bg-hive-card text-hive-card-foreground border-hive-border border rounded-lg p-4">
  Card content
</div>

// Status colors
<div class="bg-hive-success/10 text-hive-success">Connected</div>
<div class="bg-hive-warning/10 text-hive-warning">Connecting...</div>
<div class="bg-hive-destructive/10 text-hive-destructive">Error</div>

// Brand colors
<button class="bg-hive-red text-white hover:bg-hive-red/90">
  Vote on Hive
</button>`,
    vue: `<!-- Layout colors - auto adapt to light/dark mode -->
<div class="bg-hive-background text-hive-foreground border-hive-border">
  <p class="text-hive-muted-foreground">Muted text</p>
</div>

<!-- Card component -->
<div class="bg-hive-card text-hive-card-foreground border-hive-border border rounded-lg p-4">
  Card content
</div>

<!-- Status colors -->
<div class="bg-hive-success/10 text-hive-success">Connected</div>
<div class="bg-hive-warning/10 text-hive-warning">Connecting...</div>
<div class="bg-hive-destructive/10 text-hive-destructive">Error</div>

<!-- Brand colors -->
<button class="bg-hive-red text-white hover:bg-hive-red/90">
  Vote on Hive
</button>`,
    svelte: `<!-- Layout colors - auto adapt to light/dark mode -->
<div class="bg-hive-background text-hive-foreground border-hive-border">
  <p class="text-hive-muted-foreground">Muted text</p>
</div>

<!-- Card component -->
<div class="bg-hive-card text-hive-card-foreground border-hive-border border rounded-lg p-4">
  Card content
</div>

<!-- Status colors -->
<div class="bg-hive-success/10 text-hive-success">Connected</div>
<div class="bg-hive-warning/10 text-hive-warning">Connecting...</div>
<div class="bg-hive-destructive/10 text-hive-destructive">Error</div>

<!-- Brand colors -->
<button class="bg-hive-red text-white hover:bg-hive-red/90">
  Vote on Hive
</button>`,
  },
  cssFiles: `Package exports 3 CSS files:

styles.css — Full bundle (CSS vars + component styles + Tailwind utilities + theme tokens)
             Use for quick start. No Tailwind installation needed.

base.css   — CSS vars + component styles only.
             Use if you want minimal CSS without Tailwind utilities.

theme.css  — @theme inline tokens only.
             Use to add hive-* utility classes to your own Tailwind project.`,
  solidCssSetup: `/* app.css — Solid.js projects with Tailwind CSS 4 */
@import "tailwindcss";
@import "@barddev/honeycomb-solid/theme.css";

@theme inline {
  --color-background: hsl(var(--hive-background));
  --color-foreground: hsl(var(--hive-foreground));
  --color-border: hsl(var(--hive-border));
  --color-muted: hsl(var(--hive-muted));
  --color-muted-foreground: hsl(var(--hive-muted-foreground));
  --color-card: hsl(var(--hive-card));
  --color-card-foreground: hsl(var(--hive-card-foreground));
}`,
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
