import Link from "next/link";
import { ArrowRight, Info, Smartphone, QrCode, Shield, Loader2 } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState, useEffect, useRef } from "react";
import { Smartphone, QrCode, Loader2, Check, X, RefreshCw } from "lucide-react";
import QRCode from "qrcode";

interface HiveAuthLoginProps {
  appName?: string;
  onSuccess?: (user: { username: string; token: string }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

interface AuthStatus {
  status: "idle" | "pending" | "scanning" | "confirming" | "success" | "error";
  message?: string;
  qrCode?: string;
}

export function HiveAuthLogin({
  appName = "My Hive App",
  onSuccess,
  onError,
  className = "",
}: HiveAuthLoginProps) {
  const [username, setUsername] = useState("");
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ status: "idle" });
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code when we have data
  useEffect(() => {
    if (authStatus.qrCode && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, authStatus.qrCode, {
        width: 200,
        margin: 2,
        color: { dark: "#000", light: "#fff" },
      });
    }
  }, [authStatus.qrCode]);

  async function startAuth() {
    if (!username.trim()) return;

    setAuthStatus({ status: "pending", message: "Connecting..." });

    try {
      // Connect to HiveAuth WebSocket server
      const ws = new WebSocket("wss://hiveauth.com/");
      wsRef.current = ws;

      ws.onopen = () => {
        // Send auth request
        const authData = {
          cmd: "auth_req",
          account: username,
          app: appName,
          token: crypto.randomUUID(),
        };
        ws.send(JSON.stringify(authData));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.cmd) {
          case "auth_wait":
            // Generate QR code with auth data
            const qrData = JSON.stringify({
              account: username,
              uuid: data.uuid,
              key: data.key,
              host: "hiveauth.com",
            });
            setAuthStatus({
              status: "scanning",
              message: "Scan with HiveAuth app",
              qrCode: qrData,
            });
            break;

          case "auth_ack":
            setAuthStatus({
              status: "confirming",
              message: "Confirm on your phone...",
            });
            break;

          case "auth_res":
            if (data.success) {
              setAuthStatus({ status: "success", message: "Authenticated!" });
              onSuccess?.({ username, token: data.token });
            } else {
              throw new Error(data.error || "Authentication rejected");
            }
            ws.close();
            break;

          case "error":
            throw new Error(data.message || "Connection error");
        }
      };

      ws.onerror = () => {
        throw new Error("WebSocket connection failed");
      };

      ws.onclose = () => {
        if (authStatus.status === "scanning" || authStatus.status === "confirming") {
          setAuthStatus({ status: "error", message: "Connection closed" });
        }
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Auth failed");
      setAuthStatus({ status: "error", message: error.message });
      onError?.(error);
    }
  }

  function cancelAuth() {
    wsRef.current?.close();
    setAuthStatus({ status: "idle" });
  }

  function retry() {
    setAuthStatus({ status: "idle" });
  }

  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      {authStatus.status === "idle" && (
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
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
            />
          </div>

          <button
            onClick={startAuth}
            disabled={!username.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            <Smartphone className="h-5 w-5" />
            Login with HiveAuth
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Requires{" "}
            <a
              href="https://hiveauth.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:underline"
            >
              HiveAuth app
            </a>{" "}
            on your phone
          </p>
        </div>
      )}

      {(authStatus.status === "pending" || authStatus.status === "scanning" || authStatus.status === "confirming") && (
        <div className="text-center space-y-4">
          {authStatus.qrCode ? (
            <div className="inline-block p-4 bg-white rounded-xl">
              <canvas ref={canvasRef} />
            </div>
          ) : (
            <div className="h-[232px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            {authStatus.status === "confirming" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="h-4 w-4" />
            )}
            <p className="text-sm">{authStatus.message}</p>
          </div>

          <button
            onClick={cancelAuth}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {authStatus.status === "success" && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <p className="font-medium">Successfully authenticated!</p>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      )}

      {authStatus.status === "error" && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <p className="font-medium text-red-500">{authStatus.message}</p>
          <button
            onClick={retry}
            className="mt-4 flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}`,
  basicUsage: `import { HiveAuthLogin } from "@/components/hive/hiveauth-login";

export function LoginPage() {
  return (
    <HiveAuthLogin
      appName="My App"
      onSuccess={(user) => {
        console.log("Logged in:", user.username);
        // Save token for future requests
        localStorage.setItem("hiveauth_token", user.token);
      }}
      onError={(error) => {
        console.error("Login failed:", error.message);
      }}
    />
  );
}`,
  install: `# Install QR code library
npm install qrcode
npm install -D @types/qrcode`,
};

export default async function HiveAuthLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveAuth Login</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Mobile app authentication using QR code scanning.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-purple-500">Mobile-First Authentication</p>
            <p className="mt-1 text-sm text-muted-foreground">
              HiveAuth allows users to authenticate by scanning a QR code with
              the HiveAuth mobile app. Keys never leave the phone, providing
              excellent security for desktop users without browser extensions.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-500/10 mb-3">
              <span className="text-xl font-bold text-purple-500">1</span>
            </div>
            <p className="font-medium">Enter Username</p>
            <p className="text-sm text-muted-foreground">
              Type your Hive username
            </p>
          </div>
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-500/10 mb-3">
              <QrCode className="h-6 w-6 text-purple-500" />
            </div>
            <p className="font-medium">Scan QR Code</p>
            <p className="text-sm text-muted-foreground">
              Open HiveAuth app and scan
            </p>
          </div>
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-500/10 mb-3">
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
            <p className="font-medium">Confirm on Phone</p>
            <p className="text-sm text-muted-foreground">
              Approve the login request
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-medium">
            <Smartphone className="h-5 w-5" />
            Login with HiveAuth
          </button>
          <p className="text-xs text-center text-muted-foreground">
            Requires HiveAuth app on your phone
          </p>
        </div>
      </section>

      {/* QR Scanning State */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">QR Code State</h2>
        <div className="max-w-sm mx-auto text-center space-y-4">
          <div className="inline-block p-4 bg-white rounded-xl">
            <div className="h-[200px] w-[200px] bg-muted flex items-center justify-center">
              <QrCode className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <QrCode className="h-4 w-4" />
            <p className="text-sm">Scan with HiveAuth app</p>
          </div>
        </div>
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
          filename="components/hive/hiveauth-login.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
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
                <td className="py-2 font-mono text-foreground">appName</td>
                <td className="py-2 font-mono">string</td>
                <td className="py-2">"My Hive App"</td>
                <td className="py-2">App name shown in HiveAuth app</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 font-mono text-foreground">onSuccess</td>
                <td className="py-2 font-mono">(user) =&gt; void</td>
                <td className="py-2">-</td>
                <td className="py-2">Called on successful auth</td>
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
