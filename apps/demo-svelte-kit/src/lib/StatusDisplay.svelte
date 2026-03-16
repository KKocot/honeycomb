<script lang="ts">
  import { onMount } from "svelte";
  import ApiTrackerTab from "./components/ApiTrackerTab.svelte";
  import HooksTab from "./components/HooksTab.svelte";
  import AvatarTab from "./components/AvatarTab.svelte";
  import UserCardTab from "./components/UserCardTab.svelte";
  import BalanceCardTab from "./components/BalanceCardTab.svelte";
  import ManabarTab from "./components/ManabarTab.svelte";
  import PostCardTab from "./components/PostCardTab.svelte";
  import PostListTab from "./components/PostListTab.svelte";
  import RendererTab from "./components/RendererTab.svelte";
  import MdEditorTab from "./components/MdEditorTab.svelte";
  import HealthCheckerTab from "./components/HealthCheckerTab.svelte";

  type TabId =
    | "api-tracker"
    | "hooks"
    | "avatar"
    | "user-card"
    | "balance-card"
    | "manabar"
    | "post-card"
    | "post-list"
    | "renderer"
    | "health-checker"
    | "md-editor";

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
        "Reactive hooks for accessing Hive blockchain data in Svelte components.",
    },
    {
      id: "avatar",
      label: "Avatar",
      title: "Avatar",
      description:
        "User avatars fetched from Hive blockchain with multiple sizes.",
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
    {
      id: "health-checker",
      label: "Health Checker",
      title: "Health Checker",
      description:
        "Monitors Hive API endpoint health, latency and validity with automatic provider switching.",
    },
    {
      id: "md-editor",
      label: "MdEditor",
      title: "Markdown Editor",
      description:
        "CodeMirror 6 based markdown editor with toolbar, preview modes, and Hive URL conversion.",
    },
  ] as const;

  const DEFAULT_TAB: TabId = "api-tracker";
  const VALID_TAB_IDS: ReadonlySet<string> = new Set(TABS.map((t) => t.id));

  function is_valid_tab(value: string): value is TabId {
    return VALID_TAB_IDS.has(value);
  }

  function get_tab_from_url(): TabId {
    if (typeof window === "undefined") return DEFAULT_TAB;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    return tab && is_valid_tab(tab) ? tab : DEFAULT_TAB;
  }

  function set_tab_in_url(tab_id: TabId) {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab_id);
    window.history.pushState(null, "", `?${params.toString()}`);
  }

  let active_tab: TabId = $state(get_tab_from_url());

  function handle_tab_change(tab_id: TabId) {
    active_tab = tab_id;
    set_tab_in_url(tab_id);
  }

  function on_popstate() {
    active_tab = get_tab_from_url();
  }

  onMount(() => {
    window.addEventListener("popstate", on_popstate);
    return () => {
      window.removeEventListener("popstate", on_popstate);
    };
  });

  const active_config = $derived(TABS.find((t) => t.id === active_tab));
</script>

<div class="min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <!-- Tab navigation -->
    <nav class="flex flex-wrap gap-2 mb-8" role="tablist">
      {#each TABS as tab}
        <button
          role="tab"
          id="tab-{tab.id}"
          aria-selected={active_tab === tab.id}
          aria-controls="tabpanel-{tab.id}"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap {active_tab ===
          tab.id
            ? 'bg-foreground text-background'
            : 'bg-muted text-muted-foreground hover:text-foreground'}"
          onclick={() => handle_tab_change(tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </nav>

    <!-- Section header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-2">{active_config?.title}</h2>
      <p class="text-muted-foreground">{active_config?.description}</p>
    </div>

    <!-- Tab content -->
    <div
      role="tabpanel"
      id="tabpanel-{active_tab}"
      aria-labelledby="tab-{active_tab}"
    >
      {#if active_tab === "api-tracker"}
        <ApiTrackerTab />
      {:else if active_tab === "hooks"}
        <HooksTab />
      {:else if active_tab === "avatar"}
        <AvatarTab />
      {:else if active_tab === "user-card"}
        <UserCardTab />
      {:else if active_tab === "balance-card"}
        <BalanceCardTab />
      {:else if active_tab === "manabar"}
        <ManabarTab />
      {:else if active_tab === "post-card"}
        <PostCardTab />
      {:else if active_tab === "post-list"}
        <PostListTab />
      {:else if active_tab === "renderer"}
        <RendererTab />
      {:else if active_tab === "health-checker"}
        <HealthCheckerTab />
      {:else if active_tab === "md-editor"}
        <MdEditorTab />
      {/if}
    </div>
  </div>

  <!-- Footer -->
  <footer class="border-t border-border mt-16 py-8">
    <div
      class="container mx-auto px-4 text-center text-sm text-muted-foreground"
    >
      <p>Honeycomb SvelteKit Demo - @hiveio/honeycomb-svelte</p>
    </div>
  </footer>
</div>
