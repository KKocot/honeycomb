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
  Shield,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";
import { CODE } from "./content_renderer_data";

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
          Renders Hive blockchain post content with markdown parsing, HTML
          sanitization, media embedding, and link security.
        </p>
      </div>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <Youtube className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Video Embeds</h3>
          <p className="text-sm text-muted-foreground">
            YouTube, Vimeo, Twitch, 3Speak, Spotify
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <MessageSquare className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Social Embeds</h3>
          <p className="text-sm text-muted-foreground">Twitter/X, Instagram</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Code className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Markdown + HTML</h3>
          <p className="text-sm text-muted-foreground">
            GFM tables, code blocks, blockquotes
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Image className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Image Proxy</h3>
          <p className="text-sm text-muted-foreground">
            Custom proxy function for images
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <AtSign className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">@mentions & #tags</h3>
          <p className="text-sm text-muted-foreground">
            Auto-linked with custom URL functions
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Shield className="h-5 w-5 text-hive-red mb-2" />
          <h3 className="font-medium">Security</h3>
          <p className="text-sm text-muted-foreground">
            XSS sanitization, phishing detection
          </p>
        </div>
      </section>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">
              Styles not included by default
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The renderer outputs raw HTML. For proper typography, import the
              bundled stylesheet and wrap the component with{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                prose hive-renderer
              </code>{" "}
              classes. Requires{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                @tailwindcss/typography
              </code>{" "}
              plugin.
            </p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <CodeBlock
          code={CODE.basic[framework]}
          language={framework === "vue" ? "vue" : "tsx"}
        />
      </section>

      {/* Styling */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Styling</h2>
        <p className="text-muted-foreground mb-4">
          Import the renderer styles in your global CSS and add the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            @tailwindcss/typography
          </code>{" "}
          plugin to your Tailwind config.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">1. Import styles</h3>
            <CodeBlock code={CODE.importStyles} language="css" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">
              2. Tailwind config
            </h3>
            <CodeBlock code={CODE.tailwindConfig} language="ts" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">3. Wrap with classes</h3>
            <CodeBlock
              code={CODE.wrapperClasses[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
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
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>body</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Markdown or HTML content to render
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>author</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Post author (used for context during sanitization)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>permlink</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Post permlink (used for context during sanitization)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>options</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`Partial<RendererOptions>`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  See below
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Renderer configuration overrides
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>plugins</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`RendererPlugin[]`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>DEFAULT_PLUGINS</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  TablePlugin, TwitterResizePlugin, InstagramResizePlugin
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
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Additional CSS classes on the wrapper div
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Renderer Options */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Renderer Options</h2>
        <p className="text-muted-foreground mb-4">
          Pass these via the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            options
          </code>{" "}
          prop to customize rendering behavior.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Option</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>baseUrl</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`"https://hive.blog/"`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Base URL for internal link detection
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>breaks</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>true</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {`Convert \\n to <br>`}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>addNofollowToLinks</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>true</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Add rel=&quot;nofollow noopener&quot; to links
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>addTargetBlankToLinks</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>true</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Open external links in new tab
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>cssClassForExternalLinks</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  CSS class for external links (e.g.{" "}
                  <code>&quot;link-external&quot;</code>)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>imageProxyFn</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`(url: string) => string`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  identity
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Transform image URLs (e.g. proxy via images.hive.blog)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>usertagUrlFn</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`(account: string) => string`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`/@{account}`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  URL generator for @mention links
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>hashtagUrlFn</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`(tag: string) => string`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`/trending/{tag}`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  URL generator for #hashtag links
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>assetsWidth</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>number</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>640</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Default width for embedded iframes
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>assetsHeight</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>number</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>480</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Default height for embedded iframes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Custom Options Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Custom options</h3>
            <CodeBlock
              code={CODE.customOptions[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">
              Programmatic rendering (SSR / Node.js)
            </h3>
            <CodeBlock code={CODE.programmatic} language="ts" />
          </div>
        </div>
      </section>

      {/* Rendering Pipeline */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Rendering Pipeline</h2>
        <div className="rounded-lg border border-border p-4">
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                1
              </span>
              Plugin pre-processing
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                2
              </span>
              Preliminary sanitization (remove HTML comments)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                3
              </span>
              Markdown to HTML (Remarkable)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                4
              </span>
              DOM parsing: linkify URLs, @mentions, #hashtags
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                5
              </span>
              Tag-transforming sanitization (sanitize-html)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                6
              </span>
              Security check (script tag detection)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                7
              </span>
              Asset embedding (YouTube, Vimeo, Twitter, Instagram, etc.)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 shrink-0">
                8
              </span>
              Plugin post-processing + final sanitize pass
            </li>
          </ol>
        </div>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "HTML tag whitelist (no script, style, form)",
            "Attribute whitelist per tag",
            "iframe source whitelist (YouTube, Vimeo, etc.)",
            "Phishing domain detection (560+ domains)",
            "Private network URL blocking (SSRF protection)",
            "Bad actor account list",
            "XSS vector protection",
            "External link classification",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-hive-red" />
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* Markdown Support */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Supported Content</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Headers (h1-h6)",
            "Bold, Italic, Strikethrough",
            "Ordered & Unordered Lists",
            "Tables (GFM)",
            "Code blocks",
            "Inline code",
            "Blockquotes",
            "Images (auto-proxy)",
            "@mentions -> profile links",
            "#hashtags -> tag links",
            "Subscript / Superscript",
            "Horizontal rules",
            "Details / Summary (spoilers)",
            "Center / Text alignment",
            "Pull-left / Pull-right images",
            "YouTube / Vimeo / Twitch embeds",
            "Twitter / Instagram embeds",
            "3Speak / Spotify embeds",
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
        <div />
      </section>
    </article>
  );
}
