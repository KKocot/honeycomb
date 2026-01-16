import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Key, Shield, Eye, Copy, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { HiveAuthorities } from "@kkocot/hive-ui-react";

function KeysPage() {
  return <HiveAuthorities username="barddev" />;
}`,
  withReveal: `// Enable private key reveal (requires auth method that stores keys)
<HiveAuthorities
  username="barddev"
  enableReveal
/>`,
  hideElements: `// Hide specific elements
<HiveAuthorities
  username="barddev"
  hide={["memo", "reveal"]}
/>

// Available options: "owner" | "active" | "posting" | "memo" | "reveal" | "warning"`,
  withCallback: `// Callback when key is copied
<HiveAuthorities
  username="barddev"
  onCopy={(keyType) => console.log(\`Copied \${keyType} key\`)}
/>`,
  customStyle: `// Custom styling
<HiveAuthorities
  username="barddev"
  className="max-w-xl"
  style={{ borderRadius: 16 }}
/>`,
};

export default async function AuthoritiesPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveAuthorities</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display and manage account keys and multi-signature authorities.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches account authorities automatically. Hive uses hierarchical keys: Owner (most powerful),
              Active (financial), Posting (social), and Memo (encrypted messages).
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
          <div className="max-w-xl space-y-4">
            {/* Warning */}
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-500">Security Warning</p>
                  <p className="text-sm text-muted-foreground">
                    Never share your private keys.
                  </p>
                </div>
              </div>
            </div>

            {/* Owner key section */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Owner Key</h4>
                    <p className="text-xs text-muted-foreground">
                      Account recovery (keep offline!)
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Threshold: 1</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <code className="truncate">STM7abc...xyz</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">w:1</span>
                  <Copy className="h-3 w-3 cursor-pointer" />
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-500 hover:bg-red-500/10">
                <Eye className="h-4 w-4 inline mr-2" /> Reveal Private Key
              </button>
            </div>

            {/* Posting key section */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Posting Key</h4>
                    <p className="text-xs text-muted-foreground">
                      Posts, comments, votes
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Threshold: 1</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <code className="truncate">STM8def...uvw</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">w:1</span>
                  <Copy className="h-3 w-3 cursor-pointer" />
                </div>
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
                <td className="py-3 px-4"><code>enableReveal</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("owner" | "active" | "posting" | "memo" | "reveal" | "warning")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onCopy</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(keyType: string) =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Enable reveal</h3>
            <CodeBlock code={CODE.withReveal} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Hide elements</h3>
            <CodeBlock code={CODE.hideElements} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With callback</h3>
            <CodeBlock code={CODE.withCallback} language="tsx" />
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
          href="/docs/components/proposals"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Proposals
        </Link>
        <Link
          href="/docs/components/account-settings"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Account Settings
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
