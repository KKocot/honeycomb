import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Package,
  Zap,
  Activity,
  ExternalLink,
} from "lucide-react";
import { parseFramework, type Framework } from "@/lib/framework";

type DemoConfig = {
  name: string;
  desc: string;
  app: string;
};

const GITHUB_APPS_BASE =
  "https://github.com/KKocot/honeycomb/tree/main/apps";

const FRAMEWORK_DEMOS: Record<Framework, DemoConfig[]> = {
  react: [
    { name: "Next.js", desc: "Full-stack framework with SSR", app: "demo-react-next" },
    { name: "Vite", desc: "Lightning-fast SPA bundler", app: "demo-react-vite" },
    { name: "Astro", desc: "Island architecture with partial hydration", app: "demo-react-astro" },
    { name: "React Router", desc: "SPA routing with optional SSR", app: "demo-react-remix" },
  ],
  solid: [
    { name: "SolidStart", desc: "Solid.js meta-framework with SSR", app: "demo-solid-start" },
    { name: "Vite", desc: "Lightning-fast SPA bundler", app: "demo-solid-vite" },
    { name: "Astro", desc: "Island architecture with partial hydration", app: "demo-solid-astro" },
  ],
  vue: [
    { name: "Vite", desc: "Lightning-fast SPA bundler", app: "demo-vue" },
  ],
};

const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  solid: "Solid.js",
  vue: "Vue 3",
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function IntroductionPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>

      <p className="text-lg text-muted-foreground">
        Honeycomb is a component library for building applications on the Hive
        Blockchain. Install from npm, wrap your app, and start building.
      </p>

      <h2>Features</h2>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <Blocks className="mb-2 h-8 w-8 text-hive-red" />
          <h3 className="font-semibold">Built on @hiveio/wax</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Uses the official Hive protocol library for type-safe blockchain
            data retrieval and interactions.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <Package className="mb-2 h-8 w-8 text-hive-red" />
          <h3 className="font-semibold">Multi-Framework</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Built on <code>@kkocot/honeycomb-core</code> with bindings for
            React, Solid.js, and Vue 3. Pick your framework and install.
          </p>
        </div>
      </div>

      {/* Demo Applications */}
      <div className="not-prose my-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Demo Applications
        </h2>
        <p className="mb-6 text-muted-foreground">
          Explore working examples of Honeycomb with{" "}
          {FRAMEWORK_LABELS[framework]} and popular build tools.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {FRAMEWORK_DEMOS[framework].map((demo) => (
            <a
              key={demo.app}
              href={`${GITHUB_APPS_BASE}/${demo.app}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-hive-red/50"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold">{demo.name}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-hive-red" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{demo.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Also Available */}
      <div className="not-prose my-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Also Available
        </h2>
        <div className="flex flex-wrap gap-3">
          {(["react", "solid", "vue"] as const)
            .filter((fw): fw is Framework => fw !== framework)
            .map((fw) => (
              <Link
                key={fw}
                href={`/${fw}/introduction`}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:border-hive-red/50 hover:bg-muted"
              >
                <span className="font-medium">{FRAMEWORK_LABELS[fw]}</span>
                <span className="text-muted-foreground">
                  ({FRAMEWORK_DEMOS[fw].length}{" "}
                  {FRAMEWORK_DEMOS[fw].length === 1 ? "demo" : "demos"})
                </span>
              </Link>
            ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="not-prose my-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Requirements
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Node.js &gt;=18</li>
          <li>TypeScript (recommended)</li>
        </ul>
      </div>

      {/* Feature callouts */}
      <div className="not-prose my-8 space-y-4">
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex gap-3">
            <Zap className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-500">
                Sequential Endpoint Fallback
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tries endpoints in priority order (#1 → #2 → #3). If timeout or
                error occurs, automatically switches to the next available
                endpoint. Configurable list and order.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex gap-3">
            <Activity className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-500">
                Auto-Reconnect & Health Monitoring
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Periodic health checks monitor endpoint health. Automatically
                switches to healthier endpoints at runtime without page refresh.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2>Hive Blockchain Concepts</h2>

      <p>
        Before diving into the components, it&apos;s helpful to understand some
        Hive blockchain concepts:
      </p>

      <h3>Accounts</h3>

      <p>
        Hive uses a hierarchical key system for securing accounts. For read-only
        components (displaying user data, posts, balances), no keys are
        required.
      </p>

      <h3>Tokens</h3>

      <ul>
        <li>
          <strong>HIVE</strong> - The native cryptocurrency
        </li>
        <li>
          <strong>HBD</strong> - Hive Backed Dollar, a stablecoin pegged to ~$1
          USD
        </li>
        <li>
          <strong>HP (Hive Power)</strong> - Staked HIVE that gives voting power
          and Resource Credits
        </li>
      </ul>

      <h3>Resource Credits (RC)</h3>

      <p>
        Hive uses Resource Credits instead of transaction fees. RC is used for
        write operations on the blockchain and regenerates over time.
      </p>

      <div className="not-prose my-8 flex gap-4">
        <Link
          href={`/${framework}/installation`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Installation
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/${framework}/avatar`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Browse Components
        </Link>
      </div>
    </article>
  );
}
