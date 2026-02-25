<script lang="ts">
  import { browser } from "$app/environment";
  import { HiveProvider } from "@barddev/honeycomb-svelte";
  import StatusDisplay from "$lib/StatusDisplay.svelte";
</script>

{#if browser}
  <HiveProvider>
    <StatusDisplay />
  </HiveProvider>
{:else}
  <div class="min-h-screen bg-background"></div>
{/if}
