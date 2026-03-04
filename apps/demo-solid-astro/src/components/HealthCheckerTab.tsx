import { createSignal, For } from "solid-js";
import { HealthCheckerComponent } from "@barddev/honeycomb-solid";

const HC_TABS = [
  {
    key: "hive-node-api",
    label: "Hive Node API",
    description:
      "Core Hive node checks: account lookup, bridge posts, communities and ranked posts.",
  },
  {
    key: "hive-wallet-api",
    label: "Hive Wallet API",
    description:
      "Wallet-oriented checks: account lookup, dynamic global properties and witness lookup.",
  },
] as const;

export default function HealthCheckerTab() {
  const [activeHc, setActiveHc] = createSignal<string>(HC_TABS[0].key);
  const current = () => HC_TABS.find((t) => t.key === activeHc())!;

  return (
    <div class="space-y-6">
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <div class="flex gap-2 mb-6">
          <For each={HC_TABS}>
            {(tab) => (
              <button
                onClick={() => setActiveHc(tab.key)}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeHc() === tab.key
                    ? "bg-hive-foreground text-hive-background"
                    : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground"
                }`}
              >
                {tab.label}
              </button>
            )}
          </For>
        </div>
        <p class="text-sm text-muted-foreground mb-4">
          {current().description}
        </p>
        <For each={HC_TABS}>
          {(tab) => (
            <div class={activeHc() === tab.key ? "" : "hidden"}>
              <HealthCheckerComponent healthcheckerKey={tab.key} />
            </div>
          )}
        </For>
      </section>
    </div>
  );
}
