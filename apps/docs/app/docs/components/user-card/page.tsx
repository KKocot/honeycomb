import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useHiveAccount } from "@/hooks/use-hive-account";
import { HiveAvatar } from "@/components/hive/avatar";
import { useMemo } from "react";

interface UserCardProps {
  username: string;
  variant?: "compact" | "default" | "expanded";
  showStats?: boolean;
  className?: string;
}

interface ProfileMetadata {
  name?: string;
  about?: string;
  location?: string;
  website?: string;
  profile_image?: string;
  cover_image?: string;
}

export function UserCard({
  username,
  variant = "default",
  showStats = true,
  className = "",
}: UserCardProps) {
  const { account, isLoading, error } = useHiveAccount(username);

  const metadata = useMemo<ProfileMetadata | null>(() => {
    if (!account) return null;

    try {
      if (account.posting_json_metadata) {
        const parsed = JSON.parse(account.posting_json_metadata);
        if (parsed.profile) return parsed.profile;
      }
      if (account.json_metadata) {
        const parsed = JSON.parse(account.json_metadata);
        if (parsed.profile) return parsed.profile;
      }
    } catch {
      // Invalid JSON
    }
    return null;
  }, [account]);

  // Format reputation score
  const formatReputation = (rep: number): number => {
    if (rep === 0) return 25;
    const neg = rep < 0;
    const repLevel = Math.log10(Math.abs(rep));
    let reputationLevel = Math.max(repLevel - 9, 0);
    if (repLevel < 0) reputationLevel = 0;
    if (neg) reputationLevel *= -1;
    return Math.floor(reputationLevel * 9 + 25);
  };

  if (isLoading) {
    return (
      <div className={\`rounded-lg border border-border bg-card p-4 animate-pulse \${className}\`}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className={\`rounded-lg border border-border bg-card p-4 \${className}\`}>
        <p className="text-sm text-muted-foreground">
          {error?.message || "User not found"}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={\`flex items-center gap-2 \${className}\`}>
        <HiveAvatar username={username} size="sm" />
        <div>
          <span className="font-medium">@{username}</span>
          <span className="text-muted-foreground text-sm ml-1">
            ({formatReputation(account.reputation)})
          </span>
        </div>
      </div>
    );
  }

  if (variant === "expanded") {
    return (
      <div className={\`rounded-lg border border-border bg-card overflow-hidden \${className}\`}>
        {metadata?.cover_image && (
          <img
            src={metadata.cover_image}
            alt="Cover"
            className="w-full h-32 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex items-start gap-4">
            <HiveAvatar
              username={username}
              size="xl"
              className={metadata?.cover_image ? "-mt-10 ring-4 ring-card" : ""}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">
                {metadata?.name || \`@\${username}\`}
              </h3>
              <p className="text-muted-foreground text-sm">
                @{username} • Rep: {formatReputation(account.reputation)}
              </p>
            </div>
          </div>

          {metadata?.about && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {metadata.about}
            </p>
          )}

          {showStats && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">{account.post_count}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-lg font-bold">{account.balance.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">HIVE</p>
              </div>
              <div>
                <p className="text-lg font-bold">{account.hbd_balance.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">HBD</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={\`rounded-lg border border-border bg-card p-4 \${className}\`}>
      <div className="flex items-center gap-3">
        <HiveAvatar username={username} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {metadata?.name || \`@\${username}\`}
          </h3>
          <p className="text-sm text-muted-foreground">
            @{username} • Rep: {formatReputation(account.reputation)}
          </p>
        </div>
      </div>

      {showStats && (
        <div className="mt-3 flex gap-4 text-sm">
          <span>{account.post_count} posts</span>
          <span>{account.balance}</span>
        </div>
      )}
    </div>
  );
}`,
  basicUsage: `import { UserCard } from "@/components/hive/user-card";

export function ProfilePage() {
  return (
    <div className="max-w-md">
      <UserCard username="blocktrades" />
    </div>
  );
}`,
  variants: `import { UserCard } from "@/components/hive/user-card";

export function UserCardVariants() {
  return (
    <div className="space-y-4">
      {/* Compact - inline display */}
      <UserCard username="acidyo" variant="compact" />

      {/* Default - card with basic info */}
      <UserCard username="acidyo" variant="default" />

      {/* Expanded - full profile card */}
      <UserCard username="acidyo" variant="expanded" />
    </div>
  );
}`,
  withoutStats: `import { UserCard } from "@/components/hive/user-card";

export function SimpleUserCard() {
  return (
    <UserCard
      username="themarkymark"
      showStats={false}
    />
  );
}`,
  userList: `import { UserCard } from "@/components/hive/user-card";

interface UserListProps {
  usernames: string[];
}

export function UserList({ usernames }: UserListProps) {
  return (
    <div className="space-y-2">
      {usernames.map((username) => (
        <UserCard
          key={username}
          username={username}
          variant="compact"
        />
      ))}
    </div>
  );
}

// Usage
function Witnesses() {
  const witnesses = ["blocktrades", "gtg", "good-karma", "roelandp", "themarkymark"];

  return (
    <div>
      <h2 className="font-bold mb-4">Top Witnesses</h2>
      <UserList usernames={witnesses} />
    </div>
  );
}`,
  clickable: `"use client";

import { UserCard } from "@/components/hive/user-card";
import Link from "next/link";

interface ClickableUserCardProps {
  username: string;
}

export function ClickableUserCard({ username }: ClickableUserCardProps) {
  return (
    <Link
      href={\`/@\${username}\`}
      className="block transition-transform hover:scale-[1.02]"
    >
      <UserCard username={username} variant="expanded" />
    </Link>
  );
}`,
};

export default async function UserCardPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Card</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive user profile information in various formats.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">User Data</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This component uses the <code>useHiveAccount</code> hook to fetch user
              data from the blockchain. It displays profile information, reputation,
              and optionally balances and post count.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-md space-y-4">
          {/* Compact preview */}
          <div className="flex items-center gap-2">
            <img
              src="https://images.hive.blog/u/blocktrades/avatar"
              alt="@blocktrades"
              className="h-8 w-8 rounded-full"
            />
            <div>
              <span className="font-medium">@blocktrades</span>
              <span className="text-muted-foreground text-sm ml-1">(75)</span>
            </div>
          </div>

          {/* Default preview */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.hive.blog/u/blocktrades/avatar"
                alt="@blocktrades"
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">BlockTrades</h3>
                <p className="text-sm text-muted-foreground">@blocktrades • Rep: 75</p>
              </div>
            </div>
            <div className="mt-3 flex gap-4 text-sm">
              <span>1,234 posts</span>
              <span>1000.000 HIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <p className="text-muted-foreground mb-4">
          Copy this component into your project:
        </p>
        <CodeBlock
          filename="components/hive/user-card.tsx"
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
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Hive username to display
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>variant</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;compact&quot; | &quot;default&quot; | &quot;expanded&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;default&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Card display style
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showStats</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>true</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Show post count and balances
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

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Variants</h2>
        <p className="text-muted-foreground mb-4">
          Choose between compact, default, and expanded display styles:
        </p>
        <CodeBlock code={CODE.variants} language="typescript" />
      </section>

      {/* Without Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Without Stats</h2>
        <p className="text-muted-foreground mb-4">
          Hide balance and post count information:
        </p>
        <CodeBlock code={CODE.withoutStats} language="typescript" />
      </section>

      {/* User List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <p className="text-muted-foreground mb-4">
          Display a list of users using compact variant:
        </p>
        <CodeBlock code={CODE.userList} language="typescript" />
      </section>

      {/* Clickable Card */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Clickable Card</h2>
        <p className="text-muted-foreground mb-4">
          Wrap the card in a link for navigation:
        </p>
        <CodeBlock code={CODE.clickable} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/vote-button"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Vote Button
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
