import Link from "next/link";
import { ArrowRight, Info, Palette, Moon, Sun } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  cssVariables: `@layer base {
  :root {
    /* Background & Foreground */
    --background: 0 0% 100%;
    --foreground: 0 0% 9%;

    /* Card */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 9%;

    /* Muted */
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;

    /* Accent */
    --accent: 0 0% 96%;
    --accent-foreground: 0 0% 9%;

    /* Border & Ring */
    --border: 0 0% 90%;
    --ring: 0 72% 48%;

    /* Hive Brand Colors */
    --hive-red: 350 82% 48%;
    --hive-dark: 0 0% 10%;
  }

  .dark {
    --background: 0 0% 7%;
    --foreground: 0 0% 95%;

    --card: 0 0% 10%;
    --card-foreground: 0 0% 95%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 65%;

    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 95%;

    --border: 0 0% 20%;
    --ring: 0 72% 48%;
  }
}`,
  tailwindConfig: `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hive brand colors
        hive: {
          red: "hsl(var(--hive-red))",
          dark: "hsl(var(--hive-dark))",
        },
        // Semantic colors
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;`,
  themeProvider: `"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Determine resolved theme
    let resolved: "light" | "dark";
    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      resolved = theme;
    }

    // Apply theme class
    root.classList.add(resolved);
    setResolvedTheme(resolved);

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
      setResolvedTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}`,
  themeToggle: `"use client";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <button
        onClick={() => setTheme("light")}
        className={\`rounded-md p-2 transition-colors \${
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }\`}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={\`rounded-md p-2 transition-colors \${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }\`}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={\`rounded-md p-2 transition-colors \${
          theme === "system"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }\`}
        title="System preference"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}`,
  customTheme: `/* Custom Hive-inspired theme */
:root {
  /* Primary - Hive Red */
  --primary: 350 82% 48%;
  --primary-foreground: 0 0% 100%;

  /* Secondary - Hive Dark */
  --secondary: 0 0% 15%;
  --secondary-foreground: 0 0% 95%;

  /* Success - For positive actions */
  --success: 142 76% 36%;
  --success-foreground: 0 0% 100%;

  /* Warning - For caution states */
  --warning: 38 92% 50%;
  --warning-foreground: 0 0% 0%;

  /* Destructive - For errors/dangers */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  /* Border radius */
  --radius: 0.5rem;
}`,
  usingColors: `// Using semantic colors in components
<div className="bg-background text-foreground">
  <div className="border border-border rounded-lg p-4">
    <h2 className="text-foreground">Title</h2>
    <p className="text-muted-foreground">Description</p>
  </div>
</div>

// Using Hive brand colors
<button className="bg-hive-red text-white hover:bg-hive-red/90">
  Vote
</button>

// Using card styles
<div className="bg-card text-card-foreground rounded-lg p-6 border">
  Card content
</div>`,
  componentTheming: `// Example: Themed VoteButton
interface VoteButtonProps {
  variant?: "default" | "outline" | "ghost";
  // ...other props
}

export function VoteButton({ variant = "default" }: VoteButtonProps) {
  const baseStyles = "inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors";

  const variants = {
    default: "bg-hive-red text-white hover:bg-hive-red/90",
    outline: "border border-hive-red text-hive-red hover:bg-hive-red/10",
    ghost: "text-hive-red hover:bg-hive-red/10",
  };

  return (
    <button className={\`\${baseStyles} \${variants[variant]}\`}>
      {/* ... */}
    </button>
  );
}`,
};

