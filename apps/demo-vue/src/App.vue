<template>
  <HiveProvider>
    <StatusDisplay />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider } from "@kkocot/honeycomb-vue";
import StatusDisplay from "./components/StatusDisplay.vue";
</script>
