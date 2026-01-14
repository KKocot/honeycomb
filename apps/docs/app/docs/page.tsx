import Link from "next/link";
import { ArrowRight, Blocks, Copy, Zap } from "lucide-react";

export default function DocsPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>

      <p className="text-lg text-muted-foreground">
        Hive UI is a collection of reusable components for building applications
        on the Hive Blockchain. Copy and paste into your apps. Open source.
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <Copy className="mb-2 h-8 w-8 text-hive-red" />
          <h3 className="font-semibold">Not a component library</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This is NOT a component library you install from npm. Pick the components
            you need. Copy and paste the code into your project.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <Blocks className="mb-2 h-8 w-8 text-hive-red" />
          <h3 className="font-semibold">Built on @hiveio/wax</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Uses the official Hive protocol library for type-safe transactions,
            operations, and blockchain interactions.
          </p>
        </div>
      </div>

      <h2>Philosophy</h2>

      <p>
        Hive UI follows the same philosophy as{" "}
        <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
          shadcn/ui
        </a>
        :
      </p>

      <ul>
        <li>
          <strong>Open Code</strong> - You own the code. Modify it as you need.
        </li>
        <li>
          <strong>Composition</strong> - Components are built with composability in mind.
        </li>
        <li>
          <strong>Accessible</strong> - Built on Radix UI primitives for accessibility.
        </li>
        <li>
          <strong>Styled with Tailwind</strong> - Easy to customize with Tailwind CSS.
        </li>
      </ul>

      <h2>Hive Blockchain Concepts</h2>

      <p>
        Before diving into the components, it&apos;s helpful to understand some
        Hive blockchain concepts:
      </p>

      <h3>Keys</h3>

      <p>Hive uses a hierarchical key system:</p>

      <ul>
        <li>
          <strong>Posting Key</strong> - For social actions (posting, voting, following)
        </li>
        <li>
          <strong>Active Key</strong> - For financial operations (transfers, staking)
        </li>
        <li>
          <strong>Memo Key</strong> - For encrypting/decrypting messages
        </li>
        <li>
          <strong>Owner Key</strong> - Master key for account recovery (keep offline!)
        </li>
      </ul>

      <h3>Tokens</h3>

      <ul>
        <li>
          <strong>HIVE</strong> - The native cryptocurrency
        </li>
        <li>
          <strong>HBD</strong> - Hive Backed Dollar, a stablecoin pegged to ~$1 USD
        </li>
        <li>
          <strong>HP (Hive Power)</strong> - Staked HIVE that gives voting power and
          Resource Credits
        </li>
      </ul>

      <h3>Resource Credits (RC)</h3>

      <p>
        Instead of transaction fees, Hive uses Resource Credits. RC is generated
        by your Hive Power and regenerates over ~5 days. Every blockchain operation
        costs RC.
      </p>

      <div className="not-prose my-8 flex gap-4">
        <Link
          href="/docs/installation"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          Installation
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/docs/components/keychain-login"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Browse Components
        </Link>
      </div>
    </article>
  );
}
