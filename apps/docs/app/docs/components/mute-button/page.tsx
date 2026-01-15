import Link from "next/link";
import { ArrowRight, Info, VolumeX, Volume2 } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { VolumeX, Volume2, Loader2 } from "lucide-react";

interface MuteButtonProps {
  username: string;
  muter?: string;
  initialMuted?: boolean;
  onMute?: (username: string) => Promise<void>;
  onUnmute?: (username: string) => Promise<void>;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function MuteButton({
  username,
  muter,
  initialMuted = false,
  onMute,
  onUnmute,
  variant = "default",
  size = "md",
  showIcon = true,
  showLabel = true,
  className = "",
}: MuteButtonProps) {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (!muter) return;

    setIsLoading(true);
    try {
      if (isMuted) {
        await onUnmute?.(username);
        setIsMuted(false);
      } else {
        await onMute?.(username);
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Mute action failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const variantClasses = {
    default: isMuted
      ? "bg-orange-500/10 text-orange-500 hover:bg-muted"
      : "bg-muted text-foreground hover:bg-orange-500/10 hover:text-orange-500",
    outline: isMuted
      ? "border border-orange-500 text-orange-500"
      : "border border-border hover:border-orange-500 hover:text-orange-500",
    ghost: isMuted
      ? "text-orange-500"
      : "text-muted-foreground hover:text-orange-500",
  };

  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !muter}
      className={\`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 \${showLabel ? sizeClasses[size] : "p-2"} \${variantClasses[variant]} \${className}\`}
    >
      {isLoading ? (
        <Loader2 className={\`\${iconSize} animate-spin\`} />
      ) : showIcon ? (
        isMuted ? (
          <VolumeX className={iconSize} />
        ) : (
          <Volume2 className={iconSize} />
        )
      ) : null}
      {showLabel && (isMuted ? "Muted" : "Mute")}
    </button>
  );
}`,
  basicUsage: `"use client";

import { MuteButton } from "@/components/hive/mute-button";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useMute } from "@/hooks/use-mute";

interface UserActionsProps {
  username: string;
  isMuted: boolean;
}

export function UserActions({ username, isMuted }: UserActionsProps) {
  const { user } = useHiveAuth();
  const { mute, unmute } = useMute();

  return (
    <MuteButton
      username={username}
      muter={user?.username}
      initialMuted={isMuted}
      onMute={mute}
      onUnmute={unmute}
    />
  );
}`,
  iconOnly: `<MuteButton
  username="spammer"
  muter={user?.username}
  showLabel={false}
  variant="ghost"
  onMute={mute}
/>`,
  inDropdown: `"use client";

import { useState } from "react";
import { MoreHorizontal, UserMinus, Flag, VolumeX } from "lucide-react";
import { MuteButton } from "@/components/hive/mute-button";

interface UserMenuProps {
  username: string;
  isMuted: boolean;
  onMute: (username: string) => Promise<void>;
  onUnmute: (username: string) => Promise<void>;
}

export function UserMenu({ username, isMuted, onMute, onUnmute }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-muted"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg">
          <div className="p-1">
            <MuteButton
              username={username}
              muter="currentuser"
              initialMuted={isMuted}
              onMute={onMute}
              onUnmute={onUnmute}
              variant="ghost"
              className="w-full justify-start"
            />
            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted">
              <Flag className="h-4 w-4" />
              Report
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 rounded hover:bg-red-500/10">
              <UserMinus className="h-4 w-4" />
              Block
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useMute() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const mute = useCallback(async (following: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      custom_json: {
        required_auths: [],
        required_posting_auths: [user.username],
        id: "follow",
        json: JSON.stringify([
          "follow",
          {
            follower: user.username,
            following,
            what: ["ignore"],
          },
        ]),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const unmute = useCallback(async (following: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      custom_json: {
        required_auths: [],
        required_posting_auths: [user.username],
        id: "follow",
        json: JSON.stringify([
          "follow",
          {
            follower: user.username,
            following,
            what: [],
          },
        ]),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { mute, unmute };
}`,
};

export default async function MuteButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mute Button</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Mute and unmute Hive users to hide their content from your feed.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-orange-500">Muting on Hive</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Muting uses the same &quot;follow&quot; operation but with &quot;ignore&quot; in the &quot;what&quot; array.
              Muted users&apos; content is hidden from your feed but they can still interact with your posts.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="flex flex-wrap gap-4">
          {/* Not muted */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground">
            <Volume2 className="h-4 w-4" />
            Mute
          </button>

          {/* Muted */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-500/10 text-orange-500">
            <VolumeX className="h-4 w-4" />
            Muted
          </button>

          {/* Icon only */}
          <button className="p-2 rounded-lg text-muted-foreground hover:text-orange-500">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/mute-button.tsx"
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
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>username</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Username to mute</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>muter</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Current user username</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialMuted</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Is already muted</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showLabel</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show text label</td>
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

      {/* Icon Only */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Icon Only</h2>
        <CodeBlock code={CODE.iconOnly} language="tsx" />
      </section>

      {/* In Dropdown */}
      <section>
        <h2 className="text-xl font-semibold mb-4">In Dropdown Menu</h2>
        <CodeBlock code={CODE.inDropdown} language="typescript" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useMute Hook</h2>
        <CodeBlock
          filename="hooks/use-mute.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/badge-list"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Badge List
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