export default async function ThemingPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theming</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Customize the look and feel of Hive UI components.
        </p>
      </div>

      {/* Introduction */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">CSS Variables</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive UI uses CSS variables for theming. This allows you to easily
              customize colors, spacing, and other design tokens without modifying
              component code. The system supports both light and dark modes.
            </p>
          </div>
        </div>
      </section>

      {/* Color Palette Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
        <p className="text-muted-foreground mb-4">
          Hive UI includes semantic colors that adapt to light/dark mode:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Hive Red */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="h-16 bg-hive-red" />
            <div className="p-3">
              <p className="font-semibold text-sm">Hive Red</p>
              <p className="text-xs text-muted-foreground">#E31337</p>
              <p className="text-xs text-muted-foreground mt-1">Primary brand color</p>
            </div>
          </div>

          {/* Background */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="h-16 bg-background border-b border-border" />
            <div className="p-3">
              <p className="font-semibold text-sm">Background</p>
              <p className="text-xs text-muted-foreground">--background</p>
              <p className="text-xs text-muted-foreground mt-1">Page background</p>
            </div>
          </div>

          {/* Foreground */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="h-16 bg-foreground" />
            <div className="p-3">
              <p className="font-semibold text-sm">Foreground</p>
              <p className="text-xs text-muted-foreground">--foreground</p>
              <p className="text-xs text-muted-foreground mt-1">Text color</p>
            </div>
          </div>

          {/* Muted */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="h-16 bg-muted" />
            <div className="p-3">
              <p className="font-semibold text-sm">Muted</p>
              <p className="text-xs text-muted-foreground">--muted</p>
              <p className="text-xs text-muted-foreground mt-1">Subtle backgrounds</p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="h-16 bg-card border-b border-border" />
            <div className="p-3">
              <p className="font-semibold text-sm">Card</p>
              <p className="text-xs text-muted-foreground">--card</p>
              <p className="text-xs text-muted-foreground mt-1">Card backgrounds</p>
            </div>
          </div>

          {/* Border */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="h-16 bg-border" />
            <div className="p-3">
              <p className="font-semibold text-sm">Border</p>
              <p className="text-xs text-muted-foreground">--border</p>
              <p className="text-xs text-muted-foreground mt-1">Border color</p>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Variables */}
      <section>
        <h2 className="text-xl font-semibold mb-4">CSS Variables</h2>
        <p className="text-muted-foreground mb-4">
          Add these CSS variables to your <code>globals.css</code>:
        </p>

        <CodeBlock filename="app/globals.css" code={CODE.cssVariables} language="css" />
      </section>

      {/* Tailwind Config */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tailwind Configuration</h2>
        <p className="text-muted-foreground mb-4">
          Configure Tailwind to use the CSS variables:
        </p>

        <CodeBlock
          filename="tailwind.config.ts"
          code={CODE.tailwindConfig}
          language="typescript"
        />
      </section>

      {/* Dark Mode */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Dark Mode</h2>
        <p className="text-muted-foreground mb-4">
          Hive UI supports dark mode out of the box. The theme is controlled by
          adding <code>dark</code> class to the <code>&lt;html&gt;</code> element.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">Light Mode</span>
            </div>
            <div className="p-4 bg-white text-zinc-900">
              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="font-semibold">Card Title</p>
                <p className="text-sm text-zinc-500">Card description text</p>
                <button className="mt-3 rounded bg-[#E31337] px-3 py-1.5 text-sm text-white">
                  Action
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <div className="p-4 bg-[#111] text-zinc-100">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <p className="font-semibold">Card Title</p>
                <p className="text-sm text-zinc-400">Card description text</p>
                <button className="mt-3 rounded bg-[#E31337] px-3 py-1.5 text-sm text-white">
                  Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Provider */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Theme Provider</h2>
        <p className="text-muted-foreground mb-4">
          Create a theme provider to manage dark/light mode switching:
        </p>

        <CodeBlock
          filename="components/theme-provider.tsx"
          code={CODE.themeProvider}
          language="typescript"
        />
      </section>

      {/* Theme Toggle */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Theme Toggle Component</h2>
        <p className="text-muted-foreground mb-4">
          A simple toggle component for switching themes:
        </p>

        <CodeBlock
          filename="components/theme-toggle.tsx"
          code={CODE.themeToggle}
          language="typescript"
        />

        {/* Preview */}
        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-3">Preview:</p>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 w-fit">
            <button className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Sun className="h-4 w-4" />
            </button>
            <button className="rounded-md p-2 bg-background text-foreground shadow-sm transition-colors">
              <Moon className="h-4 w-4" />
            </button>
            <button className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Palette className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Custom Theme */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Theme</h2>
        <p className="text-muted-foreground mb-4">
          Extend the default theme with additional colors:
        </p>

        <CodeBlock filename="app/globals.css" code={CODE.customTheme} language="css" />
      </section>

      {/* Using Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Using Theme Colors</h2>
        <p className="text-muted-foreground mb-4">
          Use the semantic color classes in your components:
        </p>

        <CodeBlock code={CODE.usingColors} language="tsx" />
      </section>

      {/* Component Theming */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component Variants</h2>
        <p className="text-muted-foreground mb-4">
          Create themed variants for Hive UI components:
        </p>

        <CodeBlock code={CODE.componentTheming} language="typescript" />

        {/* Button Variants Preview */}
        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground mb-3">Button variants:</p>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90">
              Default
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-hive-red px-4 py-2 text-sm font-medium text-hive-red transition-colors hover:bg-hive-red/10">
              Outline
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-hive-red transition-colors hover:bg-hive-red/10">
              Ghost
            </button>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Best Practices</h2>
        </div>

        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Use semantic colors:</strong> Prefer <code>bg-background</code>{" "}
              over <code>bg-white</code> for automatic dark mode support.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Consistent spacing:</strong> Use Tailwind&apos;s spacing scale
              for consistent padding and margins.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Brand colors sparingly:</strong> Use Hive Red for primary
              actions and accents, not for large areas.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Test both modes:</strong> Always verify your UI looks good in
              both light and dark modes.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Accessibility:</strong> Ensure sufficient contrast ratios,
              especially for text on colored backgrounds.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/keychain-login"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Components
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/hooks/use-hive-chain"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Hooks
          </Link>
        </div>
      </section>
    </article>
  );
}
