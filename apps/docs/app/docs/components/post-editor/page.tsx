import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Bold, Italic, Link2, Image, List, Quote, Code } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HivePostEditor } from "@kkocot/hive-ui-react";

function CreatePost() {
  return <HivePostEditor />;
}`,
  withCallback: `// Optional callback after publishing
<HivePostEditor
  onSuccess={(permlink) => {
    console.log("Published:", permlink);
    router.push(\`/@\${username}/\${permlink}\`);
  }}
/>`,
  editPost: `// Edit existing post
<HivePostEditor
  initialTitle="My Post Title"
  initialBody="# Hello World\\n\\nThis is my post content."
  initialTags={["hive", "tutorial"]}
  permlink="my-post-title"
/>`,
  withBeneficiaries: `// Add beneficiaries (share rewards)
<HivePostEditor
  beneficiaries={[
    { account: "hive.fund", weight: 500 },  // 5%
    { account: "devfund", weight: 1000 },   // 10%
  ]}
/>`,
  customStyle: `// Custom styling
<HivePostEditor
  className="max-w-3xl mx-auto"
  style={{ minHeight: 500 }}
/>`,
};

export default async function PostEditorPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HivePostEditor</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Full-featured markdown editor for creating and editing Hive posts.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Full markdown editor with live preview, toolbar, and embeds support.
              Handles transactions automatically. Uses posting key from SmartSigner.
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
          <div className="rounded-lg border border-border overflow-hidden">
            {/* Title */}
            <div className="px-4 py-3 border-b border-border">
              <span className="text-xl font-bold text-muted-foreground">Post title...</span>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-2 py-2 border-b border-border">
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <Bold className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <Italic className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <Link2 className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <Image className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <List className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <Quote className="h-4 w-4" />
              </button>
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <Code className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <button className="px-3 py-1 text-sm rounded hover:bg-muted">
                Preview
              </button>
            </div>

            {/* Editor */}
            <div className="p-4 min-h-[150px] text-muted-foreground font-mono text-sm">
              Write your post content here... (Markdown supported)
            </div>

            {/* Tags */}
            <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
              Tags (space or comma separated)
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <button className="text-sm text-muted-foreground">Save Draft</button>
              <button className="px-4 py-2 rounded-lg bg-hive-red text-white text-sm font-medium">
                Publish
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
                <td className="py-3 px-4"><code>initialTitle</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialBody</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialTags</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string[]</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>permlink</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(permlink: string) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>beneficiaries</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`{ account: string; weight: number }[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
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
            <h3 className="text-sm font-medium mb-2">Edit existing post</h3>
            <CodeBlock code={CODE.editPost} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With beneficiaries</h3>
            <CodeBlock code={CODE.withBeneficiaries} language="tsx" />
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
          href="/docs/components/comment-form"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Comment Form
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
