import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, ArrowUp, ArrowDown, Zap } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HivePowerUpDown } from "@kkocot/hive-ui-react";

function StakingPage() {
  return <HivePowerUpDown />;
}`,
  initialMode: `// Start on power down tab
<HivePowerUpDown initialMode="down" />`,
  initialRecipient: `// Power up to another account
<HivePowerUpDown
  initialMode="up"
  initialRecipient="barddev"
/>`,
  withCallback: `// Callback after action
<HivePowerUpDown
  onSuccess={(action, amount) => {
    console.log(\`\${action}: \${amount}\`);
    refetchBalance();
  }}
/>`,
  hideTabs: `// Show only power up
<HivePowerUpDown hide={["down"]} />

// Show only power down
<HivePowerUpDown hide={["up"]} />`,
  customStyle: `// Custom styling
<HivePowerUpDown
  className="max-w-md shadow-lg"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function PowerUpDownPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HivePowerUpDown</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Stake and unstake HIVE to Hive Power for voting influence.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches balances automatically. Power up is instant. Power down takes 13 weeks
              with weekly payouts. Uses active key from SmartSigner.
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
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 border-hive-red text-hive-red">
                <ArrowUp className="h-4 w-4" /> Power Up
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ArrowDown className="h-4 w-4" /> Power Down
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Info */}
              <div className="p-3 rounded-lg bg-green-500/10 flex items-start gap-2">
                <Zap className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-500 text-sm">Power Up Benefits</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Increases voting power, curation rewards, and resource credits.
                  </p>
                </div>
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium mb-1">Power up to</label>
                <div className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                  barddev
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                    0.000
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-muted border border-border text-sm">
                    HIVE
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Available: 1,234.567 HIVE <span className="text-hive-red cursor-pointer">Max</span>
                </p>
              </div>

              <button className="w-full py-3 rounded-lg bg-green-500 text-white font-medium flex items-center justify-center gap-2">
                <ArrowUp className="h-4 w-4" /> Power Up
              </button>
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
                <td className="py-3 px-4"><code>initialMode</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"up" | "down"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"up"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialRecipient</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">current user</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("up" | "down")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(action: string, amount: string) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Initial mode</h3>
            <CodeBlock code={CODE.initialMode} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Power up to another</h3>
            <CodeBlock code={CODE.initialRecipient} language="tsx" />
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
            <h3 className="text-sm font-medium mb-2">Custom styling</h3>
            <CodeBlock code={CODE.customStyle} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/transfer-dialog"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Transfer Dialog
        </Link>
        <Link
          href="/docs/components/delegation-card"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Delegation Card
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
