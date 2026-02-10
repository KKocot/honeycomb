<template>
  <div class="space-y-6">
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">API Tracker</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Click the tracker to see all API endpoints and their health status.
      </p>
      <ApiTracker />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ApiTracker } from "@kkocot/honeycomb-vue";
</script>
