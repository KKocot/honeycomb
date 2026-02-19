import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";

const CODE = {
  react: `import { BalanceCard } from "@barddev/honeycomb-react";

function WalletPage() {
  return <BalanceCard username="barddev" />;
}`,
  solid: `import { BalanceCard } from "@kkocot/honeycomb-solid";

function WalletPage() {
  return <BalanceCard username="barddev" />;
}`,
  vue: `<template>
  <BalanceCard username="barddev" />
</template>

<script setup lang="ts">
import { BalanceCard } from "@barddev/honeycomb-vue";
</script>`,
  variants: {
    react: `// Compact
<BalanceCard username="barddev" variant="compact" />

// Default
<BalanceCard username="barddev" />

// Expanded (with delegations and savings)
<BalanceCard username="barddev" variant="expanded" />`,
    solid: `// Compact
<BalanceCard username="barddev" variant="compact" />

// Default
<BalanceCard username="barddev" />

// Expanded (with delegations and savings)
<BalanceCard username="barddev" variant="expanded" />`,
    vue: `<template>
  <!-- Compact -->
  <BalanceCard username="barddev" variant="compact" />

  <!-- Default -->
  <BalanceCard username="barddev" />

  <!-- Expanded (with delegations and savings) -->
  <BalanceCard username="barddev" variant="expanded" />
</template>`,
  },
  customStyle: {
    react: `<BalanceCard
  username="barddev"
  className="max-w-md border-hive-red/50"
/>`,
    solid: `<BalanceCard
  username="barddev"
  class="max-w-md border-hive-red/50"
/>`,
    vue: `<template>
  <BalanceCard
    username="barddev"
    class="max-w-md border-hive-red/50"
  />
</template>`,
  },
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function BalanceCardPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">BalanceCard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive account balances including HIVE, HBD, and Hive Power.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches account balances automatically via useHiveAccount hook.
              Shows HIVE (liquid), HBD (stablecoin), and HP (staked HIVE).
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
          <div className="space-y-6">
            {/* Compact variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Compact
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">1,234.567 HIVE</span>
                <span className="text-muted-foreground">&middot;</span>
                <span className="text-muted-foreground">456.789 HBD</span>
                <span className="text-muted-foreground">&middot;</span>
                <span className="text-muted-foreground">10,000.000 HP</span>
              </div>
            </div>

            {/* Default variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Default
              </p>
              <div className="rounded-lg border border-border bg-card p-4 max-w-sm">
                <h3 className="font-semibold mb-3">@barddev Wallet</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HIVE</span>
                    <span className="font-medium">1,234.567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HBD</span>
                    <span className="font-medium">456.789</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hive Power</span>
                    <span className="font-medium">10,000.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Expanded
              </p>
              <div className="rounded-lg border border-border bg-card p-4 max-w-sm">
                <h3 className="font-semibold mb-3">@barddev Wallet</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HIVE</span>
                    <span className="font-medium">1,234.567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HBD</span>
                    <span className="font-medium">456.789</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hive Power</span>
                    <span />
                  </div>
                  <div className="pl-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Own HP</span>
                      <span className="font-medium">8,500.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-500">+ Received</span>
                      <span className="text-green-500">2,000.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-500">- Delegated</span>
                      <span className="text-red-500">500.000</span>
                    </div>
                    <div className="border-t border-border my-1" />
                    <div className="flex justify-between">
                      <span className="font-medium">Effective</span>
                      <span className="font-bold text-hive-red">
                        10,000.000
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Savings</span>
                    <span />
                  </div>
                  <div className="pl-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HIVE</span>
                      <span className="font-medium">100.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HBD</span>
                      <span className="font-medium">50.000</span>
                    </div>
                  </div>
                </div>
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
          href={`/${framework}/user-card`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          User Card
        </Link>
        <Link
          href={`/${framework}/manabar`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Manabar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
