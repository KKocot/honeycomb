import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Smile, Highlighter, Table, Image, Code, List } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add md-editor-rt @vavt/rt-extension @vavt/cm-extension lucide-react`,
  basic: `import { HiveMarkdownEditor } from "@/components/hive/content";
import { useState } from "react";

function Editor() {
  const [content, setContent] = useState("");

  return (
    <HiveMarkdownEditor
      value={content}
      onChange={setContent}
    />
  );
}`,
  withTheme: `// Sync with your app's theme
import { useTheme } from "next-themes";

function ThemedEditor() {
  const [content, setContent] = useState("");
  const { resolvedTheme } = useTheme();

  return (
    <HiveMarkdownEditor
      value={content}
      onChange={setContent}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}`,
  fullHeight: `// Full height editor
<div className="h-[500px]">
  <HiveMarkdownEditor
    value={content}
    onChange={setContent}
    className="!h-full"
  />
</div>`,
  withRenderer: `// Editor with live preview using ContentRenderer
import { HiveMarkdownEditor, HiveContentRenderer } from "@/components/hive/content";

function EditorWithPreview() {
  const [content, setContent] = useState("");

  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      <HiveMarkdownEditor value={content} onChange={setContent} />
      <div className="overflow-auto border rounded-lg p-4">
        <HiveContentRenderer content={content} />
      </div>
    </div>
  );
}`,
};

export default async function MarkdownEditorPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveMarkdownEditor</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Full-featured Markdown editor with emoji picker, highlighter, and Hive-specific toolbars.
        </p>
      </div>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <Smile className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Emoji Picker</h3>
          <p className="text-sm text-muted-foreground">Built-in emoji support</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Highlighter className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Text Highlighting</h3>
          <p className="text-sm text-muted-foreground">Mark text with colors</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Table className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Tables</h3>
          <p className="text-sm text-muted-foreground">Easy table insertion</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Image className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Images</h3>
          <p className="text-sm text-muted-foreground">Image & link insertion</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Code className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Code Blocks</h3>
          <p className="text-sm text-muted-foreground">Syntax highlighted code</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <List className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Full Toolbar</h3>
          <p className="text-sm text-muted-foreground">All formatting options</p>
        </div>
      </section>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Based on md-editor-rt</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Uses md-editor-rt under the hood - a React markdown editor with
              rich toolbar support, preview mode, and extensive customization options.
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
            {/* Toolbar Preview */}
            <div className="flex items-center gap-1 px-2 py-2 border-b border-border bg-muted/30 flex-wrap">
              {["H", "B", "U", "I", "—", "S", "sub", "sup", "❝", "•", "1.", "☐", "◇"].map((item, i) => (
                <button key={i} className="p-2 rounded hover:bg-muted text-muted-foreground text-xs font-mono">
                  {item}
                </button>
              ))}
              <div className="w-px h-5 bg-border mx-1" />
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">😀</button>
              <button className="p-2 rounded hover:bg-muted text-muted-foreground">
                <Highlighter className="h-4 w-4" />
              </button>
            </div>

            {/* Editor Area */}
            <div className="p-4 min-h-[150px] text-muted-foreground font-mono text-sm">
              Write your markdown here...
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
                <td className="py-3 px-4"><code>value</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onChange</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(value: string) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>theme</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;light&quot; | &quot;dark&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;dark&quot;</code></td>
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

      {/* Toolbar */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Available Toolbar Items</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "title - Heading levels",
            "bold - Bold text",
            "underline - Underlined text",
            "italic - Italic text",
            "strikeThrough - Strikethrough",
            "sub - Subscript",
            "sup - Superscript",
            "quote - Blockquote",
            "unorderedList - Bullet list",
            "orderedList - Numbered list",
            "task - Task list",
            "mermaid - Mermaid diagrams",
            "codeRow - Inline code",
            "code - Code block",
            "link - Insert link",
            "image - Insert image",
            "table - Insert table",
            "katex - Math equation",
            "revoke - Undo",
            "next - Redo",
            "pageFullscreen - Fullscreen",
            "htmlPreview - Preview HTML",
            "catalog - Table of contents",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-hive-red" />
              <code className="text-xs">{item}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">With theme support</h3>
            <CodeBlock code={CODE.withTheme} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Full height editor</h3>
            <CodeBlock code={CODE.fullHeight} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Editor with live preview</h3>
            <CodeBlock code={CODE.withRenderer} language="tsx" />
          </div>
        </div>
      </section>

      {/* CSS Requirements */}
      <section>
        <h2 className="text-xl font-semibold mb-4">CSS Requirements</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The editor requires CSS imports for proper styling. These are automatically
          included when you import the component.
        </p>
        <CodeBlock
          code={`// These are imported automatically by HiveMarkdownEditor
import "md-editor-rt/lib/style.css";
import "@vavt/rt-extension/lib/asset/Emoji.css";
import "@vavt/rt-extension/lib/asset/Mark.css";`}
          language="tsx"
        />
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/content-renderer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Content Renderer
        </Link>
        <Link
          href="/docs/hooks/use-hive-account"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          useHiveAccount
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
