import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveUserCard } from "@/components/hive";

function ProfilePage() {
  return (
    <div className="max-w-md">
      <HiveUserCard username="barddev" />
    </div>
  );
}`,
  variants: `// Compact - inline display
<HiveUserCard username="barddev" variant="compact" />

// Default - card with basic info
<HiveUserCard username="barddev" variant="default" />

// Expanded - full profile card with cover image
<HiveUserCard username="barddev" variant="expanded" />`,
  withoutStats: `// Hide post count and balances
<HiveUserCard username="barddev" showStats={false} />`,
  userList: `// List of users with compact variant
const users = ["barddev", "barddev", "barddev"];

{users.map((username, index) => (
  <HiveUserCard key={index} username={username} variant="compact" />
))}`,
  customStyle: `// Custom styling with className and style
<HiveUserCard
  username="barddev"
  className="bg-hive-red/10 border-hive-red"
  style={{ maxWidth: 320 }}
/>`,
};

export default async function UserCardPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveUserCard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive user profile information in various formats.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">User Data</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches user data from blockchain. Displays profile info, reputation,
              and optionally balances and post count.
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
          <div className="max-w-md space-y-4">
            {/* Compact preview */}
            <div className="flex items-center gap-2">
              <img
                src="https://images.hive.blog/u/barddev/avatar"
                alt="@barddev"
                className="h-8 w-8 rounded-full"
              />
              <div>
                <span className="font-medium">@barddev</span>
                <span className="text-muted-foreground text-sm ml-1">(65)</span>
              </div>
            </div>

            {/* Default preview */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.hive.blog/u/barddev/avatar"
                  alt="@barddev"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">barddev</h3>
                  <p className="text-sm text-muted-foreground">@barddev • Rep: 65</p>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <span>42 posts</span>
                <span>100.000 HIVE</span>
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
                <td className="py-3 px-4"><code>username</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;compact&quot; | &quot;default&quot; | &quot;expanded&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;default&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showStats</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
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
            <h3 className="text-sm font-medium mb-2">Variants</h3>
            <CodeBlock code={CODE.variants} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Without stats</h3>
            <CodeBlock code={CODE.withoutStats} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">User list</h3>
            <CodeBlock code={CODE.userList} language="tsx" />
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
          href="/components/avatar"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Avatar
        </Link>
        <Link
          href="/components/balance-card"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Balance Card
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
