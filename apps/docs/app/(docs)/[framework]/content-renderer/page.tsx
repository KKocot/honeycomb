import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Youtube,
  MessageSquare,
  Image,
  Code,
  Link2,
  AtSign,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";

const CODE = {
  install: `pnpm add react-markdown rehype-highlight rehype-katex rehype-raw rehype-sanitize rehype-stringify remark-breaks remark-flexible-markers remark-flexible-paragraphs remark-gfm remark-github-blockquote-alert remark-math remark-parse remark-rehype unified unist-util-visit highlight.js @hiveio/hivescript`,
  basic: {
    react: `import { HiveContentRenderer } from "@/components/hive/content";

function PostContent({ body }: { body: string }) {
  return <HiveContentRenderer content={body} />;
}`,
    solid: `import { HiveContentRenderer } from "@/components/hive/content";

function PostContent(props: { body: string }) {
  return <HiveContentRenderer content={props.body} />;
}`,
    vue: `<template>
  <HiveContentRenderer :content="body" />
</template>

<script setup lang="ts">
import { HiveContentRenderer } from "@/components/hive/content";

defineProps<{ body: string }>();
</script>`,
  },
  withClassName: {
    react: `<HiveContentRenderer
  content={postBody}
  className="max-w-3xl mx-auto"
/>`,
    solid: `<HiveContentRenderer
  content={postBody}
  class="max-w-3xl mx-auto"
/>`,
    vue: `<template>
  <HiveContentRenderer
    :content="postBody"
    class="max-w-3xl mx-auto"
  />
</template>`,
  },
  fetchPost: {
    react: `// Fetch post and render content
const post = await fetchHivePost("@username/permlink");

<HiveContentRenderer content={post.body} />`,
    solid: `// Fetch post and render content
const post = await fetchHivePost("@username/permlink");

<HiveContentRenderer content={post.body} />`,
    vue: `<template>
  <HiveContentRenderer :content="post.body" />
</template>

<script setup lang="ts">
// Fetch post and render content
const post = await fetchHivePost("@username/permlink");
</script>`,
  },
  embeds: `// YouTube, Twitch, Twitter/X, Instagram, 3Speak links
// are automatically converted to embedded players

const markdown = \`
Check out this video:
https://www.youtube.com/watch?v=dQw4w9WgXcQ

And this tweet:
https://twitter.com/haborym/status/1795419631591813628
\`;

<HiveContentRenderer content={markdown} />`,
  mermaid: `// Mermaid diagrams are supported
const markdown = \`
\\\`\\\`\\\`mermaid
graph TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    B -- No --> D[End]
\\\`\\\`\\\`
\`;

<HiveContentRenderer content={markdown} />`,
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function ContentRendererPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          HiveContentRenderer
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Renders Hive blockchain markdown content with full embed and
          formatting support.
        </p>
      </div>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <Youtube className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Video Embeds</h3>
          <p className="text-sm text-muted-foreground">
            YouTube, Twitch, 3Speak
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <MessageSquare className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Social Embeds</h3>
          <p className="text-sm text-muted-foreground">Twitter/X, Instagram</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Code className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Code Highlighting</h3>
          <p className="text-sm text-muted-foreground">
            Syntax highlighting for 180+ languages
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Image className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Image Proxy</h3>
          <p className="text-sm text-muted-foreground">
            Auto-proxied via images.hive.blog
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <AtSign className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">@mentions & #tags</h3>
          <p className="text-sm text-muted-foreground">
            Auto-linked to profiles and tags
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Link2 className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Safe Links</h3>
          <p className="text-sm text-muted-foreground">
            Phishing protection built-in
          </p>
        </div>
      </section>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">
              Full Hive Compatibility
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Supports all Hive markdown extensions including flexible markers,
              GitHub-style alerts, math equations (KaTeX), Mermaid diagrams, and
              more.
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
        <CodeBlock
          code={CODE.basic[framework]}
          language={framework === "vue" ? "vue" : "tsx"}
        />
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
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>content</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Markdown content to render
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>
                    {framework === "react" ? "className" : "class"}
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Additional CSS classes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Supported Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Supported Features</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">
              Video & Social Embeds
            </h3>
            <CodeBlock code={CODE.embeds} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Mermaid Diagrams</h3>
            <CodeBlock code={CODE.mermaid} language="tsx" />
          </div>
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">
              With custom {framework === "react" ? "className" : "class"}
            </h3>
            <CodeBlock
              code={CODE.withClassName[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">
              Fetch and render post
            </h3>
            <CodeBlock
              code={CODE.fetchPost[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
        </div>
      </section>

      {/* Markdown Support */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Markdown Support</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Headers (h1-h6)",
            "Bold, Italic, Strikethrough",
            "Ordered & Unordered Lists",
            "Task Lists",
            "Tables (GFM)",
            "Code blocks with syntax highlighting",
            "Inline code",
            "Blockquotes",
            "GitHub-style alerts",
            "Math equations (KaTeX)",
            "Mermaid diagrams",
            "Images with proxy",
            "@mentions → links",
            "#tags → links",
            "Subscript (~text~)",
            "Superscript (^text^)",
            "Colored markers (==text==)",
            "Horizontal rules",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-hive-red" />
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/post-list`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Post List
        </Link>
        <Link
          href={`/${framework}/markdown-editor`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Markdown Editor
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
