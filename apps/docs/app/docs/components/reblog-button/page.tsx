import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Repeat, Loader2, Check } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveReblogButton } from "@kkocot/hive-ui-react";

function PostActions() {
  return (
    <HiveReblogButton
      author="barddev"
      permlink="my-first-post"
    />
  );
}`,
  withCallback: `// Optional callback after reblog
<HiveReblogButton
  author="barddev"
  permlink="my-first-post"
  onSuccess={() => console.log("Reblogged!")}
/>`,
  withLabel: `// Show text label
<HiveReblogButton
  author="barddev"
  permlink="my-first-post"
  showLabel
/>`,
  noConfirmation: `// Skip confirmation dialog
<HiveReblogButton
  author="barddev"
  permlink="my-first-post"
  showConfirmation={false}
/>`,
  variants: `// Default
<HiveReblogButton author="barddev" permlink="post" variant="default" />

// Ghost (default)
<HiveReblogButton author="barddev" permlink="post" variant="ghost" />

// Outline
<HiveReblogButton author="barddev" permlink="post" variant="outline" />`,
  sizes: `<HiveReblogButton author="barddev" permlink="post" size="sm" />
<HiveReblogButton author="barddev" permlink="post" size="md" />
<HiveReblogButton author="barddev" permlink="post" size="lg" />`,
  customStyle: `// Custom styling
<HiveReblogButton
  author="barddev"
  permlink="my-first-post"
  className="rounded-full"
  style={{ minWidth: 40 }}
/>`,
};

export default async function ReblogButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveReblogButton</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Share posts to your blog feed with a reblog action.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Automatically checks reblog status and handles transactions.
              Uses posting key from SmartSigner. Reblog is permanent and cannot be undone.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <CodeBlock code={CODE.install} language="bash" />
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <CodeBlock code={CODE.basic} language="tsx" />
      </section>

      {/* Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border p-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Ghost (default) */}
            <div className="text-center">
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-green-500">
                <Repeat className="h-4 w-4" />
              </button>
              <p className="text-xs text-muted-foreground mt-1">Default</p>
            </div>

            {/* Reblogged */}
            <div className="text-center">
              <button className="p-1.5 rounded-lg text-green-500">
                <Check className="h-4 w-4" />
              </button>
              <p className="text-xs text-muted-foreground mt-1">Reblogged</p>
            </div>

            {/* With label */}
            <div className="text-center">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground hover:border-green-500 hover:text-green-500">
                <Repeat className="h-4 w-4" />
                Reblog
              </button>
              <p className="text-xs text-muted-foreground mt-1">With label</p>
            </div>

            {/* Loading */}
            <div className="text-center">
              <button className="p-1.5 rounded-lg text-muted-foreground" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
              </button>
              <p className="text-xs text-muted-foreground mt-1">Loading</p>
            </div>

            {/* Confirmation */}
            <div className="text-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Reblog?</span>
                <button className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                  Yes
                </button>
                <button className="px-2 py-1 text-xs rounded bg-muted">
                  No
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Confirmation</p>
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
                <td className="py-3 px-4"><code>author</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>permlink</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>() =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showConfirmation</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showLabel</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"default" | "ghost" | "outline"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"ghost"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>size</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"sm" | "md" | "lg"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"md"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>className</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>style</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>React.CSSProperties</code></td>
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
            <h3 className="text-sm font-medium mb-2">With callback</h3>
            <CodeBlock code={CODE.withCallback} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With label</h3>
            <CodeBlock code={CODE.withLabel} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Without confirmation</h3>
            <CodeBlock code={CODE.noConfirmation} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Variants</h3>
            <CodeBlock code={CODE.variants} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Sizes</h3>
            <CodeBlock code={CODE.sizes} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Custom styling</h3>
            <CodeBlock code={CODE.customStyle} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/post-card"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Post Card
        </Link>
        <Link
          href="/docs/components/balance-card"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Balance Card
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
