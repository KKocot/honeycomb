import Link from "next/link";
import { ArrowRight, Info, Key } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { Key, Loader2 } from "lucide-react";

interface KeychainLoginProps {
  onSuccess?: (username: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function KeychainLogin({
  onSuccess,
  onError,
  className,
}: KeychainLoginProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if Keychain is installed
      if (typeof window === "undefined" || !window.hive_keychain) {
        throw new Error("Hive Keychain extension is not installed");
      }

      const message = \`Login to app at \${Date.now()}\`;

      window.hive_keychain.requestSignBuffer(
        username.trim().toLowerCase(),
        message,
        "Posting",
        (response: any) => {
          setIsLoading(false);

          if (response.success) {
            onSuccess?.(username.trim().toLowerCase());
          } else {
            const err = new Error(response.message || "Login failed");
            setError(err.message);
            onError?.(err);
          }
        }
      );
    } catch (err) {
      setIsLoading(false);
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    }
  }

  return (
    <form onSubmit={handleLogin} className={className}>
      <div className="space-y-4">
        {error && (
          <div className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-1.5"
          >
            Hive Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isLoading}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium transition-colors hover:bg-hive-red/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Key className="h-4 w-4" />
              Login with Keychain
            </>
          )}
        </button>
      </div>
    </form>
  );
}`,
  basicUsage: `"use client";

import { KeychainLogin } from "@/components/hive/keychain-login";

export function LoginPage() {
  function handleSuccess(username: string) {
    console.log("Logged in as:", username);
    // Redirect or update state
  }

  function handleError(error: Error) {
    console.error("Login failed:", error.message);
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <KeychainLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}`,
  withAuthContext: `"use client";

import { KeychainLogin } from "@/components/hive/keychain-login";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useRouter } from "next/navigation";

export function LoginWithRedirect() {
  const { loginWithKeychain } = useHiveAuth();
  const router = useRouter();

  async function handleSuccess(username: string) {
    // Update auth context
    await loginWithKeychain(username);
    // Redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <KeychainLogin
      onSuccess={handleSuccess}
      className="max-w-sm"
    />
  );
}`,
  customStyles: `"use client";

import { KeychainLogin } from "@/components/hive/keychain-login";

export function StyledLogin() {
  return (
    <div className="bg-gradient-to-br from-hive-red/20 to-transparent p-8 rounded-2xl">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in with your Hive account
        </p>
      </div>

      <KeychainLogin
        onSuccess={(username) => console.log("Welcome", username)}
        className="space-y-4"
      />

      <p className="text-xs text-muted-foreground text-center mt-4">
        Don&apos;t have Keychain?{" "}
        <a
          href="https://hive-keychain.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-hive-red hover:underline"
        >
          Download here
        </a>
      </p>
    </div>
  );
}`,
  keychainTypes: `// Add to global.d.ts or hive-keychain.d.ts

interface HiveKeychainResponse {
  success: boolean;
  message?: string;
  result?: any;
  publicKey?: string;
}

interface HiveKeychain {
  requestSignBuffer(
    username: string,
    message: string,
    keyType: "Posting" | "Active" | "Memo",
    callback: (response: HiveKeychainResponse) => void
  ): void;

  requestVote(
    username: string,
    permlink: string,
    author: string,
    weight: number,
    callback: (response: HiveKeychainResponse) => void
  ): void;

  requestBroadcast(
    username: string,
    operations: any[],
    keyType: "Posting" | "Active",
    callback: (response: HiveKeychainResponse) => void
  ): void;
}

declare global {
  interface Window {
    hive_keychain?: HiveKeychain;
  }
}

export {};`,
};

export default async function KeychainLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Keychain Login</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Secure authentication using the Hive Keychain browser extension.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hive Keychain</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive Keychain is a browser extension that securely stores your Hive
              keys. It allows apps to request signatures without ever exposing your
              private keys. Available for Chrome, Firefox, and Brave.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Preview</h2>
        </div>
        <div className="max-w-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Hive Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                disabled
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium">
              <Key className="h-4 w-4" />
              Login with Keychain
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <p className="text-muted-foreground mb-4">
          Copy this component into your project:
        </p>
        <CodeBlock
          filename="components/hive/keychain-login.tsx"
          code={CODE.component}
          language="typescript"
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
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(username: string) =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Called when login succeeds
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onError</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(error: Error) =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Called when login fails
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>className</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Additional CSS classes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <p className="text-muted-foreground mb-4">
          Simple login form with callbacks:
        </p>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* With Auth Context */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Auth Context</h2>
        <p className="text-muted-foreground mb-4">
          Integrate with useHiveAuth hook for state management:
        </p>
        <CodeBlock code={CODE.withAuthContext} language="typescript" />
      </section>

      {/* Custom Styles */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Styling</h2>
        <p className="text-muted-foreground mb-4">
          Wrap the component with custom styling:
        </p>
        <CodeBlock code={CODE.customStyles} language="typescript" />
      </section>

      {/* TypeScript Types */}
      <section>
        <h2 className="text-xl font-semibold mb-4">TypeScript Types</h2>
        <p className="text-muted-foreground mb-4">
          Add these type definitions for Hive Keychain:
        </p>
        <CodeBlock
          filename="types/hive-keychain.d.ts"
          code={CODE.keychainTypes}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/hivesigner-login"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Hivesigner Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
