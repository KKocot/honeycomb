<script lang="ts">
  import { browser } from "$app/environment";
  import { HiveProvider } from "@hiveio/honeycomb-svelte";
  import StatusDisplay from "$lib/StatusDisplay.svelte";
  import { healthCheckerServices } from "$lib/health-checker-config";
</script>

{#if browser}
  <HiveProvider {healthCheckerServices}>
    <StatusDisplay />
  </HiveProvider>
{:else}
  <div class="min-h-screen bg-background"></div>
{/if}
