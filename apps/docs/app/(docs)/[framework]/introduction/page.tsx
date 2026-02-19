import Link from "next/link";
import { ArrowRight, Blocks, Package, Zap, Activity } from "lucide-react";
import { parseFramework } from "@/lib/framework";

type TechItem = string | { name: string; href: string };

const SUPPORTED_TECH: {
  icon: typeof Package;
  title: string;
  items: TechItem[];
}[] = [
  {
    icon: Package,
    title: "UI Frameworks",
    items: ["React >=19", "Solid.js", "Vue 3"],
  },
  {
    icon: Blocks,
    title: "Meta-frameworks",
    items: [
      {
        name: "Next.js",
        href: "https://github.com/KKocot/honeycomb/tree/main/apps/demo-react-next",
      },
      {
        name: "Astro",
        href: "https://github.com/KKocot/honeycomb/tree/main/apps/demo-react-astro",
      },
      {
        name: "React Router",
        href: "https://github.com/KKocot/honeycomb/tree/main/apps/demo-react-remix",
      },
      "Nuxt",
      "SolidStart",
    ],
  },
  {
    icon: Zap,
    title: "Bundlers",
    items: [
      {
        name: "Vite",
        href: "https://github.com/KKocot/honeycomb/tree/main/apps/demo-react-vite",
      },
      "webpack",
      "Turbopack",
    ],
  },
  {
    icon: Activity,
    title: "Requirements",
    items: ["Node.js >=18", "TypeScript (recommended)"],
  },
];

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

      {/* Supported Technologies */}
      <div className="not-prose my-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Supported Technologies
        </h2>
        <p className="mb-6 text-muted-foreground">
          Honeycomb works with modern JavaScript frameworks and build tools.
          Choose your stack and start building.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORTED_TECH.map(({ icon: Icon, title, items }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-4"
            >
              <Icon className="mb-2 h-6 w-6 text-hive-red" />
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {items.map((item) => {
                  const is_link = typeof item === "object";
                  const label = is_link ? item.name : item;
                  return (
                    <li key={label}>
                      {is_link ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-hive-red hover:underline"
                        >
                          {label}
                        </a>
                      ) : (
                        label
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
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
