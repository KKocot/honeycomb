import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Lock, Shield } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveHBAuthLogin } from "@/components/hive";

function LoginPage() {
  return (
    <HiveHBAuthLogin
      onSuccess={(result) => {
        console.log("Logged in:", result.username);
        // result.loginMethod = "hbauth"
        // result.keyType = "posting" | "active"
      }}
      onError={(error) => console.error(error.message)}
    />
  );
}`,
  withKeyType: `// Register/unlock active key for wallet operations
<HiveHBAuthLogin
  keyType="active"
  onSuccess={handleLogin}
/>`,
};

export default async function HBAuthLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveHBAuthLogin</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Login using encrypted local key storage (Safe Storage).
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-emerald-500">Most Secure Option</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Keys encrypted with your password and stored locally in browser.
              Never sent to any server. Uses WASM-based Beekeeper for encryption.
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
            {/* Mode tabs */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button className="flex-1 py-2 text-sm font-medium bg-emerald-600 text-white">
                Register Key
              </button>
              <button className="flex-1 py-2 text-sm font-medium bg-background">
                Unlock
              </button>
            </div>

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
              <label className="block text-sm font-medium mb-1">Create Password</label>
              <input
                type="password"
                placeholder="Create strong password"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Private Posting Key (WIF)</label>
              <input
                type="password"
                placeholder="5..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background font-mono text-sm"
                disabled
              />
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium">
              <Lock className="h-5 w-5" />
              Save Key
            </button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>Key encrypted locally. Never sent to any server.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Security: ★★★ Most Secure</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Keys encrypted with AES-256 using your password. Stored only in browser&apos;s IndexedDB.
              No browser extension required. Works on any modern browser.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li><strong>Register:</strong> Enter username, create password, paste private key</li>
          <li><strong>Encrypt:</strong> Key is encrypted with your password using WASM Beekeeper</li>
          <li><strong>Store:</strong> Encrypted key saved to browser&apos;s IndexedDB</li>
          <li><strong>Unlock:</strong> Enter password to decrypt and use key for transactions</li>
        </ol>
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
            <h3 className="text-sm font-medium mb-2">Register/unlock active key</h3>
            <CodeBlock code={CODE.withKeyType} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/components/hiveauth-login"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          HiveAuth Login
        </Link>
        <Link
          href="/docs/components/wif-login"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          WIF Login
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
