import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, FileText, ThumbsUp, Clock, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveProposals } from "@kkocot/hive-ui-react";

function ProposalsPage() {
  return <HiveProposals />;
}`,
  initialFilter: `// Start with specific filter
<HiveProposals initialFilter="active" />

// Available filters: "all" | "active" | "votable" | "expired"`,
  withCallback: `// Callback after vote/unvote
<HiveProposals
  onSuccess={(action, proposalId) => {
    console.log(\`\${action} proposal #\${proposalId}\`);
    refetchProposals();
  }}
/>`,
  hideElements: `// Hide specific elements
<HiveProposals
  hide={["filters", "returnThreshold"]}
/>

// Available options: "filters" | "returnThreshold" | "dailyPay"`,
  customStyle: `// Custom styling
<HiveProposals
  className="max-w-3xl"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function ProposalsPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveProposals</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vote on Decentralized Hive Fund (DHF) proposals.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches proposals automatically. Handles vote/unvote using active key from SmartSigner.
              Proposals must have more votes than the "return proposal" to receive funding.
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
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">DHF Proposals</h3>
              <p className="text-sm text-muted-foreground">3 proposals supported</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <button className="px-3 py-1.5 rounded-lg text-sm bg-hive-red text-white">All</button>
            <button className="px-3 py-1.5 rounded-lg text-sm bg-muted text-muted-foreground">Active</button>
            <button className="px-3 py-1.5 rounded-lg text-sm bg-muted text-muted-foreground">Votable</button>
          </div>

          {/* Return threshold */}
          <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-500">Return Proposal Threshold</p>
                <p className="text-xs text-muted-foreground">
                  Proposals need more votes than this to be funded
                </p>
              </div>
              <span className="font-bold text-orange-500">45.2M MVests</span>
            </div>
          </div>

          {/* Proposal card */}
          <div className="rounded-xl border border-green-500/30 bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">#245</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-500">
                    Funded
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-500">
                    Active
                  </span>
                </div>
                <h4 className="font-semibold mt-1">HiveSQL Maintenance and Development</h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>by @arcange</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 180d remaining
                  </span>
                  <span>500 HBD/day</span>
                  <span className="flex items-center gap-1 hover:text-hive-red cursor-pointer">
                    Details <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="font-bold">89.5M</span>
                </div>
                <p className="text-xs text-muted-foreground">MVests</p>
                <button className="mt-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-500">
                  <ThumbsUp className="h-4 w-4 inline mr-1" /> Supported
                </button>
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
                <td className="py-3 px-4"><code>initialFilter</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"all" | "active" | "votable" | "expired"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"all"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("filters" | "returnThreshold" | "dailyPay")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(action, proposalId) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Initial filter</h3>
            <CodeBlock code={CODE.initialFilter} language="tsx" />
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
          href="/docs/components/witness-vote"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Witness Vote
        </Link>
        <Link
          href="/docs/components/authorities"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Authorities
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
