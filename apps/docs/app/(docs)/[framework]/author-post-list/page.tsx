import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageCircle,
  ThumbsUp,
  User,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";
import { CODE } from "./author_post_list_data";

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function AuthorPostListPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);
  // Pick syntax-highlighting language for code samples.
  const code_language =
    framework === "vue"
      ? "vue"
      : framework === "svelte"
        ? "svelte"
        : "tsx";

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          HiveAuthorPostList
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display top-level posts authored by a specific Hive account, with
          optional client-side tag filter and cursor-based Prev/Next pagination.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">
              Uses bridge.get_account_posts
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches top-level posts from the Hive blockchain via the Bridge
              API for a specific account (sort is fixed to{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                "posts"
              </code>
              ). Use the{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">tag</code>{" "}
              prop to additionally filter by a Hive tag (client-side filter on
              the returned page). Requires a HiveProvider wrapper.
            </p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <CodeBlock code={CODE.basic[framework]} language={code_language} />
      </section>

      {/* Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border p-6">
          <div className="space-y-4">
            {/* Posts */}
            {[
              {
                title: "Welcome to Hive - Getting Started Guide",
                author: "hiveio",
                votes: 312,
                comments: 87,
                payout: "$124.50",
              },
              {
                title: "Hive Improvement Proposals: How They Work",
                author: "hiveio",
                votes: 198,
                comments: 42,
                payout: "$58.20",
              },
              {
                title: "Building on Hive: Developer Resources",
                author: "hiveio",
                votes: 156,
                comments: 34,
                payout: "$41.75",
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
                Prev Page
              </button>
              <span className="text-sm text-muted-foreground">Page 1</span>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors">
                Next Page
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
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>account</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <em>required</em>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Hive account name to fetch posts for
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
                <td className="py-3 px-4 text-muted-foreground">
                  Optional client-side tag filter applied to the returned page
                </td>
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
                <td className="py-3 px-4 text-muted-foreground">
                  Posts per page (see Pagination note below)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>
                    {framework === "vue" ? "pinnedPosts" : "pinned_posts"}
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>AccountPost[]</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Full <code>AccountPost</code> objects rendered above the
                  list. Unlike <code>HivePostList</code>, no extra fetch is
                  performed.
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
                <td className="py-3 px-4 text-muted-foreground">
                  Layout variant for post items
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
                <td className="py-3 px-4 text-muted-foreground">
                  Elements to hide from post cards
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
                <td className="py-3 px-4 text-muted-foreground">
                  Base URL for post links. Only{" "}
                  <code>http(s)://</code> and root-relative paths are accepted;
                  invalid values fall back to the default.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>{framework === "react" ? "className" : "class"}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Additional CSS classes applied to the wrapper
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>
                    {framework === "vue" ? "apiEndpoint" : "api_endpoint"}
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <em>from HiveProvider</em>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Override the API endpoint for this component instance
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination note */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Pagination behavior</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The first page returns up to{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">limit</code>{" "}
              posts. Subsequent pages return up to{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                min(limit, 19)
              </code>{" "}
              posts because{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                bridge.get_account_posts
              </code>{" "}
              consumes one slot for the cursor (start_author / start_permlink).
              This is an upstream Hive API constraint, not a component
              limitation.
            </p>
          </div>
        </div>
      </section>

      {/* Tag filter example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tag filter</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Combine{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">account</code>{" "}
          with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">tag</code> to
          show only posts of that author tagged with a specific Hive tag. The
          filter is applied client-side to the returned page.
        </p>
        <CodeBlock
          code={CODE.tagFilter[framework]}
          language={code_language}
        />
      </section>

      {/* Pinned posts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pinned posts</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Unlike{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            HivePostList
          </code>{" "}
          (which accepts{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {"{ author, permlink }"}
          </code>{" "}
          and refetches each pinned post),{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            HiveAuthorPostList
          </code>{" "}
          expects full{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            AccountPost
          </code>{" "}
          objects so pinned posts can be rendered without an extra API call
          (avoiding N+1 fetches).
        </p>
        <CodeBlock
          code={CODE.pinnedExample[framework]}
          language={code_language}
        />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          useHiveAuthorPostList Hook
        </h2>
        <p className="text-muted-foreground mb-4">
          For full control, use the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            useHiveAuthorPostList
          </code>{" "}
          hook directly. It returns posts, loading state, and cursor-based
          pagination controls.
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
                  <code>
                    {framework === "vue"
                      ? "Ref<AccountPost[]>"
                      : "AccountPost[]"}
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Current page of posts authored by{" "}
                  <code>account</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>{framework === "vue" ? "isLoading" : "is_loading"}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>
                    {framework === "vue" ? "Ref<boolean>" : "boolean"}
                  </code>
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
                  <code>
                    {framework === "vue"
                      ? "Ref<Error | null>"
                      : "Error | null"}
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Fetch error, if any
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>page</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>
                    {framework === "vue" ? "Ref<number>" : "number"}
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Current page number (1-based)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>{framework === "vue" ? "hasPrev" : "has_prev"}</code> /{" "}
                  <code>{framework === "vue" ? "hasNext" : "has_next"}</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>
                    {framework === "vue" ? "Ref<boolean>" : "boolean"}
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Whether previous/next page exists
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>{framework === "vue" ? "prevPage" : "prev_page"}</code>{" "}
                  /{" "}
                  <code>{framework === "vue" ? "nextPage" : "next_page"}</code>
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
          language={code_language}
        />
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
          href={`/${framework}/content-renderer`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Content Renderer
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
