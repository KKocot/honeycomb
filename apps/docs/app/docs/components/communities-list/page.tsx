import Link from "next/link";
import { ArrowRight, Info, Globe, Users, Star, Search } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Users, Star, Search, Loader2, Check } from "lucide-react";

interface Community {
  name: string;
  title: string;
  about: string;
  subscribers: number;
  num_pending: number;
  num_authors: number;
  avatar_url?: string;
  is_subscribed?: boolean;
}

interface CommunitiesListProps {
  communities: Community[];
  isLoading?: boolean;
  onSubscribe?: (name: string) => Promise<void>;
  onUnsubscribe?: (name: string) => Promise<void>;
  showSearch?: boolean;
  variant?: "grid" | "list";
  className?: string;
}

export function CommunitiesList({
  communities,
  isLoading = false,
  onSubscribe,
  onUnsubscribe,
  showSearch = true,
  variant = "grid",
  className = "",
}: CommunitiesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const filteredCommunities = communities.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSubscribe(name: string, isSubscribed: boolean) {
    setSubscribing(name);
    try {
      if (isSubscribed) {
        await onUnsubscribe?.(name);
      } else {
        await onSubscribe?.(name);
      }
    } catch (error) {
      console.error("Subscribe failed:", error);
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <div className={className}>
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-hive-red" />
        </div>
      ) : filteredCommunities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No communities found
        </div>
      ) : variant === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.map((community) => (
            <div
              key={community.name}
              className="rounded-xl border border-border bg-card p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-hive-red/10 flex items-center justify-center shrink-0">
                  {community.avatar_url ? (
                    <img
                      src={community.avatar_url}
                      alt={community.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <Globe className="h-6 w-6 text-hive-red" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={\`/community/\${community.name}\`}
                    className="font-semibold hover:text-hive-red truncate block"
                  >
                    {community.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    hive-{community.name}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {community.about}
              </p>

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {community.subscribers.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {community.num_authors.toLocaleString()} active
                </span>
              </div>

              <button
                onClick={() => handleSubscribe(community.name, community.is_subscribed || false)}
                disabled={subscribing === community.name}
                className={\`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors \${
                  community.is_subscribed
                    ? "bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500"
                    : "bg-hive-red text-white hover:bg-hive-red/90"
                }\`}
              >
                {subscribing === community.name ? (
                  <Loader2 className="h-4 w-4 animate-spin inline" />
                ) : community.is_subscribed ? (
                  <>
                    <Check className="h-4 w-4 inline mr-1" />
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredCommunities.map((community) => (
            <div
              key={community.name}
              className="flex items-center gap-4 py-4 hover:bg-muted/30 px-2 -mx-2 rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-hive-red/10 flex items-center justify-center shrink-0">
                {community.avatar_url ? (
                  <img
                    src={community.avatar_url}
                    alt={community.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <Globe className="h-5 w-5 text-hive-red" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={\`/community/\${community.name}\`}
                  className="font-medium hover:text-hive-red"
                >
                  {community.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {community.subscribers.toLocaleString()} subscribers
                </p>
              </div>

              <button
                onClick={() => handleSubscribe(community.name, community.is_subscribed || false)}
                disabled={subscribing === community.name}
                className={\`px-4 py-1.5 rounded-lg text-sm font-medium \${
                  community.is_subscribed
                    ? "bg-muted"
                    : "bg-hive-red text-white"
                }\`}
              >
                {subscribing === community.name ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : community.is_subscribed ? (
                  "Subscribed"
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
  basicUsage: `"use client";

import { CommunitiesList } from "@/components/hive/communities-list";
import { useCommunities } from "@/hooks/use-communities";
import { useSubscribe } from "@/hooks/use-subscribe";

export function ExploreCommunities() {
  const { communities, isLoading } = useCommunities();
  const { subscribe, unsubscribe } = useSubscribe();

  return (
    <CommunitiesList
      communities={communities}
      isLoading={isLoading}
      onSubscribe={subscribe}
      onUnsubscribe={unsubscribe}
    />
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useSubscribe() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const subscribe = useCallback(async (community: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      custom_json: {
        required_auths: [],
        required_posting_auths: [user.username],
        id: "community",
        json: JSON.stringify([
          "subscribe",
          { community: \`hive-\${community}\` },
        ]),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  const unsubscribe = useCallback(async (community: string) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      custom_json: {
        required_auths: [],
        required_posting_auths: [user.username],
        id: "community",
        json: JSON.stringify([
          "unsubscribe",
          { community: \`hive-\${community}\` },
        ]),
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { subscribe, unsubscribe };
}`,
};

export default async function CommunitiesListPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communities List</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse and subscribe to Hive communities.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hive Communities</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Communities are topic-based groups on Hive. Subscribing adds their posts
              to your feed. Community names start with &quot;hive-&quot; followed by a number.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Card 1 */}
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-hive-red/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-hive-red" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Photography Lovers</p>
                <p className="text-sm text-muted-foreground">hive-194913</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              A community for photographers to share their work and connect with others.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> 12,345
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" /> 234 active
              </span>
            </div>
            <button className="w-full mt-4 py-2 rounded-lg text-sm font-medium bg-hive-red text-white">
              Subscribe
            </button>
          </div>

          {/* Card 2 - Subscribed */}
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">LeoFinance</p>
                <p className="text-sm text-muted-foreground">hive-167922</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              Pair your passion for financial topics with blockchain technology.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> 45,678
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" /> 567 active
              </span>
            </div>
            <button className="w-full mt-4 py-2 rounded-lg text-sm font-medium bg-muted text-foreground">
              Subscribed
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/communities-list.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useSubscribe Hook</h2>
        <CodeBlock
          filename="hooks/use-subscribe.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Next</h2>
        <div className="flex gap-4">
          <Link
            href="/docs/components/witness-vote"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            Witness Vote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
