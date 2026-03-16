<script lang="ts">
  import {
    useHive,
    useApiEndpoint,
    useHiveStatus,
    useHiveAccount,
    useHiveChain,
    type ConnectionStatus,
    type EndpointStatus,
  } from "@hiveio/honeycomb-svelte";

  interface GlobalProps {
    head_block_number: number;
    current_supply: string;
    head_block_id: string;
  }

  interface RawGlobalProps {
    head_block_number: number;
    head_block_id: string;
    current_supply: { amount?: string; nai?: string } | string;
  }

  function has_prop<K extends string>(
    obj: object,
    key: K,
  ): obj is Record<K, unknown> {
    return key in obj;
  }

  function is_dynamic_global_props(value: unknown): value is RawGlobalProps {
    if (typeof value !== "object" || value === null) return false;
    if (
      !has_prop(value, "head_block_number") ||
      !has_prop(value, "head_block_id") ||
      !has_prop(value, "current_supply")
    ) {
      return false;
    }
    return (
      typeof value.head_block_number === "number" &&
      typeof value.head_block_id === "string" &&
      ((typeof value.current_supply === "object" &&
        value.current_supply !== null) ||
        typeof value.current_supply === "string")
    );
  }

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
  const chain_accessor = useHiveChain();

  let refresh_loading = $state(false);
  let input_username = $state("barddev");
  let username_to_fetch = $state("barddev");
  let global_props: GlobalProps | null = $state(null);
  let chain_loading = $state(false);
  let chain_error: string | null = $state(null);

  const account_result = useHiveAccount(() => username_to_fetch);

  async function handle_refresh_endpoints() {
    refresh_loading = true;
    try {
      await hive_context.refresh_endpoints();
    } finally {
      refresh_loading = false;
    }
  }

  function handle_lookup() {
    const trimmed = input_username.trim();
    if (trimmed) {
      username_to_fetch = trimmed.toLowerCase();
    }
  }

  async function handle_fetch_global_props() {
    const chain_value = chain_accessor.chain;
    if (!chain_value) return;

    chain_loading = true;
    chain_error = null;

    try {
      const response =
        await chain_value.api.database_api.get_dynamic_global_properties({});

      if (!is_dynamic_global_props(response)) {
        throw new Error(
          "Unexpected response shape from global properties API",
        );
      }

      const { current_supply } = response;
      let supply_str = "";
      if (typeof current_supply === "object" && current_supply !== null) {
        const amount =
          parseInt(String(current_supply.amount ?? "0"), 10) / 1000;
        supply_str = `${amount.toFixed(3)} HIVE`;
      } else {
        supply_str = String(current_supply);
      }

      global_props = {
        head_block_number: response.head_block_number,
        current_supply: supply_str,
        head_block_id: response.head_block_id,
      };
    } catch (err) {
      chain_error =
        err instanceof Error ? err.message : "Failed to fetch global props";
    } finally {
      chain_loading = false;
    }
  }

  function handle_keydown(event: KeyboardEvent) {
    if (event.key === "Enter") handle_lookup();
  }
</script>

