import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Users, Plus, Minus } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/honeycomb-react`,
  basic: `import { HiveDelegationCard } from "@kkocot/honeycomb-react";

function DelegationsPage() {
  return <HiveDelegationCard username="barddev" />;
}`,
  initialTab: `// Start on incoming tab
<HiveDelegationCard
  username="barddev"
  initialTab="incoming"
/>`,
  withCallback: `// Callback after delegation action
<HiveDelegationCard
  username="barddev"
  onSuccess={(action, delegatee, amount) => {
    console.log(\`\${action} \${amount} HP to \${delegatee}\`);
    refetchDelegations();
  }}
/>`,
  hideTabs: `// Show only outgoing
<HiveDelegationCard
  username="barddev"
  hide={["incoming"]}
/>`,
  hideAddButton: `// Hide add delegation button
<HiveDelegationCard
  username="barddev"
  hide={["addButton"]}
/>`,
  customStyle: `// Custom styling
<HiveDelegationCard
  username="barddev"
  className="max-w-lg shadow-lg"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function DelegationCardPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveDelegationCard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage HP delegations to and from other accounts.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches delegations automatically. Handles delegate/undelegate using active key from SmartSigner.
              Undelegation has a 5-day cooldown period.
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
          <div className="max-w-md mx-auto rounded-xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Delegations</h3>
                  <p className="text-sm text-muted-foreground">5,000.000 HP delegated</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-purple-500 text-white">
                <Plus className="h-4 w-4" /> Delegate
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button className="flex-1 py-2 text-sm font-medium border-b-2 border-purple-500 text-purple-500">
                Outgoing (3)
              </button>
              <button className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Incoming (2)
              </button>
            </div>

            {/* List */}
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.hive.blog/u/alice/avatar/small"
                    alt="@alice"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">@alice</p>
                    <p className="text-sm text-muted-foreground">2,500.000 HP</p>
                  </div>
                </div>
                <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                  <Minus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.hive.blog/u/bob/avatar/small"
                    alt="@bob"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">@bob</p>
                    <p className="text-sm text-muted-foreground">1,500.000 HP</p>
                  </div>
                </div>
                <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total delegated</span>
                <span className="font-medium text-red-500">-5,000.000 HP</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Total received</span>
                <span className="font-medium text-green-500">+10,000.000 HP</span>
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
                <td className="py-3 px-4"><code>username</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialTab</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"outgoing" | "incoming"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"outgoing"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("outgoing" | "incoming" | "addButton" | "summary")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(action, delegatee, amount) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
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
            <h3 className="text-sm font-medium mb-2">Initial tab</h3>
            <CodeBlock code={CODE.initialTab} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With callback</h3>
            <CodeBlock code={CODE.withCallback} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide tabs</h3>
            <CodeBlock code={CODE.hideTabs} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide add button</h3>
            <CodeBlock code={CODE.hideAddButton} language="tsx" />
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
          href="/docs/components/power-up-down"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Power Up/Down
        </Link>
        <Link
          href="/docs/components/trade-hive"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Trade Hive
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
