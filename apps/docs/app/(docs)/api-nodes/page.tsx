import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Zap } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const PUBLIC_NODES = [
  { url: "api.hive.blog", provider: "@blocktrades", default: true },
  { url: "api.openhive.network", provider: "@gtg", default: true },
  { url: "api.syncad.com", provider: "@gtg", default: true },
  { url: "anyx.io", provider: "@anyx", default: false },
  { url: "rpc.ausbit.dev", provider: "@ausbitbank", default: false },
  { url: "hive-api.arcange.eu", provider: "@arcange", default: false },
  { url: "api.deathwing.me", provider: "@deathwing", default: false },
  { url: "rpc.mahdiyari.info", provider: "@mahdiyari", default: false },
  { url: "techcoderx.com", provider: "@techcoderx", default: false },
  { url: "hive.roelandp.nl", provider: "@roelandp", default: false },
];

const CODE = {
  default: `import { HiveProvider } from "@kkocot/honeycomb-react";

// Uses default nodes: api.hive.blog, api.openhive.network, api.syncad.com
<HiveProvider>
  {children}
</HiveProvider>`,
  custom: `import { HiveProvider } from "@kkocot/honeycomb-react";

<HiveProvider
  apiEndpoints={[
    "https://api.syncad.com",
    "https://api.openhive.network",
    "https://anyx.io",
    "https://rpc.ausbit.dev",
  ]}
>
  {children}
</HiveProvider>`,
};

export default async function ApiNodesPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Nodes</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Public Hive API endpoints for your application.
        </p>
      </div>

      {/* Auto Selection */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Zap className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Automatic Selection</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <code>HiveProvider</code> automatically tests all endpoints and connects
              to the fastest responding node.
            </p>
          </div>
        </div>
      </section>

      {/* Public Nodes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Public Nodes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Node</th>
                <th className="py-3 px-4 text-left font-semibold">Provider</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PUBLIC_NODES.map((node) => (
                <tr key={node.url}>
                  <td className="py-3 px-4">
                    <code className="text-hive-red">{node.url}</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{node.provider}</td>
                  <td className="py-3 px-4">
                    {node.default && (
                      <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-xs text-green-500">
                        Yes
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Default Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Default Usage</h2>
        <p className="text-muted-foreground mb-4">
          Without configuration, provider uses 3 default nodes:
        </p>
        <CodeBlock code={CODE.default} language="tsx" />
      </section>

      {/* Custom Nodes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Nodes</h2>
        <p className="text-muted-foreground mb-4">
          Add or replace default nodes:
        </p>
        <CodeBlock code={CODE.custom} language="tsx" />
      </section>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Running Your Own Node</p>
            <p className="mt-1 text-sm text-muted-foreground">
              For production apps with high traffic, consider running your own node.
              See the{" "}
              <a
                href="https://developers.hive.io/quickstart/hive_full_nodes.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Hive Developer Portal
              </a>{" "}
              for instructions.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/hive-provider"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          HiveProvider
        </Link>
        <Link
          href="/theming"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Theming
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
