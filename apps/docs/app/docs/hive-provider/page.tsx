import Link from "next/link";
import { ArrowRight, AlertTriangle, Info, Zap } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { UsageTabs } from "@/components/usage-tabs";

// Code snippets
const CODE = {
  component: `"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createHiveChain, type IHiveChainInterface } from "@hiveio/wax";

// Types
interface HiveContextValue {
  chain: IHiveChainInterface | null;
  isReady: boolean;
  error: Error | null;
  apiEndpoint: string;
  switchEndpoint: (endpoint: string) => Promise<void>;
}

interface HiveProviderProps {
  children: ReactNode;
  apiEndpoint?: string;
  fallbackEndpoints?: string[];
}

// Default API nodes
const DEFAULT_ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.deathwing.me",
  "https://anyx.io",
  "https://api.openhive.network",
];

// Context
const HiveContext = createContext<HiveContextValue | null>(null);

// Provider Component
export function HiveProvider({
  children,
  apiEndpoint = "https://api.hive.blog",
  fallbackEndpoints = DEFAULT_ENDPOINTS,
}: HiveProviderProps) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentEndpoint, setCurrentEndpoint] = useState(apiEndpoint);

  // Initialize chain
  const initChain = useCallback(async (endpoint: string) => {
    setIsReady(false);
    setError(null);

    try {
      const hiveChain = await createHiveChain({ apiEndpoint: endpoint });
      setChain(hiveChain);
      setCurrentEndpoint(endpoint);
      setIsReady(true);
      return true;
    } catch (err) {
      console.error(\`Failed to connect to \${endpoint}:\`, err);
      return false;
    }
  }, []);

  // Try endpoints with fallback
  useEffect(() => {
    let mounted = true;

    async function tryEndpoints() {
      // Try primary endpoint first
      const endpoints = [apiEndpoint, ...fallbackEndpoints.filter(e => e !== apiEndpoint)];

      for (const endpoint of endpoints) {
        if (!mounted) return;

        const success = await initChain(endpoint);
        if (success) return;
      }

      // All endpoints failed
      if (mounted) {
        setError(new Error("Failed to connect to any Hive API node"));
      }
    }

    tryEndpoints();

    return () => {
      mounted = false;
    };
  }, [apiEndpoint, fallbackEndpoints, initChain]);

  // Switch endpoint manually
  const switchEndpoint = useCallback(async (endpoint: string) => {
    const success = await initChain(endpoint);
    if (!success) {
      throw new Error(\`Failed to connect to \${endpoint}\`);
    }
  }, [initChain]);

  return (
    <HiveContext.Provider
      value={{
        chain,
        isReady,
        error,
        apiEndpoint: currentEndpoint,
        switchEndpoint,
      }}
    >
      {children}
    </HiveContext.Provider>
  );
}

// Hook to access Hive context
export function useHiveChain() {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHiveChain must be used within a HiveProvider");
  }
  return context;
}`,
  basicProviders: `"use client";

import { HiveProvider } from "@/components/hive/hive-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HiveProvider>
      {children}
    </HiveProvider>
  );
}`,
  basicLayout: `import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
  fallback: `<HiveProvider
  apiEndpoint="https://api.hive.blog"
  fallbackEndpoints={[
    "https://api.deathwing.me",
    "https://anyx.io",
    "https://api.openhive.network",
  ]}
>
  {children}
</HiveProvider>`,
  custom: `<HiveProvider apiEndpoint="https://your-custom-node.com">
  {children}
</HiveProvider>`,
  hook: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";

export function MyComponent() {
  const { chain, isReady, error, apiEndpoint } = useHiveChain();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isReady) {
    return <div>Connecting to Hive...</div>;
  }

  return (
    <div>
      <p>Connected to: {apiEndpoint}</p>
      {/* Use chain for API calls */}
    </div>
  );
}`,
  fetchAccount: `"use client";

import { useHiveChain } from "@/components/hive/hive-provider";
import { useEffect, useState } from "react";

export function AccountInfo({ username }: { username: string }) {
  const { chain, isReady } = useHiveChain();
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    if (!isReady || !chain) return;

    async function fetchAccount() {
      const accounts = await chain.api.database_api.find_accounts({
        accounts: [username],
      });

      if (accounts.accounts.length > 0) {
        setAccount(accounts.accounts[0]);
      }
    }

    fetchAccount();
  }, [chain, isReady, username]);

  if (!account) return <div>Loading...</div>;

  return (
    <div>
      <p>Username: {account.name}</p>
      <p>Balance: {account.balance}</p>
    </div>
  );
}`,
};

