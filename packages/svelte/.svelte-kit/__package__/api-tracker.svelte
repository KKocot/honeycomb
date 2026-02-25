<script lang="ts" module>
  export interface ApiTrackerProps {
    class?: string;
    showUrl?: boolean;
    side?: "top" | "bottom";
  }
</script>

<script lang="ts">
  import { useHive } from "./context.svelte";
  import { cn } from "./utils";
  import type { ConnectionStatus } from "@kkocot/honeycomb-core";

  let {
    class: class_name,
    showUrl = false,
    side = "bottom",
  }: ApiTrackerProps = $props();

  const hive = useHive();
  let is_refreshing = $state(false);
  let is_open = $state(false);

  function get_status_color(s: ConnectionStatus): string {
    switch (s) {
      case "connected":
        return "bg-hive-success";
      case "connecting":
      case "reconnecting":
        return "bg-hive-warning animate-pulse";
      case "error":
      case "disconnected":
        return "bg-hive-destructive";
      default:
        return "bg-hive-muted-foreground";
    }
  }

  function format_url(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  function format_time(timestamp: number | null): string {
    if (timestamp === null) return "Never";
    return new Date(timestamp).toLocaleTimeString();
  }

  async function handle_toggle() {
    is_open = !is_open;
    if (is_open) {
      is_refreshing = true;
      try {
        await hive.refresh_endpoints();
      } finally {
        is_refreshing = false;
      }
    }
  }

  async function handle_refresh() {
    is_refreshing = true;
    try {
      await hive.refresh_endpoints();
    } finally {
      is_refreshing = false;
    }
  }

  const healthy_count = $derived(
    hive.endpoints.filter((ep) => ep.healthy).length,
  );
</script>

<svelte:window
  onkeydown={(e) => {
    if (is_open && e.key === "Escape") is_open = false;
  }}
/>

<div class="relative inline-block">
  <button
    type="button"
    onclick={handle_toggle}
    aria-expanded={is_open}
    aria-haspopup="true"
    class={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hive-border bg-hive-card cursor-pointer hover:bg-hive-muted/50 transition-colors",
      class_name,
    )}
    data-testid="hive-connect-button"
  >
    <span
      class={cn("w-2.5 h-2.5 rounded-full", get_status_color(hive.status))}
    ></span>
    <span
      class="text-sm text-hive-foreground capitalize"
      data-testid="hive-connection-status">{hive.status}</span
    >
    {#if showUrl && hive.api_endpoint}
      <span
        class="text-xs text-hive-muted-foreground font-mono truncate max-w-[200px]"
        data-testid="hive-api-endpoint"
      >
        {format_url(hive.api_endpoint)}
      </span>
    {/if}
  </button>

  {#if is_open}
    <div
      class="fixed inset-0 z-40"
      role="presentation"
      onclick={() => (is_open = false)}
    ></div>
    <div
      role="dialog"
      aria-label="API endpoints"
      class={cn(
        "absolute z-50 w-80 rounded-md border bg-hive-popover p-4 text-hive-popover-foreground shadow-md",
        side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        "left-0",
      )}
    >
      <div class="flex items-center justify-between mb-3">
        <div>
          <h3 class="text-sm font-semibold">API Endpoints</h3>
          <p class="text-xs text-hive-muted-foreground">
            {healthy_count}/{hive.endpoints.length} healthy
          </p>
        </div>
        <button
          type="button"
          onclick={handle_refresh}
          disabled={is_refreshing}
          class="text-xs text-hive-muted-foreground hover:text-hive-foreground cursor-pointer disabled:opacity-50"
        >
          {is_refreshing ? "Checking..." : "Refresh"}
        </button>
      </div>

      <div class="space-y-0" data-testid="hive-endpoint-list">
        {#each hive.endpoints as endpoint (endpoint.url)}
          <div
            class="flex items-start justify-between gap-2 py-2 border-b border-hive-border last:border-0"
            data-testid="hive-endpoint-item"
          >
            <div class="flex items-start gap-2 flex-1 min-w-0">
              <span
                class={cn(
                  "w-2 h-2 rounded-full mt-1",
                  endpoint.healthy
                    ? "bg-hive-success"
                    : "bg-hive-destructive",
                )}
              ></span>
              <div class="flex-1 min-w-0">
                <div
                  class="text-xs font-mono truncate"
                  data-testid="hive-endpoint-url"
                >
                  {format_url(endpoint.url)}
                </div>
                <p class="text-xs text-hive-muted-foreground mt-0.5">
                  Last check: {format_time(endpoint.lastCheck)}
                </p>
                {#if endpoint.lastError}
                  <p
                    class="text-xs text-hive-destructive mt-0.5 truncate"
                  >
                    {endpoint.lastError}
                  </p>
                {/if}
              </div>
            </div>
            <span
              class={cn(
                "text-xs px-2 py-0.5 rounded shrink-0",
                endpoint.healthy
                  ? "bg-hive-success/10 text-hive-success"
                  : "bg-hive-destructive/10 text-hive-destructive",
              )}
              data-testid="hive-endpoint-status"
            >
              {endpoint.healthy ? "Healthy" : "Unhealthy"}
            </span>
          </div>
        {/each}

        {#if hive.endpoints.length === 0}
          <p
            class="text-xs text-hive-muted-foreground text-center py-4"
          >
            No endpoints configured
          </p>
        {/if}
      </div>
    </div>
  {/if}
</div>
