import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Settings, User, Bell, Save } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveAccountSettings } from "@kkocot/hive-ui-react";

function SettingsPage() {
  return <HiveAccountSettings />;
}`,
  initialTab: `// Start on specific tab
<HiveAccountSettings initialTab="preferences" />

// Available tabs: "profile" | "preferences" | "notifications"`,
  withCallback: `// Callback after save
<HiveAccountSettings
  onSuccess={(tab, data) => {
    console.log(\`Saved \${tab}:\`, data);
    refetchProfile();
  }}
/>`,
  hideElements: `// Hide specific tabs
<HiveAccountSettings
  hide={["notifications"]}
/>

// Available options: "profile" | "preferences" | "notifications"`,
  customStyle: `// Custom styling
<HiveAccountSettings
  className="max-w-xl"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function AccountSettingsPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveAccountSettings</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage profile information and account preferences.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches current profile automatically. Saves profile using posting key from SmartSigner.
              Profile data is stored in posting_json_metadata on the blockchain.
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
          <div className="max-w-xl mx-auto rounded-xl border border-border">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Account Settings</h3>
                <p className="text-sm text-muted-foreground">@barddev</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-hive-red text-hive-red">
                <User className="h-4 w-4" /> Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" /> Preferences
              </button>
              <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Bell className="h-4 w-4" /> Notifications
              </button>
            </div>

            {/* Form preview */}
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                  <div className="px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                    https://...
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <div className="px-3 py-2 rounded-lg bg-muted border border-border">
                  Bard Dev
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">About</label>
                <div className="px-3 py-2 rounded-lg bg-muted border border-border h-20 text-muted-foreground">
                  Tell us about yourself
                </div>
              </div>
              <button className="w-full py-3 rounded-lg bg-hive-red text-white font-medium flex items-center justify-center gap-2">
                <Save className="h-4 w-4" /> Save Profile
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
                <td className="py-3 px-4"><code>initialTab</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`"profile" | "preferences" | "notifications"`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>"profile"</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("profile" | "preferences" | "notifications")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(tab, data) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
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
            <h3 className="text-sm font-medium mb-2">Initial tab</h3>
            <CodeBlock code={CODE.initialTab} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With callback</h3>
            <CodeBlock code={CODE.withCallback} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide tabs</h3>
            <CodeBlock code={CODE.hideElements} language="tsx" />
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
          href="/docs/components/authorities"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Authorities
        </Link>
        <Link
          href="/docs/hooks/use-hive-chain"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          useHiveChain
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
