import Link from "next/link";
import { ArrowRight, Info, Award, Trophy, Star, Zap, Shield, Heart } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { Award, Trophy, Star, Zap, Shield, Heart, Clock, Users, Flame } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "star" | "zap" | "shield" | "heart" | "clock" | "users" | "flame" | "award";
  color: "gold" | "silver" | "bronze" | "red" | "blue" | "green" | "purple";
  earnedAt?: string;
}

interface BadgeListProps {
  badges: Badge[];
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

const iconComponents = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  shield: Shield,
  heart: Heart,
  clock: Clock,
  users: Users,
  flame: Flame,
  award: Award,
};

const colorClasses = {
  gold: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  silver: "bg-gray-400/10 text-gray-400 border-gray-400/30",
  bronze: "bg-orange-700/10 text-orange-700 border-orange-700/30",
  red: "bg-hive-red/10 text-hive-red border-hive-red/30",
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  green: "bg-green-500/10 text-green-500 border-green-500/30",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

const sizeClasses = {
  sm: { container: "p-1.5", icon: "h-3 w-3" },
  md: { container: "p-2", icon: "h-4 w-4" },
  lg: { container: "p-2.5", icon: "h-5 w-5" },
};

export function BadgeList({
  badges,
  maxDisplay = 5,
  size = "md",
  showTooltip = true,
  className = "",
}: BadgeListProps) {
  const displayBadges = badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;

  return (
    <div className={\`flex flex-wrap gap-1.5 \${className}\`}>
      {displayBadges.map((badge) => {
        const Icon = iconComponents[badge.icon];
        return (
          <div
            key={badge.id}
            className={\`relative group rounded-lg border \${colorClasses[badge.color]} \${sizeClasses[size].container}\`}
            title={showTooltip ? \`\${badge.name}: \${badge.description}\` : undefined}
          >
            <Icon className={sizeClasses[size].icon} />

            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <p className="font-medium">{badge.name}</p>
                <p className="text-muted-foreground">{badge.description}</p>
              </div>
            )}
          </div>
        );
      })}

      {remaining > 0 && (
        <div
          className={\`rounded-lg border border-border bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center \${sizeClasses[size].container}\`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}`,
  basicUsage: `"use client";

import { BadgeList } from "@/components/hive/badge-list";

const userBadges = [
  {
    id: "early-adopter",
    name: "Early Adopter",
    description: "Joined Hive in the first month",
    icon: "star" as const,
    color: "gold" as const,
    earnedAt: "2020-03-20",
  },
  {
    id: "whale",
    name: "Whale",
    description: "Has over 100,000 HP",
    icon: "trophy" as const,
    color: "blue" as const,
  },
  {
    id: "consistent-poster",
    name: "Consistent Poster",
    description: "Posted every day for 30 days",
    icon: "flame" as const,
    color: "red" as const,
  },
];

export function UserBadges() {
  return <BadgeList badges={userBadges} />;
}`,
  withProfile: `"use client";

import { HiveAvatar } from "@/components/hive/avatar";
import { BadgeList } from "@/components/hive/badge-list";
import { FollowButton } from "@/components/hive/follow-button";

interface UserProfileHeaderProps {
  username: string;
  displayName?: string;
  bio?: string;
  badges: Badge[];
  isFollowing: boolean;
}

export function UserProfileHeader({
  username,
  displayName,
  bio,
  badges,
  isFollowing,
}: UserProfileHeaderProps) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-border bg-card">
      <HiveAvatar username={username} size="xl" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              {displayName || username}
            </h2>
            <p className="text-muted-foreground">@{username}</p>
          </div>
          <FollowButton
            username={username}
            initialFollowing={isFollowing}
          />
        </div>

        {bio && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {bio}
          </p>
        )}

        {badges.length > 0 && (
          <div className="mt-3">
            <BadgeList badges={badges} maxDisplay={6} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}`,
  hiveBadges: `// Common Hive achievement badges
const HIVE_BADGES = {
  earlyAdopter: {
    id: "early-adopter",
    name: "Early Adopter",
    description: "Joined Hive in March 2020",
    icon: "star" as const,
    color: "gold" as const,
  },
  whale: {
    id: "whale",
    name: "Whale",
    description: "Over 100,000 HP",
    icon: "trophy" as const,
    color: "blue" as const,
  },
  orca: {
    id: "orca",
    name: "Orca",
    description: "Over 50,000 HP",
    icon: "shield" as const,
    color: "purple" as const,
  },
  dolphin: {
    id: "dolphin",
    name: "Dolphin",
    description: "Over 5,000 HP",
    icon: "zap" as const,
    color: "blue" as const,
  },
  minnow: {
    id: "minnow",
    name: "Minnow",
    description: "Over 500 HP",
    icon: "heart" as const,
    color: "green" as const,
  },
  witness: {
    id: "witness",
    name: "Witness",
    description: "Active block producer",
    icon: "shield" as const,
    color: "red" as const,
  },
  curator: {
    id: "curator",
    name: "Top Curator",
    description: "Top 100 curation rewards",
    icon: "award" as const,
    color: "gold" as const,
  },
  veteran: {
    id: "veteran",
    name: "Veteran",
    description: "Account over 3 years old",
    icon: "clock" as const,
    color: "silver" as const,
  },
};`,
};

export default async function BadgeListPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Badge List</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display user achievements and badges with customizable icons and colors.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-purple-500">Hive Badges</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Badges can be earned based on HP levels (whale, orca, dolphin, minnow),
              account age, activity streaks, witness status, and community achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="space-y-4">
          {/* Sample badges */}
          <div className="flex flex-wrap gap-1.5">
            <div className="p-2 rounded-lg border bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
              <Star className="h-4 w-4" />
            </div>
            <div className="p-2 rounded-lg border bg-blue-500/10 text-blue-500 border-blue-500/30">
              <Trophy className="h-4 w-4" />
            </div>
            <div className="p-2 rounded-lg border bg-hive-red/10 text-hive-red border-hive-red/30">
              <Zap className="h-4 w-4" />
            </div>
            <div className="p-2 rounded-lg border bg-green-500/10 text-green-500 border-green-500/30">
              <Shield className="h-4 w-4" />
            </div>
            <div className="p-2 rounded-lg border bg-purple-500/10 text-purple-500 border-purple-500/30">
              <Award className="h-4 w-4" />
            </div>
            <div className="p-2 rounded-lg border border-border bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center">
              +3
            </div>
          </div>

          {/* Large badges */}
          <div className="flex flex-wrap gap-1.5">
            <div className="p-2.5 rounded-lg border bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="p-2.5 rounded-lg border bg-gray-400/10 text-gray-400 border-gray-400/30">
              <Award className="h-5 w-5" />
            </div>
            <div className="p-2.5 rounded-lg border bg-orange-700/10 text-orange-700 border-orange-700/30">
              <Heart className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/badge-list.tsx"
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
                <td className="py-3 px-4"><code>badges</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>Badge[]</code></td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
                <td className="py-3 px-4 text-muted-foreground">Array of badge objects</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>maxDisplay</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>number</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>5</code></td>
                <td className="py-3 px-4 text-muted-foreground">Max badges before +N</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>size</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;sm&quot; | &quot;md&quot; | &quot;lg&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>&quot;md&quot;</code></td>
                <td className="py-3 px-4 text-muted-foreground">Badge size</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>showTooltip</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>boolean</code></td>
                <td className="py-3 px-4 text-muted-foreground"><code>true</code></td>
                <td className="py-3 px-4 text-muted-foreground">Show tooltip on hover</td>
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

      {/* With Profile */}
      <section>
        <h2 className="text-xl font-semibold mb-4">In User Profile</h2>
        <CodeBlock code={CODE.withProfile} language="typescript" />
      </section>

      {/* Common Hive Badges */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Common Hive Badges</h2>
        <p className="text-muted-foreground mb-4">
          Pre-defined badges for common Hive achievements:
        </p>
        <CodeBlock code={CODE.hiveBadges} language="typescript" />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/post-editor"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Post Editor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
