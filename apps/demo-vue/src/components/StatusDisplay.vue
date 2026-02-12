<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur"
    >
      <div
        class="container mx-auto px-4 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-8 w-8 rounded-lg bg-hive-red flex items-center justify-center"
          >
            <span class="text-white font-bold">H</span>
          </div>
          <span class="font-bold text-xl">Hive UI</span>
          <span class="text-sm text-muted-foreground font-medium">Vue</span>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Docs
          </a>
        </div>

        <div class="text-sm text-muted-foreground font-mono">
          @kkocot/honeycomb-vue
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <!-- Tabs -->
      <nav role="tablist" class="flex gap-2 overflow-x-auto pb-2 mb-8">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          role="tab"
          :id="`tab-${tab.id}`"
          :aria-selected="active_tab === tab.id"
          :aria-controls="`tabpanel-${tab.id}`"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm',
            active_tab === tab.id
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground hover:text-foreground',
          ]"
          @click="handle_tab_change(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- Section header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{{ active_config?.title }}</h2>
        <p class="text-muted-foreground">{{ active_config?.description }}</p>
      </div>

      <!-- Tab content -->
      <div
        role="tabpanel"
        :id="`tabpanel-${active_tab}`"
        :aria-labelledby="`tab-${active_tab}`"
      >
        <ApiTrackerTab v-if="active_tab === 'api-tracker'" />
        <HooksTab v-else-if="active_tab === 'hooks'" />
        <AvatarTab v-else-if="active_tab === 'avatar'" />
        <UserCardTab v-else-if="active_tab === 'user-card'" />
        <BalanceCardTab v-else-if="active_tab === 'balance-card'" />
        <ManabarTab v-else-if="active_tab === 'manabar'" />
        <PostCardTab v-else-if="active_tab === 'post-card'" />
        <PostListTab v-else-if="active_tab === 'post-list'" />
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-border mt-16 py-8">
      <div
        class="container mx-auto px-4 text-center text-sm text-muted-foreground"
      >
        <p>Honeycomb Vue Demo - @kkocot/honeycomb-vue</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import ApiTrackerTab from "./ApiTrackerTab.vue";
import HooksTab from "./HooksTab.vue";
import AvatarTab from "./AvatarTab.vue";
import UserCardTab from "./UserCardTab.vue";
import BalanceCardTab from "./BalanceCardTab.vue";
import ManabarTab from "./ManabarTab.vue";
import PostCardTab from "./PostCardTab.vue";
import PostListTab from "./PostListTab.vue";

type TabId =
  | "api-tracker"
  | "hooks"
  | "avatar"
  | "user-card"
  | "balance-card"
  | "manabar"
  | "post-card"
  | "post-list";

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
    description: "Real-time Hive API endpoint health monitoring.",
  },
  {
    id: "hooks",
    label: "Hooks",
    title: "Hooks",
    description: "Reactive composables for Hive blockchain data.",
  },
  {
    id: "avatar",
    label: "Avatar",
    title: "Avatar",
    description: "User avatar components with reputation badges.",
  },
  {
    id: "user-card",
    label: "User Card",
    title: "User Card",
    description: "Detailed user profile cards with account stats.",
  },
  {
    id: "balance-card",
    label: "Balance Card",
    title: "Balance Card",
    description: "Wallet balance display for HIVE, HBD, and HP.",
  },
  {
    id: "manabar",
    label: "Manabar",
    title: "Manabar",
    description: "Resource credit and voting power indicators.",
  },
  {
    id: "post-card",
    label: "Post Card",
    title: "Post Card",
    description: "Blog post preview cards in multiple variants.",
  },
  {
    id: "post-list",
    label: "Post List",
    title: "Post List",
    description:
      "Paginated list of ranked Hive posts with sort controls and multiple layouts.",
  },
];

const VALID_TAB_IDS: ReadonlySet<string> = new Set(TABS.map((t) => t.id));

function is_valid_tab(value: string): value is TabId {
  return VALID_TAB_IDS.has(value);
}

function get_tab_from_url(): TabId {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (tab && is_valid_tab(tab)) {
    return tab;
  }
  return "api-tracker";
}

const active_tab = ref<TabId>(get_tab_from_url());
const active_config = computed(() => TABS.find((t) => t.id === active_tab.value));

function handle_tab_change(tab_id: TabId) {
  active_tab.value = tab_id;
  const params = new URLSearchParams(window.location.search);
  params.set("tab", tab_id);
  window.history.pushState({}, "", `?${params.toString()}`);
}

function handle_popstate() {
  active_tab.value = get_tab_from_url();
}

onMounted(() => {
  window.addEventListener("popstate", handle_popstate);
});

onUnmounted(() => {
  window.removeEventListener("popstate", handle_popstate);
});
</script>
