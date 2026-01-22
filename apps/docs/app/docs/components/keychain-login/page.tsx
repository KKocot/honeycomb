import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Key, Shield } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  basic: `import { HiveKeychainLogin } from "@/components/hive";

function LoginPage() {
  return (
    <HiveKeychainLogin
      onSuccess={(result) => {
        console.log("Logged in:", result.username);
        // result.loginMethod = "keychain"
        // result.keyType = "posting" | "active"
      }}
      onError={(error) => console.error(error.message)}
    />
  );
}`,
  withProvider: `import { HiveAuthProvider } from "@/providers/hive-auth-provider";
import { HiveKeychainLogin } from "@/components/hive";

function App() {
  return (
    <HiveAuthProvider>
      <HiveKeychainLogin
        onSuccess={(result) => {
          // Provider automatically updates user state
          router.push("/dashboard");
        }}
      />
    </HiveAuthProvider>
  );
}`,
  withKeyType: `// Request active key for wallet operations
<HiveKeychainLogin
  keyType="active"
  onSuccess={handleLogin}
/>`,
  withDefaultUser: `// Pre-fill username
<HiveKeychainLogin
  defaultUsername="barddev"
  onSuccess={handleLogin}
/>`,
};

export default async function KeychainLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveKeychainLogin</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Login using Hive Keychain browser extension.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Browser Extension Required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Requires Hive Keychain extension installed in Chrome, Firefox, or Brave.
              Component automatically detects if extension is available.
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
              <label className="block text-sm font-medium mb-1.5">Hive Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                disabled
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium">
              <Key className="h-5 w-5" />
              Login with Keychain
            </button>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Security: ★★☆ Secure</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Keys managed by browser extension. Never exposed to the website.
              Extension handles transaction signing securely.
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
            <h3 className="text-sm font-medium mb-2">With HiveAuthProvider</h3>
            <CodeBlock code={CODE.withProvider} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Request active key</h3>
            <CodeBlock code={CODE.withKeyType} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Pre-fill username</h3>
            <CodeBlock code={CODE.withDefaultUser} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/theming"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Theming
        </Link>
        <Link
          href="/docs/components/peakvault-login"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          PeakVault Login
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
