import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { UsageTabs } from "@/components/usage-tabs";
import { FrameworkSelector } from "@/components/framework-selector";
import { parseFramework } from "@/lib/framework";

const CODE = {
  reactBasic: `import { HiveProvider } from "@kkocot/honeycomb-react";

function App() {
  return (
    <HiveProvider
      apiEndpoints={[
        "https://api.hive.blog",
        "https://api.openhive.network",
        "https://api.syncad.com",
      ]}
      timeout={5000}
      healthCheckInterval={30000}
      onEndpointChange={(ep) => console.log("Switched to:", ep)}
    >
      <YourApp />
    </HiveProvider>
  );
}`,
  reactNextjs: `// app/providers.tsx
"use client";

import { HiveProvider } from "@kkocot/honeycomb-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HiveProvider
      apiEndpoints={[
        "https://api.hive.blog",
        "https://api.openhive.network",
        "https://api.syncad.com",
      ]}
      timeout={5000}
      healthCheckInterval={30000}
      onEndpointChange={(ep) => console.log("Switched to:", ep)}
    >
      {children}
    </HiveProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
  solidBasic: `import { HiveProvider, useHive } from "@kkocot/honeycomb-solid";

function App() {
  return (
    <HiveProvider
      apiEndpoints={[
        "https://api.hive.blog",
        "https://api.openhive.network",
        "https://api.syncad.com",
      ]}
      timeout={5000}
      healthCheckInterval={30000}
    >
      <MyComponent />
    </HiveProvider>
  );
}

function MyComponent() {
  const { chain, isLoading, error } = useHive();

  // Note: chain(), isLoading(), error() are signal getters in Solid!
  return (
    <div>
      {isLoading() ? "Loading..." : "Connected!"}
      {error() && <p>Error: {error()}</p>}
    </div>
  );
}`,
  vueBasic: `<template>
  <HiveProvider
    :api-endpoints="endpoints"
    :timeout="5000"
    :health-check-interval="30000"
    :on-endpoint-change="onEndpointChange"
  >
    <MyComponent />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider } from "@kkocot/honeycomb-vue";
import MyComponent from "./MyComponent.vue";

const endpoints = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://api.syncad.com",
];

const onEndpointChange = (ep: string) => console.log("Switched to:", ep);
</script>`,
  vueChild: `<template>
  <div>
    <p v-if="isLoading">Connecting...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <p v-else>Connected to {{ apiEndpoint }}</p>
  </div>
</template>

<script setup lang="ts">
import { useHive } from "@kkocot/honeycomb-vue";

const { chain, isLoading, error, status, apiEndpoint } = useHive();
</script>`,
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HiveProviderPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const framework = parseFramework(params.framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveProvider</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connects your app to the Hive blockchain with automatic endpoint fallback and health monitoring.
        </p>
      </div>

      {/* Framework Selector */}
      <section>
        <Suspense>
          <FrameworkSelector activeFramework={framework} />
        </Suspense>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>

        {framework === "react" && (
          <UsageTabs
            tabs={[
              { id: "react-basic", label: "React", content: <CodeBlock code={CODE.reactBasic} language="tsx" /> },
              { id: "react-nextjs", label: "Next.js", content: <CodeBlock code={CODE.reactNextjs} language="tsx" /> },
            ]}
          />
        )}

        {framework === "solid" && (
          <div className="space-y-4">
            <CodeBlock code={CODE.solidBasic} language="tsx" />
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-500">Solid.js Signal Getters</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    In Solid.js, <code>chain()</code>, <code>isLoading()</code>, and <code>error()</code> are
                    signal getters. Call them as functions to access reactive values.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {framework === "vue" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Provider Component</h3>
              <CodeBlock code={CODE.vueBasic} language="vue" filename="App.vue" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Child Component</h3>
              <CodeBlock code={CODE.vueChild} language="vue" filename="MyComponent.vue" />
            </div>
          </div>
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
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>apiEndpoints</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string[]</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>DEFAULT_API_ENDPOINTS</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  API endpoints in priority order
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>timeout</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>number</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>5000</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Request timeout in ms
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>healthCheckInterval</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>number</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>30000</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Health check interval in ms (0 = disabled)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onEndpointChange</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(endpoint: string) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>undefined</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Called when active endpoint changes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Default Endpoints */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Default Endpoints</h2>
        <p className="text-muted-foreground mb-4">
          When no <code>apiEndpoints</code> prop is provided, these endpoints are used (in priority order):
        </p>
        <div className="rounded-lg border border-border p-4 font-mono text-sm">
          <div>https://api.hive.blog</div>
          <div>https://api.openhive.network</div>
          <div>https://api.syncad.com</div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/project-structure"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Project Structure
        </Link>
        <Link
          href="/api-nodes"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          API Nodes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
