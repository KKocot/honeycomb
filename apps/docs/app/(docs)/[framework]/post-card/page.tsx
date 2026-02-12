import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  MessageCircle,
  ThumbsUp,
  Clock,
  Share,
  User,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";
import { CODE } from "./post_card_data";

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function PostCardPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HivePostCard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive posts with title, author, content preview, stats, and
          metadata.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">
              Display-only component
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches post data automatically via condenser_api. Displays post
              content, author, stats, and metadata. Requires HiveProvider
              wrapper.
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

      {/* Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border p-6">
          <div className="space-y-6">
            {/* Card variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Card (default)
              </p>
              <div className="rounded-lg border border-border p-4 max-w-lg">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://images.hive.blog/u/barddev/avatar/small"
                    alt="@barddev"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">@barddev</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 2h ago
                    </p>
                  </div>
                </div>
                <h2 className="text-lg font-bold">
                  Building Components for Hive
                </h2>
                <p className="mt-2 text-muted-foreground text-sm line-clamp-2">
                  Learn how to create reusable React components that interact
                  with the Hive blockchain...
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1.5 hover:text-hive-red cursor-pointer">
                      <ThumbsUp className="h-4 w-4" /> 42
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" /> 12
                    </span>
                    <Share className="h-4 w-4 cursor-pointer hover:text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-green-500">
                    $8.45
                  </span>
                </div>
              </div>
            </div>

            {/* Compact variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Compact
              </p>
              <div className="flex gap-4 p-4 rounded-lg border border-border max-w-lg">
                <div className="w-20 h-20 rounded bg-muted shrink-0 flex items-center justify-center text-2xl">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    Quick Update on Development Progress
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    @barddev · 5h ago
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" /> 56
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> 8
                    </span>
                    <span className="text-green-500">$3.21</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid variant */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Grid
              </p>
              <div className="rounded-lg border border-border overflow-hidden max-w-xs">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">
                    Hive UI Components Tutorial
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    @barddev · 1d ago
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" /> 89
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" /> 24
                      </span>
                    </div>
                    <span className="font-medium text-green-500">$15.30</span>
                  </div>
                </div>
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
                <td className="py-3 px-4">
                  <code>author</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>permlink</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>variant</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`"card" | "compact" | "grid"`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>"card"</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>hide</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`("author" | "thumbnail" | "payout" | "votes" | "comments" | "time")[]`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>[]</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>linkTarget</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`"https://blog.openhive.network"`}</code>
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
            <CodeBlock
              code={CODE.variants[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide elements</h3>
            <CodeBlock
              code={CODE.hideElements[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Custom styling</h3>
            <CodeBlock
              code={CODE.customStyle[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Render post list</h3>
            <CodeBlock
              code={CODE.postList[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/manabar`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Manabar
        </Link>
        <Link
          href={`/${framework}/post-list`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Post List
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
