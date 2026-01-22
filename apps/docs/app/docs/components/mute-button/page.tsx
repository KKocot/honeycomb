import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, VolumeX, Volume2, Circle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveMuteButton } from "@/components/hive";

function UserProfile() {
  return (
    <HiveMuteButton
      username="spammer"
      onMute={(muted) => {
        console.log(muted ? "User muted" : "User unmuted");
      }}
    />
  );
}`,
  withoutStatus: `// Hide the status indicator
<HiveMuteButton
  username="spammer"
  showStatus={false}
/>`,
};

export default async function MuteButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveMuteButton</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Mute and unmute Hive users to hide their content from your feed.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-orange-500">Content Filtering</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Muting a user hides their posts and comments from your feed.
              Uses the &quot;ignore&quot; blockchain operation with posting key.
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
          {/* Not muted state */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">@spammer is not muted</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-orange-500 text-white">
                <VolumeX className="h-4 w-4" />
                Mute
              </button>
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-muted text-muted-foreground opacity-50 cursor-not-allowed">
                <Volume2 className="h-4 w-4" />
                Unmute
              </button>
            </div>
          </div>

          {/* Muted state */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <VolumeX className="h-4 w-4 text-orange-500" />
              <span className="text-orange-500">@spammer is muted</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-muted text-muted-foreground opacity-50 cursor-not-allowed">
                <VolumeX className="h-4 w-4" />
                Mute
              </button>
              <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium bg-muted text-foreground hover:bg-green-500/10 hover:text-green-500">
                <Volume2 className="h-4 w-4" />
                Unmute
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Auto-fetches mute status from blockchain on mount</li>
          <li>• Optimistic UI updates with 10s grace period</li>
          <li>• Confirmation dialog before broadcasting</li>
          <li>• Status indicator showing current mute state</li>
          <li>• Login prompt if user not authenticated</li>
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
                <td className="py-3 px-4"><code>onMute</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(muted: boolean) =&gt; void</code></td>
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
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/follow-button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Follow Button
        </Link>
        <Link
          href="/docs/components/vote-button"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Vote Button
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
