<template>
  <HiveProvider>
    <StatusDisplay />
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider } from "@barddev/honeycomb-vue";
import StatusDisplay from "./components/StatusDisplay.vue";
</script>
