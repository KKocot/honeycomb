import Link from "next/link";
import { ArrowRight, Info, Wallet, Check, AlertCircle, Loader2 } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState, useEffect } from "react";
import { Wallet, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";

declare global {
  interface Window {
    peakvault?: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: "Posting" | "Active" | "Memo",
        callback: (response: { success: boolean; result?: string; message?: string }) => void
      ) => void;
      requestBroadcast: (
        username: string,
        operations: any[],
        keyType: "Posting" | "Active",
        callback: (response: { success: boolean; message?: string }) => void
      ) => void;
    };
  }
}

interface PeakVaultLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  keyType?: "posting" | "active";
  className?: string;
}

export function PeakVaultLogin({
  onSuccess,
  onError,
  keyType = "posting",
  className = "",
}: PeakVaultLoginProps) {
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if PeakVault is installed
    const checkAvailability = () => {
      setIsAvailable(!!window.peakvault);
    };

    // Check immediately
    checkAvailability();

    // Also check after a short delay (extension might load async)
    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, []);

  async function handleLogin() {
    if (!window.peakvault) {
      setError("PeakVault extension not found");
      onError?.(new Error("PeakVault extension not found"));
      return;
    }

    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sign a challenge to verify account ownership
      const challenge = \`Login to app at \${Date.now()}\`;

      await new Promise<void>((resolve, reject) => {
        window.peakvault!.requestSignBuffer(
          username,
          challenge,
          keyType === "active" ? "Active" : "Posting",
          (response) => {
            if (response.success) {
              resolve();
            } else {
              reject(new Error(response.message || "PeakVault signing failed"));
            }
          }
        );
      });

      // Success
      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Extension not available
  if (isAvailable === false) {
    return (
      <div className={\`w-full max-w-sm \${className}\`}>
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-500">PeakVault Not Detected</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Install the PeakVault browser extension to continue.
              </p>
              <a
                href="https://peakd.com/me/wallet?vault=true"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline"
              >
                Get PeakVault
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Still checking
  if (isAvailable === null) {
    return (
      <div className={\`w-full max-w-sm flex justify-center py-8 \${className}\`}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Hive Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading || !username.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              Login with PeakVault
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Check className="h-3 w-3 text-green-500" />
          PeakVault detected
        </div>
      </div>
    </div>
  );
}`,
  basicUsage: `import { PeakVaultLogin } from "@/components/hive/peakvault-login";

export function LoginPage() {
  return (
    <PeakVaultLogin
      onSuccess={(user) => {
        console.log("Logged in:", user.username);
        // Redirect to dashboard
      }}
      onError={(error) => {
        console.error("Login failed:", error.message);
      }}
    />
  );
}`,
  withActiveKey: `// For operations that require active key (transfers, power up, etc.)
<PeakVaultLogin
  keyType="active"
  onSuccess={(user) => console.log("Authorized:", user.username)}
/>`,
};

export default async function PeakVaultLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PeakVault Login</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Authenticate using PeakD's browser extension.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">PeakVault Extension</p>
            <p className="mt-1 text-sm text-muted-foreground">
              PeakVault is a browser extension by PeakD that securely stores
              your Hive keys. It provides the same API as Hive Keychain,
              making it easy to support both extensions.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-sm mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Hive Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted"
              disabled
            />
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium">
            <Wallet className="h-5 w-5" />
            Login with PeakVault
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Check className="h-3 w-3 text-green-500" />
            PeakVault detected
          </div>
        </div>
      </section>

      {/* Not Installed State */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Not Installed State</h2>
        <div className="max-w-sm mx-auto">
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-orange-500">PeakVault Not Detected</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Install the PeakVault browser extension to continue.
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-orange-500">
                  Get PeakVault →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/peakvault-login.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* With Active Key */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Active Key Authorization</h2>
        <p className="text-muted-foreground mb-4">
          For financial operations that require the active key:
        </p>
        <CodeBlock code={CODE.withActiveKey} language="typescript" />
      </section>

      {/* Props */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium">Prop</th>
                <th className="text-left py-2 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Default</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 font-mono text-foreground">keyType</td>
                <td className="py-2 font-mono">"posting" | "active"</td>
                <td className="py-2">"posting"</td>
                <td className="py-2">Key type to use for signing</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 font-mono text-foreground">onSuccess</td>
                <td className="py-2 font-mono">(user) =&gt; void</td>
                <td className="py-2">-</td>
                <td className="py-2">Called on successful login</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 font-mono text-foreground">onError</td>
                <td className="py-2 font-mono">(error) =&gt; void</td>
                <td className="py-2">-</td>
                <td className="py-2">Called on error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Next */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Related</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/docs/components/keychain-login"
            className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
          >
            Keychain Login
          </Link>
          <Link
            href="/docs/components/hiveauth-login"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            HiveAuth Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
