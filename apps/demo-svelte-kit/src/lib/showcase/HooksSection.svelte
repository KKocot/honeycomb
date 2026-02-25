<script lang="ts">
  import {
    useHive,
    useApiEndpoint,
    useHiveStatus,
    useHiveAccount,
    type ConnectionStatus,
  } from "@barddev/honeycomb-svelte";

  function get_status_color(status_value: ConnectionStatus): string {
    switch (status_value) {
      case "connected":
        return "bg-green-500";
      case "connecting":
      case "reconnecting":
        return "bg-yellow-500";
      case "error":
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  const hive_context = useHive();
  const api_endpoint = useApiEndpoint();
  const hive_status = useHiveStatus();
  const account_result = useHiveAccount(() => "blocktrades");
</script>

<section id="hooks" class="scroll-mt-20">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">Hooks</h2>
    <p class="text-muted-foreground">
      Reactive hooks for accessing Hive blockchain data: useHive,
      useApiEndpoint, useHiveStatus, useHiveAccount, useHiveChain.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- useHive -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-1">useHive()</h3>
      <p class="text-xs text-muted-foreground mb-4 font-mono">
        Connection status and error state
      </p>
      <div class="flex items-center gap-3">
        <div
          class="w-4 h-4 rounded-full {get_status_color(hive_context.status)}"
        ></div>
        <span class="text-lg capitalize">{hive_context.status}</span>
        {#if hive_context.is_loading}
          <span class="text-muted-foreground text-sm">(loading...)</span>
        {/if}
      </div>
    </div>

    <!-- useApiEndpoint -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-1">useApiEndpoint()</h3>
      <p class="text-xs text-muted-foreground mb-4 font-mono">
        Current active endpoint URL
      </p>
      <p class="font-mono text-sm text-muted-foreground">
        {#if api_endpoint.url}
          {api_endpoint.url}
        {:else}
          <em>Not connected</em>
        {/if}
      </p>
    </div>

    <!-- useHiveStatus -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-1">useHiveStatus()</h3>
      <p class="text-xs text-muted-foreground mb-4 font-mono">
        All endpoints with health status
      </p>
      <div class="space-y-2">
        {#each hive_status.endpoints.slice(0, 4) as endpoint (endpoint.url)}
          <div class="flex items-center gap-2 text-sm">
            <div
              class="w-2.5 h-2.5 rounded-full {endpoint.healthy
                ? 'bg-green-500'
                : 'bg-red-500'}"
            ></div>
            <span class="font-mono text-xs truncate">{endpoint.url}</span>
          </div>
        {/each}
        {#if hive_status.endpoints.length > 4}
          <p class="text-xs text-muted-foreground">
            +{hive_status.endpoints.length - 4} more endpoints
          </p>
        {/if}
      </div>
    </div>

    <!-- useHiveAccount -->
    <div class="border border-border rounded-lg p-6 bg-muted/20">
      <h3 class="text-lg font-semibold mb-1">useHiveAccount()</h3>
      <p class="text-xs text-muted-foreground mb-4 font-mono">
        Account data for @blocktrades
      </p>
      {#if account_result.is_loading}
        <p class="text-sm text-muted-foreground">Loading...</p>
      {:else if account_result.error}
        <p class="text-sm text-red-400">{account_result.error.message}</p>
      {:else if account_result.account}
        {@const acc = account_result.account}
        <dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt class="text-muted-foreground">Name</dt>
          <dd class="font-mono">{acc.name}</dd>
          <dt class="text-muted-foreground">Reputation</dt>
          <dd class="font-mono">{acc.reputation}</dd>
          <dt class="text-muted-foreground">Posts</dt>
          <dd class="font-mono">{acc.post_count}</dd>
          <dt class="text-muted-foreground">Balance</dt>
          <dd class="font-mono">{acc.balance}</dd>
        </dl>
      {/if}
    </div>
  </div>
</section>
