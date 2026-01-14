import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface HiveAvatarProps {
  username: string;
  size?: AvatarSize;
  className?: string;
  showBorder?: boolean;
  fallbackColor?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function HiveAvatar({
  username,
  size = "md",
  className = "",
  showBorder = false,
  fallbackColor,
}: HiveAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Generate a consistent color from username
  const generateColor = (name: string): string => {
    if (fallbackColor) return fallbackColor;

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 360);
    return \`hsl(\${hue}, 70%, 50%)\`;
  };

  const initials = username.slice(0, 2).toUpperCase();
  const imageUrl = \`https://images.hive.blog/u/\${username}/avatar\`;

  if (hasError) {
    return (
      <div
        className={\`\${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium \${
          showBorder ? "ring-2 ring-border" : ""
        } \${className}\`}
        style={{ backgroundColor: generateColor(username) }}
        title={\`@\${username}\`}
      >
        <span className={\`\${size === "xs" ? "text-xs" : size === "sm" ? "text-xs" : "text-sm"}\`}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={\`@\${username}\`}
      title={\`@\${username}\`}
      onError={() => setHasError(true)}
      className={\`\${sizeClasses[size]} rounded-full object-cover \${
        showBorder ? "ring-2 ring-border" : ""
      } \${className}\`}
    />
  );
}`,
  basicUsage: `import { HiveAvatar } from "@/components/hive/avatar";

export function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <HiveAvatar username="blocktrades" size="lg" />
      <div>
        <p className="font-medium">@blocktrades</p>
        <p className="text-sm text-muted-foreground">Witness</p>
      </div>
    </div>
  );
}`,
  sizes: `import { HiveAvatar } from "@/components/hive/avatar";

export function AvatarSizes() {
  return (
    <div className="flex items-center gap-4">
      <HiveAvatar username="hive" size="xs" />
      <HiveAvatar username="hive" size="sm" />
      <HiveAvatar username="hive" size="md" />
      <HiveAvatar username="hive" size="lg" />
      <HiveAvatar username="hive" size="xl" />
    </div>
  );
}`,
  withBorder: `import { HiveAvatar } from "@/components/hive/avatar";

export function AvatarWithBorder() {
  return (
    <div className="flex items-center gap-2">
      <HiveAvatar username="user1" showBorder />
      <HiveAvatar username="user2" showBorder />
      <HiveAvatar username="user3" showBorder />
      {/* Overlapping avatars */}
      <div className="flex -space-x-2">
        <HiveAvatar username="user1" showBorder className="ring-background" />
        <HiveAvatar username="user2" showBorder className="ring-background" />
        <HiveAvatar username="user3" showBorder className="ring-background" />
      </div>
    </div>
  );
}`,
  avatarGroup: `import { HiveAvatar } from "@/components/hive/avatar";

interface AvatarGroupProps {
  usernames: string[];
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function AvatarGroup({ usernames, max = 5, size = "md" }: AvatarGroupProps) {
  const visible = usernames.slice(0, max);
  const remaining = usernames.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((username) => (
        <HiveAvatar
          key={username}
          username={username}
          size={size}
          showBorder
          className="ring-background"
        />
      ))}
      {remaining > 0 && (
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium ring-2 ring-background">
          +{remaining}
        </div>
      )}
    </div>
  );
}

// Usage
function Example() {
  return (
    <AvatarGroup
      usernames={["blocktrades", "acidyo", "gtg", "themarkymark", "good-karma", "roelandp"]}
      max={4}
    />
  );
}`,
  withStatus: `import { HiveAvatar } from "@/components/hive/avatar";

interface AvatarWithStatusProps {
  username: string;
  status: "online" | "offline" | "away";
}

export function AvatarWithStatus({ username, status }: AvatarWithStatusProps) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
  };

  return (
    <div className="relative inline-block">
      <HiveAvatar username={username} size="lg" />
      <span
        className={\`absolute bottom-0 right-0 h-3 w-3 rounded-full \${statusColors[status]} ring-2 ring-background\`}
      />
    </div>
  );
}`,
};

export default async function AvatarPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avatar</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive user profile pictures with automatic fallback.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hive Avatars</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hive avatars are served from <code>images.hive.blog/u/username/avatar</code>.
              This component handles loading states and provides a colored initials fallback
              when images fail to load.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="flex items-center gap-4">
          <img
            src="https://images.hive.blog/u/blocktrades/avatar"
            alt="@blocktrades"
            className="h-6 w-6 rounded-full"
          />
          <img
            src="https://images.hive.blog/u/blocktrades/avatar"
            alt="@blocktrades"
            className="h-8 w-8 rounded-full"
          />
          <img
            src="https://images.hive.blog/u/blocktrades/avatar"
            alt="@blocktrades"
            className="h-10 w-10 rounded-full"
          />
          <img
            src="https://images.hive.blog/u/blocktrades/avatar"
            alt="@blocktrades"
            className="h-12 w-12 rounded-full"
          />
          <img
            src="https://images.hive.blog/u/blocktrades/avatar"
            alt="@blocktrades"
            className="h-16 w-16 rounded-full"
          />
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <p className="text-muted-foreground mb-4">
          Copy this component into your project:
        </p>
        <CodeBlock
          filename="components/hive/avatar.tsx"
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
                  Hive username
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>size</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; | &quot;lg&quot; | &quot;xl&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;md&quot;</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Avatar size
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showBorder</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>false</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  Show ring border
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>fallbackColor</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">auto</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Custom fallback background color
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

      {/* Sizes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sizes</h2>
        <p className="text-muted-foreground mb-4">
          Available sizes: xs (24px), sm (32px), md (40px), lg (48px), xl (64px)
        </p>
        <CodeBlock code={CODE.sizes} language="typescript" />
      </section>

      {/* With Border */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Border</h2>
        <p className="text-muted-foreground mb-4">
          Add borders for overlapping avatars or emphasis:
        </p>
        <CodeBlock code={CODE.withBorder} language="typescript" />
      </section>

      {/* Avatar Group */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Avatar Group</h2>
        <p className="text-muted-foreground mb-4">
          Display multiple avatars with a count for overflow:
        </p>
        <CodeBlock code={CODE.avatarGroup} language="typescript" />
      </section>

      {/* With Status */}
      <section>
        <h2 className="text-xl font-semibold mb-4">With Status Indicator</h2>
        <p className="text-muted-foreground mb-4">
          Add online/offline status indicators:
        </p>
        <CodeBlock code={CODE.withStatus} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/user-card"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            User Card
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
