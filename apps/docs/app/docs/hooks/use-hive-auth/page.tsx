import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  install: `pnpm add @kkocot/honeycomb-react`,
  basic: `import { useHiveAuth } from "@kkocot/honeycomb-react";

function MyComponent() {
  const { user, isAuthenticated, logout } = useHiveAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      Welcome, @{user.username}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}`,
  conditionalUI: `// Show different UI based on auth status
const { isAuthenticated, user } = useHiveAuth();

return isAuthenticated ? (
  <span>@{user.username}</span>
) : (
  <HiveSmartSigner />
);`,
  authMethod: `// Check which authentication method is used
const { user, authMethod } = useHiveAuth();

// authMethod: "keychain" | "peakvault" | "hivesigner" | "hiveauth" | "hbauth" | "wif"
console.log(\`Logged in via \${authMethod}\`);`,
  protectedRoute: `// Protect a page or component
const { isAuthenticated, isLoading } = useHiveAuth();

if (isLoading) return <div>Loading...</div>;
if (!isAuthenticated) return <Redirect to="/login" />;

return <ProtectedContent />;`,
};

export default async function UseHiveAuthPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useHiveAuth</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Access current user session and authentication state.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Session management</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Works with SmartSigner. Provides current user, auth method, and logout function.
              Session persists across page reloads.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <CodeBlock code={CODE.install} language="bash" />
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        <CodeBlock code={CODE.basic} language="tsx" />
      </section>

      {/* Return Values */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Return Value</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>user</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>{`{ username: string }`}</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>null</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isAuthenticated</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isLoading</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>authMethod</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string | null</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>null</code></td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>logout</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>() =&gt; void</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Conditional UI</h3>
            <CodeBlock code={CODE.conditionalUI} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Check auth method</h3>
            <CodeBlock code={CODE.authMethod} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Protected route</h3>
            <CodeBlock code={CODE.protectedRoute} language="tsx" />
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href="/docs/hooks/use-hive-chain"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          useHiveChain
        </Link>
        <Link
          href="/docs/hooks/use-hive-account"
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          useHiveAccount
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
