import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Send, ArrowUpDown, PiggyBank, Users } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveTransferDialog } from "@kkocot/hive-ui-react";

function WalletPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Transfer</button>
      <HiveTransferDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}`,
  initialType: `// Open with specific tab selected
<HiveTransferDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialType="powerUp"
/>

// Available types: "transfer" | "powerUp" | "powerDown" | "delegate" | "savings"`,
  initialRecipient: `// Pre-fill recipient
<HiveTransferDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialRecipient="barddev"
/>`,
  withCallback: `// Callback after successful transfer
<HiveTransferDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSuccess={(data) => {
    console.log("Transferred:", data);
    refetchBalance();
  }}
/>`,
  hideTabs: `// Hide specific tabs
<HiveTransferDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  hide={["powerDown", "savings"]}
/>`,
  customStyle: `// Custom styling
<HiveTransferDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  className="max-w-lg"
  style={{ borderRadius: 20 }}
/>`,
};

export default async function TransferDialogPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveTransferDialog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Multi-purpose dialog for transfers, power up/down, delegation, and savings.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches balances automatically. Handles all transfer operations using active key from SmartSigner.
              Power down takes 13 weeks. Savings have 3-day withdrawal.
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
          <div className="max-w-md mx-auto rounded-xl border border-border bg-card">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Transfer</h3>
                  <p className="text-sm text-muted-foreground">Send HIVE or HBD</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-hive-red text-white">
                <Send className="h-4 w-4" /> Transfer
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted">
                <ArrowUpDown className="h-4 w-4" /> Power Up
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted">
                <Users className="h-4 w-4" /> Delegate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted">
                <PiggyBank className="h-4 w-4" /> Savings
              </button>
            </div>

            {/* Form preview */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Recipient</label>
                <div className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                  username
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                    0.000
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-muted border border-border">
                    HIVE
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Available: 1,234.567 HIVE <span className="text-hive-red cursor-pointer">Max</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Memo <span className="text-muted-foreground">(optional)</span>
                </label>
                <div className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                  Add a memo...
                </div>
              </div>
              <button className="w-full py-3 rounded-lg bg-hive-red text-white font-medium">
                Transfer
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
                <td className="py-3 px-4"><code>isOpen</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onClose</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>() =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialType</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"transfer" | "powerUp" | "powerDown" | "delegate" | "savings"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"transfer"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialRecipient</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>""</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("transfer" | "powerUp" | "powerDown" | "delegate" | "savings")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(data: TransferData) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Initial type</h3>
            <CodeBlock code={CODE.initialType} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Pre-fill recipient</h3>
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
          href="/docs/components/balance-card"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Balance Card
        </Link>
        <Link
          href="/docs/components/power-up-down"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Power Up/Down
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
