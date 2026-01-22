import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, ThumbsUp, ThumbsDown } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveVoteButton } from "@/components/hive";

function PostFooter() {
  return (
    <HiveVoteButton
      author="barddev"
      permlink="my-first-post"
      onVote={(vote, weight) => {
        console.log(vote, weight); // "up" | "down" | null, -10000 to 10000
      }}
    />
  );
}`,
  inCard: `// Used inside a post card
<article className="p-4 border rounded-lg">
  <h2>Post Title</h2>
  <p>Post content...</p>

  <div className="mt-4">
    <HiveVoteButton
      author="barddev"
      permlink="my-first-post"
    />
  </div>
</article>`,
};

export default async function VoteButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveVoteButton</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upvote and downvote posts with adjustable vote weight and payout display.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Curation Rewards</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Voting on posts earns curation rewards. Right-click on upvote
              to adjust vote weight (1-100%). Uses posting key.
            </p>
          </div>
        </div>
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
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Upvote */}
              <button className="flex items-center gap-1.5 rounded-lg px-4 py-2 bg-muted hover:bg-green-500/20 hover:text-green-500 transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span className="font-medium">42</span>
              </button>

              {/* Downvote */}
              <button className="rounded-lg p-2 bg-muted hover:bg-red-500/20 hover:text-red-500 transition-colors">
                <ThumbsDown className="h-4 w-4" />
              </button>

              {/* Payout */}
              <span className="text-sm font-semibold text-green-500 ml-1">
                $12.34
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Right-click for vote weight
            </p>
          </div>

          {/* Voted state */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3 text-center">After voting:</p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg px-4 py-2 bg-green-500 text-white">
                  <ThumbsUp className="h-4 w-4 fill-current" />
                  <span className="font-medium">43</span>
                </button>
                <button className="rounded-lg p-2 bg-muted">
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-green-500 ml-1">
                  $12.50
                </span>
              </div>
              <p className="text-xs text-green-500">
                You upvoted this post
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Fetches vote count and payout from blockchain</li>
          <li>• Shows current user&apos;s vote state</li>
          <li>• Adjustable vote weight via right-click slider</li>
          <li>• Click again to remove vote</li>
          <li>• Optimistic UI updates</li>
          <li>• Confirmation dialog before broadcasting</li>
          <li>• Login prompt if not authenticated</li>
        </ul>
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
                <td className="py-3 px-4"><code>onVote</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(vote: &quot;up&quot; | &quot;down&quot; | null, weight: number) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
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

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Inside a post card</h3>
            <CodeBlock code={CODE.inCard} language="tsx" />
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
          href="/docs/components/reblog-button"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Reblog Button
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
