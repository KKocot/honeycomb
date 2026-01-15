import Link from "next/link";
import { ArrowRight, Info, UserPlus, UserMinus } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  username: string;
  follower?: string;
  initialFollowing?: boolean;
  onFollow?: (username: string) => Promise<void>;
  onUnfollow?: (username: string) => Promise<void>;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function FollowButton({
  username,
  follower,
  initialFollowing = false,
  onFollow,
  onUnfollow,
  variant = "default",
  size = "md",
  showIcon = true,
  className = "",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (!follower) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow?.(username);
        setIsFollowing(false);
      } else {
        await onFollow?.(username);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
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
    default: isFollowing
      ? "bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500"
      : "bg-hive-red text-white hover:bg-hive-red/90",
    outline: isFollowing
      ? "border border-border hover:border-red-500 hover:text-red-500"
      : "border border-hive-red text-hive-red hover:bg-hive-red hover:text-white",
    ghost: isFollowing
      ? "hover:bg-red-500/10 hover:text-red-500"
      : "hover:bg-hive-red/10 text-hive-red",
  };

  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !follower}
      className={\`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 \${sizeClasses[size]} \${variantClasses[variant]} \${className}\`}
    >
      {isLoading ? (
        <Loader2 className={\`\${iconSize} animate-spin\`} />
      ) : showIcon ? (
        isFollowing ? (
          <UserMinus className={iconSize} />
        ) : (
          <UserPlus className={iconSize} />
        )
      ) : null}
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}`,
  basicUsage: `"use client";

import { FollowButton } from "@/components/hive/follow-button";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useFollow } from "@/hooks/use-follow";

interface UserProfileProps {
  username: string;
  isFollowing: boolean;
}

export function UserProfile({ username, isFollowing }: UserProfileProps) {
  const { user } = useHiveAuth();
  const { follow, unfollow } = useFollow();

  return (
    <div className="flex items-center gap-4">
      <span className="font-medium">@{username}</span>
      <FollowButton
        username={username}
        follower={user?.username}
        initialFollowing={isFollowing}
        onFollow={follow}
        onUnfollow={unfollow}
      />
    </div>
  );
}`,
  variants: `<div className="flex flex-wrap gap-4">
  {/* Default variant */}
  <FollowButton
    username="hiveio"
    follower={user?.username}
    variant="default"
    onFollow={follow}
  />

  {/* Outline variant */}
  <FollowButton
    username="hiveio"
    follower={user?.username}
    variant="outline"
    onFollow={follow}
  />

  {/* Ghost variant */}
  <FollowButton
    username="hiveio"
    follower={user?.username}
    variant="ghost"
    onFollow={follow}
  />
</div>`,
  sizes: `<div className="flex items-center gap-4">
  <FollowButton
    username="hiveio"
    follower={user?.username}
    size="sm"
    onFollow={follow}
  />
  <FollowButton
    username="hiveio"
    follower={user?.username}
    size="md"
    onFollow={follow}
  />
  <FollowButton
    username="hiveio"
    follower={user?.username}
    size="lg"
    onFollow={follow}
  />
</div>`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useFollow() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const follow = useCallback(async (following: string) => {
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
            what: ["blog"],
          },
        ]),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const unfollow = useCallback(async (following: string) => {
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

  return { follow, unfollow };
}`,
};

export default async function FollowButtonPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Follow Button</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Follow and unfollow Hive users with optimistic UI updates.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Following on Hive</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Following uses the custom_json operation with &quot;follow&quot; id.
              It requires the posting key and affects what content appears in your feed.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="flex flex-wrap gap-4">
          {/* Not following */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-hive-red text-white hover:bg-hive-red/90">
            <UserPlus className="h-4 w-4" />
            Follow
          </button>

          {/* Following */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground">
            <UserMinus className="h-4 w-4" />
            Following
          </button>

          {/* Outline */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-hive-red text-hive-red hover:bg-hive-red hover:text-white">
            <UserPlus className="h-4 w-4" />
            Follow
          </button>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/follow-button.tsx"
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
                <td className="py-3 px-4 text-muted-foreground">Username to follow</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>follower</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>string</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Current user username</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>initialFollowing</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>false</code></td>
                <td className="py-3 px-4 text-muted-foreground">Is already following</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onFollow</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(username: string) =&gt; Promise&lt;void&gt;</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Follow handler</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onUnfollow</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>(username: string) =&gt; Promise&lt;void&gt;</code></td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Unfollow handler</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;default&quot; | &quot;outline&quot; | &quot;ghost&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;default&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Visual variant</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>size</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;md&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Button size</td>
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

      {/* Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Variants</h2>
        <CodeBlock code={CODE.variants} language="tsx" />
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sizes</h2>
        <CodeBlock code={CODE.sizes} language="tsx" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useFollow Hook</h2>
        <p className="text-muted-foreground mb-4">
          Hook for handling follow/unfollow operations:
        </p>
        <CodeBlock
          filename="hooks/use-follow.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/mute-button"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Mute Button
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
