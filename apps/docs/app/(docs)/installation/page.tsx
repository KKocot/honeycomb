import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Steps, Step } from "@/components/steps";
import { UsageTabs } from "@/components/usage-tabs";
import { FrameworkSelector } from "@/components/framework-selector";
import { parseFramework } from "@/lib/framework";

const PACKAGES = {
  react: "@kkocot/honeycomb-react",
  solid: "@kkocot/honeycomb-solid",
  vue: "@kkocot/honeycomb-vue",
} as const;

const pmCommands = (pkg: string) => ({
  npm: `npm install ${pkg}`,
  pnpm: `pnpm add ${pkg}`,
  yarn: `yarn add ${pkg}`,
  bun: `bun add ${pkg}`,
});

const CODE = {
  react: {
    provider: `"use client";

import { HiveProvider } from "@kkocot/honeycomb-react";

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
    usage: `import { useHive } from "@kkocot/honeycomb-react";

function MyComponent() {
  const { chain, isLoading, error } = useHive();

  if (isLoading) return <p>Connecting...</p>;
  if (error) return <p>Error: {error}</p>;

  return <p>Connected!</p>;
}`,
  },
  solid: {
    provider: `import { HiveProvider } from "@kkocot/honeycomb-solid";

function App() {
  return (
    <HiveProvider>
      <MyComponent />
    </HiveProvider>
  );
}`,
    usage: `import { useHive } from "@kkocot/honeycomb-solid";

function MyComponent() {
  const { chain, isLoading, error } = useHive();

  return (
    <div>
      {isLoading() ? "Connecting..." : "Connected!"}
      {error() && <p>Error: {error()}</p>}
    </div>
  );
}`,
  },
  vue: {
    provider: `<template>
  <HiveProvider>
    <router-view />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider } from "@kkocot/honeycomb-vue";
</script>`,
    usage: `<template>
  <div>
    <p v-if="isLoading">Connecting...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <p v-else>Connected!</p>
  </div>
</template>

<script setup lang="ts">
import { useHive } from "@kkocot/honeycomb-vue";

const { chain, isLoading, error } = useHive();
</script>`,
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InstallationPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const framework = parseFramework(params.framework);

  const pkg = PACKAGES[framework];

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          How to install and set up Hive UI in your project.
        </p>
      </div>

      {/* Framework Selector */}
      <section>
        <Suspense>
          <FrameworkSelector activeFramework={framework} />
        </Suspense>
      </section>

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
          </Step>

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
          </Step>
        </Steps>
      </section>

      {/* API Nodes */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">API Nodes</h2>
        <p className="text-muted-foreground mb-4">
          By default, HiveProvider connects to public Hive API nodes with automatic
          fallback. You can customize the endpoint list — see{" "}
          <Link href="/hive-provider" className="text-hive-red hover:underline">
            HiveProvider
          </Link>{" "}
          and{" "}
          <Link href="/api-nodes" className="text-hive-red hover:underline">
            API Nodes
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

      {/* What's Next */}
      <section>
        <h2 className="text-xl font-semibold mb-4">What&apos;s Next?</h2>
        <p className="text-muted-foreground mb-4">
          Now that you have Hive UI set up, you can start adding components:
        </p>

        <div className="flex gap-4">
          <Link
            href="/components/avatar"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Browse Components
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/hive-provider"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            HiveProvider docs
          </Link>
        </div>
      </section>
    </article>
  );
}
