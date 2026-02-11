import { createSignal, Switch, Match, For } from "solid-js";
import ApiTrackerTab from "./components/ApiTrackerTab";
import HooksTab from "./components/HooksTab";
import AvatarTab from "./components/AvatarTab";
import UserCardTab from "./components/UserCardTab";
import BalanceCardTab from "./components/BalanceCardTab";
import ManabarTab from "./components/ManabarTab";
import PostCardTab from "./components/PostCardTab";

type Tab =
  | "API Tracker"
  | "Hooks"
  | "Avatar"
  | "User Card"
  | "Balance Card"
  | "Manabar"
  | "Post Card";
const TABS: readonly Tab[] = [
  "API Tracker",
  "Hooks",
  "Avatar",
  "User Card",
  "Balance Card",
  "Manabar",
  "Post Card",
];

function tab_id(tab: Tab): string {
  return tab.toLowerCase().replace(/\s+/g, "-");
}

export default function StatusDisplay() {
  const [active_tab, set_active_tab] = createSignal<Tab>("API Tracker");

  return (
    <main class="container mx-auto p-8 max-w-4xl">
      <h1 class="text-4xl font-bold mb-8 text-hive-red">
        Honeycomb Solid Demo
      </h1>

      <nav class="flex border-b border-border mb-6" role="tablist">
        <For each={TABS}>
          {(tab) => (
            <button
              role="tab"
              id={`tab-${tab_id(tab)}`}
              aria-selected={active_tab() === tab}
              aria-controls={`tabpanel-${tab_id(tab)}`}
              class={`px-4 py-2 text-sm font-medium transition-colors ${
                active_tab() === tab
                  ? "border-b-2 border-hive-red text-hive-red"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => set_active_tab(tab)}
            >
              {tab}
            </button>
          )}
        </For>
      </nav>

      <div
        role="tabpanel"
        id={`tabpanel-${tab_id(active_tab())}`}
        aria-labelledby={`tab-${tab_id(active_tab())}`}
      >
        <Switch>
          <Match when={active_tab() === "API Tracker"}>
            <ApiTrackerTab />
          </Match>
          <Match when={active_tab() === "Hooks"}>
            <HooksTab />
          </Match>
          <Match when={active_tab() === "Avatar"}>
            <AvatarTab />
          </Match>
          <Match when={active_tab() === "User Card"}>
            <UserCardTab />
          </Match>
          <Match when={active_tab() === "Balance Card"}>
            <BalanceCardTab />
          </Match>
          <Match when={active_tab() === "Manabar"}>
            <ManabarTab />
          </Match>
          <Match when={active_tab() === "Post Card"}>
            <PostCardTab />
          </Match>
        </Switch>
      </div>
    </main>
  );
}
