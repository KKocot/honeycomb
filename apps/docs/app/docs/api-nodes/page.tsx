import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  Info,
  Globe,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

// Node data
const PUBLIC_NODES = [
  {
    url: "api.hive.blog",
    provider: "Hive",
    type: "Official",
    location: "Global",
    features: ["Full API", "Hivemind"],
  },
  {
    url: "api.deathwing.me",
    provider: "Deathwing",
    type: "Community",
    location: "Europe",
    features: ["Full API", "Hivemind", "HAF"],
  },
  {
    url: "anyx.io",
    provider: "Anyx",
    type: "Community",
    location: "Canada",
    features: ["Full API", "Hivemind"],
  },
  {
    url: "api.openhive.network",
    provider: "OpenHive",
    type: "Community",
    location: "Global",
    features: ["Full API", "Hivemind"],
  },
  {
    url: "rpc.ausbit.dev",
    provider: "Ausbit",
    type: "Community",
    location: "Australia",
    features: ["Full API", "Hivemind"],
  },
  {
    url: "hive-api.arcange.eu",
    provider: "Arcange",
    type: "Community",
    location: "Europe",
    features: ["Full API", "Hivemind", "HAF"],
  },
  {
    url: "api.c0ff33a.uk",
    provider: "C0ff33a",
    type: "Community",
    location: "UK",
    features: ["Full API", "Hivemind"],
  },
  {
    url: "hived.emre.sh",
    provider: "Emre",
    type: "Community",
    location: "Germany",
    features: ["Full API"],
  },
];

