import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Steps, Step } from "@/components/steps";
import { InstallationTabs } from "@/components/installation-tabs";

// Code snippets
const CODE = {
  nextjs: {
    create: `npx create-next-app@latest my-hive-app --typescript --tailwind --eslint --app`,
    install: `cd my-hive-app
pnpm add @hiveio/wax @hiveio/beekeeper
pnpm add class-variance-authority clsx tailwind-merge lucide-react`,
    tsconfig: `{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}`,
    utils: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
    provider: `"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createHiveChain, type IHiveChainInterface } from "@hiveio/wax";

interface HiveContextValue {
  chain: IHiveChainInterface | null;
  isReady: boolean;
  error: Error | null;
  apiEndpoint: string;
}

const HiveContext = createContext<HiveContextValue | null>(null);

interface HiveProviderProps {
  children: ReactNode;
  apiEndpoint?: string;
}

export function HiveProvider({
  children,
  apiEndpoint = "https://api.hive.blog",
}: HiveProviderProps) {
  const [chain, setChain] = useState<IHiveChainInterface | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initChain() {
      try {
        const hiveChain = await createHiveChain({ apiEndpoint });
        if (mounted) {
          setChain(hiveChain);
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to initialize chain"));
        }
      }
    }

    initChain();

    return () => {
      mounted = false;
    };
  }, [apiEndpoint]);

  return (
    <HiveContext.Provider value={{ chain, isReady, error, apiEndpoint }}>
      {children}
    </HiveContext.Provider>
  );
}

export function useHiveChain() {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHiveChain must be used within a HiveProvider");
  }
  return context;
}`,
    providers: `"use client";

import { HiveProvider } from "@/components/hive/hive-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HiveProvider apiEndpoint="https://api.hive.blog">
      {children}
    </HiveProvider>
  );
}`,
    layout: `import { Providers } from "./providers";

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
  },
  vite: {
    create: `pnpm create vite my-hive-app --template react-ts
cd my-hive-app`,
    tailwind: `pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p`,
    install: `pnpm add @hiveio/wax @hiveio/beekeeper
pnpm add class-variance-authority clsx tailwind-merge lucide-react`,
    tailwindConfig: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
  },
  remix: {
    create: `npx create-remix@latest my-hive-app
cd my-hive-app`,
    tailwind: `pnpm add -D tailwindcss
npx tailwindcss init --ts`,
    install: `pnpm add @hiveio/wax @hiveio/beekeeper
pnpm add class-variance-authority clsx tailwind-merge lucide-react`,
  },
};

export default async function InstallationPage() {
  // Pre-render Next.js content
  const nextjsContent = (
    <Steps className="mt-6">
      <Step title="Create a new Next.js project">
        <p className="mb-3">
          Start by creating a new Next.js project using <code>create-next-app</code>:
        </p>
        <CodeBlock code={CODE.nextjs.create} language="bash" />
      </Step>

      <Step title="Install dependencies">
        <p className="mb-3">Install the required dependencies:</p>
        <CodeBlock code={CODE.nextjs.install} language="bash" />
      </Step>

      <Step title="Configure path aliases">
        <p className="mb-3">
          Make sure your <code>tsconfig.json</code> has the path alias configured:
        </p>
        <CodeBlock filename="tsconfig.json" code={CODE.nextjs.tsconfig} language="json" />
      </Step>

      <Step title="Add utility function">
        <p className="mb-3">
          Create the <code>cn</code> utility for merging class names:
        </p>
        <CodeBlock filename="lib/utils.ts" code={CODE.nextjs.utils} language="typescript" />
      </Step>

      <Step title="Set up HiveProvider">
        <p className="mb-3">Create the Hive provider to initialize the chain once:</p>
        <CodeBlock
          filename="components/hive/hive-provider.tsx"
          code={CODE.nextjs.provider}
          language="typescript"
        />
      </Step>

      <Step title="Wrap your app">
        <p className="mb-3">Add the provider to your root layout:</p>
        <CodeBlock filename="app/providers.tsx" code={CODE.nextjs.providers} language="typescript" />
        <div className="mt-4">
          <CodeBlock filename="app/layout.tsx" code={CODE.nextjs.layout} language="typescript" />
        </div>
      </Step>
    </Steps>
  );

  // Pre-render Vite content
  const viteContent = (
    <Steps className="mt-6">
      <Step title="Create a new Vite project">
        <CodeBlock code={CODE.vite.create} language="bash" />
      </Step>

      <Step title="Install Tailwind CSS">
        <CodeBlock code={CODE.vite.tailwind} language="bash" />
      </Step>

      <Step title="Install dependencies">
        <CodeBlock code={CODE.vite.install} language="bash" />
      </Step>

      <Step title="Configure Tailwind">
        <p className="mb-3">
          Update <code>tailwind.config.js</code>:
        </p>
        <CodeBlock
          filename="tailwind.config.js"
          code={CODE.vite.tailwindConfig}
          language="javascript"
        />
      </Step>

      <Step title="Follow the same steps">
        <p>
          Follow steps 4-6 from the Next.js installation to set up utilities and the
          HiveProvider.
        </p>
      </Step>
    </Steps>
  );

  // Pre-render Remix content
  const remixContent = (
    <Steps className="mt-6">
      <Step title="Create a new Remix project">
        <CodeBlock code={CODE.remix.create} language="bash" />
      </Step>

      <Step title="Install Tailwind CSS">
        <CodeBlock code={CODE.remix.tailwind} language="bash" />
      </Step>

      <Step title="Install dependencies">
        <CodeBlock code={CODE.remix.install} language="bash" />
      </Step>

      <Step title="Follow the same steps">
        <p>
          Follow steps 4-6 from the Next.js installation to set up utilities and the
          HiveProvider.
        </p>
      </Step>
    </Steps>
  );

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          How to install and set up Hive UI in your project.
        </p>
      </div>

      {/* Framework Selection */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Frameworks</h2>
        <p className="text-muted-foreground mb-4">
          Hive UI currently supports React. Vue and Svelte support is planned.
        </p>

        <InstallationTabs
          nextjsContent={nextjsContent}
          viteContent={viteContent}
          remixContent={remixContent}
        />
      </section>

      {/* API Nodes */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">API Nodes</h2>
        <p className="text-muted-foreground mb-4">
          You can use any public Hive API node. Here are some popular options:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { node: "api.hive.blog", desc: "Official node" },
            { node: "api.deathwing.me", desc: "Community node" },
            { node: "anyx.io", desc: "Community node" },
            { node: "api.openhive.network", desc: "OpenHive node" },
            { node: "rpc.ausbit.dev", desc: "Ausbit node" },
            { node: "hive-api.arcange.eu", desc: "Arcange node" },
          ].map(({ node, desc }) => (
            <div
              key={node}
              className="flex items-center justify-between rounded-md bg-muted px-3 py-2"
            >
              <code className="text-sm">{node}</code>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 p-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500">Node Selection</p>
            <p className="text-muted-foreground mt-1">
              Public nodes may have rate limits. For production apps, consider running
              your own node or using a dedicated RPC provider.
            </p>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section>
        <h2 className="text-xl font-semibold mb-4">What&apos;s Next?</h2>
        <p className="text-muted-foreground mb-4">
          Now that you have Hive UI set up, you can start adding components:
        </p>

        <div className="flex gap-4">
          <Link
            href="/docs/components/keychain-login"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Add Keychain Login
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/hive-provider"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Learn about HiveProvider
          </Link>
        </div>
      </section>
    </article>
  );
}
