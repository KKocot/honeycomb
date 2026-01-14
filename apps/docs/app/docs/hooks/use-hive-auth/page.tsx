import Link from "next/link";
import { ArrowRight, Info, Shield } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  hook: `"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types
interface HiveUser {
  username: string;
  loginMethod: "keychain" | "hivesigner" | "manual";
  publicKeys?: {
    posting?: string;
    active?: string;
    memo?: string;
  };
}

interface HiveAuthContextValue {
  user: HiveUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  loginWithKeychain: (username: string) => Promise<void>;
  loginWithHivesigner: () => void;
  logout: () => void;
}

const HiveAuthContext = createContext<HiveAuthContextValue | null>(null);

// Provider
export function HiveAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<HiveUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Login with Hive Keychain
  const loginWithKeychain = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Keychain is installed
      if (typeof window === "undefined" || !window.hive_keychain) {
        throw new Error("Hive Keychain is not installed");
      }

      // Request signature to verify ownership
      const message = \`Login to app at \${Date.now()}\`;

      return new Promise<void>((resolve, reject) => {
        window.hive_keychain.requestSignBuffer(
          username,
          message,
          "Posting",
          (response: any) => {
            if (response.success) {
              setUser({
                username,
                loginMethod: "keychain",
                publicKeys: {
                  posting: response.publicKey,
                },
              });
              resolve();
            } else {
              reject(new Error(response.message || "Keychain login failed"));
            }
            setIsLoading(false);
          }
        );
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  // Login with Hivesigner
  const loginWithHivesigner = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_HIVESIGNER_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + "/auth/callback");
    const scope = encodeURIComponent("login,vote,comment");

    window.location.href = \`https://hivesigner.com/oauth2/authorize?client_id=\${clientId}&redirect_uri=\${redirectUri}&scope=\${scope}\`;
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return (
    <HiveAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        loginWithKeychain,
        loginWithHivesigner,
        logout,
      }}
    >
      {children}
    </HiveAuthContext.Provider>
  );
}

// Hook
export function useHiveAuth() {
  const context = useContext(HiveAuthContext);
  if (!context) {
    throw new Error("useHiveAuth must be used within a HiveAuthProvider");
  }
  return context;
}`,
  basicUsage: `"use client";

import { useHiveAuth } from "@/hooks/use-hive-auth";

export function AuthStatus() {
  const { user, isAuthenticated, isLoading } = useHiveAuth();

  if (isLoading) {
    return <div>Logging in...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, @{user?.username}!</p>
      <p className="text-sm text-muted-foreground">
        Logged in via {user?.loginMethod}
      </p>
    </div>
  );
}`,
  loginForm: `"use client";

import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useState } from "react";

export function LoginForm() {
  const { loginWithKeychain, loginWithHivesigner, isLoading, error } = useHiveAuth();
  const [username, setUsername] = useState("");

  async function handleKeychainLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      await loginWithKeychain(username.trim().toLowerCase());
    } catch (err) {
      // Error is handled by the hook
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-500">{error.message}</div>
      )}

      <form onSubmit={handleKeychainLogin} className="space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Hive username"
          className="w-full px-3 py-2 rounded border border-border bg-background"
        />
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="w-full px-4 py-2 rounded bg-hive-red text-white disabled:opacity-50"
        >
          {isLoading ? "Connecting..." : "Login with Keychain"}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">or</div>

      <button
        onClick={loginWithHivesigner}
        disabled={isLoading}
        className="w-full px-4 py-2 rounded border border-border hover:bg-muted"
      >
        Login with Hivesigner
      </button>
    </div>
  );
}`,
  protectedRoute: `"use client";

import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useHiveAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}`,
  logoutButton: `"use client";

import { useHiveAuth } from "@/hooks/use-hive-auth";

export function LogoutButton() {
  const { logout, user } = useHiveAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 rounded bg-muted hover:bg-muted/80"
    >
      Logout @{user?.username}
    </button>
  );
}`,
};

export default async function UseHiveAuthPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">useHiveAuth</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage user authentication with Hive Keychain or Hivesigner.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Authentication Methods</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive UI supports two secure authentication methods: <strong>Hive Keychain</strong>{" "}
              (browser extension) and <strong>Hivesigner</strong> (OAuth-style). Both
              methods never expose private keys to your application.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hook & Provider</h2>
        <p className="text-muted-foreground mb-4">
          Copy this hook and provider into your project:
        </p>
        <CodeBlock filename="hooks/use-hive-auth.tsx" code={CODE.hook} language="typescript" />
      </section>

      {/* Return Values */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Return Values</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Property</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>user</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>HiveUser | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Current authenticated user
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isAuthenticated</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  True if user is logged in
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>isLoading</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  True during login process
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>error</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>Error | null</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Error if login failed
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>loginWithKeychain</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(username: string) =&gt; Promise&lt;void&gt;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Login using Hive Keychain
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>loginWithHivesigner</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Redirect to Hivesigner login
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>logout</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Clear user session
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
          Check authentication status:
        </p>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Login Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Login Form</h2>
        <p className="text-muted-foreground mb-4">
          A complete login form with both authentication methods:
        </p>
        <CodeBlock code={CODE.loginForm} language="typescript" />
      </section>

      {/* Protected Route */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Protected Routes</h2>
        <p className="text-muted-foreground mb-4">
          Protect pages that require authentication:
        </p>
        <CodeBlock code={CODE.protectedRoute} language="typescript" />
      </section>

      {/* Logout */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Logout</h2>
        <p className="text-muted-foreground mb-4">
          Simple logout button:
        </p>
        <CodeBlock code={CODE.logoutButton} language="typescript" />
      </section>

      {/* Security */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Security Notes</h2>
        </div>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Keychain is preferred:</strong> Keys never leave the browser
              extension, making it the most secure option.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Never store private keys:</strong> Both methods authenticate
              without exposing keys to your application.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">•</span>
            <span>
              <strong>Verify signatures:</strong> Always verify login signatures
              server-side for sensitive operations.
            </span>
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/hooks/use-hive-account"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            useHiveAccount
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
