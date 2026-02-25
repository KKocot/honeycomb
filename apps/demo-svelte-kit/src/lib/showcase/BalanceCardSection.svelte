<script lang="ts">
  import { BalanceCard } from "@barddev/honeycomb-svelte";

  const USERS = ["barddev", "blocktrades", "arcange"];
  const ALL_USERS = ["barddev", "blocktrades", "arcange", "good-karma"];
</script>

<section id="balance-card" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">BalanceCard</h2>
    <p class="text-muted-foreground">
      Shows HIVE, HBD and Hive Power balances in compact, default, and expanded
      layouts.
    </p>
  </div>

  <div class="space-y-6">
    <!-- Compact List -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Compact Variant</h3>
      <div class="space-y-2">
        {#each ALL_USERS as user}
          <BalanceCard username={user} variant="compact" />
        {/each}
      </div>
    </div>

    <!-- Default Grid -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Default Variant</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each USERS as user}
          <BalanceCard username={user} />
        {/each}
      </div>
    </div>

    <!-- Expanded -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-4">Expanded Variant</h3>
      <p class="text-sm text-muted-foreground mb-4">
        Full breakdown with HP delegations and savings.
      </p>
      <div class="max-w-md">
        <BalanceCard username="blocktrades" variant="expanded" />
      </div>
    </div>
  </div>
</section>
