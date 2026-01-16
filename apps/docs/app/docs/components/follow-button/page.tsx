import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, UserPlus, UserMinus } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveFollowButton } from "@kkocot/hive-ui-react";

function UserProfile() {
  return <HiveFollowButton username="barddev" />;
}`,
  withCallback: `// Optional callback after action
<HiveFollowButton
  username="barddev"
  onSuccess={(action) => console.log(action)} // "followed" | "unfollowed"
/>`,
  variants: `// Default - filled button
<HiveFollowButton username="barddev" variant="default" />

// Outline - bordered button
<HiveFollowButton username="barddev" variant="outline" />

// Ghost - text only
<HiveFollowButton username="barddev" variant="ghost" />`,
  sizes: `<HiveFollowButton username="barddev" size="sm" />
<HiveFollowButton username="barddev" size="md" />
<HiveFollowButton username="barddev" size="lg" />`,
  customStyle: `// Custom styling
<HiveFollowButton
  username="barddev"
  className="rounded-full px-6"
  style={{ minWidth: 120 }}
/>`,
};

export default async function FollowButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveFollowButton</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Follow and unfollow Hive users with optimistic UI updates.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Automatically checks follow status and handles transactions.
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
          <div className="flex flex-wrap gap-4">
            {/* Not following */}
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-hive-red text-white">
              <UserPlus className="h-4 w-4" />
              Follow
            </button>

            {/* Following */}
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground">
              <UserMinus className="h-4 w-4" />
              Following
            </button>

            {/* Outline */}
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-hive-red text-hive-red">
              <UserPlus className="h-4 w-4" />
              Follow
            </button>
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
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(action: &quot;followed&quot; | &quot;unfollowed&quot;) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;default&quot; | &quot;outline&quot; | &quot;ghost&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;default&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>size</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;md&quot;</code></td>
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
            <h3 className="text-sm font-medium mb-2">Variants</h3>
            <CodeBlock code={CODE.variants} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Sizes</h3>
            <CodeBlock code={CODE.sizes} language="tsx" />
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
          href="/docs/components/user-card"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          User Card
        </Link>
        <Link
          href="/docs/components/mute-button"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Mute Button
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
