import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, FileKey, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveWIFLogin } from "@/components/hive";

function LoginPage() {
  return (
    <HiveWIFLogin
      onSuccess={(result) => {
        console.log("Logged in:", result.username);
        // result.loginMethod = "wif"
        // result.keyType = "posting" | "active"
      }}
      onError={(error) => console.error(error.message)}
    />
  );
}`,
  withKeyType: `// Request active key
<HiveWIFLogin
  keyType="active"
  onSuccess={handleLogin}
/>`,
};

export default async function WIFLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveWIFLogin</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Login by directly entering private key (WIF format).
        </p>
      </div>

      {/* Warning */}
      <section className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-500">Development Only</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This method exposes your private key directly. Use only for local development
              and testing. Never use in production with real keys.
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
          <div className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                placeholder="your-username"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Private Key (WIF)</label>
              <input
                type="password"
                placeholder="5..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm"
                disabled
              />
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 text-white font-medium">
              <FileKey className="h-5 w-5" />
              Login with WIF
            </button>

            <div className="flex items-start gap-2 text-xs text-orange-500">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Key stored in memory only. For development use.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-500">Security: ☆☆☆ Use with caution</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Private key is entered directly and kept in memory. Can be exposed via
              browser devtools, extensions, or XSS attacks. Only for testing.
            </p>
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
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(result: HiveLoginResult) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onError</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(error: AuthError) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onPending</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(pending: boolean) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>defaultUsername</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>keyType</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;posting&quot; | &quot;active&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;posting&quot;</code></td>
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
            <h3 className="text-sm font-medium mb-2">Request active key</h3>
            <CodeBlock code={CODE.withKeyType} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/hbauth-login"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          HB-Auth Login
        </Link>
        <Link
          href="/docs/components/follow-button"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Follow Button
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
