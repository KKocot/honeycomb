import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, UserPlus, UserMinus, CheckCircle2, Circle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveFollowButton } from "@/components/hive";

function UserProfile() {
  return (
    <HiveFollowButton
      username="barddev"
      onFollow={(following) => {
        console.log(following ? "Now following" : "Unfollowed");
      }}
    />
  );
}`,
  withoutStatus: `// Hide the status indicator
<HiveFollowButton
  username="barddev"
  showStatus={false}
/>`,
  withProvider: `import { HiveProvider } from "@/contexts/hive-context";
import { HiveFollowButton } from "@/components/hive";

function App() {
  return (
    <HiveProvider>
      <HiveFollowButton username="gtg" />
    </HiveProvider>
  );
}`,
};

export default async function FollowButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveFollowButton</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Follow and unfollow Hive users with optimistic UI updates and status tracking.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained Component</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Automatically checks follow status via blockchain API, handles transactions
              with optimistic updates, and shows confirmation dialogs. Uses posting key.
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
        <div className="rounded-lg border border-border p-6 space-y-6">
          {/* Not following state */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Not following @barddev</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-hive-red text-white">
                <UserPlus className="h-4 w-4" />
                Follow
              </button>
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-muted text-muted-foreground opacity-50 cursor-not-allowed">
                <UserMinus className="h-4 w-4" />
                Unfollow
              </button>
            </div>
          </div>

          {/* Following state */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-green-500">You follow @barddev</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-muted text-muted-foreground opacity-50 cursor-not-allowed">
                <UserPlus className="h-4 w-4" />
                Follow
              </button>
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500">
                <UserMinus className="h-4 w-4" />
                Unfollow
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Auto-fetches follow status from blockchain on mount</li>
          <li>• Optimistic UI updates with 10s grace period</li>
          <li>• Confirmation dialog before broadcasting</li>
          <li>• Status indicator showing current relationship</li>
          <li>• Login prompt if user not authenticated</li>
          <li>• WIF/HB-Auth password dialogs when needed</li>
          <li>• Hidden when viewing own profile</li>
        </ul>
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
                <td className="py-3 px-4"><code>onFollow</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(following: boolean) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showStatus</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
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

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Without status indicator</h3>
            <CodeBlock code={CODE.withoutStatus} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With HiveProvider</h3>
            <CodeBlock code={CODE.withProvider} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/wif-login"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          WIF Login
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
