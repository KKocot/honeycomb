import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Repeat } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveReblogButton } from "@/components/hive";

function PostFooter() {
  return (
    <HiveReblogButton
      author="barddev"
      permlink="my-first-post"
      onReblog={(reblogged) => {
        console.log(reblogged ? "Post reblogged" : "Reblog cancelled");
      }}
    />
  );
}`,
  inCard: `// Used inside a post card footer
<div className="flex items-center gap-4 mt-4">
  <HiveVoteButton author={author} permlink={permlink} />
  <HiveReblogButton author={author} permlink={permlink} />
</div>`,
};

export default async function ReblogButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveReblogButton</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Share posts to your blog feed with a single click.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Permanent Action</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reblogs cannot be undone on the blockchain. The post will appear
              on your blog feed. Uses posting key.
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
          <div className="flex flex-col items-center gap-6">
            {/* Not reblogged */}
            <div className="flex flex-col items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-green-500/20 hover:text-green-500 transition-colors">
                <Repeat className="h-4 w-4" />
                Reblog
              </button>
              <p className="text-xs text-muted-foreground">
                Share to your blog
              </p>
            </div>

            {/* Reblogged */}
            <div className="pt-6 border-t border-border w-full flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground mb-2">After reblogging:</p>
              <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-green-500/10 text-green-500 cursor-not-allowed">
                <Repeat className="h-4 w-4 fill-current" />
                Reblogged
              </button>
              <p className="text-xs text-green-500">
                You reblogged this post
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Checks reblog status from blockchain</li>
          <li>• Disabled after reblogging (cannot undo)</li>
          <li>• Disabled for own posts</li>
          <li>• Confirmation dialog before broadcasting</li>
          <li>• Optimistic UI updates</li>
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
                <td className="py-3 px-4"><code>onReblog</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(reblogged: boolean) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">With vote button</h3>
            <CodeBlock code={CODE.inCard} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/vote-button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Vote Button
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
