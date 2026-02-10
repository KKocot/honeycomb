import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeft, ArrowRight, Info, Moon, Sun } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CSS_VARIABLES = [
  // Brand
  { name: "--hive-red", light: "350 82% 48%", dark: "350 82% 48%", desc: "Brand primary color", section: "Brand" },
  { name: "--hive-dark", light: "0 0% 10%", dark: "0 0% 10%", desc: "Brand dark color", section: "Brand" },

  // Layout
  { name: "--hive-background", light: "0 0% 100%", dark: "0 0% 7%", desc: "Page background", section: "Layout" },
  { name: "--hive-foreground", light: "0 0% 9%", dark: "0 0% 95%", desc: "Primary text color", section: "Layout" },
  { name: "--hive-border", light: "0 0% 90%", dark: "0 0% 20%", desc: "Border color", section: "Layout" },
  { name: "--hive-ring", light: "350 82% 48%", dark: "350 82% 48%", desc: "Focus ring color", section: "Layout" },

  // Card
  { name: "--hive-card", light: "0 0% 100%", dark: "0 0% 10%", desc: "Card background", section: "Card" },
  { name: "--hive-card-foreground", light: "0 0% 9%", dark: "0 0% 95%", desc: "Card text color", section: "Card" },

  // Popover
  { name: "--hive-popover", light: "0 0% 100%", dark: "0 0% 10%", desc: "Popover background", section: "Popover" },
  { name: "--hive-popover-foreground", light: "0 0% 9%", dark: "0 0% 95%", desc: "Popover text color", section: "Popover" },

  // Muted
  { name: "--hive-muted", light: "0 0% 96%", dark: "0 0% 15%", desc: "Muted background", section: "Muted" },
  { name: "--hive-muted-foreground", light: "0 0% 45%", dark: "0 0% 65%", desc: "Muted text color", section: "Muted" },

  // Status
  { name: "--hive-success", light: "142 76% 36%", dark: "142 71% 45%", desc: "Success state (connected, healthy)", section: "Status" },
  { name: "--hive-warning", light: "38 92% 50%", dark: "48 96% 53%", desc: "Warning state (connecting, reconnecting)", section: "Status" },
  { name: "--hive-destructive", light: "0 84% 60%", dark: "0 63% 31%", desc: "Destructive state (error, disconnected)", section: "Status" },
  { name: "--hive-destructive-foreground", light: "0 0% 100%", dark: "0 0% 95%", desc: "Destructive text color", section: "Status" },
];

const CODE = {
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

export default async function ThemingPage() {
  const sections = ["Brand", "Layout", "Card", "Popover", "Muted", "Status"];

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theming</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Customize Hive UI components with CSS variables and Tailwind CSS.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">CSS Variables Required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive UI uses CSS variables with <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded">--hive-*</code> prefix. You must define these in your <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded">globals.css</code> for components to work correctly.
            </p>
          </div>
        </div>
      </section>

      {/* All CSS Variables */}
      <section>
        <h2 className="text-xl font-semibold mb-4">CSS Variables Reference</h2>
        <p className="text-muted-foreground mb-4">
          Complete list of CSS variables used by Hive UI components. All values are in HSL format (H S% L%).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Variable</th>
                <th className="py-3 px-4 text-left font-semibold">Light</th>
                <th className="py-3 px-4 text-left font-semibold">Dark</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <Fragment key={section}>
                  <tr className="bg-muted/50">
                    <td colSpan={4} className="py-2 px-4 font-semibold text-xs uppercase tracking-wide">
                      {section}
                    </td>
                  </tr>
                  {CSS_VARIABLES.filter((v) => v.section === section).map((v) => (
                    <tr key={v.name} className="border-b border-border">
                      <td className="py-3 px-4">
                        <code className="text-hive-red text-xs">{v.name}</code>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{v.light}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{v.dark}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{v.desc}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dark Mode Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Dark Mode</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">Light</span>
            </div>
            <div className="p-4 bg-white text-zinc-900">
              <div className="rounded-lg border border-zinc-200 p-3">
                <p className="font-medium text-sm">Card</p>
                <p className="text-xs text-zinc-500">Description</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">Dark</span>
            </div>
            <div className="p-4 bg-zinc-950 text-zinc-100">
              <div className="rounded-lg border border-zinc-800 p-3">
                <p className="font-medium text-sm">Card</p>
                <p className="text-xs text-zinc-400">Description</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* globals.css */}
      <section>
        <h2 className="text-xl font-semibold mb-4">globals.css</h2>
        <CodeBlock code={CODE.cssVariables} language="css" />
      </section>

      {/* Tailwind Config */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tailwind Config</h2>
        <CodeBlock code={CODE.tailwindConfig} language="typescript" />
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
        <p className="text-muted-foreground mb-4">
          How to use Hive UI color variables in your components.
        </p>
        <CodeBlock code={CODE.usage} language="tsx" />
      </section>

      {/* Customization */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Customization</h2>
        <p className="text-muted-foreground mb-4">
          Override any variable in your application to customize the theme.
        </p>
        <CodeBlock code={CODE.customization} language="css" />
      </section>

      {/* Component Variables Mapping */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component Variables</h2>
        <p className="text-muted-foreground mb-4">
          Which components use which CSS variables.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Component</th>
                <th className="py-3 px-4 text-left font-semibold">Variables Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 font-mono text-xs">ApiTracker</td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">--hive-card</code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">--hive-border</code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">--hive-foreground</code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">--hive-muted</code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">--hive-popover</code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">--hive-success</code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">--hive-warning</code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded">--hive-destructive</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between pt-4">
        <Link
          href="/react/hooks"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-hive-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Hooks
        </Link>
        <Link
          href="/components/avatar"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Avatar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
