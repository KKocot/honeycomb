import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveManabar } from "@kkocot/hive-ui-react";

function UserStats() {
  return (
    <HiveManabar
      username="barddev"
      variant="full"
      showValues
      showCooldown
    />
  );
}`,
  compact: `// Compact variant - small rings in a row
<HiveManabar username="barddev" variant="compact" />`,
  ring: `// Ring variant - single RC ring (for headers/navbars)
<HiveManabar username="barddev" variant="ring" />`,
  options: `// Full variant with all options
<HiveManabar
  username="barddev"
  variant="full"
  showLabels={true}    // Show "Voting Power", "Downvote", "RC" labels
  showValues={true}    // Show current/max values
  showCooldown={true}  // Show time until full regeneration
/>

// Minimal display
<HiveManabar
  username="barddev"
  variant="full"
  showLabels={false}
  showValues={false}
  showCooldown={false}
/>`,
};

export default async function ManabarPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveManabar</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display voting power, downvote mana, and resource credits with circular progress indicators.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hive Manabars</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive accounts have three types of mana that regenerate over time:
              <strong> Voting Power</strong> (upvotes), <strong>Downvote Mana</strong> (downvotes),
              and <strong>Resource Credits</strong> (RC - for all blockchain operations).
              Full regeneration takes approximately 5 days. Data refreshes every minute.
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
          <div className="flex flex-wrap justify-center gap-8">
            {/* Voting Power */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Voting Power</span>
              <div className="relative" style={{ width: 70, height: 70 }}>
                <svg width={70} height={70} className="-rotate-90">
                  <circle cx={35} cy={35} r={32} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted/30" />
                  <circle cx={35} cy={35} r={32} fill="none" stroke="#00C040" strokeWidth={6} strokeDasharray={201} strokeDashoffset={20} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">90%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Full in: 12h 30m</div>
            </div>
            {/* Downvote */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Downvote</span>
              <div className="relative" style={{ width: 70, height: 70 }}>
                <svg width={70} height={70} className="-rotate-90">
                  <circle cx={35} cy={35} r={32} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted/30" />
                  <circle cx={35} cy={35} r={32} fill="none" stroke="#C01000" strokeWidth={6} strokeDasharray={201} strokeDashoffset={0} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">100%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Full</div>
            </div>
            {/* RC */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Resource Credits</span>
              <div className="relative" style={{ width: 70, height: 70 }}>
                <svg width={70} height={70} className="-rotate-90">
                  <circle cx={35} cy={35} r={32} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted/30" />
                  <circle cx={35} cy={35} r={32} fill="none" stroke="#0088FE" strokeWidth={6} strokeDasharray={201} strokeDashoffset={40} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">80%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Full in: 1d 2h</div>
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
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;full&quot; | &quot;compact&quot; | &quot;ring&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;full&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showLabels</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showValues</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showCooldown</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>className</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Variants</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Compact</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Small rings in a row, perfect for sidebars or user cards.
            </p>
            <CodeBlock code={CODE.compact} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Ring</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Single RC ring, ideal for headers or navigation bars.
            </p>
            <CodeBlock code={CODE.ring} language="tsx" />
          </div>
        </div>
      </section>

      {/* Display Options */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Display Options</h2>
        <CodeBlock code={CODE.options} language="tsx" />
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
          href="/docs/components/post-card"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Post Card
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
