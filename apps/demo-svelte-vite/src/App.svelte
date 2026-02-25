<script lang="ts">
  import { HiveProvider } from "@barddev/honeycomb-svelte";
  import StatusDisplay from "./StatusDisplay.svelte";
</script>

<HiveProvider>
  <StatusDisplay />
</HiveProvider>
