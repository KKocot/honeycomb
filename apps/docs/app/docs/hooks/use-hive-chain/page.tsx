import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/hive-ui-react`,
  basic: `import { useHiveChain } from "@kkocot/hive-ui-react";

function MyComponent() {
  const { chain, isReady } = useHiveChain();

  if (!isReady) return <div>Connecting...</div>;

  return <div>Connected to Hive</div>;
}`,
  fetchAccount: `// Fetch account data
const { chain } = useHiveChain();

const account = await chain.api.database_api.find_accounts({
  accounts: ["barddev"]
});`,
  fetchPosts: `// Fetch posts from a community
const { chain } = useHiveChain();

const posts = await chain.api.bridge.get_ranked_posts({
  sort: "trending",
  tag: "hive-167922",
  limit: 10
});`,
  dynamicGlobal: `// Get blockchain properties
const { chain } = useHiveChain();

const props = await chain.api.database_api.get_dynamic_global_properties({});
console.log("Head block:", props.head_block_number);`,
};

export default async function UseHiveChainPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useHiveChain</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Direct access to the Hive blockchain API for custom queries.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Low-level access</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use this hook when built-in components don't cover your use case.
              Provides raw access to @hiveio/wax chain instance.
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
                <td className="py-3 px-4"><code>chain</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>IHiveChainInterface</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>null</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isReady</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>Error | null</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>null</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>apiEndpoint</code></td>
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
            <h3 className="text-sm font-medium mb-2">Fetch account</h3>
            <CodeBlock code={CODE.fetchAccount} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Fetch posts</h3>
            <CodeBlock code={CODE.fetchPosts} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Blockchain properties</h3>
            <CodeBlock code={CODE.dynamicGlobal} language="tsx" />
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
          href="/docs/hooks/use-hive-auth"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          useHiveAuth
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
