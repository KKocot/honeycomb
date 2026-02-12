<template>
  <div class="space-y-6">
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Full Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Three mana rings with labels and cooldown timers.
      </p>
      <HiveManabar username="blocktrades" />
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Compact Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Smaller rings without labels, suitable for inline use.
      </p>
      <HiveManabar username="blocktrades" variant="compact" />
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Ring Variant</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Single RC ring, minimal footprint.
      </p>
      <HiveManabar username="blocktrades" variant="ring" />
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">With Values</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Full variant showing raw current/max values.
      </p>
      <HiveManabar username="blocktrades" :showValues="true" />
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Multiple Users</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Compact manabars for several users.
      </p>
      <div class="space-y-3">
        <div
          v-for="user in USERS"
          :key="user"
          class="flex items-center gap-3"
        >
          <span class="text-sm font-medium w-28">@{{ user }}</span>
          <HiveManabar :username="user" variant="compact" />
        </div>
      </div>
    </section>

    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Custom Styling</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Override styles with class prop.
      </p>
      <HiveManabar
        username="arcange"
        class="border border-hive-red/50 rounded-lg p-4"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { HiveManabar } from "@kkocot/honeycomb-vue";

const USERS = ["blocktrades", "barddev", "arcange", "good-karma"];
</script>
