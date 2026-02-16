"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ApiTrackerTab from "../components/ApiTrackerTab";
import HooksTab from "../components/HooksTab";
import AvatarTab from "../components/AvatarTab";
import UserCardTab from "../components/UserCardTab";
import BalanceCardTab from "../components/BalanceCardTab";
import ManabarTab from "../components/ManabarTab";
import PostCardTab from "../components/PostCardTab";
import PostListTab from "../components/PostListTab";
import RendererTab from "../components/RendererTab";

type TabId =
  | "api-tracker"
  | "hooks"
  | "avatar"
  | "user-card"
  | "balance-card"
  | "manabar"
  | "post-card"
  | "post-list"
  | "renderer";

interface TabConfig {
  id: TabId;
  label: string;
  title: string;
  description: string;
}

const TABS: readonly TabConfig[] = [
  {
    id: "api-tracker",
    label: "API Tracker",
    title: "API Tracker",
    description:
      "Real-time Hive API endpoint health monitoring and status tracking.",
  },
  {
    id: "hooks",
    label: "Hooks",
    title: "Hooks",
    description:
      "React hooks for interacting with Hive blockchain data and state.",
  },
  {
    id: "avatar",
    label: "Avatar",
    title: "Avatar",
    description: "User avatar component with multiple sizes and reputation badge.",
  },
  {
    id: "user-card",
    label: "User Card",
    title: "User Card",
    description: "Displays Hive user profile information in a card layout.",
  },
  {
    id: "balance-card",
    label: "Balance Card",
    title: "Balance Card",
    description:
      "Shows HIVE, HBD and HP balances for a given account.",
  },
  {
    id: "manabar",
    label: "Manabar",
    title: "Manabar",
    description:
      "Voting mana and resource credit bars in multiple visual variants.",
  },
  {
    id: "post-card",
    label: "Post Card",
    title: "Post Card",
    description:
      "Renders Hive blog posts in card, compact and grid layouts.",
  },
  {
    id: "post-list",
    label: "Post List",
    title: "Post List",
    description:
      "Paginated Hive post feed with sort controls, pinned posts, and multiple layouts.",
  },
  {
    id: "renderer",
    label: "Renderer",
    title: "Content Renderer",
    description:
      "Renders Hive markdown content with mentions, hashtags, embeds, and sanitization.",
  },
];

const VALID_TAB_IDS = TABS.map((t) => t.id);
const DEFAULT_TAB: TabId = "api-tracker";

function is_valid_tab(value: string | null): value is TabId {
  return value !== null && VALID_TAB_IDS.includes(value as TabId);
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const search_params = useSearchParams();
  const router = useRouter();

  const tab_from_url = search_params.get("tab");
  const initial_tab = is_valid_tab(tab_from_url) ? tab_from_url : DEFAULT_TAB;

  const [active_tab, set_active_tab] = useState<TabId>(initial_tab);

  const handle_tab_change = (tab_id: TabId) => {
    set_active_tab(tab_id);
    const params = new URLSearchParams(search_params.toString());
    params.set("tab", tab_id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (is_valid_tab(tab_from_url) && tab_from_url !== active_tab) {
      set_active_tab(tab_from_url);
    }
  }, [tab_from_url]);

  const current_tab = TABS.find((t) => t.id === active_tab);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-hive-red flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-bold text-xl">Hive UI</span>
            <span className="text-sm text-muted-foreground font-medium">
              React
            </span>
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Documentation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
              </svg>
              Docs
            </a>
          </div>

          <div className="text-sm text-muted-foreground font-mono">
            @kkocot/honeycomb-react
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 mb-8" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active_tab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => handle_tab_change(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                active_tab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Section header */}
        {current_tab && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{current_tab.title}</h2>
            <p className="text-muted-foreground">{current_tab.description}</p>
          </div>
        )}

        {/* Tab content */}
        <div
          role="tabpanel"
          id={`tabpanel-${active_tab}`}
          aria-labelledby={`tab-${active_tab}`}
        >
          {active_tab === "api-tracker" && <ApiTrackerTab />}
          {active_tab === "hooks" && <HooksTab />}
          {active_tab === "avatar" && <AvatarTab />}
          {active_tab === "user-card" && <UserCardTab />}
          {active_tab === "balance-card" && <BalanceCardTab />}
          {active_tab === "manabar" && <ManabarTab />}
          {active_tab === "post-card" && <PostCardTab />}
          {active_tab === "post-list" && <PostListTab />}
          {active_tab === "renderer" && <RendererTab />}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Honeycomb React Demo - @kkocot/honeycomb-react
        </div>
      </footer>
    </div>
  );
}
