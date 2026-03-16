<script lang="ts">
  import { ApiTracker } from "@hiveio/honeycomb-svelte";
</script>

<section id="api-tracker" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">ApiTracker</h2>
    <p class="text-muted-foreground">
      Real-time monitoring of Hive API endpoints and connection status.
    </p>
  </div>

  <div class="border border-border rounded-lg p-6 bg-muted/20">
    <ApiTracker />
  </div>
</section>
