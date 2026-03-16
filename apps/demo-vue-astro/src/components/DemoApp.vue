<template>
  <HiveProvider>
    <StatusDisplay />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider } from "@hiveio/honeycomb-vue";
import StatusDisplay from "./StatusDisplay.vue";
</script>
