import Link from "next/link";
import { ArrowLeft, ArrowRight, Package, Zap } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { UsageTabs } from "@/components/usage-tabs";

const CODE = {
  install: `npm install @kkocot/honeycomb-react
# or
pnpm add @kkocot/honeycomb-react`,
  npmrc: `# Add to ~/.npmrc (one-time setup)
@kkocot:registry=https://npm.pkg.github.com`,
  react: `import { HiveProvider } from "@kkocot/honeycomb-react";

function App() {
  return (
    <HiveProvider>
      <YourApp />
    </HiveProvider>
  );
}`,
  nextjs: `// app/providers.tsx
"use client";

import { HiveProvider } from "@kkocot/honeycomb-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <HiveProvider>{children}</HiveProvider>;
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
};

export default async function HiveProviderPage() {
  const reactContent = <CodeBlock code={CODE.react} language="tsx" />;
  const nextjsContent = <CodeBlock code={CODE.nextjs} language="tsx" />;

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveProvider</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Root provider for Hive blockchain connection.
        </p>
      </div>

      {/* Package Info */}
      <section className="rounded-lg border border-hive-red/20 bg-hive-red/5 p-4">
        <div className="flex gap-3">
          <Package className="h-5 w-5 text-hive-red shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-hive-red">npm package</p>
            <p className="mt-1 text-sm text-muted-foreground">
              <code>@kkocot/honeycomb-react</code>
            </p>
          </div>
        </div>
      </section>

      {/* Auto Node Selection */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Zap className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Automatic Node Selection</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Provider automatically tests all endpoints and connects to the fastest one.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <div className="space-y-4">
          <CodeBlock code={CODE.npmrc} language="bash" />
          <CodeBlock code={CODE.install} language="bash" />
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <UsageTabs
          tabs={[
            { id: "react", label: "React", content: reactContent },
            { id: "nextjs", label: "Next.js", content: nextjsContent },
          ]}
        />
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>apiEndpoints</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string[]</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>[&quot;api.hive.blog&quot;, &quot;api.openhive.network&quot;, &quot;api.syncad.com&quot;]</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>storageKey</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;hive-ui-session&quot;</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onLogin</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(user) =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onLogout</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>() =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/project-structure"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Project Structure
        </Link>
        <Link
          href="/docs/api-nodes"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          API Nodes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
