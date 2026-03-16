<script lang="ts">
  import { HealthCheckerComponent } from "@hiveio/honeycomb-svelte";

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

  let active_hc = $state<string>(HC_TABS[0].key);
  const current = $derived(HC_TABS.find((t) => t.key === active_hc));
</script>

<div class="space-y-6">
  <section class="border border-border rounded-lg p-6 bg-muted/20">
    <div class="flex gap-2 mb-6">
      {#each HC_TABS as tab}
        <button
          onclick={() => (active_hc = tab.key)}
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {active_hc ===
          tab.key
            ? 'bg-foreground text-background'
            : 'bg-muted text-muted-foreground hover:text-foreground'}"
        >
          {tab.label}
        </button>
      {/each}
    </div>
    <p class="text-sm text-muted-foreground mb-4">
      {current?.description}
    </p>
    {#each HC_TABS as tab (tab.key)}
      <div class={active_hc === tab.key ? "" : "hidden"}>
        <HealthCheckerComponent healthcheckerKey={tab.key} />
      </div>
    {/each}
  </section>
</div>
