import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Key, Shield, Copy, AlertTriangle, Pencil, PlusCircle, Trash2, User } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/honeycomb-react`,
  basic: `import { HiveAuthorities } from "@kkocot/honeycomb-react";

function KeysPage() {
  return <HiveAuthorities username="barddev" />;
}`,
  editable: `// Enable editing mode for adding/removing authorities
<HiveAuthorities
  username="barddev"
  editable
  onSave={async (level, data) => {
    // level: "owner" | "active" | "posting"
    // data: { keyAuths, accountAuths, weightThreshold }
    console.log("Save:", level, data);
    await broadcastAuthorityUpdate(level, data);
  }}
/>`,
  hideElements: `// Hide specific elements
<HiveAuthorities
  username="barddev"
  hide={["memo", "warning"]}
/>

// Available options: "owner" | "active" | "posting" | "memo" | "warning"`,
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
          Display and manage account keys and multi-signature authorities with add/edit/delete support.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Self-contained with editing</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches account authorities automatically. Supports multi-sig with key and account authorities.
              Enable <code className="px-1 bg-muted rounded">editable</code> prop to add/remove keys and accounts.
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

            {/* Posting key section with edit button */}
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Posting</h4>
                    <p className="text-xs text-muted-foreground">
                      Posts, comments, votes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Threshold: 1</span>
                  <button className="p-1.5 rounded text-muted-foreground hover:bg-muted">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Key item */}
              <div className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm mb-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <code className="text-xs">STM7abc...xyz</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">w:1</span>
                  <Copy className="h-3 w-3 cursor-pointer" />
                </div>
              </div>

              {/* Account auth item */}
              <div className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <code className="text-xs">@hive.blog</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">w:1</span>
                  <Copy className="h-3 w-3 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Edit mode preview */}
            <div className="rounded-lg border border-dashed border-primary/50 p-4 bg-primary/5">
              <p className="text-xs font-medium text-primary mb-3">Edit Mode Preview</p>

              {/* Add button */}
              <button className="w-full flex items-center justify-center gap-2 py-2 mb-2 rounded border border-dashed border-border text-sm text-muted-foreground hover:bg-muted/50">
                <PlusCircle className="h-4 w-4" />
                Add key or account
              </button>

              {/* Editable item */}
              <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm">
                <Key className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value="STM7abc...xyz"
                  readOnly
                  className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
                />
                <input
                  type="number"
                  value={1}
                  readOnly
                  className="w-16 px-2 py-1 text-xs border border-border rounded bg-background text-center"
                />
                <button className="p-1 rounded text-red-500 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </button>
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
                <td className="py-3 px-4"><code>editable</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>hide</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`("owner" | "active" | "posting" | "memo" | "warning")[]`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>[]</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onCopy</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(keyType: string) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onSave</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(level: EditableKeyType, data: AuthorityData) =&gt; Promise&lt;void&gt;</code></td>
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
            <h3 className="text-sm font-medium mb-2">Editable mode</h3>
            <CodeBlock code={CODE.editable} language="tsx" />
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
          href="/docs/components/account-settings"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Account Settings
        </Link>
        <Link
          href="/docs/hooks/use-hive-chain"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Hooks
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
