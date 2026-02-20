import { Show, For, createSignal } from "solid-js";
import {
  useHive,
  useApiEndpoint,
  useHiveStatus,
  useHiveAccount,
  useHiveChain,
  type ConnectionStatus,
  type EndpointStatus,
} from "@barddev/honeycomb-solid";

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

export default function HooksTab() {
  const hive_context = useHive();
  const api_endpoint = useApiEndpoint();
  const hive_status = useHiveStatus();
  const chain = useHiveChain();

  const [refresh_loading, set_refresh_loading] = createSignal(false);
  const [input_username, set_input_username] = createSignal("barddev");
  const [username_to_fetch, set_username_to_fetch] = createSignal("barddev");
  const [global_props, set_global_props] = createSignal<GlobalProps | null>(
    null,
  );
  const [chain_loading, set_chain_loading] = createSignal(false);
  const [chain_error, set_chain_error] = createSignal<string | null>(null);

  const {
    account,
    is_loading: account_loading,
    error: account_error,
    refetch,
  } = useHiveAccount(username_to_fetch);

  const handle_refresh_endpoints = async () => {
    set_refresh_loading(true);
    try {
      await hive_context.refresh_endpoints();
    } finally {
      set_refresh_loading(false);
    }
  };

  const handle_lookup = () => {
    const trimmed = input_username().trim();
    if (trimmed) {
      set_username_to_fetch(trimmed.toLowerCase());
    }
  };

  const handle_fetch_global_props = async () => {
    const chain_value = chain();
    if (!chain_value) return;

    set_chain_loading(true);
    set_chain_error(null);

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

      set_global_props({
        head_block_number: response.head_block_number,
        current_supply: supply_str,
        head_block_id: response.head_block_id,
      });
    } catch (err) {
      set_chain_error(
        err instanceof Error ? err.message : "Failed to fetch global props",
      );
    } finally {
      set_chain_loading(false);
    }
  };

  return (
    <div class="space-y-6">
      {/* Connection Status (useHive) */}
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Connection Status</h2>
        <p class="text-xs text-muted-foreground mb-3 font-mono">useHive()</p>
        <div class="flex items-center gap-3">
          <div
            class={`w-4 h-4 rounded-full ${get_status_color(hive_context.status())}`}
            title={hive_context.status()}
            data-testid="hive-hook-status-dot"
          />
          <span class="text-lg capitalize" data-testid="hive-hook-status">{hive_context.status()}</span>
          <Show when={hive_context.is_loading()}>
            <span class="text-muted-foreground text-sm">(loading...)</span>
          </Show>
        </div>
        <Show when={hive_context.error()}>
          <div class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
            <strong>Error:</strong> {hive_context.error()}
          </div>
        </Show>
      </section>

      {/* Current Endpoint (useApiEndpoint) */}
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Current Endpoint</h2>
        <p class="text-xs text-muted-foreground mb-3 font-mono">
          useApiEndpoint()
        </p>
        <p class="font-mono text-sm text-muted-foreground" data-testid="hive-hook-endpoint">
          {api_endpoint() || <em>Not connected</em>}
        </p>
      </section>

      {/* All Endpoints (useHiveStatus + refreshEndpoints) */}
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">
          All Endpoints ({hive_status().endpoints.length})
        </h2>
        <p class="text-xs text-muted-foreground mb-3 font-mono">
          useHiveStatus() + refreshEndpoints()
        </p>
        <div class="space-y-3">
          <For each={hive_status().endpoints}>
            {(endpoint: EndpointStatus) => (
              <div class="flex items-center justify-between p-3 bg-background border border-border rounded">
                <div class="flex items-center gap-3 flex-1">
                  <div
                    class={`w-3 h-3 rounded-full ${
                      endpoint.healthy ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={endpoint.healthy ? "Healthy" : "Unhealthy"}
                  />
                  <span class="font-mono text-sm" data-testid="hive-hook-endpoint-url">{endpoint.url}</span>
                </div>
                <div class="flex gap-4 text-xs text-muted-foreground">
                  <Show when={endpoint.lastCheck !== null}>
                    <span>
                      Checked:{" "}
                      {new Date(endpoint.lastCheck ?? 0).toLocaleTimeString()}
                    </span>
                  </Show>
                  <Show when={endpoint.lastError}>
                    <span
                      class="text-red-400"
                      title={endpoint.lastError || ""}
                    >
                      Error
                    </span>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
        <button
          class="mt-4 px-4 py-2 text-sm font-medium rounded bg-muted hover:bg-muted/80 border border-border transition-colors disabled:opacity-50"
          disabled={refresh_loading()}
          onClick={handle_refresh_endpoints}
        >
          {refresh_loading() ? "Refreshing..." : "Refresh Endpoints"}
        </button>
      </section>

      {/* Account Lookup (useHiveAccount) */}
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
            value={input_username()}
            onInput={(e) => set_input_username(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handle_lookup();
            }}
            placeholder="Enter username"
            class="flex-1 px-3 py-2 text-sm rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
          />
          <button
            class="px-4 py-2 text-sm font-medium rounded bg-hive-red text-white hover:bg-hive-red/90 transition-colors"
            onClick={handle_lookup}
          >
            Lookup
          </button>
        </div>

        <Show when={account_loading()}>
          <div class="p-4 text-sm text-muted-foreground">
            Loading account data...
          </div>
        </Show>

        <Show when={account_error()}>
          <div class="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            <strong>Error:</strong> {account_error()?.message}
          </div>
        </Show>

        <Show when={!account_loading() && !account_error() && account()}>
          {(acc) => (
            <div class="space-y-2">
              <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt class="text-muted-foreground">Name</dt>
                <dd class="font-mono">{acc().name}</dd>

                <dt class="text-muted-foreground">Reputation</dt>
                <dd class="font-mono">{acc().reputation}</dd>

                <dt class="text-muted-foreground">Posts</dt>
                <dd class="font-mono">{acc().post_count}</dd>

                <dt class="text-muted-foreground">Balance</dt>
                <dd class="font-mono">{acc().balance}</dd>

                <dt class="text-muted-foreground">HBD Balance</dt>
                <dd class="font-mono">{acc().hbd_balance}</dd>

                <dt class="text-muted-foreground">Created</dt>
                <dd class="font-mono">{acc().created}</dd>
              </dl>
              <button
                class="mt-3 px-4 py-2 text-sm font-medium rounded bg-muted hover:bg-muted/80 border border-border transition-colors"
                onClick={refetch}
              >
                Refetch
              </button>
            </div>
          )}
        </Show>
      </section>

      {/* Chain API (useHiveChain) */}
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Chain API</h2>
        <p class="text-xs text-muted-foreground mb-3 font-mono">
          useHiveChain()
        </p>
        <p class="text-sm text-muted-foreground mb-4">
          Direct chain access using the useHiveChain hook.
        </p>

        <Show
          when={chain()}
          fallback={
            <p class="text-sm text-muted-foreground">
              Waiting for chain connection...
            </p>
          }
        >
          <button
            class="px-4 py-2 text-sm font-medium rounded bg-hive-red text-white hover:bg-hive-red/90 transition-colors disabled:opacity-50"
            disabled={chain_loading()}
            onClick={handle_fetch_global_props}
          >
            {chain_loading() ? "Fetching..." : "Fetch Global Properties"}
          </button>

          <Show when={chain_error()}>
            <div class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              <strong>Error:</strong> {chain_error()}
            </div>
          </Show>

          <Show when={global_props()}>
            {(props) => (
              <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt class="text-muted-foreground">Head Block</dt>
                <dd class="font-mono">
                  {props().head_block_number.toLocaleString()}
                </dd>

                <dt class="text-muted-foreground">Current Supply</dt>
                <dd class="font-mono">{props().current_supply}</dd>

                <dt class="text-muted-foreground">Block ID</dt>
                <dd
                  class="font-mono truncate"
                  title={props().head_block_id}
                >
                  {props().head_block_id}
                </dd>
              </dl>
            )}
          </Show>
        </Show>
      </section>
    </div>
  );
}
