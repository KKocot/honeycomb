import Link from "next/link";
import { ArrowRight, Code2, Puzzle, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Build Hive Apps
          <span className="block text-hive-red">Faster</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          A component library for building applications on the Hive Blockchain.
          Install from npm, wrap your app, and start building with type-safe,
          production-ready components.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/react/introduction"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-hive-red px-6 py-3 text-base font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/react/avatar"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-base font-medium transition-colors hover:bg-muted"
          >
            Browse Components
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <Code2 className="mb-4 h-10 w-10 text-hive-red" />
          <h3 className="mb-2 text-xl font-semibold">Type-Safe</h3>
          <p className="text-muted-foreground">
            Built with TypeScript and @hiveio/wax. Full type safety from
            blockchain to UI.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <Puzzle className="mb-4 h-10 w-10 text-hive-red" />
          <h3 className="mb-2 text-xl font-semibold">Multi-Framework</h3>
          <p className="text-muted-foreground">
            Built on @kkocot/honeycomb-core with bindings for React, Solid.js,
            and Vue 3. Pick your framework.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <Zap className="mb-4 h-10 w-10 text-hive-red" />
          <h3 className="mb-2 text-xl font-semibold">Production Ready</h3>
          <p className="text-muted-foreground">
            Auto-reconnect, health monitoring, sequential endpoint fallback.
            Handles network failures gracefully.
          </p>
        </div>
      </div>

      {/* Code Example */}
      <div className="mt-24">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Simple to Use
        </h2>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border bg-muted px-4 py-2">
            <span className="font-mono text-sm text-muted-foreground">
              App.tsx
            </span>
          </div>
          <pre className="overflow-x-auto p-6">
            <code className="text-sm">
{`import { HiveProvider, HiveAvatar } from '@kkocot/honeycomb-react'

export default function App() {
  return (
    <HiveProvider>
      <HiveAvatar username="barddev" size="lg" />
    </HiveProvider>
  )
}`}
            </code>
          </pre>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 rounded-lg border border-hive-red/20 bg-hive-red/5 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to build?</h2>
        <p className="mb-6 text-muted-foreground">
          Install the package and start building your Hive application in
          minutes.
        </p>
        <Link
          href="/react/installation"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-6 py-3 font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          View Installation Guide
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
