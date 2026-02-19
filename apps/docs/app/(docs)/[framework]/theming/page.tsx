import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeft, ArrowRight, Info, Moon, Sun } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";
import { CSS_VARIABLES, CODE } from "./theming_data";

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function ThemingPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  const sections = ["Brand", "Layout", "Card", "Popover", "Muted", "Status"];

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theming</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Customize Honeycomb components with CSS variables and Tailwind CSS.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">CSS Variables Required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Honeycomb uses CSS variables with{" "}
              <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded">
                --hive-*
              </code>{" "}
              prefix. You must define these in your{" "}
              <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded">
                globals.css
              </code>{" "}
              for components to work correctly.
            </p>
          </div>
        </div>
      </section>

      {/* All CSS Variables */}
      <section>
        <h2 className="text-xl font-semibold mb-4">CSS Variables Reference</h2>
        <p className="text-muted-foreground mb-4">
          Complete list of CSS variables used by Honeycomb components. All values
          are in HSL format (H S% L%).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Variable</th>
                <th className="py-3 px-4 text-left font-semibold">Light</th>
                <th className="py-3 px-4 text-left font-semibold">Dark</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <Fragment key={section}>
                  <tr className="bg-muted/50">
                    <td
                      colSpan={4}
                      className="py-2 px-4 font-semibold text-xs uppercase tracking-wide"
                    >
                      {section}
                    </td>
                  </tr>
                  {CSS_VARIABLES.filter((v) => v.section === section).map(
                    (v) => (
                      <tr key={v.name} className="border-b border-border">
                        <td className="py-3 px-4">
                          <code className="text-hive-red text-xs">
                            {v.name}
                          </code>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                          {v.light}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                          {v.dark}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {v.desc}
                        </td>
                      </tr>
                    )
                  )}
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
          How to use Honeycomb color variables in your components.
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
                <th className="py-3 px-4 text-left font-semibold">
                  Component
                </th>
                <th className="py-3 px-4 text-left font-semibold">
                  Variables Used
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 font-mono text-xs">ApiTracker</td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">
                    --hive-card
                  </code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">
                    --hive-border
                  </code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">
                    --hive-foreground
                  </code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">
                    --hive-muted
                  </code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">
                    --hive-popover
                  </code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">
                    --hive-success
                  </code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded mr-2">
                    --hive-warning
                  </code>
                  <code className="text-hive-red bg-muted px-1.5 py-0.5 rounded">
                    --hive-destructive
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between pt-4">
        <Link
          href={`/${framework}/hooks`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-hive-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Hooks
        </Link>
        <Link
          href={`/${framework}/api-tracker`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          API Tracker
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
