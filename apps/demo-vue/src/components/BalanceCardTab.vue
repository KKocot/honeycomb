<template>
  <div class="space-y-6">
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Default Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Card showing HIVE, HBD, and Hive Power balances.
      </p>
      <div class="max-w-sm">
        <BalanceCard username="blocktrades" />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Compact Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Inline display of all balances.
      </p>
      <BalanceCard username="blocktrades" variant="compact" />
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Expanded Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Full breakdown with HP delegations and savings.
      </p>
      <div class="max-w-md">
        <BalanceCard username="blocktrades" variant="expanded" />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Multiple Users</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Balance cards for different users.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BalanceCard
          v-for="user in USERS"
          :key="user"
          :username="user"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Compact List</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Compact balances in a vertical list.
      </p>
      <div class="space-y-2">
        <BalanceCard
          v-for="user in ALL_USERS"
          :key="user"
          :username="user"
          variant="compact"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Custom Styling</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Override styles with class prop.
      </p>
      <BalanceCard
        username="arcange"
        class="border-hive-red/50 max-w-sm"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { BalanceCard } from "@kkocot/honeycomb-vue";

const USERS = ["blocktrades", "gtg", "arcange"];
const ALL_USERS = ["blocktrades", "gtg", "arcange", "good-karma"];
</script>
