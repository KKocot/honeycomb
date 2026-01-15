import Link from "next/link";
import { ArrowRight, Info, FileKey, AlertTriangle, Eye, EyeOff, Shield } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { FileKey, Eye, EyeOff, Loader2, AlertCircle, AlertTriangle } from "lucide-react";

interface WifLoginProps {
  onSuccess?: (user: { username: string; publicKey: string }) => void;
  onError?: (error: Error) => void;
  keyType?: "posting" | "active";
  allowStorage?: boolean;
  className?: string;
}

export function WifLogin({
  onSuccess,
  onError,
  keyType = "posting",
  allowStorage = false,
  className = "",
}: WifLoginProps) {
  const [username, setUsername] = useState("");
  const [wifKey, setWifKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [rememberKey, setRememberKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!username.trim() || !wifKey.trim()) {
      setError("Please enter username and private key");
      return;
    }

    // Basic WIF validation
    if (!wifKey.startsWith("5") || wifKey.length !== 51) {
      setError("Invalid WIF format. Private keys start with '5' and are 51 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In production, you would:
      // 1. Derive public key from WIF
      // 2. Verify it matches the account's public key
      // 3. Sign a challenge to prove ownership

      // Example with @hiveio/wax:
      // const wax = await createHiveChain();
      // const publicKey = wax.getPublicKeyFromWif(wifKey);
      // const account = await wax.api.database_api.find_accounts({ accounts: [username] });
      // const expectedKey = account.accounts[0][keyType];
      // if (publicKey !== expectedKey.key_auths[0][0]) throw new Error("Key mismatch");

      await new Promise((r) => setTimeout(r, 500));

      // Optionally store the key (not recommended)
      if (allowStorage && rememberKey) {
        // WARNING: This is insecure! Consider using HB-Auth instead
        sessionStorage.setItem(\`wif_\${username}_\${keyType}\`, wifKey);
      }

      onSuccess?.({
        username,
        publicKey: "STM..." // Would be derived from WIF
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      {/* Security Warning */}
      <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
        <div className="flex gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-red-500">Security Warning</p>
            <p className="text-muted-foreground">
              Entering your private key directly is less secure. Consider using
              Keychain, PeakVault, or HB-Auth instead.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Hive Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter your username"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
          />
        </div>

        {/* WIF Key */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Private Key ({keyType})
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={wifKey}
              onChange={(e) => setWifKey(e.target.value)}
              placeholder="5K..."
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Your {keyType} private key (starts with 5, 51 characters)
          </p>
        </div>

        {/* Remember (if allowed) */}
        {allowStorage && (
          <div className="flex items-start gap-2">
            <input
              id="remember-key"
              type="checkbox"
              checked={rememberKey}
              onChange={(e) => setRememberKey(e.target.checked)}
              className="h-4 w-4 mt-0.5 rounded border-border accent-hive-red"
            />
            <label htmlFor="remember-key" className="text-sm">
              <span>Remember for this session</span>
              <p className="text-xs text-muted-foreground">
                Key stored in session storage (cleared when browser closes)
              </p>
            </label>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <FileKey className="h-5 w-5" />
              Login with Private Key
            </>
          )}
        </button>
      </div>
    </div>
  );
}`,
  basicUsage: `import { WifLogin } from "@/components/hive/wif-login";

export function LoginPage() {
  return (
    <WifLogin
      keyType="posting"
      onSuccess={(user) => {
        console.log("Logged in:", user.username);
      }}
      onError={(error) => {
        console.error("Error:", error.message);
      }}
    />
  );
}`,
  withStorage: `// Allow session storage (use with caution)
<WifLogin
  allowStorage={true}
  keyType="active"
  onSuccess={(user) => console.log("Authorized:", user.username)}
/>`,
};

export default async function WifLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WIF Login</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Direct private key entry for authentication.
        </p>
      </div>

      {/* Warning */}
      <section className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-500">Use With Caution</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct key entry is the least secure authentication method.
              The key is handled by your application, which creates potential
              security risks. Consider using Keychain, PeakVault, or HB-Auth
              for better security.
            </p>
          </div>
        </div>
      </section>

      {/* When to use */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">When to Use WIF Login</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Server-side operations where extensions aren't available</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>CLI tools and scripts</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Mobile apps without Keychain support</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Fallback when other methods fail</span>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <span className="text-red-500">✗</span>
            <span>Public-facing web apps (prefer Keychain/HB-Auth)</span>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-sm mx-auto">
          {/* Warning */}
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <div className="flex gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-500">Security Warning</p>
                <p className="text-muted-foreground">
                  Consider using Keychain or HB-Auth instead.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Private Key (posting)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="5K..."
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-muted font-mono"
                  disabled
                />
                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium">
              <FileKey className="h-5 w-5" />
              Login with Private Key
            </button>
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Security Best Practices</h2>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-hive-red">1.</span>
            Never store private keys in localStorage
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red">2.</span>
            Use HTTPS only - never transmit keys over HTTP
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red">3.</span>
            Clear key from memory after use
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red">4.</span>
            Validate WIF format before processing
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red">5.</span>
            Consider using posting key only (not active/owner)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red">6.</span>
            Implement rate limiting to prevent brute force
          </li>
        </ul>
      </section>

      {/* Component */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/wif-login.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* With Storage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Session Storage</h2>
        <p className="text-muted-foreground mb-4">
          You can optionally allow storing the key in session storage (cleared
          when browser closes). This is still not recommended for production:
        </p>
        <CodeBlock code={CODE.withStorage} language="typescript" />
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
                <td className="py-2">Which key type to request</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 font-mono text-foreground">allowStorage</td>
                <td className="py-2 font-mono">boolean</td>
                <td className="py-2">false</td>
                <td className="py-2">Allow session storage option</td>
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

      {/* Alternatives */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended Alternatives</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/docs/components/keychain-login"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-500/20"
          >
            Keychain Login (Recommended)
          </Link>
          <Link
            href="/docs/components/hbauth-login"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-500/20"
          >
            HB-Auth (Encrypted Storage)
          </Link>
          <Link
            href="/docs/components/smart-signer"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Smart Signer (All Methods)
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
