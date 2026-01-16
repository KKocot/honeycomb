import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { useVote } from "@kkocot/hive-ui-react";

function VoteButton({ author, permlink }) {
  const { vote, isVoting } = useVote();

  const handleVote = async () => {
    await vote({ author, permlink, weight: 10000 }); // 100% upvote
  };

  return (
    <button onClick={handleVote} disabled={isVoting}>
      {isVoting ? "Voting..." : "Upvote"}
    </button>
  );
}`,
  withWeight: `// Vote with custom weight
await vote({
  author: "barddev",
  permlink: "my-post",
  weight: 5000  // 50% upvote
});`,
  downvote: `// Negative weight for downvote
await vote({
  author: "barddev",
  permlink: "my-post",
  weight: -10000  // 100% downvote
});`,
};

export default async function UseVotePage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useVote</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Vote on Hive posts and comments with customizable weight.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Vote weight</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Weight ranges from -10000 to 10000. Positive = upvote, negative = downvote.
              Each 100% vote uses 2% of Voting Power (regenerates ~20%/day).
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

      {/* Return Values */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Return Value</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>vote</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(params) =&gt; Promise</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isVoting</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>Error | null</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>null</code></td>
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
            <h3 className="text-sm font-medium mb-2">Custom weight</h3>
            <CodeBlock code={CODE.withWeight} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Downvote</h3>
            <CodeBlock code={CODE.downvote} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/hooks/use-hive-account"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          useHiveAccount
        </Link>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Back to Docs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
