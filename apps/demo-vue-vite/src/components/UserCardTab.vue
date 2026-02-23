<template>
  <div class="space-y-6">
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Default Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Standard card with avatar, name, reputation, and optional stats.
      </p>
      <div class="max-w-sm">
        <UserCard username="blocktrades" />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Compact Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Inline display with small avatar, username and reputation.
      </p>
      <div class="space-y-2">
        <UserCard
          v-for="user in DEMO_USERS"
          :key="user"
          :username="user"
          variant="compact"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Expanded Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Full profile card with cover image, bio, and detailed stats.
      </p>
      <div class="max-w-md">
        <UserCard username="blocktrades" variant="expanded" />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Without Stats</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Hide post count and balances by setting showStats to false.
      </p>
      <div class="max-w-sm">
        <UserCard username="barddev" :showStats="false" />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">User List</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Multiple default cards in a grid layout.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UserCard
          v-for="user in DEMO_USERS"
          :key="user"
          :username="user"
        />
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Custom Styling</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Override appearance with class prop.
      </p>
      <div class="max-w-sm">
        <UserCard
          username="arcange"
          class="bg-hive-red/10 border-hive-red"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { UserCard } from "@barddev/honeycomb-vue";

const DEMO_USERS = ["barddev", "blocktrades", "good-karma", "arcange"];
</script>
