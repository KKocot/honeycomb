import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Shield, Key, Smartphone, Globe, Wallet, Lock, FileKey } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const LOGIN_METHODS = [
  { id: "hbauth", label: "HB-Auth", icon: Lock, desc: "Encrypted local storage - keys encrypted with password, stored in browser", security: 1 },
  { id: "keychain", label: "Keychain", icon: Key, desc: "Hive Keychain browser extension (Chrome, Firefox, Brave)", security: 2 },
  { id: "peakvault", label: "PeakVault", icon: Wallet, desc: "PeakD browser extension for key management", security: 2 },
  { id: "hiveauth", label: "HiveAuth", icon: Smartphone, desc: "Mobile app authentication via QR code scanning", security: 3 },
  { id: "hivesigner", label: "Hivesigner", icon: Globe, desc: "OAuth-style redirect to hivesigner.com", security: 4 },
  { id: "wif", label: "WIF", icon: FileKey, desc: "Direct private key entry - use only for testing", security: 5 },
];

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { SmartSigner } from "@kkocot/hive-ui-react";

function LoginPage() {
  return (
    <SmartSigner
      methods={["hbauth", "keychain", "wif"]}
      onLogin={(user) => console.log("Logged in:", user)}
    />
  );
}`,
  allMethods: `<SmartSigner
  methods={["hbauth", "keychain", "peakvault", "hiveauth", "hivesigner", "wif"]}
  onLogin={(user) => console.log(user)}
/>`,
  secureOnly: `// Most secure - only local encrypted storage
<SmartSigner
  methods={["hbauth"]}
  onLogin={handleLogin}
/>`,
  withKeyType: `<SmartSigner
  methods={["hbauth", "keychain"]}
  defaultKeyType="active"  // "posting" | "active" | "owner"
  onLogin={handleLogin}
/>`,
};

export default async function SmartSignerPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SmartSigner</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Multi-method authentication component for Hive.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Unified Login</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Single component supporting 6 authentication methods.
              Pass methods as props to enable only the ones you want.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <CodeBlock code={CODE.install} language="bash" />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <CodeBlock code={CODE.basic} language="tsx" />
      </section>

      {/* Available Methods */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Available Methods</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Method</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
                <th className="py-3 px-4 text-left font-semibold">Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LOGIN_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <tr key={method.id}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-hive-red" />
                        <code className="text-hive-red">{method.id}</code>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{method.desc}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                        method.security === 1 ? "bg-green-500/10 text-green-500" :
                        method.security === 2 ? "bg-blue-500/10 text-blue-500" :
                        method.security === 3 ? "bg-blue-500/10 text-blue-500" :
                        method.security === 4 ? "bg-yellow-500/10 text-yellow-600" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {method.security === 1 ? "★★★ Most Secure" :
                         method.security === 2 ? "★★☆ Secure" :
                         method.security === 3 ? "★★☆ Secure" :
                         method.security === 4 ? "★☆☆ Moderate" :
                         "☆☆☆ Use with caution"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Security Info */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Shield className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Security Recommendation</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <strong>HB-Auth</strong> is the most secure option - keys are encrypted locally and never leave your device.
              Browser extensions (Keychain, PeakVault) are secure but keys can be exposed if the extension is compromised.
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
                <td className="py-3 px-4"><code>methods</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(&quot;hbauth&quot; | &quot;keychain&quot; | &quot;peakvault&quot; | &quot;hiveauth&quot; | &quot;hivesigner&quot; | &quot;wif&quot;)[]</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>[&quot;hbauth&quot;, &quot;keychain&quot;, &quot;wif&quot;]</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>defaultKeyType</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;posting&quot; | &quot;active&quot; | &quot;owner&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;posting&quot;</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onLogin</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(user: SignerUser) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">All methods</h3>
            <CodeBlock code={CODE.allMethods} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Most secure only</h3>
            <CodeBlock code={CODE.secureOnly} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With active key</h3>
            <CodeBlock code={CODE.withKeyType} language="tsx" />
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
          href="/docs/components/avatar"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Avatar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