export default async function HiveProviderPage() {
  // Pre-render all code blocks
  const basicContent = (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Wrap your application with <code>HiveProvider</code>:
      </p>
      <CodeBlock filename="app/providers.tsx" code={CODE.basicProviders} language="typescript" />
      <CodeBlock filename="app/layout.tsx" code={CODE.basicLayout} language="typescript" />
    </div>
  );

  const fallbackContent = (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Configure fallback nodes for reliability:
      </p>
      <CodeBlock code={CODE.fallback} language="tsx" />
      <p className="text-sm text-muted-foreground">
        If the primary endpoint fails, the provider will automatically try fallback nodes in order.
      </p>
    </div>
  );

  const customContent = (
    <div className="space-y-4">
      <p className="text-muted-foreground">Use your own Hive node:</p>
      <CodeBlock code={CODE.custom} language="tsx" />
    </div>
  );

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hive Provider</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          The root provider that initializes the Hive blockchain connection.
        </p>
      </div>

      {/* Why Provider */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Why a Provider?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Initializing the Hive chain with <code>@hiveio/wax</code> is an expensive
              operation. The <code>HiveProvider</code> ensures the chain is initialized
              only once and shared across all components via React Context.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <p className="text-muted-foreground mb-4">
          Copy the provider code into your project:
        </p>

        <CodeBlock
          filename="components/hive/hive-provider.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>

        <UsageTabs
          tabs={[
            { id: "basic", label: "Basic", content: basicContent },
            { id: "fallback", label: "With Fallback", content: fallbackContent },
            { id: "custom", label: "Custom Node", content: customContent },
          ]}
        />
      </section>

      {/* useHiveChain Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useHiveChain Hook</h2>
        <p className="text-muted-foreground mb-4">
          Access the chain instance and status in any component:
        </p>

        <CodeBlock filename="components/my-component.tsx" code={CODE.hook} language="typescript" />

        <h3 className="text-lg font-semibold mt-6 mb-3">Return Values</h3>
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
                  The initialized Hive chain instance
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isReady</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Whether the chain is initialized and ready
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>Error | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Error if initialization failed
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>apiEndpoint</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Currently connected API endpoint
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>switchEndpoint</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(endpoint: string) =&gt; Promise&lt;void&gt;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Switch to a different API node
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Using Chain Instance */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Using the Chain Instance</h2>
        <p className="text-muted-foreground mb-4">
          Once initialized, you can use the chain for API calls:
        </p>

        <CodeBlock filename="Example: Fetch account" code={CODE.fetchAccount} language="typescript" />
      </section>

      {/* Performance */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Performance Notes</h2>
        </div>

        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Single initialization:</strong> The chain is initialized once when{" "}
              <code>HiveProvider</code> mounts. All child components share this instance.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Automatic fallback:</strong> If the primary node fails, fallback nodes
              are tried automatically without user intervention.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Lazy loading:</strong> Components should check <code>isReady</code>{" "}
              before making API calls to avoid null reference errors.
            </span>
          </li>
        </ul>
      </section>

      {/* API Reference */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>apiEndpoint</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;https://api.hive.blog&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">Primary API node URL</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>fallbackEndpoints</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string[]</code></td>
                <td className="py-3 px-4 text-muted-foreground">Default nodes list</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Fallback nodes if primary fails
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>children</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>ReactNode</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Child components</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Warning */}
      <section className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-500">Important</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The <code>HiveProvider</code> must be placed at the root of your application,
              above any components that use <code>useHiveChain()</code>. In Next.js App
              Router, this typically means wrapping in a client component in{" "}
              <code>app/providers.tsx</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/api-nodes"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            API Nodes
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
