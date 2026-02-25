<template>
  <div class="space-y-6">
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <div class="flex gap-2 mb-6">
        <button
          v-for="tab in HC_TABS"
          :key="tab.key"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            active_hc === tab.key
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground hover:text-foreground',
          ]"
          @click="active_hc = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      <p class="text-sm text-muted-foreground mb-4">
        {{ current?.description }}
      </p>
      <div v-for="tab in HC_TABS" :key="tab.key">
        <HealthCheckerComponent
          v-show="active_hc === tab.key"
          :healthchecker-key="tab.key"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { HealthCheckerComponent } from "@barddev/honeycomb-vue";

const HC_TABS = [
  {
    key: "default",
    label: "Default Health Checker",
    description:
      "Default health checker with basic database API checks against all configured endpoints.",
  },
] as const;

const active_hc = ref<string>(HC_TABS[0].key);
const current = computed(() => HC_TABS.find((t) => t.key === active_hc.value));
</script>
