import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, ThumbsUp, ThumbsDown } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveVoteButton } from "@kkocot/hive-ui-react";

function PostFooter() {
  return (
    <HiveVoteButton
      author="barddev"
      permlink="my-first-post"
    />
  );
}`,
  withCallback: `// Optional callback after vote
<HiveVoteButton
  author="barddev"
  permlink="my-first-post"
  onSuccess={(weight) => console.log("Voted with weight:", weight)}
/>`,
  withSlider: `// Show weight slider (1-100%)
<HiveVoteButton
  author="barddev"
  permlink="my-first-post"
  showSlider
/>`,
  withDownvote: `// Show downvote button
<HiveVoteButton
  author="barddev"
  permlink="my-first-post"
  showDownvote
/>`,
  sizes: `<HiveVoteButton author="barddev" permlink="post" size="sm" />
<HiveVoteButton author="barddev" permlink="post" size="md" />
<HiveVoteButton author="barddev" permlink="post" size="lg" />`,
  customStyle: `// Custom styling
<HiveVoteButton
  author="barddev"
  permlink="my-first-post"
  className="bg-muted rounded-full"
  style={{ minWidth: 80 }}
/>`,
};

export default async function VoteButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveVoteButton</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upvote and downvote Hive content with optional weight slider.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Automatically checks vote status and handles transactions.
              Uses posting key from SmartSigner. Voting Power regenerates ~20%/day.
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
          <div className="space-y-4">
            {/* Basic */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">42</span>
              </button>
            </div>

            {/* Voted state */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hive-red/10 text-hive-red">
                <ThumbsUp className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">43</span>
              </button>
            </div>

            {/* With downvote */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">42</span>
              </button>
              <button className="p-1.5 rounded-lg hover:bg-muted">
                <ThumbsDown className="h-4 w-4" />
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
                <td className="py-3 px-4 text-muted-foreground"><code>(weight: number) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showSlider</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showDownvote</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>size</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;md&quot;</code></td>
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
            <h3 className="text-sm font-medium mb-2">With weight slider</h3>
            <CodeBlock code={CODE.withSlider} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With downvote</h3>
            <CodeBlock code={CODE.withDownvote} language="tsx" />
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
          href="/docs/components/mute-button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Mute Button
        </Link>
        <Link
          href="/docs/components/comment-form"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Comment Form
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
