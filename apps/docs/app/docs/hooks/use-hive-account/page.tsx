import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/honeycomb-react`,
  basic: `import { useHiveAccount } from "@kkocot/honeycomb-react";

function Profile() {
  const { account, isLoading, error } = useHiveAccount("barddev");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Balance: {account.balance}</p>
      <p>HP: {account.hive_power}</p>
    </div>
  );
}`,
  withMetadata: `// Access profile metadata
const { account } = useHiveAccount("barddev");

const profile = account.profile; // parsed posting_json_metadata
console.log(profile.name);       // "Bard Dev"
console.log(profile.about);      // "Building on Hive"
console.log(profile.website);    // "https://example.com"`,
  refetch: `// Manually refresh account data
const { account, refetch, isLoading } = useHiveAccount("barddev");

<button onClick={refetch} disabled={isLoading}>
  Refresh
</button>`,
};

export default async function UseHiveAccountPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useHiveAccount</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Fetch and manage Hive account data.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Account data</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches account info including balances, HP, reputation, and profile metadata.
              Automatically converts VESTS to Hive Power.
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

      {/* Return Values */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Return Value</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>account</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>HiveAccount</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>null</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isLoading</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>Error | null</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>null</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>refetch</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>() =&gt; void</code></td>
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
            <h3 className="text-sm font-medium mb-2">Profile metadata</h3>
            <CodeBlock code={CODE.withMetadata} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Manual refresh</h3>
            <CodeBlock code={CODE.refetch} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/hooks/use-hive-chain"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          useHiveChain
        </Link>
        <Link
          href="/docs/components/avatar"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Components
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