<div class="space-y-6">
  <!-- Connection Status (useHive) -->
  <section class="border border-border rounded-lg p-6 bg-muted/20">
    <h2 class="text-2xl font-semibold mb-4">Connection Status</h2>
    <p class="text-xs text-muted-foreground mb-3 font-mono">useHive()</p>
    <div class="flex items-center gap-3">
      <div
        class="w-4 h-4 rounded-full {get_status_color(hive_context.status)}"
        title={hive_context.status}
        data-testid="hive-hook-status-dot"
      ></div>
      <span class="text-lg capitalize" data-testid="hive-hook-status"
        >{hive_context.status}</span
      >
      {#if hive_context.is_loading}
        <span class="text-muted-foreground text-sm">(loading...)</span>
      {/if}
    </div>
    {#if hive_context.error}
      <div
        class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400"
      >
        <strong>Error:</strong>
        {hive_context.error}
      </div>
    {/if}
  </section>

  <!-- Current Endpoint (useApiEndpoint) -->
  <section class="border border-border rounded-lg p-6 bg-muted/20">
    <h2 class="text-2xl font-semibold mb-4">Current Endpoint</h2>
    <p class="text-xs text-muted-foreground mb-3 font-mono">
      useApiEndpoint()
    </p>
    <p
      class="font-mono text-sm text-muted-foreground"
      data-testid="hive-hook-endpoint"
    >
      {#if api_endpoint.url}
        {api_endpoint.url}
      {:else}
        <em>Not connected</em>
      {/if}
    </p>
  </section>

  <!-- All Endpoints (useHiveStatus + refreshEndpoints) -->
  <section class="border border-border rounded-lg p-6 bg-muted/20">
    <h2 class="text-2xl font-semibold mb-4">
      All Endpoints ({hive_status.endpoints.length})
    </h2>
    <p class="text-xs text-muted-foreground mb-3 font-mono">
      useHiveStatus() + refreshEndpoints()
    </p>
    <div class="space-y-3">
      {#each hive_status.endpoints as endpoint (endpoint.url)}
        <div
          class="flex items-center justify-between p-3 bg-background border border-border rounded"
        >
          <div class="flex items-center gap-3 flex-1">
            <div
              class="w-3 h-3 rounded-full {endpoint.healthy
                ? 'bg-green-500'
                : 'bg-red-500'}"
              title={endpoint.healthy ? "Healthy" : "Unhealthy"}
            ></div>
            <span
              class="font-mono text-sm"
              data-testid="hive-hook-endpoint-url">{endpoint.url}</span
            >
          </div>
          <div class="flex gap-4 text-xs text-muted-foreground">
            {#if endpoint.lastCheck !== null}
              <span>
                Checked: {new Date(
                  endpoint.lastCheck ?? 0,
                ).toLocaleTimeString()}
              </span>
            {/if}
            {#if endpoint.lastError}
              <span class="text-red-400" title={endpoint.lastError}>
                Error
              </span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
    <button
      class="mt-4 px-4 py-2 text-sm font-medium rounded bg-muted hover:bg-muted/80 border border-border transition-colors disabled:opacity-50"
      disabled={refresh_loading}
      onclick={handle_refresh_endpoints}
    >
      {refresh_loading ? "Refreshing..." : "Refresh Endpoints"}
    </button>
  </section>

  <!-- Account Lookup (useHiveAccount) -->
  <section class="border border-border rounded-lg p-6 bg-muted/20">
    <h2 class="text-2xl font-semibold mb-4">Account Lookup</h2>
    <p class="text-xs text-muted-foreground mb-3 font-mono">
      useHiveAccount()
    </p>
    <p class="text-sm text-muted-foreground mb-4">
      Fetch Hive account data using the useHiveAccount hook.
    </p>
    <div class="flex gap-2 mb-4">
      <input
        type="text"
        bind:value={input_username}
        onkeydown={handle_keydown}
        placeholder="Enter username"
        class="flex-1 px-3 py-2 text-sm rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
      />
      <button
        class="px-4 py-2 text-sm font-medium rounded bg-hive-red text-white hover:bg-hive-red/90 transition-colors"
        onclick={handle_lookup}
      >
        Lookup
      </button>
    </div>

    {#if account_result.is_loading}
      <div class="p-4 text-sm text-muted-foreground">
        Loading account data...
      </div>
    {/if}

    {#if account_result.error}
      <div
        class="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm"
      >
        <strong>Error:</strong>
        {account_result.error.message}
      </div>
    {/if}

    {#if !account_result.is_loading && !account_result.error && account_result.account}
      {@const acc = account_result.account}
      <div class="space-y-2">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt class="text-muted-foreground">Name</dt>
          <dd class="font-mono">{acc.name}</dd>

          <dt class="text-muted-foreground">Reputation</dt>
          <dd class="font-mono">{acc.reputation}</dd>

          <dt class="text-muted-foreground">Posts</dt>
          <dd class="font-mono">{acc.post_count}</dd>

          <dt class="text-muted-foreground">Balance</dt>
          <dd class="font-mono">{acc.balance}</dd>

          <dt class="text-muted-foreground">HBD Balance</dt>
          <dd class="font-mono">{acc.hbd_balance}</dd>

          <dt class="text-muted-foreground">Created</dt>
          <dd class="font-mono">{acc.created}</dd>
        </dl>
        <button
          class="mt-3 px-4 py-2 text-sm font-medium rounded bg-muted hover:bg-muted/80 border border-border transition-colors"
          onclick={account_result.refetch}
        >
          Refetch
        </button>
      </div>
    {/if}
  </section>

  <!-- Chain API (useHiveChain) -->
  <section class="border border-border rounded-lg p-6 bg-muted/20">
    <h2 class="text-2xl font-semibold mb-4">Chain API</h2>
    <p class="text-xs text-muted-foreground mb-3 font-mono">useHiveChain()</p>
    <p class="text-sm text-muted-foreground mb-4">
      Direct chain access using the useHiveChain hook.
    </p>

    {#if chain_accessor.chain}
      <button
        class="px-4 py-2 text-sm font-medium rounded bg-hive-red text-white hover:bg-hive-red/90 transition-colors disabled:opacity-50"
        disabled={chain_loading}
        onclick={handle_fetch_global_props}
      >
        {chain_loading ? "Fetching..." : "Fetch Global Properties"}
      </button>

      {#if chain_error}
        <div
          class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm"
        >
          <strong>Error:</strong>
          {chain_error}
        </div>
      {/if}

      {#if global_props}
        <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt class="text-muted-foreground">Head Block</dt>
          <dd class="font-mono">
            {global_props.head_block_number.toLocaleString()}
          </dd>

          <dt class="text-muted-foreground">Current Supply</dt>
          <dd class="font-mono">{global_props.current_supply}</dd>

          <dt class="text-muted-foreground">Block ID</dt>
          <dd class="font-mono truncate" title={global_props.head_block_id}>
            {global_props.head_block_id}
          </dd>
        </dl>
      {/if}
    {:else}
      <p class="text-sm text-muted-foreground">
        Waiting for chain connection...
      </p>
    {/if}
  </section>
</div>
