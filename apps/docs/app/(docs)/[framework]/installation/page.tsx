import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Steps, Step } from "@/components/steps";
import { UsageTabs } from "@/components/usage-tabs";
import { parseFramework } from "@/lib/framework";

const PACKAGES = {
  react: "@barddev/honeycomb-react",
  solid: "@barddev/honeycomb-solid",
  vue: "@barddev/honeycomb-vue",
  svelte: "@barddev/honeycomb-svelte",
} as const;

const pmCommands = (pkg: string) => ({
  npm: `npm install ${pkg}`,
  pnpm: `pnpm add ${pkg}`,
  yarn: `yarn add ${pkg}`,
  bun: `bun add ${pkg}`,
});

const SOLID_PEER_DEPS = "@hiveio/wax solid-js tailwindcss @tailwindcss/vite";

const solid_peer_commands = {
  npm: `npm install ${SOLID_PEER_DEPS}`,
  pnpm: `pnpm add ${SOLID_PEER_DEPS}`,
  yarn: `yarn add ${SOLID_PEER_DEPS}`,
  bun: `bun add ${SOLID_PEER_DEPS}`,
};

const CODE = {
  react: {
    provider: `"use client";

import { HiveProvider } from "@barddev/honeycomb-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HiveProvider>
      {children}
    </HiveProvider>
  );
}`,
    layout: `import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
    usage: `import { useHive } from "@barddev/honeycomb-react";

function MyComponent() {
  const { chain, is_loading, error } = useHive();

  if (is_loading) return <p>Connecting...</p>;
  if (error) return <p>Error: {error}</p>;

  return <p>Connected!</p>;
}`,
  },
  solid: {
    provider: `import { HiveProvider } from "@barddev/honeycomb-solid";

function App() {
  return (
    <HiveProvider>
      <MyComponent />
    </HiveProvider>
  );
}`,
    usage: `import { useHive } from "@barddev/honeycomb-solid";

function MyComponent() {
  const { chain, is_loading, error } = useHive();

  return (
    <div>
      {is_loading() ? "Connecting..." : "Connected!"}
      {error() && <p>Error: {error()}</p>}
    </div>
  );
}`,
    styles_entry: `// Entry file (index.tsx or app.tsx)
import "@barddev/honeycomb-solid/base.css";
import "./app.css";`,
    styles_css: `/* app.css */
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
    dark_mode: `<html lang="en" class="dark">
  <body class="min-h-screen antialiased bg-hive-background text-hive-foreground">`,
    vite_config: `// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), solid()],
  optimizeDeps: {
    exclude: ["@hiveio/wax"],
  },
});`,
    astro_config: `// astro.config.mjs
import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { wasmUrlPlugin } from "@barddev/honeycomb-solid/plugins";

export default defineConfig({
  integrations: [solid()],
  vite: {
    plugins: [tailwindcss(), wasmUrlPlugin()],
  },
});`,
    solid_start_config: `// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { wasmUrlPlugin } from "@barddev/honeycomb-solid/plugins";

export default defineConfig({
  ssr: true,
  vite: {
    plugins: [tailwindcss(), wasmUrlPlugin()],
    resolve: {
      conditions: ["solid", "browser", "module"],
    },
    optimizeDeps: {
      exclude: ["@hiveio/wax"],
    },
    ssr: {
      noExternal: ["@barddev/honeycomb-solid"],
    },
  },
});`,
  },
  vue: {
    provider: `<template>
  <HiveProvider>
    <router-view />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider } from "@barddev/honeycomb-vue";
</script>`,
    usage: `<template>
  <div>
    <p v-if="is_loading">Connecting...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <p v-else>Connected!</p>
  </div>
</template>

<script setup lang="ts">
import { useHive } from "@barddev/honeycomb-vue";

const { chain, is_loading, error } = useHive();
</script>`,
  },
  svelte: {
    provider: `<script lang="ts">
  import { HiveProvider } from "@barddev/honeycomb-svelte";
  import "@barddev/honeycomb-svelte/styles.css";
</script>

<HiveProvider>
  <slot />
</HiveProvider>`,
    usage: `<script lang="ts">
  import { useHive } from "@barddev/honeycomb-svelte";

  const hive = useHive();
</script>

{#if hive.is_loading}
  <p>Connecting...</p>
{:else if hive.error}
  <p>Error: {hive.error}</p>
{:else}
  <p>Connected!</p>
{/if}`,
    vite_config: `// vite.config.ts
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
});`,
    sveltekit_config: `// svelte.config.js
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  kit: { adapter: adapter() },
};`,
  },
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function InstallationPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  const pkg = PACKAGES[framework];

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          How to install and set up Honeycomb in your project.
        </p>
      </div>

      {/* Steps */}
      <section>
        <Steps>
          <Step title="Install the package">
            <p className="mb-3">
              Install <code>{pkg}</code> via your preferred package manager:
            </p>
            <UsageTabs
              tabs={Object.entries(pmCommands(pkg)).map(([pm, cmd]) => ({
                id: `${framework}-${pm}`,
                label: pm,
                content: <CodeBlock code={cmd} language="bash" />,
              }))}
            />
          </Step>

          {framework === "solid" && (
            <Step title="Install peer dependencies">
              <p className="mb-3">
                Solid package requires additional peer dependencies.{" "}
                <code>@kobalte/core</code> is optional (only needed for{" "}
                <code>ApiTracker</code>).
              </p>
              <UsageTabs
                tabs={Object.entries(solid_peer_commands).map(([pm, cmd]) => ({
                  id: `solid-peer-${pm}`,
                  label: pm,
                  content: <CodeBlock code={cmd} language="bash" />,
                }))}
              />
            </Step>
          )}

          <Step title="Wrap your app with HiveProvider">
            {framework === "react" && (
              <div className="space-y-4">
                <p className="mb-3">
                  Create a providers file and wrap your root layout:
                </p>
                <CodeBlock filename="app/providers.tsx" code={CODE.react.provider} language="tsx" />
                <CodeBlock filename="app/layout.tsx" code={CODE.react.layout} language="tsx" />
              </div>
            )}
            {framework === "solid" && (
              <div className="space-y-4">
                <p className="mb-3">
                  Wrap your app with <code>HiveProvider</code>:
                </p>
                <CodeBlock filename="App.tsx" code={CODE.solid.provider} language="tsx" />
              </div>
            )}
            {framework === "vue" && (
              <div className="space-y-4">
                <p className="mb-3">
                  Wrap your app with <code>HiveProvider</code>:
                </p>
                <CodeBlock filename="App.vue" code={CODE.vue.provider} language="vue" />
              </div>
            )}
            {framework === "svelte" && (
              <div className="space-y-4">
                <p className="mb-3">
                  Wrap your app with <code>HiveProvider</code>:
                </p>
                <CodeBlock filename="+layout.svelte" code={CODE.svelte.provider} language="svelte" />
              </div>
            )}
          </Step>

          {framework === "solid" && (
            <Step title="Set up styles">
              <div className="space-y-4">
                <p className="mb-3">
                  Import the component styles and configure Tailwind CSS with
                  Honeycomb theme tokens:
                </p>
                <CodeBlock filename="index.tsx" code={CODE.solid.styles_entry} language="tsx" />
                <CodeBlock filename="app.css" code={CODE.solid.styles_css} language="css" />
              </div>
            </Step>
          )}

          {framework === "solid" && (
            <Step title="Configure dark mode">
              <div className="space-y-4">
                <p className="mb-3">
                  Add the <code>dark</code> class to <code>{"<html>"}</code> and
                  apply base background/foreground utilities to{" "}
                  <code>{"<body>"}</code>:
                </p>
                <CodeBlock filename="index.html" code={CODE.solid.dark_mode} language="html" />
              </div>
            </Step>
          )}

          <Step title="Use in your components">
            {framework === "react" && (
              <CodeBlock filename="components/MyComponent.tsx" code={CODE.react.usage} language="tsx" />
            )}
            {framework === "solid" && (
              <CodeBlock filename="components/MyComponent.tsx" code={CODE.solid.usage} language="tsx" />
            )}
            {framework === "vue" && (
              <CodeBlock filename="components/MyComponent.vue" code={CODE.vue.usage} language="vue" />
            )}
            {framework === "svelte" && (
              <CodeBlock filename="components/MyComponent.svelte" code={CODE.svelte.usage} language="svelte" />
            )}
          </Step>
        </Steps>
      </section>

      {/* API Nodes */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">API Nodes</h2>
        <p className="text-muted-foreground mb-4">
          By default, HiveProvider connects to public Hive API nodes with automatic
          fallback. You can customize the endpoint list — see{" "}
          <Link href={`/${framework}/hive-provider`} className="text-hive-red hover:underline">
            HiveProvider
          </Link>{" "}
          and{" "}
          <Link href={`/${framework}/api-tracker`} className="text-hive-red hover:underline">
            API Tracker
          </Link>{" "}
          for details.
        </p>

        <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 p-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500">Production</p>
            <p className="text-muted-foreground mt-1">
              Public nodes may have rate limits. For production apps, consider running
              your own node or using a dedicated RPC provider.
            </p>
          </div>
        </div>
      </section>

      {/* Framework Guides (Solid only) */}
      {framework === "solid" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Framework Guides</h2>
          <p className="text-muted-foreground mb-6">
            Configuration varies by meta-framework. Pick your setup below.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">Vite</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Standard SPA setup with Solid and Tailwind plugins.
              </p>
              <CodeBlock filename="vite.config.ts" code={CODE.solid.vite_config} language="ts" />
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">Astro</h3>
              <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 p-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Use <code>client:only=&quot;solid-js&quot;</code> instead of{" "}
                  <code>client:load</code>. WASM modules require the{" "}
                  <code>wasmUrlPlugin()</code>.
                </p>
              </div>
              <CodeBlock filename="astro.config.mjs" code={CODE.solid.astro_config} language="js" />
              <p className="mt-2 text-xs text-muted-foreground">
                wasmUrlPlugin is required for projects installed from npm.
                Monorepo demo apps may work without it due to Vite workspace
                resolution.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">SolidStart</h3>
              <div className="flex items-start gap-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 p-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Use <code>clientOnly()</code> from{" "}
                  <code>@solidjs/start</code>. Add{" "}
                  <code>ssr.noExternal</code> for the package.
                </p>
              </div>
              <CodeBlock filename="app.config.ts" code={CODE.solid.solid_start_config} language="ts" />
              <p className="mt-2 text-xs text-muted-foreground">
                wasmUrlPlugin is required for projects installed from npm.
                Monorepo demo apps may work without it due to Vite workspace
                resolution.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Framework Guides (Svelte only) */}
      {framework === "svelte" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Framework Guides</h2>
          <p className="text-muted-foreground mb-6">
            Configuration varies by meta-framework. Pick your setup below.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">Vite</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Standard SPA setup with Svelte plugin.
              </p>
              <CodeBlock filename="vite.config.ts" code={CODE.svelte.vite_config} language="ts" />
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold mb-3">SvelteKit</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Full-stack meta-framework with SSR support.
              </p>
              <CodeBlock filename="svelte.config.js" code={CODE.svelte.sveltekit_config} language="js" />
            </div>
          </div>
        </section>
      )}

      {/* What's Next */}
      <section>
        <h2 className="text-xl font-semibold mb-4">What&apos;s Next?</h2>
        <p className="text-muted-foreground mb-4">
          Now that you have Honeycomb set up, you can start adding components:
        </p>

        <div className="flex gap-4">
          <Link
            href={`/${framework}/avatar`}
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Browse Components
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${framework}/hive-provider`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            HiveProvider docs
          </Link>
        </div>
      </section>
    </article>
  );
}
