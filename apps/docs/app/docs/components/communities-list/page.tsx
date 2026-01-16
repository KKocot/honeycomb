import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Globe, Users, Star, Search } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveCommunitiesList } from "@kkocot/hive-ui-react";

function ExplorePage() {
  return <HiveCommunitiesList />;
}`,
  variants: `// Grid (default)
<HiveCommunitiesList variant="grid" />

// List
<HiveCommunitiesList variant="list" />`,
  withQuery: `// Pre-filter communities
<HiveCommunitiesList initialQuery="photography" />`,
  withCallback: `// Callback after subscribe/unsubscribe
<HiveCommunitiesList
  onSuccess={(action, community) => {
    console.log(\`\${action} \${community}\`);
    refetchSubscriptions();
  }}
/>`,
  hideElements: `// Hide specific elements
<HiveCommunitiesList
  hide={["search", "stats"]}
/>

// Available options: "search" | "stats" | "description"`,
  customStyle: `// Custom styling
<HiveCommunitiesList
  className="max-w-4xl"
  style={{ gap: 24 }}
/>`,
};

export default async function CommunitiesListPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveCommunitiesList</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse and subscribe to Hive communities.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches communities automatically. Handles subscribe/unsubscribe using posting key from SmartSigner.
              Community names start with "hive-" followed by a number.
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
          {/* Search */}
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
              Search communities...
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-xl border border-border p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-hive-red/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-hive-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Photography Lovers</p>
                  <p className="text-sm text-muted-foreground">hive-194913</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                A community for photographers to share their work and connect with others.
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> 12,345
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" /> 234 active
                </span>
              </div>
              <button className="w-full mt-4 py-2 rounded-lg text-sm font-medium bg-hive-red text-white">
                Subscribe
              </button>
            </div>

            {/* Card 2 - Subscribed */}
            <div className="rounded-xl border border-border p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">LeoFinance</p>
                  <p className="text-sm text-muted-foreground">hive-167922</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                Pair your passion for financial topics with blockchain technology.
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> 45,678
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" /> 567 active
                </span>
              </div>
              <button className="w-full mt-4 py-2 rounded-lg text-sm font-medium bg-muted text-foreground">
                Subscribed
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
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"grid" | "list"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"grid"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialQuery</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>""</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("search" | "stats" | "description")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(action, community) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Pre-filter</h3>
            <CodeBlock code={CODE.withQuery} language="tsx" />
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
          href="/docs/components/trade-hive"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Trade Hive
        </Link>
        <Link
          href="/docs/components/witness-vote"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Witness Vote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
