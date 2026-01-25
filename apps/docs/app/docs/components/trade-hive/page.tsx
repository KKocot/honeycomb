import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, TrendingUp } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/honeycomb-react`,
  basic: `import { HiveTradeCard } from "@kkocot/honeycomb-react";

function MarketPage() {
  return <HiveTradeCard />;
}`,
  initialMode: `// Start on sell tab
<HiveTradeCard initialMode="sell" />`,
  initialOrderType: `// Start with market order
<HiveTradeCard initialOrderType="market" />`,
  withCallback: `// Callback after trade
<HiveTradeCard
  onSuccess={(mode, amount, price) => {
    console.log(\`\${mode} \${amount} HIVE at \${price}\`);
    refetchBalance();
  }}
/>`,
  hideElements: `// Hide specific elements
<HiveTradeCard
  hide={["orderBook", "orderType"]}
/>

// Available options: "orderBook" | "orderType" | "priceChange"`,
  customStyle: `// Custom styling
<HiveTradeCard
  className="max-w-2xl shadow-lg"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function TradeHivePage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveTradeCard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Internal market interface for trading HIVE and HBD.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches order book and balances automatically. Supports limit and market orders.
              No fees for trading. Uses active key from SmartSigner.
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
          <div className="max-w-2xl mx-auto rounded-xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold">HIVE/HBD</h3>
                <p className="text-sm text-muted-foreground">Internal Market</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">0.425 HBD</p>
                <p className="text-sm text-green-500 flex items-center gap-1 justify-end">
                  <TrendingUp className="h-3 w-3" /> +2.4%
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-4">
              {/* Order Book */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Order Book</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs py-1 px-2 rounded bg-red-500/5">
                    <span className="text-red-500">0.430</span>
                    <span>1,234</span>
                    <span className="text-muted-foreground">530.62</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 px-2 rounded bg-red-500/5">
                    <span className="text-red-500">0.428</span>
                    <span>567</span>
                    <span className="text-muted-foreground">242.68</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs py-2 px-2 bg-muted rounded">
                  <span>Spread</span>
                  <span className="font-medium">0.425 HBD</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs py-1 px-2 rounded bg-green-500/5">
                    <span className="text-green-500">0.423</span>
                    <span>890</span>
                    <span className="text-muted-foreground">376.47</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 px-2 rounded bg-green-500/5">
                    <span className="text-green-500">0.420</span>
                    <span>2,100</span>
                    <span className="text-muted-foreground">882.00</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div>
                <div className="flex mb-4">
                  <button className="flex-1 py-2 text-sm font-medium rounded-l-lg bg-green-500 text-white">
                    Buy HIVE
                  </button>
                  <button className="flex-1 py-2 text-sm font-medium rounded-r-lg bg-muted text-muted-foreground hover:text-foreground">
                    Sell HIVE
                  </button>
                </div>
                <div className="flex gap-2 mb-4">
                  <button className="px-3 py-1 text-xs rounded bg-hive-red text-white">
                    Limit
                  </button>
                  <button className="px-3 py-1 text-xs rounded bg-muted text-muted-foreground">
                    Market
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Price (HBD)</label>
                    <div className="px-3 py-2 text-sm rounded-lg bg-muted border border-border">
                      0.425
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Amount (HIVE)</label>
                    <div className="px-3 py-2 text-sm rounded-lg bg-muted border border-border text-muted-foreground">
                      0.000
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Available: 456.789 HBD <span className="text-hive-red cursor-pointer">Max</span>
                    </p>
                  </div>
                  <div className="flex justify-between py-2 px-3 rounded-lg bg-muted text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">0.000 HBD</span>
                  </div>
                  <button className="w-full py-3 rounded-lg bg-green-500 text-white font-medium flex items-center justify-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Buy HIVE
                  </button>
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
                <td className="py-3 px-4"><code>initialMode</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"buy" | "sell"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"buy"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialOrderType</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"limit" | "market"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"limit"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("orderBook" | "orderType" | "priceChange")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(mode, amount, price) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Initial order type</h3>
            <CodeBlock code={CODE.initialOrderType} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With callback</h3>
            <CodeBlock code={CODE.withCallback} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide elements</h3>
            <CodeBlock code={CODE.hideElements} language="tsx" />
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
          href="/docs/components/delegation-card"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Delegation Card
        </Link>
        <Link
          href="/docs/components/communities-list"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Communities List
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
