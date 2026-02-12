import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageCircle,
  Pin,
  ThumbsUp,
  User,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";
import { CODE } from "./post_list_data";

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function PostListPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HivePostList</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ranked post feed with sorting, pagination, pinned posts, and multiple
          layout variants.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">
              Uses bridge.get_ranked_posts
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches ranked posts from the Hive blockchain via the Bridge API.
              Supports sorting by trending, hot, created, payout, and muted.
              Requires HiveProvider wrapper.
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
          <div className="space-y-4">
            {/* Sort controls */}
            <div className="flex gap-2">
              {["Trending", "Hot", "Created", "Payout"].map((label, i) => (
                <button
                  key={label}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    i === 0
                      ? "bg-hive-red text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Pinned post */}
            <div className="flex gap-4 rounded-lg border border-hive-red/20 bg-hive-red/5 p-4">
              <div className="w-16 h-16 rounded bg-muted shrink-0 flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Pin className="h-3.5 w-3.5 text-hive-red" />
                  <span className="text-xs font-medium text-hive-red">
                    Pinned
                  </span>
                </div>
                <h3 className="font-semibold truncate mt-1">
                  Welcome to Hive - Getting Started Guide
                </h3>
                <p className="text-sm text-muted-foreground">
                  @hiveio
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> 312
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> 87
                  </span>
                  <span className="text-green-500">$124.50</span>
                </div>
              </div>
            </div>

            {/* Regular posts */}
            {[
              {
                title: "Building DApps on Hive Blockchain",
                author: "barddev",
                votes: 89,
                comments: 24,
                payout: "$15.30",
              },
              {
                title: "Weekly Development Update #42",
                author: "hivebuzz",
                votes: 156,
                comments: 45,
                payout: "$32.10",
              },
              {
                title: "Understanding Resource Credits",
                author: "peakd",
                votes: 67,
                comments: 12,
                payout: "$8.75",
              },
            ].map((post) => (
              <div
                key={post.title}
                className="flex gap-4 rounded-lg border border-border p-4"
              >
                <div className="w-16 h-16 rounded bg-muted shrink-0 flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    @{post.author}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" /> {post.votes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                    </span>
                    <span className="text-green-500">{post.payout}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-muted-foreground">Page 1</span>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">
                Next
                <ChevronRight className="h-4 w-4" />
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
                <td className="py-3 px-4">
                  <code>sort</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`"trending" | "hot" | "created" | "payout" | "muted"`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>"trending"</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>tag</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>limit</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>number</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>20</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>pinned_posts</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`Array<{ author: string; permlink: string }>`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>[]</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>show_sort_controls</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>false</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>variant</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>{`"card" | "compact" | "grid"`}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>"compact"</code>
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

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useHivePostList Hook</h2>
        <p className="text-muted-foreground mb-4">
          For full control over the post feed, use the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            useHivePostList
          </code>{" "}
          hook directly. It returns posts, loading state, pagination controls,
          and sort management.
        </p>

        <h3 className="text-sm font-medium mb-2">Return values</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>posts</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>RankedPost[]</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Current page of ranked posts
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>is_loading</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Whether data is being fetched
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>error</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>Error | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Fetch error, if any
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>sort</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>SortType</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Current sort method
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>set_sort</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(sort: SortType) =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Change sort method (resets to page 1)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>page</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>number</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Current page number
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>has_prev</code> / <code>has_next</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Whether previous/next page exists
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>prev_page</code> / <code>next_page</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Navigate to previous/next page
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium mb-2">Example</h3>
        <CodeBlock
          code={CODE.hookUsage[framework]}
          language={framework === "vue" ? "vue" : "tsx"}
        />
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Sort controls</h3>
            <CodeBlock
              code={CODE.sortControls[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Pinned posts</h3>
            <CodeBlock
              code={CODE.pinnedPosts[framework]}
              language={framework === "vue" ? "vue" : "tsx"}
            />
          </div>
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
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/post-card`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Post Card
        </Link>
        <div />
      </section>
    </article>
  );
}
