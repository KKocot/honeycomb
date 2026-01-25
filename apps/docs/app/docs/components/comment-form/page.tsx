import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Send } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/honeycomb-react`,
  basic: `import { HiveCommentForm } from "@kkocot/honeycomb-react";

function CommentSection() {
  return (
    <HiveCommentForm
      parentAuthor="barddev"
      parentPermlink="my-first-post"
    />
  );
}`,
  withCallback: `// Optional callback after posting
<HiveCommentForm
  parentAuthor="barddev"
  parentPermlink="my-first-post"
  onSuccess={(permlink) => console.log("Posted:", permlink)}
/>`,
  withPreview: `// Show live preview alongside editor
<HiveCommentForm
  parentAuthor="barddev"
  parentPermlink="my-first-post"
  showPreview
/>`,
  minimal: `// Minimal mode without toolbar
<HiveCommentForm
  parentAuthor="barddev"
  parentPermlink="my-first-post"
  showToolbar={false}
  placeholder="Add a quick reply..."
/>`,
  customStyle: `// Custom styling
<HiveCommentForm
  parentAuthor="barddev"
  parentPermlink="my-first-post"
  className="max-w-xl"
  style={{ minHeight: 200 }}
/>`,
};

export default async function CommentFormPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveCommentForm</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Post comments with markdown editor and live preview.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Full markdown editor with toolbar. Handles transactions automatically.
              Uses posting key from SmartSigner.
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
          <div className="max-w-lg">
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
                <img
                  src="https://images.hive.blog/u/barddev/avatar"
                  alt="@barddev"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium">@barddev</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-muted/20 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer">B</span>
                <span className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer italic">I</span>
                <span className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer">Link</span>
                <span className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer">Image</span>
                <span className="px-2 py-0.5 rounded hover:bg-muted cursor-pointer">Code</span>
              </div>
              <textarea
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-3 py-2 bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground"
                disabled
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/20">
                <span className="text-xs text-muted-foreground">Markdown supported</span>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-hive-red text-white text-sm font-medium">
                  <Send className="h-4 w-4" />
                  Comment
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
                <td className="py-3 px-4"><code>parentAuthor</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>parentPermlink</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(permlink: string) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showToolbar</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showPreview</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>placeholder</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;Write a comment...&quot;</code></td>
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
            <h3 className="text-sm font-medium mb-2">With live preview</h3>
            <CodeBlock code={CODE.withPreview} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Minimal mode</h3>
            <CodeBlock code={CODE.minimal} language="tsx" />
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
          href="/docs/components/vote-button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Vote Button
        </Link>
        <Link
          href="/docs/components/post-editor"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Post Editor
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
