import Link from "next/link";
import { ArrowRight, Info, Lock, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, Check, Plus } from "lucide-react";

interface HBAuthLoginProps {
  onSuccess?: (user: { username: string }) => void;
  onError?: (error: Error) => void;
  workerUrl?: string;
  className?: string;
}

interface StoredUser {
  username: string;
  keyType: "posting" | "active";
}

export function HBAuthLogin({
  onSuccess,
  onError,
  workerUrl = "/hb-auth-worker.js",
  className = "",
}: HBAuthLoginProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wifKey, setWifKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showWif, setShowWif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);

  // In production, you would initialize the HB-Auth client here
  // const client = useRef<HBAuthClient | null>(null);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // With @hiveio/hb-auth:
      // const auth = await client.current.authenticate(username, password, "posting");
      // if (!auth.ok) throw new Error("Invalid password");

      // For demo, simulate auth
      await new Promise((r) => setTimeout(r, 1000));

      // Check if user is registered
      const users = JSON.parse(localStorage.getItem("hbauth_users") || "[]");
      const user = users.find((u: StoredUser) => u.username === username);

      if (!user) {
        throw new Error("User not registered. Please register first.");
      }

      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister() {
    if (!username.trim() || !password.trim() || !wifKey.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // With @hiveio/hb-auth:
      // await client.current.register(username, wifKey, password, "posting");

      // For demo, save to localStorage
      await new Promise((r) => setTimeout(r, 1000));

      const users = JSON.parse(localStorage.getItem("hbauth_users") || "[]");
      users.push({ username, keyType: "posting" });
      localStorage.setItem("hbauth_users", JSON.stringify(users));

      // Auto login after register
      onSuccess?.({ username });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Registration failed");
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      {/* Mode Tabs */}
      <div className="flex mb-6 border-b border-border">
        <button
          onClick={() => { setMode("login"); setError(null); }}
          className={\`flex-1 py-2 text-sm font-medium border-b-2 transition-colors \${
            mode === "login"
              ? "border-hive-red text-hive-red"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }\`}
        >
          Login
        </button>
        <button
          onClick={() => { setMode("register"); setError(null); }}
          className={\`flex-1 py-2 text-sm font-medium border-b-2 transition-colors \${
            mode === "register"
              ? "border-hive-red text-hive-red"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }\`}
        >
          Register Key
        </button>
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Unlock Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "register" ? "Create a strong password" : "Enter your password"}
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* WIF Key (register only) */}
        {mode === "register" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Private Key (WIF)
              </label>
              <div className="relative">
                <input
                  type={showWif ? "text" : "password"}
                  value={wifKey}
                  onChange={(e) => setWifKey(e.target.value)}
                  placeholder="Enter your posting private key"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
                />
                <button
                  type="button"
                  onClick={() => setShowWif(!showWif)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showWif ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 text-sm">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Your key will be encrypted with your password and stored locally.
                  The original key is never saved.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {mode === "login" ? "Unlocking..." : "Registering..."}
            </>
          ) : mode === "login" ? (
            <>
              <Lock className="h-5 w-5" />
              Unlock Wallet
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Register Key
            </>
          )}
        </button>
      </div>
    </div>
  );
}`,
  basicUsage: `import { HBAuthLogin } from "@/components/hive/hbauth-login";

export function LoginPage() {
  return (
    <HBAuthLogin
      onSuccess={(user) => {
        console.log("Logged in:", user.username);
      }}
      onError={(error) => {
        console.error("Error:", error.message);
      }}
    />
  );
}`,
  install: `# Install HB-Auth library
npm install @hiveio/hb-auth

# Copy the worker file to your public directory
cp node_modules/@hiveio/hb-auth/dist/worker.js public/hb-auth-worker.js`,
};

export default async function HBAuthLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HB-Auth Login</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Encrypted local wallet with password protection (Safe Storage).
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Safe Storage</p>
            <p className="mt-1 text-sm text-muted-foreground">
              HB-Auth (Hive Browser Auth) stores your private key encrypted in
              the browser. You unlock it with a password you choose. The key
              is never stored in plain text and encryption happens in a
              separate Web Worker for security.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10 shrink-0">
              <span className="text-sm font-bold text-green-500">1</span>
            </div>
            <div>
              <p className="font-medium">One-time Registration</p>
              <p className="text-sm text-muted-foreground">
                Enter your private key and create a password. The key is encrypted
                and stored in IndexedDB.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10 shrink-0">
              <span className="text-sm font-bold text-green-500">2</span>
            </div>
            <div>
              <p className="font-medium">Login with Password</p>
              <p className="text-sm text-muted-foreground">
                Enter your password to decrypt and use the key. Password never
                leaves your browser.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10 shrink-0">
              <span className="text-sm font-bold text-green-500">3</span>
            </div>
            <div>
              <p className="font-medium">Sign Transactions</p>
              <p className="text-sm text-muted-foreground">
                The Web Worker handles all cryptographic operations in isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview - Login</h2>
        <div className="max-w-sm mx-auto">
          <div className="flex mb-6 border-b border-border">
            <button className="flex-1 py-2 text-sm font-medium border-b-2 border-hive-red text-hive-red">
              Login
            </button>
            <button className="flex-1 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground">
              Register Key
            </button>
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
                Unlock Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-muted"
                  disabled
                />
                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium">
              <Lock className="h-5 w-5" />
              Unlock Wallet
            </button>
          </div>
        </div>
      </section>

      {/* Register Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview - Register</h2>
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Private Key (WIF)
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your posting private key"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-muted"
                  disabled
                />
                <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 text-sm">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  Your key will be encrypted with your password and stored locally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold">Security Features</h2>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Keys encrypted with AES-256-GCM
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Password derived using PBKDF2 with 100,000 iterations
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Cryptographic operations run in isolated Web Worker
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Original key never stored, only encrypted version
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Data stored in IndexedDB, survives browser restarts
          </li>
        </ul>
      </section>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Installation</h2>
        <CodeBlock code={CODE.install} language="bash" />
      </section>

      {/* Component */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/hbauth-login.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
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
            href="/docs/components/wif-login"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            WIF Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
