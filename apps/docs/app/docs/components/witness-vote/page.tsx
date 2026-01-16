import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Vote, Check, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveWitnessVote } from "@kkocot/hive-ui-react";

function WitnessesPage() {
  return <HiveWitnessVote />;
}`,
  withCallback: `// Callback after vote/unvote
<HiveWitnessVote
  onSuccess={(action, witness) => {
    console.log(\`\${action} \${witness}\`);
    refetchWitnesses();
  }}
/>`,
  hideElements: `// Hide specific elements
<HiveWitnessVote
  hide={["search", "yourVotes", "version"]}
/>

// Available options: "search" | "yourVotes" | "version" | "url"`,
  initialQuery: `// Pre-filter witnesses
<HiveWitnessVote initialQuery="gtg" />`,
  customStyle: `// Custom styling
<HiveWitnessVote
  className="max-w-4xl"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function WitnessVotePage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveWitnessVote</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vote for Hive blockchain witnesses who secure and govern the network.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches witnesses automatically. Handles vote/unvote using active key from SmartSigner.
              You can vote for up to 30 witnesses. Your HP determines your voting influence.
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
                <Vote className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Witness Voting</h3>
                <p className="text-sm text-muted-foreground">2/30 votes used</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-500">
              28 votes remaining
            </span>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left text-sm font-medium">#</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Witness</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Votes</th>
                  <th className="py-3 px-4 text-right text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 text-sm text-muted-foreground">1</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.hive.blog/u/blocktrades/avatar/small"
                        alt="@blocktrades"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex items-center gap-1">
                        <span className="font-medium">@blocktrades</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="font-medium">145.2M</span>
                    <span className="text-muted-foreground ml-1">MVests</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500/10 text-green-500">
                      <Check className="h-4 w-4 inline mr-1" /> Voted
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-muted-foreground">2</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.hive.blog/u/gtg/avatar/small"
                        alt="@gtg"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium">@gtg</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="font-medium">132.8M</span>
                    <span className="text-muted-foreground ml-1">MVests</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-hive-red text-white">
                      Vote
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
                <td className="py-3 px-4"><code>initialQuery</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>""</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("search" | "yourVotes" | "version" | "url")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(action, witness) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">With callback</h3>
            <CodeBlock code={CODE.withCallback} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide elements</h3>
            <CodeBlock code={CODE.hideElements} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Pre-filter</h3>
            <CodeBlock code={CODE.initialQuery} language="tsx" />
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
          href="/docs/components/communities-list"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Communities List
        </Link>
        <Link
          href="/docs/components/proposals"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Proposals
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
