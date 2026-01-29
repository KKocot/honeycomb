import { CodeBlock } from "@/components/code-block";
import { Folder, FileCode, Box } from "lucide-react";

export default function ProjectStructurePage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Structure</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          How to organize your Hive UI components and utilities.
        </p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          Hive UI follows the same structure as shadcn/ui. Components are copied
          into your project, giving you full ownership and control.
        </p>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="font-mono text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-blue-400" />
              <span>your-project/</span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-blue-400" />
                <span>components/</span>
              </div>
              <div className="pl-6 space-y-1">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">hive/</span>
                  <span className="text-muted-foreground text-xs ml-2">← Hive UI components</span>
                </div>
                <div className="pl-6 space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>hive-provider.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>avatar.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>user-card.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>balance-card.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>post-card.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>...</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-blue-400" />
                  <span>ui/</span>
                  <span className="text-muted-foreground text-xs ml-2">← shadcn/ui components</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-blue-400" />
                <span>hooks/</span>
              </div>
              <div className="pl-6 space-y-1 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>use-hive-account.ts</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>use-hive-auth.ts</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>use-vote.ts</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-blue-400" />
                <span>lib/</span>
              </div>
              <div className="pl-6 space-y-1 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>utils.ts</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>hive-utils.ts</span>
                  <span className="text-muted-foreground text-xs ml-2">← Hive helpers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Components Directory */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Components Directory</h2>
        <p className="text-muted-foreground mb-4">
          All Hive UI components live in <code>components/hive/</code>. This keeps
          them separate from your other UI components.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Box className="h-5 w-5 text-hive-red" />
              <h3 className="font-semibold">hive-provider.tsx</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              The root provider that initializes the Hive chain. Should wrap your
              entire application.
            </p>
            <CodeBlock
              code={`// Required - initializes chain once
<HiveProvider apiEndpoint="https://api.hive.blog">
  <App />
</HiveProvider>`}
              language="tsx"
            />
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Box className="h-5 w-5 text-hive-red" />
              <h3 className="font-semibold">User Display Components</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Components for displaying user information.
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
              <li><code>avatar.tsx</code> - User profile picture</li>
              <li><code>user-card.tsx</code> - Compact user info card</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Box className="h-5 w-5 text-hive-red" />
              <h3 className="font-semibold">Wallet Display Components</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Components for displaying wallet balances and resources.
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
              <li><code>balance-card.tsx</code> - HIVE/HBD/HP balances</li>
              <li><code>manabar.tsx</code> - Resource Credits / Voting Mana</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Box className="h-5 w-5 text-hive-red" />
              <h3 className="font-semibold">Post Display Components</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Components for displaying post content.
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
              <li><code>post-card.tsx</code> - Display post with metadata</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <Box className="h-5 w-5 text-hive-red" />
              <h3 className="font-semibold">Content Components</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Components for rendering and editing content.
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
              <li><code>content-renderer.tsx</code> - Render Hive markdown content</li>
              <li><code>markdown-editor.tsx</code> - Markdown editor with preview</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hooks */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hooks Directory</h2>
        <p className="text-muted-foreground mb-4">
          Custom React hooks for Hive blockchain interactions live in{" "}
          <code>hooks/</code>.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Hook</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>useHiveChain()</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Access the initialized chain instance
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>useHiveAccount(username)</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Fetch account data by username
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>useBalance(username)</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Get HIVE/HBD/HP balances
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>useRC(username)</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Resource Credits status
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Lib / Utils */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Lib Directory</h2>
        <p className="text-muted-foreground mb-4">
          Utility functions and helpers live in <code>lib/</code>.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">lib/utils.ts</h3>
            <p className="text-sm text-muted-foreground mb-3">
              General utilities like the <code>cn()</code> function for merging
              Tailwind classes.
            </p>
            <CodeBlock
              code={`import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold mb-2">lib/hive-utils.ts</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Hive-specific utilities for formatting and calculations.
            </p>
            <CodeBlock
              code={`// Format raw reputation to human-readable number
export function formatReputation(raw: number): number {
  if (raw === 0) return 25;
  const neg = raw < 0;
  const rep = Math.log10(Math.abs(raw));
  const result = Math.max(rep - 9, 0) * 9 + 25;
  return Math.round(neg ? -result : result);
}

// Format VESTS to Hive Power
export function vestsToHP(
  vests: number,
  totalVestingFund: number,
  totalVestingShares: number
): number {
  return (vests * totalVestingFund) / totalVestingShares;
}

// Format token amounts
export function formatToken(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

// Get profile image URL
export function getAvatarUrl(username: string): string {
  return \`https://images.hive.blog/u/\${username}/avatar\`;
}

// Validate Hive username
export function isValidUsername(username: string): boolean {
  return /^[a-z][a-z0-9.-]{2,15}$/.test(username);
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      {/* Import Aliases */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Import Aliases</h2>
        <p className="text-muted-foreground mb-4">
          We recommend using the <code>@/</code> alias for clean imports:
        </p>

        <CodeBlock
          filename="tsconfig.json"
          code={`{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}`}
          language="json"
        />

        <p className="mt-4 text-muted-foreground">
          This allows you to import components like:
        </p>

        <CodeBlock
          className="mt-3"
          code={`import { HiveProvider } from "@/components/hive/hive-provider";
import { useHiveAccount } from "@/hooks/use-hive-account";
import { formatReputation } from "@/lib/hive-utils";`}
          language="typescript"
        />
      </section>

      {/* Example Full Structure */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Full Example Structure</h2>
        <p className="text-muted-foreground mb-4">
          Here&apos;s what a complete Next.js project with Hive UI might look like:
        </p>

        <CodeBlock
          code={`my-hive-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── profile/
│       └── [username]/
│           └── page.tsx
├── components/
│   ├── hive/
│   │   ├── hive-provider.tsx
│   │   ├── avatar.tsx
│   │   ├── user-card.tsx
│   │   ├── balance-card.tsx
│   │   ├── manabar.tsx
│   │   ├── post-card.tsx
│   │   ├── content-renderer.tsx
│   │   └── markdown-editor.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── header.tsx
├── hooks/
│   ├── use-hive-account.ts
│   ├── use-balance.ts
│   └── use-rc.ts
├── lib/
│   ├── utils.ts
│   └── hive-utils.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json`}
          language="text"
        />
      </section>
    </article>
  );
}