const CODE = {
  basicConfig: `<HiveProvider apiEndpoint="https://api.hive.blog">
  {children}
</HiveProvider>`,
  fallbackConfig: `<HiveProvider
  apiEndpoint="https://api.hive.blog"
  fallbackEndpoints={[
    "https://api.deathwing.me",
    "https://anyx.io",
    "https://api.openhive.network",
    "https://rpc.ausbit.dev",
  ]}
>
  {children}
</HiveProvider>`,
  regionConfig: `// For users in Europe
const EUROPE_NODES = [
  "https://api.deathwing.me",
  "https://hive-api.arcange.eu",
  "https://api.c0ff33a.uk",
  "https://api.hive.blog",
];

// For users in Asia-Pacific
const APAC_NODES = [
  "https://rpc.ausbit.dev",
  "https://api.hive.blog",
  "https://anyx.io",
];

// For users in Americas
const AMERICAS_NODES = [
  "https://anyx.io",
  "https://api.hive.blog",
  "https://api.openhive.network",
];`,
  healthCheck: `import { useHiveChain } from "@/components/hive/hive-provider";
import { useEffect, useState } from "react";

export function useNodeHealth() {
  const { chain, apiEndpoint } = useHiveChain();
  const [latency, setLatency] = useState<number | null>(null);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!chain) return;

    async function checkHealth() {
      const start = performance.now();

      try {
        const props = await chain.api.database_api.get_dynamic_global_properties({});
        const end = performance.now();

        setLatency(Math.round(end - start));
        setBlockHeight(props.head_block_number);
      } catch (error) {
        setLatency(null);
        setBlockHeight(null);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [chain]);

  return { latency, blockHeight, apiEndpoint };
}`,
  nodeSwitcher: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";
import { useState } from "react";

const NODES = [
  { url: "https://api.hive.blog", name: "Hive (Official)" },
  { url: "https://api.deathwing.me", name: "Deathwing" },
  { url: "https://anyx.io", name: "Anyx" },
];

export function NodeSwitcher() {
  const { apiEndpoint, switchEndpoint } = useHiveChain();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSwitch(url: string) {
    if (url === apiEndpoint) return;

    setIsLoading(true);
    try {
      await switchEndpoint(url);
    } catch (error) {
      console.error("Failed to switch node:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      {NODES.map((node) => (
        <button
          key={node.url}
          onClick={() => handleSwitch(node.url)}
          disabled={isLoading}
          className={\`px-3 py-1.5 rounded text-sm \${
            apiEndpoint === node.url
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }\`}
        >
          {node.name}
        </button>
      ))}
    </div>
  );
}`,
};

export default async function ApiNodesPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Nodes</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Configure and manage Hive API nodes for your application.
        </p>
      </div>

      {/* Introduction */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">What are API Nodes?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive API nodes are servers that provide access to the Hive blockchain.
              They handle JSON-RPC requests for reading blockchain data and broadcasting
              transactions. Using multiple nodes ensures reliability and better performance.
            </p>
          </div>
        </div>
      </section>

      {/* Public Nodes List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Public Nodes</h2>
        <p className="text-muted-foreground mb-4">
          These are publicly available Hive API nodes maintained by the community:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Node URL</th>
                <th className="py-3 px-4 text-left font-semibold">Provider</th>
                <th className="py-3 px-4 text-left font-semibold">Location</th>
                <th className="py-3 px-4 text-left font-semibold">Features</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PUBLIC_NODES.map((node) => (
                <tr key={node.url}>
                  <td className="py-3 px-4">
                    <code className="text-hive-red">{node.url}</code>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-2">
                      {node.provider}
                      {node.type === "Official" && (
                        <span className="rounded bg-hive-red/10 px-1.5 py-0.5 text-xs text-hive-red">
                          Official
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{node.location}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {node.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded bg-muted px-1.5 py-0.5 text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Configuration */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Configuration</h2>
        <p className="text-muted-foreground mb-4">
          Set the primary API node in your <code>HiveProvider</code>:
        </p>

        <CodeBlock code={CODE.basicConfig} language="tsx" />
      </section>

      {/* Fallback Configuration */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Fallback Nodes</h2>
        <p className="text-muted-foreground mb-4">
          For production applications, always configure fallback nodes. If the primary
          node fails, the provider will automatically try the next one:
        </p>

        <CodeBlock code={CODE.fallbackConfig} language="tsx" />

        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-hive-red" />
            <span className="font-semibold">How Fallback Works</span>
          </div>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
            <li>Provider attempts to connect to the primary endpoint</li>
            <li>If connection fails, tries the first fallback node</li>
            <li>Continues through the list until successful connection</li>
            <li>If all nodes fail, sets an error state</li>
          </ol>
        </div>
      </section>

      {/* Regional Configuration */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Regional Optimization</h2>
        <p className="text-muted-foreground mb-4">
          For better latency, prioritize nodes geographically closer to your users:
        </p>

        <CodeBlock
          filename="lib/hive-nodes.ts"
          code={CODE.regionConfig}
          language="typescript"
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <Globe className="h-6 w-6 text-blue-500 mb-2" />
            <h3 className="font-semibold text-sm">Europe</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Deathwing, Arcange, C0ff33a
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Globe className="h-6 w-6 text-green-500 mb-2" />
            <h3 className="font-semibold text-sm">Americas</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Anyx, Hive Official, OpenHive
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Globe className="h-6 w-6 text-yellow-500 mb-2" />
            <h3 className="font-semibold text-sm">Asia-Pacific</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Ausbit, Hive Official
            </p>
          </div>
        </div>
      </section>

      {/* Node Health Check */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Health Monitoring</h2>
        <p className="text-muted-foreground mb-4">
          Monitor node health to provide feedback to users or implement smart node
          switching:
        </p>

        <CodeBlock
          filename="hooks/use-node-health.ts"
          code={CODE.healthCheck}
          language="typescript"
        />
      </section>

      {/* Node Switcher Component */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Manual Node Switching</h2>
        <p className="text-muted-foreground mb-4">
          Allow users to manually switch between nodes:
        </p>

        <CodeBlock
          filename="components/node-switcher.tsx"
          code={CODE.nodeSwitcher}
          language="typescript"
        />
      </section>

      {/* Best Practices */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Best Practices</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Use Multiple Fallback Nodes</p>
              <p className="text-sm text-muted-foreground">
                Always configure at least 3-4 fallback nodes for production apps.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Consider Geographic Distribution</p>
              <p className="text-sm text-muted-foreground">
                Include nodes from different regions to handle regional outages.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Monitor Node Health</p>
              <p className="text-sm text-muted-foreground">
                Implement health checks to detect slow or unresponsive nodes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Don&apos;t Rely on a Single Node</p>
              <p className="text-sm text-muted-foreground">
                Public nodes can go down or have rate limits. Always have backups.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Don&apos;t Hardcode Node URLs</p>
              <p className="text-sm text-muted-foreground">
                Use environment variables or configuration files for flexibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits Warning */}
      <section className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-500">Rate Limits</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Public nodes may have rate limits. For high-traffic production
              applications, consider running your own node or using a dedicated
              RPC provider. Some community members offer premium node access for
              projects with higher requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Running Your Own Node */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Running Your Own Node</h2>
        <p className="text-muted-foreground mb-4">
          For maximum reliability and performance, you can run your own Hive node:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <Clock className="h-6 w-6 text-muted-foreground mb-2" />
            <h3 className="font-semibold">Full Node</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Complete blockchain data. Requires ~500GB storage and good bandwidth.
              Recommended for production apps.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Zap className="h-6 w-6 text-muted-foreground mb-2" />
            <h3 className="font-semibold">Light Node</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reduced storage requirements. Limited historical data. Good for
              development and testing.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          See the{" "}
          <a
            href="https://developers.hive.io/quickstart/hive_full_nodes.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-hive-red hover:underline"
          >
            Hive Developer Portal
          </a>{" "}
          for instructions on setting up your own node.
        </p>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/theming"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Theming
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/components/keychain-login"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Add Authentication
          </Link>
        </div>
      </section>
    </article>
  );
}
