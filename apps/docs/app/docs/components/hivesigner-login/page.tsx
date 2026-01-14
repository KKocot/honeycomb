import Link from "next/link";
import { ArrowRight, Info, ExternalLink } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { ExternalLink } from "lucide-react";

interface HivesignerLoginProps {
  clientId: string;
  redirectUri?: string;
  scope?: string[];
  className?: string;
}

export function HivesignerLogin({
  clientId,
  redirectUri,
  scope = ["login", "vote", "comment"],
  className,
}: HivesignerLoginProps) {
  function handleLogin() {
    const redirect = redirectUri || \`\${window.location.origin}/auth/callback\`;
    const scopeString = scope.join(",");

    const url = new URL("https://hivesigner.com/oauth2/authorize");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirect);
    url.searchParams.set("scope", scopeString);

    window.location.href = url.toString();
  }

  return (
    <button
      onClick={handleLogin}
      className={\`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background font-medium transition-colors hover:bg-muted \${className}\`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
      Login with Hivesigner
      <ExternalLink className="h-4 w-4 opacity-50" />
    </button>
  );
}`,
  callback: `// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const username = searchParams.get("username");
    const expiresIn = searchParams.get("expires_in");

    if (accessToken && username) {
      // Store token securely (consider httpOnly cookies for production)
      localStorage.setItem("hivesigner_token", accessToken);
      localStorage.setItem("hivesigner_user", username);

      if (expiresIn) {
        const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
        localStorage.setItem("hivesigner_expires", expiresAt.toString());
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <a href="/login" className="text-hive-red hover:underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-hive-red border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Completing login...</p>
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { HivesignerLogin } from "@/components/hive/hivesigner-login";

export function LoginPage() {
  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <HivesignerLogin
        clientId="your-app-name"
        redirectUri="https://yourapp.com/auth/callback"
      />
    </div>
  );
}`,
  withKeychain: `"use client";

import { KeychainLogin } from "@/components/hive/keychain-login";
import { HivesignerLogin } from "@/components/hive/hivesigner-login";

export function CombinedLogin() {
  return (
    <div className="max-w-sm mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Choose Login Method</h1>

      <KeychainLogin
        onSuccess={(username) => console.log("Keychain:", username)}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <HivesignerLogin
        clientId="your-app-name"
        className="w-full"
      />
    </div>
  );
}`,
  customScopes: `"use client";

import { HivesignerLogin } from "@/components/hive/hivesigner-login";

export function AdvancedLogin() {
  return (
    <div className="space-y-4">
      {/* Basic login only */}
      <HivesignerLogin
        clientId="your-app"
        scope={["login"]}
      />

      {/* Full permissions */}
      <HivesignerLogin
        clientId="your-app"
        scope={["login", "vote", "comment", "delete_comment", "custom_json"]}
      />
    </div>
  );
}`,
  envSetup: `# .env.local

# Your Hivesigner app name (register at https://hivesigner.com/dashboard)
NEXT_PUBLIC_HIVESIGNER_CLIENT_ID=your-app-name

# Callback URL (must match your Hivesigner app settings)
NEXT_PUBLIC_HIVESIGNER_REDIRECT_URI=http://localhost:3000/auth/callback`,
};

export default async function HivesignerLoginPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hivesigner Login</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          OAuth-style authentication using Hivesigner.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hivesigner</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hivesigner provides OAuth2-style authentication for Hive. Users are
              redirected to Hivesigner to authorize your app, then sent back with
              an access token. No browser extension required.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background font-medium hover:bg-muted">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Login with Hivesigner
          <ExternalLink className="h-4 w-4 opacity-50" />
        </button>
      </section>

      {/* Environment Setup */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Environment Setup</h2>
        <p className="text-muted-foreground mb-4">
          First, register your app at{" "}
          <a
            href="https://hivesigner.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-hive-red hover:underline"
          >
            Hivesigner Dashboard
          </a>
          , then add these environment variables:
        </p>
        <CodeBlock filename=".env.local" code={CODE.envSetup} language="bash" />
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <p className="text-muted-foreground mb-4">
          Copy this component into your project:
        </p>
        <CodeBlock
          filename="components/hive/hivesigner-login.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Callback Handler */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Callback Handler</h2>
        <p className="text-muted-foreground mb-4">
          Create a callback page to handle the redirect from Hivesigner:
        </p>
        <CodeBlock
          filename="app/auth/callback/page.tsx"
          code={CODE.callback}
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
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>clientId</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Your Hivesigner app name
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>redirectUri</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>/auth/callback</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  OAuth callback URL
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>scope</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string[]</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>[&quot;login&quot;, &quot;vote&quot;, &quot;comment&quot;]</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Permissions to request
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>className</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Additional CSS classes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Available Scopes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Available Scopes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Scope</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>login</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Basic authentication
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>vote</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Upvote and downvote content
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>comment</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Create posts and comments
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>delete_comment</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Delete own posts and comments
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>custom_json</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  Broadcast custom JSON operations
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Combined with Keychain */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Combined with Keychain</h2>
        <p className="text-muted-foreground mb-4">
          Offer both authentication methods for better user experience:
        </p>
        <CodeBlock code={CODE.withKeychain} language="typescript" />
      </section>

      {/* Custom Scopes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Scopes</h2>
        <p className="text-muted-foreground mb-4">
          Request only the permissions you need:
        </p>
        <CodeBlock code={CODE.customScopes} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/avatar"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Avatar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
