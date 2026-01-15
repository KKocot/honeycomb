import Link from "next/link";
import { ArrowRight, Info, Send, ArrowUpDown, PiggyBank, Users } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { X, Send, ArrowUpDown, PiggyBank, Users, Loader2 } from "lucide-react";

type TransferType = "transfer" | "powerUp" | "powerDown" | "delegate" | "savings";

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sender: string;
  initialType?: TransferType;
  initialRecipient?: string;
  availableHive?: string;
  availableHbd?: string;
  availableHp?: string;
  onTransfer?: (data: {
    type: TransferType;
    to: string;
    amount: string;
    asset: "HIVE" | "HBD" | "HP";
    memo?: string;
  }) => Promise<void>;
}

export function TransferDialog({
  isOpen,
  onClose,
  sender,
  initialType = "transfer",
  initialRecipient = "",
  availableHive = "0.000",
  availableHbd = "0.000",
  availableHp = "0.000",
  onTransfer,
}: TransferDialogProps) {
  const [type, setType] = useState<TransferType>(initialType);
  const [to, setTo] = useState(initialRecipient);
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<"HIVE" | "HBD" | "HP">("HIVE");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const typeConfig = {
    transfer: {
      title: "Transfer",
      icon: Send,
      description: "Send HIVE or HBD to another account",
      assets: ["HIVE", "HBD"] as const,
      showMemo: true,
      showRecipient: true,
    },
    powerUp: {
      title: "Power Up",
      icon: ArrowUpDown,
      description: "Convert HIVE to Hive Power",
      assets: ["HIVE"] as const,
      showMemo: false,
      showRecipient: true,
    },
    powerDown: {
      title: "Power Down",
      icon: ArrowUpDown,
      description: "Convert HP to HIVE over 13 weeks",
      assets: ["HP"] as const,
      showMemo: false,
      showRecipient: false,
    },
    delegate: {
      title: "Delegate HP",
      icon: Users,
      description: "Lend your HP to another account",
      assets: ["HP"] as const,
      showMemo: false,
      showRecipient: true,
    },
    savings: {
      title: "Savings",
      icon: PiggyBank,
      description: "Transfer to savings (3-day withdrawal)",
      assets: ["HIVE", "HBD"] as const,
      showMemo: true,
      showRecipient: false,
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || (config.showRecipient && !to)) return;

    setIsLoading(true);
    try {
      await onTransfer?.({
        type,
        to: config.showRecipient ? to : sender,
        amount,
        asset,
        memo: config.showMemo ? memo : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const getAvailable = () => {
    switch (asset) {
      case "HIVE": return availableHive;
      case "HBD": return availableHbd;
      case "HP": return availableHp;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 bg-card rounded-xl border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">{config.title}</h2>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
          {(Object.keys(typeConfig) as TransferType[]).map((t) => {
            const TypeIcon = typeConfig[t].icon;
            return (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setAsset(typeConfig[t].assets[0]);
                }}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap \${
                  type === t
                    ? "bg-hive-red text-white"
                    : "text-muted-foreground hover:bg-muted"
                }\`}
              >
                <TypeIcon className="h-4 w-4" />
                {typeConfig[t].title}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {config.showRecipient && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {type === "delegate" ? "Delegate to" : "Recipient"}
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value.toLowerCase())}
                placeholder="username"
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000"
                step="0.001"
                min="0"
                className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
              />
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none"
              >
                {config.assets.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Available: {getAvailable()} {asset}
              <button
                type="button"
                onClick={() => setAmount(getAvailable())}
                className="ml-2 text-hive-red hover:underline"
              >
                Max
              </button>
            </p>
          </div>

          {config.showMemo && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Memo <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Add a memo..."
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Start with # for encrypted memo
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !amount || (config.showRecipient && !to)}
            className="w-full py-3 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Processing...
              </>
            ) : (
              config.title
            )}
          </button>
        </form>
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { useState } from "react";
import { TransferDialog } from "@/components/hive/transfer-dialog";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useHiveAccount } from "@/hooks/use-hive-account";
import { useTransfer } from "@/hooks/use-transfer";

export function WalletActions() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useHiveAuth();
  const { account } = useHiveAccount(user?.username);
  const { transfer, powerUp, delegate } = useTransfer();

  async function handleTransfer(data: any) {
    switch (data.type) {
      case "transfer":
        await transfer(data.to, data.amount, data.asset, data.memo);
        break;
      case "powerUp":
        await powerUp(data.to, data.amount);
        break;
      case "delegate":
        await delegate(data.to, data.amount);
        break;
      // ... handle other types
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-hive-red text-white rounded-lg"
      >
        Transfer
      </button>

      <TransferDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sender={user?.username || ""}
        availableHive={account?.balance}
        availableHbd={account?.hbd_balance}
        availableHp={account?.vesting_shares}
        onTransfer={handleTransfer}
      />
    </>
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useTransfer() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const transfer = useCallback(async (
    to: string,
    amount: string,
    asset: "HIVE" | "HBD",
    memo?: string
  ) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      transfer: {
        from: user.username,
        to,
        amount: \`\${amount} \${asset}\`,
        memo: memo || "",
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const powerUp = useCallback(async (to: string, amount: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      transfer_to_vesting: {
        from: user.username,
        to,
        amount: \`\${amount} HIVE\`,
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const powerDown = useCallback(async (amount: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      withdraw_vesting: {
        account: user.username,
        vesting_shares: \`\${amount} VESTS\`,
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const delegate = useCallback(async (delegatee: string, amount: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      delegate_vesting_shares: {
        delegator: user.username,
        delegatee,
        vesting_shares: \`\${amount} VESTS\`,
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { transfer, powerUp, powerDown, delegate };
}`,
};

export default async function TransferDialogPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transfer Dialog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Multi-purpose dialog for transfers, power up/down, delegation, and savings.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-500">Transfer Operations</p>
            <p className="mt-1 text-sm text-muted-foreground">
              All transfer operations require the active key. Power down takes 13 weeks
              with weekly payouts. Savings have a 3-day withdrawal period for security.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-md mx-auto rounded-xl border border-border bg-card">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Transfer</h3>
                <p className="text-sm text-muted-foreground">Send HIVE or HBD</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-hive-red text-white">
              <Send className="h-4 w-4" /> Transfer
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground">
              <ArrowUpDown className="h-4 w-4" /> Power Up
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground">
              <Users className="h-4 w-4" /> Delegate
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground">
              <PiggyBank className="h-4 w-4" /> Savings
            </button>
          </div>

          {/* Form preview */}
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient</label>
              <div className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                username
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                  0.000
                </div>
                <div className="px-3 py-2 rounded-lg bg-muted border border-border">
                  HIVE
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Available: 1,234.567 HIVE
              </p>
            </div>
            <button className="w-full py-3 rounded-lg bg-hive-red text-white font-medium">
              Transfer
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/transfer-dialog.tsx"
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
                <td className="py-3 px-4"><code>isOpen</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground">Dialog visibility</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>sender</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">Sending account username</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialType</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>TransferType</code></td>
                <td className="py-3 px-4 text-muted-foreground">Initial transfer type tab</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>availableHive</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">Available HIVE balance</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>availableHbd</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">Available HBD balance</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>availableHp</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">Available HP balance</td>
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

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useTransfer Hook</h2>
        <CodeBlock
          filename="hooks/use-transfer.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/power-up-down"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Power Up/Down
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
