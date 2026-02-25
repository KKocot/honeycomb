<script lang="ts" module>
  import type { PostVariant } from "./post-card.svelte";

  export interface LoadingSkeletonProps {
    variant: PostVariant;
    count: number;
  }
</script>

<script lang="ts">
  let { variant, count }: LoadingSkeletonProps = $props();

  const items = $derived(Array.from({ length: count }, (_, i) => i));
</script>

{#snippet compact_skeleton()}
  <div
    class="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse"
  >
    <div class="w-20 h-20 rounded bg-hive-muted shrink-0"></div>
    <div class="flex-1 space-y-2">
      <div class="h-5 w-3/4 bg-hive-muted rounded"></div>
      <div class="h-3 w-1/3 bg-hive-muted rounded"></div>
      <div class="h-3 w-1/2 bg-hive-muted rounded"></div>
    </div>
  </div>
{/snippet}

{#snippet card_skeleton()}
  <div
    class="rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse"
  >
    <div class="flex items-center gap-3 mb-3">
      <div class="h-10 w-10 rounded-full bg-hive-muted"></div>
      <div class="space-y-2">
        <div class="h-4 w-24 bg-hive-muted rounded"></div>
        <div class="h-3 w-16 bg-hive-muted rounded"></div>
      </div>
    </div>
    <div class="h-5 w-3/4 bg-hive-muted rounded mb-2"></div>
    <div class="h-3 w-full bg-hive-muted rounded mb-1"></div>
    <div class="h-3 w-2/3 bg-hive-muted rounded"></div>
  </div>
{/snippet}

{#snippet grid_skeleton()}
  <div
    class="rounded-lg border border-hive-border bg-hive-card overflow-hidden animate-pulse"
  >
    <div class="aspect-video bg-hive-muted"></div>
    <div class="p-4 space-y-2">
      <div class="h-5 w-3/4 bg-hive-muted rounded"></div>
      <div class="h-3 w-1/3 bg-hive-muted rounded"></div>
    </div>
  </div>
{/snippet}

{#if variant === "grid"}
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    {#each items as i (i)}
      {@render grid_skeleton()}
    {/each}
  </div>
{:else if variant === "compact"}
  <div class="flex flex-col gap-2">
    {#each items as i (i)}
      {@render compact_skeleton()}
    {/each}
  </div>
{:else}
  <div class="flex flex-col gap-4">
    {#each items as i (i)}
      {@render card_skeleton()}
    {/each}
  </div>
{/if}
