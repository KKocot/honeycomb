import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Blocks,
  Wallet,
  Vote,
  User,
  Shield,
  Zap,
} from "lucide-react";
import { HiveLogo } from "@/components/hive-logo";
import { CodeBlock } from "@/components/code-block";

const features = [
  {
    icon: Copy,
    title: "Copy & Paste",
    description:
      "Not a package. Copy components directly into your project. Full ownership and control.",
  },
  {
    icon: Blocks,
    title: "Built on @hiveio/wax",
    description:
      "Uses the official Hive protocol library. Type-safe transactions and operations.",
  },
  {
    icon: Shield,
    title: "Keychain Integration",
    description:
      "Secure authentication with Hive Keychain. Keys never leave the browser extension.",
  },
  {
    icon: Zap,
    title: "Lazy Chain Init",
    description:
      "Chain initialization happens once. Singleton pattern for optimal performance.",
  },
];

const componentCategories = [
  {
    icon: Shield,
    title: "Authentication",
    items: ["SmartSigner", "KeychainLogin", "HivesignerLogin"],
  },
  {
    icon: User,
    title: "Social",
    items: ["Avatar", "UserCard", "FollowButton", "MuteButton", "BadgeList"],
  },
  {
    icon: Vote,
    title: "Content",
    items: ["VoteButton", "CommentForm", "PostEditor", "ReblogButton"],
  },
  {
    icon: Wallet,
    title: "Wallet",
    items: ["BalanceCard", "TransferDialog", "PowerUp/Down", "DelegationCard"],
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center px-4 pt-24 pb-16 text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hive-red opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-hive-red"></span>
          </span>
          Currently in development
        </div>

        <HiveLogo className="mb-8 h-20 w-20" />

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Build Hive Apps
          <br />
          <span className="text-hive-red">Faster</span>
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Beautiful, accessible components for Hive Blockchain. Copy and paste
          into your apps. Built with{" "}
          <code className="text-hive-red">@hiveio/wax</code>, Radix UI, and
          Tailwind CSS.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-hive-red px-6 py-3 font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/examples"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-medium transition-colors hover:bg-muted"
          >
            Browse Components
          </Link>
        </div>

        {/* Quick Install */}
        <div className="mt-12 w-full max-w-lg">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <code className="text-sm text-muted-foreground">
                npx hive-ui init
              </code>
              <button
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Hive UI?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <feature.icon className="mb-4 h-10 w-10 text-hive-red" />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Components Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">Components</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Everything you need to build Hive dApps
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {componentCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <category.icon className="mb-4 h-8 w-8 text-hive-red" />
                <h3 className="mb-4 font-semibold">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item}>
                      <code className="text-sm text-muted-foreground">
                        {item}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="border-t border-border bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Simple to Use
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Initialize once, use everywhere
          </p>

          <div className="mx-auto max-w-3xl space-y-6">
            <CodeBlock
              filename="app/providers.tsx"
              code={`import { HiveProvider } from '@/components/hive/hive-provider'

export function Providers({ children }) {
  return (
    <HiveProvider apiEndpoint="https://api.hive.blog">
      {children}
    </HiveProvider>
  )
}`}
            />

            <CodeBlock
              filename="app/page.tsx"
              code={`import { KeychainLogin } from '@/components/hive/keychain-login'
import { UserCard } from '@/components/hive/user-card'
import { VoteButton } from '@/components/hive/vote-button'

export default function Page() {
  return (
    <div>
      <KeychainLogin />
      <UserCard username="hiveio" />
      <VoteButton author="alice" permlink="my-post" />
    </div>
  )
}`}
            />
          </div>
        </div>
      </section>

      {/* API Nodes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Flexible API Configuration
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Use any Hive API node. Configure globally or per-component.
          </p>

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold">Supported Nodes</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "api.hive.blog",
                "api.deathwing.me",
                "anyx.io",
                "api.openhive.network",
                "rpc.ausbit.dev",
                "hive-api.arcange.eu",
              ].map((node) => (
                <code
                  key={node}
                  className="rounded bg-muted px-3 py-2 text-sm"
                >
                  {node}
                </code>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built for the{" "}
            <a
              href="https://hive.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hive-red hover:underline"
            >
              Hive
            </a>{" "}
            community. Open source and free to use.
          </p>
        </div>
      </footer>
    </main>
  );
}
