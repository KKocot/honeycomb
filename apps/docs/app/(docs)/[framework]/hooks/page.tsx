import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";
import {
  CODE,
  USE_HIVE_RETURN_VALUES,
  USE_HIVE_ACCOUNT_RETURN_VALUES,
} from "./hooks_data";

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function HooksPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hooks</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Access the Hive blockchain connection, chain object, and account data
          through framework-specific hooks.
        </p>
      </div>

      {/* useHive */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useHive()</h2>
        <p className="text-muted-foreground mb-4">
          Returns the full Hive context including the chain object, connection
          status, and endpoint information. This is the primary hook for
          accessing blockchain connectivity.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {USE_HIVE_RETURN_VALUES.filter(
                (row) => row[framework] !== "N/A"
              ).map((row) => (
                <tr key={row[framework]}>
                  <td className="py-3 px-4">
                    <code className="text-hive-red">{row[framework]}</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <code>{row.type}</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {framework === "solid" && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 mb-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-500">Signal Getters</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All values are signal getters &mdash; call them as functions (
                  <code>chain()</code>, <code>isLoading()</code>) to access
                  reactive values.
                </p>
              </div>
            </div>
          </div>
        )}

        {framework === "vue" && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 mb-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-500">Vue Refs</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All values are Vue Refs &mdash; access via{" "}
                  <code>.value</code> in script, auto-unwrapped in templates.
                </p>
              </div>
            </div>
          </div>
        )}

        {framework === "react" && (
          <CodeBlock code={CODE.useHiveReact} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.useHiveSolid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.useHiveVue} language="vue" />
        )}
      </section>

      {/* useHiveChain */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useHiveChain()</h2>
        <p className="text-muted-foreground mb-4">
          Returns the chain object directly. Use this when you only need the
          chain and want to keep destructuring minimal. The chain object provides
          access to all Hive blockchain APIs.
        </p>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 mb-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-500">Chain API</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The <code>chain</code> object is an{" "}
                <code>IHiveChainInterface</code> from{" "}
                <code>@hiveio/wax</code>. Use it to call blockchain APIs like{" "}
                <code>chain.api.database_api.find_accounts()</code> or{" "}
                <code>
                  chain.api.database_api.get_dynamic_global_properties()
                </code>
                .
              </p>
            </div>
          </div>
        </div>

        {framework === "react" && (
          <CodeBlock code={CODE.useHiveChainReact} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.useHiveChainSolid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.useHiveChainVue} language="vue" />
        )}
      </section>

      {/* useApiEndpoint */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useApiEndpoint()</h2>
        <p className="text-muted-foreground mb-4">
          Returns the currently active API endpoint URL. Returns{" "}
          <code>null</code> when not connected.
        </p>

        {framework === "react" && (
          <CodeBlock code={CODE.useApiEndpointReact} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.useApiEndpointSolid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.useApiEndpointVue} language="vue" />
        )}
      </section>

      {/* useHiveStatus */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useHiveStatus()</h2>
        <p className="text-muted-foreground mb-4">
          Returns connection status and endpoint health information.
        </p>

        {/* EndpointStatus interface */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Field</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code className="text-hive-red">url</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Endpoint URL
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code className="text-hive-red">healthy</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Whether the endpoint is responding
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code className="text-hive-red">lastCheck</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>number | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Timestamp of last health check
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code className="text-hive-red">lastError</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Last error message if unhealthy
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {framework === "react" && (
          <CodeBlock code={CODE.useHiveStatusReact} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.useHiveStatusSolid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.useHiveStatusVue} language="vue" />
        )}
      </section>

      {/* useHiveAccount */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          useHiveAccount(username)
        </h2>
        <p className="text-muted-foreground mb-4">
          Fetches account data from the Hive blockchain. Handles loading and
          error states automatically.
        </p>

        {/* Props */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Param</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code className="text-hive-red">username</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Hive account username to fetch
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {USE_HIVE_ACCOUNT_RETURN_VALUES.filter(
                (row) => row[framework] !== "N/A"
              ).map((row) => (
                <tr key={row[framework]}>
                  <td className="py-3 px-4">
                    <code className="text-hive-red">{row[framework]}</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <code>{row.type}</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {framework === "solid" && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 mb-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-500">Signal Getters</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All values are signal getters &mdash; call them as functions (
                  <code>account()</code>, <code>isLoading()</code>) to access
                  reactive values.
                </p>
              </div>
            </div>
          </div>
        )}

        {framework === "vue" && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 mb-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-500">Vue Refs</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All values are Vue Refs &mdash; access via{" "}
                  <code>.value</code> in script, auto-unwrapped in templates.
                </p>
              </div>
            </div>
          </div>
        )}

        {framework === "react" && (
          <CodeBlock code={CODE.useHiveAccountReact} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.useHiveAccountSolid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.useHiveAccountVue} language="vue" />
        )}
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/hive-provider`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Hive Provider
        </Link>
        <Link
          href={`/${framework}/theming`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Theming
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
