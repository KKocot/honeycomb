import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";

const CODE = {
  basic: {
    react: `import { ApiTracker } from "@barddev/honeycomb-react";

function App() {
  return (
    <div>
      <ApiTracker />
    </div>
  );
}`,
    solid: `import { ApiTracker } from "@kkocot/honeycomb-solid";

function App() {
  return (
    <div>
      <ApiTracker />
    </div>
  );
}`,
    vue: `<template>
  <div>
    <ApiTracker />
  </div>
</template>

<script setup lang="ts">
import { ApiTracker } from "@kkocot/honeycomb-vue";
</script>`,
  },
  showUrl: {
    react: `<ApiTracker showUrl side="bottom" />`,
    solid: `<ApiTracker showUrl side="bottom" />`,
    vue: `<ApiTracker :show-url="true" side="bottom" />`,
  },
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function ApiTrackerPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ApiTracker</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Displays current API connection status with an expandable tooltip
          showing all endpoint health details.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Health Monitoring</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ApiTracker automatically refreshes endpoint health when the
              tooltip is opened. You can also trigger a manual refresh from
              inside the tooltip.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Compact pill badge showing connection status (green/yellow/red)
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Click to expand tooltip with all endpoints and health status
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Auto-refresh on open + manual refresh button
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Health badges (Healthy/Unhealthy) and last check timestamps
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Click outside to dismiss tooltip
          </li>
        </ul>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        {framework === "react" && (
          <CodeBlock code={CODE.basic.react} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.basic.solid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.basic.vue} language="vue" />
        )}
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>className</code> / <code>class</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Additional CSS classes for the container
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>showUrl</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>false</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Show current endpoint hostname in the pill badge
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>side</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;top&quot; | &quot;bottom&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;bottom&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Popover opens above or below the pill
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">
              Show endpoint URL in pill
            </h3>
            {framework === "react" && (
              <CodeBlock code={CODE.showUrl.react} language="tsx" />
            )}
            {framework === "solid" && (
              <CodeBlock code={CODE.showUrl.solid} language="tsx" />
            )}
            {framework === "vue" && (
              <CodeBlock code={CODE.showUrl.vue} language="vue" />
            )}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/theming`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Theming
        </Link>
        <Link
          href={`/${framework}/avatar`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Avatar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
