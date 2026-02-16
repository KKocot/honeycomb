import { createSignal, Switch, Match, For, onMount, onCleanup } from "solid-js";
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
      "Real-time monitoring of Hive API endpoints and connection status.",
  },
  {
    id: "hooks",
    label: "Hooks",
    title: "Hooks",
    description:
      "Reactive hooks for accessing Hive blockchain data in Solid.js components.",
  },
  {
    id: "avatar",
    label: "Avatar",
    title: "Avatar",
    description: "User avatars fetched from Hive blockchain with multiple sizes.",
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
      "Resource Credits and voting mana visualization in multiple variants.",
  },
  {
    id: "post-card",
    label: "Post Card",
    title: "Post Card",
    description: "Renders a Hive blog post in card, compact or grid layout.",
  },
  {
    id: "post-list",
    label: "Post List",
    title: "Post List",
    description:
      "Paginated list of ranked Hive posts with sort controls and multiple layouts.",
  },
  {
    id: "renderer",
    label: "Renderer",
    title: "Content Renderer",
    description:
      "Renders Hive markdown content with mentions, hashtags, embeds, and sanitization.",
  },
] as const;

const DEFAULT_TAB: TabId = "api-tracker";
const VALID_TAB_IDS: ReadonlySet<string> = new Set(TABS.map((t) => t.id));

function is_valid_tab(value: string): value is TabId {
  return VALID_TAB_IDS.has(value);
}

function get_tab_from_url(): TabId {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  return tab && is_valid_tab(tab) ? tab : DEFAULT_TAB;
}

function set_tab_in_url(tab_id: TabId) {
  const params = new URLSearchParams(window.location.search);
  params.set("tab", tab_id);
  window.history.pushState(null, "", `?${params.toString()}`);
}

export default function StatusDisplay() {
  const [active_tab, set_active_tab] = createSignal<TabId>(get_tab_from_url());

  const handle_tab_change = (tab_id: TabId) => {
    set_active_tab(tab_id);
    set_tab_in_url(tab_id);
  };

  const on_popstate = () => {
    set_active_tab(get_tab_from_url());
  };

  onMount(() => {
    window.addEventListener("popstate", on_popstate);
  });

  onCleanup(() => {
    window.removeEventListener("popstate", on_popstate);
  });

  const active_config = () => TABS.find((t) => t.id === active_tab());

  return (
    <div class="min-h-screen">
      {/* Header */}
      <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-hive-red flex items-center justify-center">
              <span class="text-white font-bold">H</span>
            </div>
            <span class="font-bold text-xl">Hive UI</span>
            <span class="text-sm text-muted-foreground font-medium">
              Solid
            </span>
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Documentation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
              </svg>
              Docs
            </a>
          </div>

          <div class="text-sm text-muted-foreground font-mono">
            @kkocot/honeycomb-solid
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        {/* Tab navigation */}
        <nav class="flex flex-wrap gap-2 mb-8" role="tablist">
          <For each={TABS}>
            {(tab) => (
              <button
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active_tab() === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                class={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  active_tab() === tab.id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => handle_tab_change(tab.id)}
              >
                {tab.label}
              </button>
            )}
          </For>
        </nav>

        {/* Section header */}
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-2">{active_config()?.title}</h2>
          <p class="text-muted-foreground">{active_config()?.description}</p>
        </div>

        {/* Tab content */}
        <div
          role="tabpanel"
          id={`tabpanel-${active_tab()}`}
          aria-labelledby={`tab-${active_tab()}`}
        >
          <Switch>
            <Match when={active_tab() === "api-tracker"}>
              <ApiTrackerTab />
            </Match>
            <Match when={active_tab() === "hooks"}>
              <HooksTab />
            </Match>
            <Match when={active_tab() === "avatar"}>
              <AvatarTab />
            </Match>
            <Match when={active_tab() === "user-card"}>
              <UserCardTab />
            </Match>
            <Match when={active_tab() === "balance-card"}>
              <BalanceCardTab />
            </Match>
            <Match when={active_tab() === "manabar"}>
              <ManabarTab />
            </Match>
            <Match when={active_tab() === "post-card"}>
              <PostCardTab />
            </Match>
            <Match when={active_tab() === "post-list"}>
              <PostListTab />
            </Match>
            <Match when={active_tab() === "renderer"}>
              <RendererTab />
            </Match>
          </Switch>
        </div>
      </div>

      {/* Footer */}
      <footer class="border-t border-border mt-16 py-8">
        <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Honeycomb Solid Demo - @kkocot/honeycomb-solid</p>
        </div>
      </footer>
    </div>
  );
}
