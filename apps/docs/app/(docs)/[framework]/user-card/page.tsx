import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";

const CODE = {
  react: `import { UserCard } from "@barddev/honeycomb-react";

function ProfilePage() {
  return (
    <div className="max-w-md">
      <UserCard username="blocktrades" />
    </div>
  );
}`,
  solid: `import { UserCard } from "@kkocot/honeycomb-solid";

function ProfilePage() {
  return (
    <div class="max-w-md">
      <UserCard username="blocktrades" />
    </div>
  );
}`,
  vue: `<template>
  <div class="max-w-md">
    <UserCard username="blocktrades" />
  </div>
</template>

<script setup>
import { UserCard } from "@barddev/honeycomb-vue";
</script>`,
  variants: {
    react: `// Compact - inline display
<UserCard username="blocktrades" variant="compact" />

// Default - card with basic info
<UserCard username="blocktrades" variant="default" />

// Expanded - full profile card with cover image
<UserCard username="blocktrades" variant="expanded" />`,
    solid: `// Compact - inline display
<UserCard username="blocktrades" variant="compact" />

// Default - card with basic info
<UserCard username="blocktrades" variant="default" />

// Expanded - full profile card with cover image
<UserCard username="blocktrades" variant="expanded" />`,
    vue: `<template>
  <!-- Compact - inline display -->
  <UserCard username="blocktrades" variant="compact" />

  <!-- Default - card with basic info -->
  <UserCard username="blocktrades" variant="default" />

  <!-- Expanded - full profile card with cover image -->
  <UserCard username="blocktrades" variant="expanded" />
</template>`,
  },
  withoutStats: {
    react: `// Hide post count and balances
<UserCard username="blocktrades" showStats={false} />`,
    solid: `// Hide post count and balances
<UserCard username="blocktrades" showStats={false} />`,
    vue: `<template>
  <!-- Hide post count and balances -->
  <UserCard username="blocktrades" :showStats="false" />
</template>`,
  },
  customStyle: {
    react: `<UserCard
  username="blocktrades"
  className="bg-hive-red/10 border-hive-red"
/>`,
    solid: `<UserCard
  username="blocktrades"
  class="bg-hive-red/10 border-hive-red"
/>`,
    vue: `<template>
  <UserCard
    username="blocktrades"
    class="bg-hive-red/10 border-hive-red"
  />
</template>`,
  },
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function UserCardPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UserCard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive user profile information in various formats.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">User Data</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches user data from blockchain. Displays profile info,
              reputation, and optionally Hive Power and post count.
            </p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        {framework === "react" && (
          <CodeBlock code={CODE.react} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.solid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.vue} language="vue" />
        )}
      </section>

      {/* Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border p-6">
          <div className="max-w-md space-y-4">
            {/* Compact preview */}
            <div className="flex items-center gap-2">
              <img
                src="https://images.hive.blog/u/blocktrades/avatar"
                alt="@blocktrades"
                className="h-8 w-8 rounded-full"
              />
              <div>
                <span className="font-medium">@blocktrades</span>
                <span className="text-muted-foreground text-sm ml-1">
                  (65)
                </span>
              </div>
            </div>

            {/* Default preview */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.hive.blog/u/blocktrades/avatar"
                  alt="@blocktrades"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">blocktrades</h3>
                  <p className="text-sm text-muted-foreground">
                    @blocktrades &bull; Rep: 65
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <span>42 posts</span>
                <span>1,234.567 HP</span>
              </div>
            </div>
          </div>
        </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>username</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>variant</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>
                    &quot;compact&quot; | &quot;default&quot; |
                    &quot;expanded&quot;
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;default&quot;</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>showStats</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>true</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>className</code> / <code>class</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
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
            <h3 className="text-sm font-medium mb-2">Variants</h3>
            {framework === "react" && (
              <CodeBlock code={CODE.variants.react} language="tsx" />
            )}
            {framework === "solid" && (
              <CodeBlock code={CODE.variants.solid} language="tsx" />
            )}
            {framework === "vue" && (
              <CodeBlock code={CODE.variants.vue} language="vue" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Without stats</h3>
            {framework === "react" && (
              <CodeBlock code={CODE.withoutStats.react} language="tsx" />
            )}
            {framework === "solid" && (
              <CodeBlock code={CODE.withoutStats.solid} language="tsx" />
            )}
            {framework === "vue" && (
              <CodeBlock code={CODE.withoutStats.vue} language="vue" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Custom styling</h3>
            {framework === "react" && (
              <CodeBlock code={CODE.customStyle.react} language="tsx" />
            )}
            {framework === "solid" && (
              <CodeBlock code={CODE.customStyle.solid} language="tsx" />
            )}
            {framework === "vue" && (
              <CodeBlock code={CODE.customStyle.vue} language="vue" />
            )}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/avatar`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Avatar
        </Link>
        <Link
          href={`/${framework}/balance-card`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Balance Card
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
