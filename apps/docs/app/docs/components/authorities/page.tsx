import Link from "next/link";
import { ArrowRight, Info, Key, Shield, Eye, EyeOff, Copy, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { Key, Shield, Eye, EyeOff, Copy, AlertTriangle, Check, Plus, Trash2 } from "lucide-react";

interface Authority {
  weight_threshold: number;
  account_auths: [string, number][];
  key_auths: [string, number][];
}

interface AuthoritiesProps {
  username: string;
  owner: Authority;
  active: Authority;
  posting: Authority;
  memo_key: string;
  onAddAuth?: (type: "owner" | "active" | "posting", account: string, weight: number) => Promise<void>;
  onRemoveAuth?: (type: "owner" | "active" | "posting", account: string) => Promise<void>;
  onRevealKey?: (type: "owner" | "active" | "posting" | "memo") => Promise<string>;
  className?: string;
}

export function Authorities({
  username,
  owner,
  active,
  posting,
  memo_key,
  onAddAuth,
  onRemoveAuth,
  onRevealKey,
  className = "",
}: AuthoritiesProps) {
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revealType, setRevealType] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleReveal(type: "owner" | "active" | "posting" | "memo") {
    try {
      const key = await onRevealKey?.(type);
      if (key) {
        setRevealedKey(key);
        setRevealType(type);
      }
    } catch (error) {
      console.error("Failed to reveal key:", error);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function AuthoritySection({
    title,
    type,
    authority,
    color,
    description,
  }: {
    title: string;
    type: "owner" | "active" | "posting";
    authority: Authority;
    color: string;
    description: string;
  }) {
    return (
      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={\`p-2 rounded-lg bg-\${color}-500/10 text-\${color}-500\`}>
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold">{title} Key</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            Threshold: {authority.weight_threshold}
          </span>
        </div>

        {/* Public keys */}
        <div className="space-y-2">
          {authority.key_auths.map(([key, weight]) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                <code className="truncate">{key}</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">w:{weight}</span>
                <button
                  onClick={() => handleCopy(key)}
                  className="p-1 hover:bg-muted rounded"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Account auths */}
        {authority.account_auths.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted-foreground">Account Authorities:</p>
            {authority.account_auths.map(([account, weight]) => (
              <div
                key={account}
                className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm"
              >
                <span>@{account}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">w:{weight}</span>
                  {onRemoveAuth && (
                    <button
                      onClick={() => onRemoveAuth(type, account)}
                      className="p-1 hover:bg-red-500/10 text-red-500 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reveal private key */}
        <button
          onClick={() => handleReveal(type)}
          className={\`mt-3 w-full py-2 rounded-lg text-sm font-medium border border-\${color}-500/30 text-\${color}-500 hover:bg-\${color}-500/10\`}
        >
          <Eye className="h-4 w-4 inline mr-2" />
          Reveal Private Key
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Warning */}
      <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-orange-500">Security Warning</p>
            <p className="text-sm text-muted-foreground">
              Never share your private keys. The owner key should be kept offline.
              Use posting key for social actions, active key for financial operations.
            </p>
          </div>
        </div>
      </div>

      {/* Revealed key modal */}
      {revealedKey && (
        <div className="mb-4 p-4 rounded-lg bg-card border border-hive-red">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-hive-red">
              {revealType?.toUpperCase()} Private Key
            </span>
            <button
              onClick={() => setRevealedKey(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 rounded bg-muted text-sm break-all">
              {revealedKey}
            </code>
            <button
              onClick={() => handleCopy(revealedKey)}
              className="p-2 hover:bg-muted rounded"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Authority sections */}
      <div className="space-y-4">
        <AuthoritySection
          title="Owner"
          type="owner"
          authority={owner}
          color="red"
          description="Account recovery & key changes (keep offline!)"
        />
        <AuthoritySection
          title="Active"
          type="active"
          authority={active}
          color="orange"
          description="Transfers, power up/down, witness voting"
        />
        <AuthoritySection
          title="Posting"
          type="posting"
          authority={posting}
          color="blue"
          description="Posts, comments, votes, follows"
        />

        {/* Memo key */}
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold">Memo Key</h4>
              <p className="text-xs text-muted-foreground">
                Encrypt & decrypt private messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-muted/50 text-sm">
            <code className="flex-1 truncate">{memo_key}</code>
            <button
              onClick={() => handleCopy(memo_key)}
              className="p-1 hover:bg-muted rounded"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <button
            onClick={() => handleReveal("memo")}
            className="mt-3 w-full py-2 rounded-lg text-sm font-medium border border-green-500/30 text-green-500 hover:bg-green-500/10"
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Reveal Private Key
          </button>
        </div>
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { Authorities } from "@/components/hive/authorities";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useHiveAccount } from "@/hooks/use-hive-account";

export function KeysPage() {
  const { user, revealPrivateKey } = useHiveAuth();
  const { account } = useHiveAccount(user?.username);

  if (!user || !account) return null;

  return (
    <Authorities
      username={user.username}
      owner={account.owner}
      active={account.active}
      posting={account.posting}
      memo_key={account.memo_key}
      onRevealKey={revealPrivateKey}
    />
  );
}`,
};

export default async function AuthoritiesPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Authorities</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage account keys and multi-signature authorities.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-orange-500">Key Hierarchy</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive uses a hierarchical key system: Owner (most powerful, keep offline),
              Active (financial), Posting (social), and Memo (encrypted messages).
              Each authority can have multiple keys or accounts with weighted access.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="space-y-4 max-w-xl">
          {/* Warning */}
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-orange-500">Security Warning</p>
                <p className="text-sm text-muted-foreground">
                  Never share your private keys.
                </p>
              </div>
            </div>
          </div>

          {/* Owner key section */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">Owner Key</h4>
                  <p className="text-xs text-muted-foreground">
                    Account recovery (keep offline!)
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Threshold: 1</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <code className="truncate">STM7abc...xyz</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">w:1</span>
                <Copy className="h-3 w-3" />
              </div>
            </div>
            <button className="mt-3 w-full py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-500">
              <Eye className="h-4 w-4 inline mr-2" /> Reveal Private Key
            </button>
          </div>

          {/* Posting key section */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">Posting Key</h4>
                  <p className="text-xs text-muted-foreground">
                    Posts, comments, votes
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Threshold: 1</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <code className="truncate">STM8def...uvw</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">w:1</span>
                <Copy className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/authorities.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/account-settings"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Account Settings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
