import { useState, useEffect } from "react";
import ApiTrackerTab from "./components/ApiTrackerTab";
import HooksTab from "./components/HooksTab";
import AvatarTab from "./components/AvatarTab";
import UserCardTab from "./components/UserCardTab";
import BalanceCardTab from "./components/BalanceCardTab";
import ManabarTab from "./components/ManabarTab";
import PostCardTab from "./components/PostCardTab";
import PostListTab from "./components/PostListTab";
import RendererTab from "./components/RendererTab";

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
    description:
      "User avatar component with multiple sizes and reputation badge.",
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
    description: "Shows HIVE, HBD and HP balances for a given account.",
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
    description: "Renders Hive blog posts in card, compact and grid layouts.",
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

function get_tab_from_url(): TabId {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  return is_valid_tab(tab) ? tab : DEFAULT_TAB;
}

export default function App() {
  const [active_tab, set_active_tab] = useState<TabId>(get_tab_from_url);

  useEffect(() => {
    const handle_popstate = () => {
      set_active_tab(get_tab_from_url());
    };
    window.addEventListener("popstate", handle_popstate);
    return () => window.removeEventListener("popstate", handle_popstate);
  }, []);

  const handle_tab_change = (tab_id: TabId) => {
    set_active_tab(tab_id);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab_id);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const current_tab = TABS.find((t) => t.id === active_tab);

  return (
    <div className="min-h-screen bg-hive-background text-hive-foreground">
      <header className="sticky top-0 z-50 border-b border-hive-border bg-hive-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-hive-red flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-bold text-xl">Hive UI</span>
            <span className="text-sm text-hive-muted-foreground font-medium">
              React + Vite
            </span>
          </div>
          <div className="text-sm text-hive-muted-foreground font-mono">
            @barddev/honeycomb-react
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
                  ? "bg-hive-foreground text-hive-background"
                  : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {current_tab && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{current_tab.title}</h2>
            <p className="text-hive-muted-foreground">
              {current_tab.description}
            </p>
          </div>
        )}

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

      <footer className="border-t border-hive-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-hive-muted-foreground">
          Honeycomb React Vite Demo - @barddev/honeycomb-react
        </div>
      </footer>
    </div>
  );
}
