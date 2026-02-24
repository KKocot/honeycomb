import Link from "next/link";
import { ArrowLeft, ArrowRight, Info, Zap, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { UsageTabs } from "@/components/usage-tabs";
import { parseFramework } from "@/lib/framework";

const CODE = {
  zeroConfig: `import { HiveProvider, HealthCheckerComponent } from "@barddev/honeycomb-react";

function App() {
  return (
    <HiveProvider>
      <HealthCheckerComponent healthcheckerKey="default" />
    </HiveProvider>
  );
}`,
  customServices: `import {
  HiveProvider,
  HealthCheckerComponent,
  type HealthCheckerServiceConfig,
} from "@barddev/honeycomb-react";

const ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://api.syncad.com",
  "https://anyx.io",
  "https://techcoderx.com",
  "https://api.deathwing.me",
];

const healthCheckerServices: HealthCheckerServiceConfig[] = [
  {
    key: "my-api",
    defaultProviders: ENDPOINTS,
    nodeAddress: null,
    onNodeChange: (node, chain) => {
      if (node) {
        chain.endpointUrl = node;
      }
    },
    createCheckers: (chain) => [
      {
        title: "Database - Find accounts",
        method: chain.api.database_api.find_accounts,
        params: { accounts: ["hiveio"], delayed_votes_active: false },
        validatorFunction: (data: any) =>
          data?.accounts?.[0]?.name === "hiveio"
            ? true
            : "Find accounts error",
      },
      {
        title: "Database - Dynamic global properties",
        method: chain.api.database_api.get_dynamic_global_properties,
        params: {},
        validatorFunction: (data: any) =>
          !!data?.head_block_number
            ? true
            : "Dynamic global properties error",
      },
    ],
  },
];

function App() {
  return (
    <HiveProvider healthCheckerServices={healthCheckerServices}>
      <HealthCheckerComponent healthcheckerKey="my-api" />
    </HiveProvider>
  );
}`,
  multipleInstances: `import {
  HiveProvider,
  HealthCheckerComponent,
  type HealthCheckerServiceConfig,
} from "@barddev/honeycomb-react";

const NODE_ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://anyx.io",
  "https://techcoderx.com",
];

const WALLET_ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://api.deathwing.me",
];

const healthCheckerServices: HealthCheckerServiceConfig[] = [
  {
    key: "hive-node-api",
    defaultProviders: NODE_ENDPOINTS,
    nodeAddress: null,
    onNodeChange: (node, chain) => {
      if (node) chain.endpointUrl = node;
    },
    createCheckers: (chain) => {
      const api = chain.api as any;
      return [
        {
          title: "Database - Find accounts",
          method: chain.api.database_api.find_accounts,
          params: { accounts: ["hiveio"], delayed_votes_active: false },
          validatorFunction: (data: any) =>
            data?.accounts?.[0]?.name === "hiveio" ? true : "Error",
        },
        {
          title: "Bridge - Get Ranked Posts",
          method: api.bridge.get_ranked_posts,
          params: { observer: "hive.blog", tag: "", limit: 10, sort: "trending" },
          validatorFunction: (data: any) =>
            data?.length > 0 ? true : "Bridge API error",
        },
      ];
    },
  },
  {
    key: "hive-wallet-api",
    defaultProviders: WALLET_ENDPOINTS,
    nodeAddress: null,
    onNodeChange: (node, chain) => {
      if (node) chain.endpointUrl = node;
    },
    createCheckers: (chain) => [
      {
        title: "Database - Dynamic global properties",
        method: chain.api.database_api.get_dynamic_global_properties,
        params: {},
        validatorFunction: (data: any) =>
          !!data?.head_block_number ? true : "Error",
      },
    ],
  },
];

function App() {
  return (
    <HiveProvider healthCheckerServices={healthCheckerServices}>
      <h2>Node API Health</h2>
      <HealthCheckerComponent healthcheckerKey="hive-node-api" />

      <h2>Wallet API Health</h2>
      <HealthCheckerComponent healthcheckerKey="hive-wallet-api" />
    </HiveProvider>
  );
}`,
  checkerExample: `{
  title: "Database - Find accounts",
  method: chain.api.database_api.find_accounts,
  params: { accounts: ["hiveio"], delayed_votes_active: false },
  validatorFunction: (data: any) =>
    data?.accounts?.[0]?.name === "hiveio"
      ? true           // check passed
      : "Account not found"  // error message
}`,
  serviceAccess: `import { useHive } from "@barddev/honeycomb-react";

function MyComponent() {
  const { getHealthCheckerService } = useHive();
  const service = getHealthCheckerService("default");

  const handleStart = () => service?.startCheckingProcess();
  const handleStop = () => service?.stopCheckingProcess();
  const handleReset = () => service?.resetProviders();
  const handleAdd = () => service?.addProvider("https://my-node.example.com");
  const handleSwitch = () => service?.evaluateAndSwitch();

  return (
    <div>
      <button onClick={handleStart}>Start Checks</button>
      <button onClick={handleStop}>Stop Checks</button>
      <button onClick={handleSwitch}>Switch to Best</button>
      <button onClick={handleReset}>Reset Providers</button>
      <button onClick={handleAdd}>Add Custom Node</button>
    </div>
  );
}`,
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function HealthCheckerPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HealthChecker</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Monitor, score, and switch between Hive API endpoints with a full UI for managing providers.
        </p>
      </div>

      {/* React-only note */}
      {framework !== "react" && (
        <section className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">React Only</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The HealthChecker component is currently available only for React.
                Solid.js and Vue support is planned for a future release.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Zero-Config Defaults</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When <code>HiveProvider</code> has no <code>healthCheckerServices</code> prop,
              a default service is created automatically with the key <code>&quot;default&quot;</code>.
              It uses <code>DEFAULT_API_ENDPOINTS</code> and runs basic database checks,
              so you can use <code>HealthCheckerComponent</code> without any configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Score-based endpoint ranking with latency measurement
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Automatic and manual switching to the best provider
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Add, remove, and reset custom API endpoints
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Validation error reporting with detailed diagnostics
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Confirmation dialog before switching to unverified nodes
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Provider list persisted in localStorage across sessions
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
            Multiple independent instances per application
          </li>
        </ul>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <p className="text-muted-foreground mb-4">
          The simplest setup requires no configuration. A default health checker service is created
          automatically with basic database API checks against the default endpoints.
        </p>
        <CodeBlock code={CODE.zeroConfig} language="tsx" />
      </section>

      {/* Custom Configuration */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Configuration</h2>
        <p className="text-muted-foreground mb-4">
          For full control, pass <code>healthCheckerServices</code> to <code>HiveProvider</code>.
          Each service defines its own endpoints, API checks, and node-change callback.
        </p>
        <CodeBlock code={CODE.customServices} language="tsx" />
      </section>

      {/* Multiple Instances */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Multiple Instances</h2>
        <p className="text-muted-foreground mb-4">
          You can run multiple health checker services side by side, each monitoring different
          sets of endpoints with different checks. Use unique <code>key</code> values
          and render separate <code>HealthCheckerComponent</code> instances.
        </p>
        <CodeBlock code={CODE.multipleInstances} language="tsx" />
      </section>

      {/* HealthCheckerComponent Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">HealthCheckerComponent Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Required</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>healthcheckerKey</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">Yes</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Key matching a registered <code>HealthCheckerServiceConfig.key</code>.
                  Use <code>&quot;default&quot;</code> for the auto-created service.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* HealthCheckerServiceConfig */}
      <section>
        <h2 className="text-xl font-semibold mb-4">HealthCheckerServiceConfig</h2>
        <p className="text-muted-foreground mb-4">
          Each entry in the <code>healthCheckerServices</code> array configures one independent service instance.
        </p>
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
                <td className="py-3 px-4"><code>key</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Unique identifier for this service. Used as <code>healthcheckerKey</code> in the component.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>createCheckers</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(chain) =&gt; ApiChecker[]</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Factory that receives the Hive chain instance and returns an array of API checks to run.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>defaultProviders</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string[]</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Default list of API endpoint URLs to monitor. Users can add/remove providers at runtime.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>nodeAddress</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string | null</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Currently active node. Pass <code>null</code> to let the service pick one automatically.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onNodeChange</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(node, chain) =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Called when the service switches to a different node. Typically used to update <code>chain.endpointUrl</code>.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>enableLogs</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Enable console logging for debugging health check results.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ApiChecker */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ApiChecker</h2>
        <p className="text-muted-foreground mb-4">
          Each checker defines a single API call that is executed against every provider during health checks.
        </p>
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
                <td className="py-3 px-4"><code>title</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Display name shown in the UI for this check.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>method</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>any</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  The API method reference from <code>chain.api</code> (e.g. <code>chain.api.database_api.find_accounts</code>).
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>params</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>any</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Parameters to pass to the API method.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>validatorFunction</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(data) =&gt; true | string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Returns <code>true</code> if the response is valid, or an error message string.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Example checker</h3>
          <CodeBlock code={CODE.checkerExample} language="tsx" />
        </div>
      </section>

      {/* Service Methods */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Programmatic Access</h2>
        <p className="text-muted-foreground mb-4">
          Access the underlying <code>HealthCheckerService</code> instance via the <code>useHive</code> hook
          for programmatic control outside of the UI component.
        </p>
        <CodeBlock code={CODE.serviceAccess} language="tsx" />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Method</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>startCheckingProcess()</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Register all API checks and start automatic health monitoring.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>stopCheckingProcess()</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Unregister all checks and stop monitoring.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>evaluateAndSwitch()</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Run checks and switch to the highest-scoring provider.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>addProvider(url)</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Add a custom endpoint URL to the provider list.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>removeProvider(url)</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Remove an endpoint from the provider list.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>resetProviders()</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Reset the provider list back to <code>defaultProviders</code>.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>handleChangeOfNode(url)</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Manually switch the active node to a specific endpoint.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Zap className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">How It Works</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Each <code>HealthCheckerService</code> uses the <code>@hiveio/wax</code> HealthChecker
              under the hood. It registers your API checks as endpoints, runs them against every
              provider, scores them by latency and success rate, and emits events that
              the <code>HealthCheckerComponent</code> listens to for live UI updates.
              Provider lists are persisted in <code>localStorage</code> so user customizations survive page reloads.
            </p>
          </div>
        </div>
      </section>

      {/* Default checkers info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Default Checkers</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The auto-created <code>&quot;default&quot;</code> service runs two checks:
              <code> database_api.find_accounts</code> (verifies account lookup)
              and <code> database_api.get_dynamic_global_properties</code> (verifies chain state).
              These work on any standard Hive API node. For advanced checks (Bridge API, witness lookups, etc.),
              provide a custom <code>healthCheckerServices</code> configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/api-tracker`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          API Tracker
        </Link>
        <Link
          href={`/${framework}/avatar`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Avatar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
