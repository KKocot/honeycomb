import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  hook: `import { useContext } from "react";
import { HiveContext } from "@/components/hive/hive-provider";

export function useHiveChain() {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHiveChain must be used within a HiveProvider");
  }
  return context;
}`,
  basicUsage: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";

export function ChainStatus() {
  const { chain, isReady, error, apiEndpoint } = useHiveChain();

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!isReady) {
    return <div>Connecting to Hive blockchain...</div>;
  }

  return (
    <div className="text-green-500">
      Connected to {apiEndpoint}
    </div>
  );
}`,
  apiCall: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";
import { useEffect, useState } from "react";

export function GlobalProperties() {
  const { chain, isReady } = useHiveChain();
  const [props, setProps] = useState<any>(null);

  useEffect(() => {
    if (!isReady || !chain) return;

    async function fetchProps() {
      const result = await chain.api.database_api.get_dynamic_global_properties({});
      setProps(result);
    }

    fetchProps();
  }, [chain, isReady]);

  if (!props) return <div>Loading...</div>;

  return (
    <div className="space-y-2">
      <p>Head Block: {props.head_block_number}</p>
      <p>Current Witness: {props.current_witness}</p>
      <p>Total HIVE: {props.current_supply}</p>
    </div>
  );
}`,
  switchNode: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";
import { useState } from "react";

export function NodeSelector() {
  const { apiEndpoint, switchEndpoint, isReady } = useHiveChain();
  const [switching, setSwitching] = useState(false);

  const nodes = [
    "https://api.hive.blog",
    "https://api.deathwing.me",
    "https://anyx.io",
  ];

  async function handleSwitch(node: string) {
    if (node === apiEndpoint || switching) return;

    setSwitching(true);
    try {
      await switchEndpoint(node);
    } catch (err) {
      console.error("Failed to switch:", err);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Current: {apiEndpoint}
      </p>
      <div className="flex gap-2">
        {nodes.map((node) => (
          <button
            key={node}
            onClick={() => handleSwitch(node)}
            disabled={switching || !isReady}
            className={\`px-3 py-1.5 rounded text-sm \${
              apiEndpoint === node
                ? "bg-hive-red text-white"
                : "bg-muted hover:bg-muted/80"
            }\`}
          >
            {node.replace("https://", "")}
          </button>
        ))}
      </div>
    </div>
  );
}`,
};

export default async function UseHiveChainPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useHiveChain</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Access the Hive blockchain chain instance and connection status.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Core Hook</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <code>useHiveChain</code> is the foundation for all Hive blockchain
              interactions. It provides access to the chain instance initialized by{" "}
              <code>HiveProvider</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hook Definition</h2>
        <p className="text-muted-foreground mb-4">
          This hook is included in <code>HiveProvider</code>. Here&apos;s the
          implementation:
        </p>
        <CodeBlock filename="hooks/use-hive-chain.ts" code={CODE.hook} language="typescript" />
      </section>

      {/* Return Values */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Return Values</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>chain</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>IHiveChainInterface | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  The @hiveio/wax chain instance for API calls
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isReady</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  True when chain is initialized and ready
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>Error | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Error object if initialization failed
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>apiEndpoint</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Currently connected API node URL
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>switchEndpoint</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(url: string) =&gt; Promise&lt;void&gt;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Function to switch to a different API node
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <p className="text-muted-foreground mb-4">
          Check connection status and display feedback to users:
        </p>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Making API Calls */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Making API Calls</h2>
        <p className="text-muted-foreground mb-4">
          Use the chain instance to fetch blockchain data:
        </p>
        <CodeBlock code={CODE.apiCall} language="typescript" />
      </section>

      {/* Switching Nodes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Switching Nodes</h2>
        <p className="text-muted-foreground mb-4">
          Allow users to switch between API nodes:
        </p>
        <CodeBlock code={CODE.switchNode} language="typescript" />
      </section>

      {/* Best Practices */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Always check <code>isReady</code>:</strong> Before making API
              calls, ensure the chain is initialized.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Handle errors gracefully:</strong> Display user-friendly
              messages when connection fails.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Use in client components:</strong> This hook requires React
              context, so use <code>&quot;use client&quot;</code> directive.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/hooks/use-hive-auth"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            useHiveAuth
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
