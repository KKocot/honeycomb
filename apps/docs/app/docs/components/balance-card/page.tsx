import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Wallet, TrendingUp, Lock, Coins } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveBalanceCard } from "@kkocot/hive-ui-react";

function WalletPage() {
  return <HiveBalanceCard username="barddev" />;
}`,
  variants: `// Compact (inline)
<HiveBalanceCard username="barddev" variant="compact" />

// Default (card)
<HiveBalanceCard username="barddev" variant="default" />

// Detailed (full breakdown)
<HiveBalanceCard username="barddev" variant="detailed" />`,
  hideElements: `// Hide specific elements
<HiveBalanceCard
  username="barddev"
  hide={["savings", "delegations"]}
/>

// Available options: "hive" | "hbd" | "hp" | "savings" | "delegations"`,
  withCallback: `// Click actions
<HiveBalanceCard
  username="barddev"
  onTransfer={() => openTransferDialog()}
  onPowerUp={() => openPowerUpDialog()}
/>`,
  customStyle: `// Custom styling
<HiveBalanceCard
  username="barddev"
  className="max-w-md shadow-lg"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function BalanceCardPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveBalanceCard</h1>
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
              Fetches account balances automatically. Shows HIVE (liquid), HBD (stablecoin ~$1),
              and HP (staked HIVE with delegations).
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
          <div className="space-y-6">
            {/* Default variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Default</p>
              <div className="rounded-lg border border-border bg-background p-4 max-w-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="h-5 w-5 text-hive-red" />
                  <h3 className="font-semibold">Balance</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HIVE</span>
                    <span className="font-medium">1,234.567 HIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HBD</span>
                    <span className="font-medium">456.789 HBD</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Hive Power</span>
                    <span className="font-medium">10,000.000 HP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Compact</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">1,234.567 HIVE</span>
                <span className="text-muted-foreground">456.789 HBD</span>
                <span className="text-muted-foreground">10,000.000 HP</span>
              </div>
            </div>

            {/* Detailed variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Detailed</p>
              <div className="rounded-lg border border-border max-w-sm">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-hive-red" />
                    <h3 className="font-semibold">@barddev Wallet</h3>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">HIVE</span>
                    </div>
                    <span className="font-medium">1,234.567 HIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">HBD</span>
                    </div>
                    <span className="font-medium">456.789 HBD</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Hive Power</span>
                      </div>
                      <span className="font-medium">8,500.000 HP</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-green-500">+ Received</span>
                      <span className="text-green-500">2,000.000 HP</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-red-500">- Delegated</span>
                      <span className="text-red-500">500.000 HP</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                      <span className="text-sm font-medium">Effective HP</span>
                      <span className="font-bold text-hive-red">10,000.000 HP</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Savings</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>HIVE</span>
                        <span>100.000 HIVE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HBD</span>
                        <span>50.000 HBD</span>
                      </div>
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
                <td className="py-3 px-4"><code>username</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"compact" | "default" | "detailed"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"default"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("hive" | "hbd" | "hp" | "savings" | "delegations")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onTransfer</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>() =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onPowerUp</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>() =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Variants</h3>
            <CodeBlock code={CODE.variants} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide elements</h3>
            <CodeBlock code={CODE.hideElements} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With callbacks</h3>
            <CodeBlock code={CODE.withCallback} language="tsx" />
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
          href="/docs/components/reblog-button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Reblog Button
        </Link>
        <Link
          href="/docs/components/transfer-dialog"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Transfer Dialog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
