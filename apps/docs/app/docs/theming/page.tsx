import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Moon, Sun } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CSS_VARIABLES = [
  { name: "--hive-red", light: "350 82% 48%", dark: "350 82% 48%", desc: "Brand primary" },
  { name: "--hive-dark", light: "0 0% 10%", dark: "0 0% 10%", desc: "Brand dark" },
  { name: "--hive-background", light: "0 0% 100%", dark: "0 0% 7%", desc: "Page background" },
  { name: "--hive-foreground", light: "0 0% 9%", dark: "0 0% 95%", desc: "Text color" },
  { name: "--hive-card", light: "0 0% 100%", dark: "0 0% 10%", desc: "Card background" },
  { name: "--hive-card-foreground", light: "0 0% 9%", dark: "0 0% 95%", desc: "Card text" },
  { name: "--hive-muted", light: "0 0% 96%", dark: "0 0% 15%", desc: "Muted background" },
  { name: "--hive-muted-foreground", light: "0 0% 45%", dark: "0 0% 65%", desc: "Muted text" },
  { name: "--hive-border", light: "0 0% 90%", dark: "0 0% 20%", desc: "Border color" },
  { name: "--hive-ring", light: "350 82% 48%", dark: "350 82% 48%", desc: "Focus ring" },
];

const CODE = {
  cssVariables: `@layer base {
  :root {
    --hive-red: 350 82% 48%;
    --hive-dark: 0 0% 10%;
    --hive-background: 0 0% 100%;
    --hive-foreground: 0 0% 9%;
    --hive-card: 0 0% 100%;
    --hive-card-foreground: 0 0% 9%;
    --hive-muted: 0 0% 96%;
    --hive-muted-foreground: 0 0% 45%;
    --hive-border: 0 0% 90%;
    --hive-ring: 350 82% 48%;
  }

  .dark {
    --hive-background: 0 0% 7%;
    --hive-foreground: 0 0% 95%;
    --hive-card: 0 0% 10%;
    --hive-card-foreground: 0 0% 95%;
    --hive-muted: 0 0% 15%;
    --hive-muted-foreground: 0 0% 65%;
    --hive-border: 0 0% 20%;
  }
}`,
  tailwindConfig: `// tailwind.config.ts
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        hive: {
          red: "hsl(var(--hive-red))",
          dark: "hsl(var(--hive-dark))",
          background: "hsl(var(--hive-background))",
          foreground: "hsl(var(--hive-foreground))",
          card: "hsl(var(--hive-card))",
          "card-foreground": "hsl(var(--hive-card-foreground))",
          muted: "hsl(var(--hive-muted))",
          "muted-foreground": "hsl(var(--hive-muted-foreground))",
          border: "hsl(var(--hive-border))",
          ring: "hsl(var(--hive-ring))",
        },
      },
    },
  },
};`,
  usage: `// Semantic colors - auto adapt to light/dark mode
<div className="bg-hive-background text-hive-foreground">
  <p className="text-hive-muted-foreground">Muted text</p>
</div>

// Card styling
<div className="bg-hive-card text-hive-card-foreground border-hive-border border rounded-lg p-4">
  Card content
</div>

// Hive brand colors
<button className="bg-hive-red text-white hover:bg-hive-red/90">
  Vote
</button>`,
};

export default async function ThemingPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theming</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Customize colors with CSS variables and Tailwind.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">CSS Variables</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive UI uses CSS variables for theming. Supports light and dark modes.
            </p>
          </div>
        </div>
      </section>

      {/* All CSS Variables */}
      <section>
        <h2 className="text-xl font-semibold mb-4">CSS Variables</h2>
        <p className="text-muted-foreground mb-4">
          All variables used by components. Change these to customize the look:
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
            <tbody className="divide-y divide-border">
              {CSS_VARIABLES.map((v) => (
                <tr key={v.name}>
                  <td className="py-3 px-4">
                    <code className="text-hive-red">{v.name}</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{v.light}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{v.dark}</td>
                  <td className="py-3 px-4 text-muted-foreground">{v.desc}</td>
                </tr>
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

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <CodeBlock code={CODE.usage} language="tsx" />
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/api-nodes"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          API Nodes
        </Link>
        <Link
          href="/docs/components/avatar"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Avatar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
