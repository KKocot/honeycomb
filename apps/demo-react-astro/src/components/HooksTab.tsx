import { useState } from "react";
import {
  useHive,
  useApiEndpoint,
  useHiveStatus,
  useHiveAccount,
  useHiveChain,
  type ConnectionStatus,
} from "@barddev/honeycomb-react";

function get_status_color(status_value: ConnectionStatus) {
  switch (status_value) {
    case "connected":
      return "bg-hive-success";
    case "connecting":
    case "reconnecting":
      return "bg-hive-warning";
    case "error":
    case "disconnected":
      return "bg-hive-destructive";
    default:
      return "bg-hive-muted-foreground";
  }
}

interface GlobalProps {
  head_block_number: number;
  current_supply: string;
  head_block_id: string;
}

interface ApiSupplyAsset {
  amount: string;
  nai: string;
}

function is_record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function is_supply_asset(value: unknown): value is ApiSupplyAsset {
  return (
    is_record(value) &&
    typeof value.amount === "string" &&
    typeof value.nai === "string"
  );
}

function is_dynamic_global_props(
  value: unknown,
): value is {
  head_block_number: number;
  current_supply: unknown;
  head_block_id: string;
} {
  if (!is_record(value)) return false;
  return (
    typeof value.head_block_number === "number" &&
    typeof value.head_block_id === "string" &&
    "current_supply" in value
  );
}

function format_supply(value: unknown): string {
  if (is_supply_asset(value)) {
    const amount = parseInt(value.amount, 10) / 1000;
    return `${amount.toFixed(3)} HIVE`;
  }
  if (typeof value === "string") {
    return value;
  }
  return "N/A";
}

function ConnectionStatusSection() {
  const { status, is_loading, error } = useHive();

  return (
    <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
      <h2 className="text-2xl font-semibold mb-4">Connection Status</h2>
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded-full ${get_status_color(status)}`}
          title={status}
          data-testid="hive-hook-status-dot"
        />
        <span className="text-lg capitalize" data-testid="hive-hook-status">{status}</span>
        {is_loading && (
          <span className="text-hive-muted-foreground text-sm">
            (loading...)
          </span>
        )}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-hive-destructive/10 border border-hive-destructive/20 rounded text-hive-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}
    </section>
  );
}

function CurrentEndpointSection() {
  const api_endpoint = useApiEndpoint();

  return (
    <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
      <h2 className="text-2xl font-semibold mb-4">Current Endpoint</h2>
      <p className="font-mono text-sm text-hive-muted-foreground" data-testid="hive-hook-endpoint">
        {api_endpoint || <em>Not connected</em>}
      </p>
    </section>
  );
}

function AllEndpointsSection() {
  const { refresh_endpoints } = useHive();
  const { endpoints } = useHiveStatus();
  const [refresh_loading, set_refresh_loading] = useState(false);

  const handle_refresh_endpoints = async () => {
    set_refresh_loading(true);
    try {
      await refresh_endpoints();
    } finally {
      set_refresh_loading(false);
    }
  };

  return (
    <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          All Endpoints ({endpoints.length})
        </h2>
        <button
          onClick={handle_refresh_endpoints}
          disabled={refresh_loading}
          className="px-3 py-1.5 text-sm bg-hive-red text-white rounded hover:bg-hive-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refresh_loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <div className="space-y-3">
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.url}
            className="flex items-center justify-between p-3 bg-hive-background border border-hive-border rounded"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-3 h-3 rounded-full ${
                  endpoint.healthy ? "bg-hive-success" : "bg-hive-destructive"
                }`}
                title={endpoint.healthy ? "Healthy" : "Unhealthy"}
              />
              <span className="font-mono text-sm" data-testid="hive-hook-endpoint-url">{endpoint.url}</span>
            </div>
            <div className="flex gap-4 text-xs text-hive-muted-foreground">
              {endpoint.lastCheck !== null && (
                <span>
                  Checked:{" "}
                  {new Date(endpoint.lastCheck).toLocaleTimeString()}
                </span>
              )}
              {endpoint.lastError && (
                <span
                  className="text-hive-destructive"
                  title={endpoint.lastError}
                >
                  Error
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccountLookupSection() {
  const [account_input, set_account_input] = useState("barddev");
  const [username_to_fetch, set_username_to_fetch] = useState("barddev");
  const {
    account,
    is_loading: account_loading,
    error: account_error,
    refetch: account_refetch,
  } = useHiveAccount(username_to_fetch);

  const handle_lookup = () => {
    if (account_input.trim()) {
      set_username_to_fetch(account_input.trim().toLowerCase());
    }
  };

  return (
    <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
      <h2 className="text-2xl font-semibold mb-4">Account Lookup</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={account_input}
          onChange={(e) => set_account_input(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handle_lookup();
          }}
          placeholder="Enter Hive username"
          className="flex-1 px-3 py-2 text-sm bg-hive-background border border-hive-border rounded focus:outline-none focus:ring-2 focus:ring-hive-red/50"
        />
        <button
          onClick={handle_lookup}
          className="px-4 py-2 text-sm bg-hive-red text-white rounded hover:bg-hive-red/90"
        >
          Lookup
        </button>
      </div>
      {account_loading && (
        <p className="text-sm text-hive-muted-foreground">Loading...</p>
      )}
      {account_error && (
        <div className="p-3 bg-hive-destructive/10 border border-hive-destructive/20 rounded text-hive-destructive text-sm">
          Error: {account_error.message}
        </div>
      )}
      {!account_loading && !account_error && account && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span className="text-hive-muted-foreground">Name</span>
            <span className="font-mono">{account.name}</span>
            <span className="text-hive-muted-foreground">Reputation</span>
            <span className="font-mono">{account.reputation}</span>
            <span className="text-hive-muted-foreground">Posts</span>
            <span className="font-mono">{account.post_count}</span>
            <span className="text-hive-muted-foreground">Balance</span>
            <span className="font-mono">{account.balance}</span>
            <span className="text-hive-muted-foreground">HBD Balance</span>
            <span className="font-mono">{account.hbd_balance}</span>
            <span className="text-hive-muted-foreground">Created</span>
            <span className="font-mono">{account.created}</span>
          </div>
          <button
            onClick={account_refetch}
            className="mt-3 px-3 py-1.5 text-sm border border-hive-border rounded hover:bg-hive-muted/50"
          >
            Refetch
          </button>
        </div>
      )}
    </section>
  );
}

function ChainApiSection() {
  const chain = useHiveChain();
  const [global_props, set_global_props] = useState<GlobalProps | null>(null);
  const [chain_loading, set_chain_loading] = useState(false);
  const [chain_error, set_chain_error] = useState<string | null>(null);

  const handle_fetch_global_props = async () => {
    if (!chain) return;
    set_chain_loading(true);
    set_chain_error(null);
    try {
      const result =
        await chain.api.database_api.get_dynamic_global_properties({});
      if (!is_dynamic_global_props(result)) {
        throw new Error("Unexpected API response format");
      }
      set_global_props({
        head_block_number: result.head_block_number,
        current_supply: format_supply(result.current_supply),
        head_block_id: result.head_block_id,
      });
    } catch (err) {
      set_chain_error(
        err instanceof Error
          ? err.message
          : "Failed to fetch global properties",
      );
    } finally {
      set_chain_loading(false);
    }
  };

  return (
    <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
      <h2 className="text-2xl font-semibold mb-4">Chain API</h2>
      {chain === null ? (
        <p className="text-sm text-hive-muted-foreground">
          Waiting for chain connection...
        </p>
      ) : (
        <>
          <button
            onClick={handle_fetch_global_props}
            disabled={chain_loading}
            className="px-4 py-2 text-sm bg-hive-red text-white rounded hover:bg-hive-red/90 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {chain_loading ? "Fetching..." : "Fetch Global Properties"}
          </button>
          {chain_error && (
            <div className="p-3 bg-hive-destructive/10 border border-hive-destructive/20 rounded text-hive-destructive text-sm mb-4">
              Error: {chain_error}
            </div>
          )}
          {global_props && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <span className="text-hive-muted-foreground">
                Head Block Number
              </span>
              <span className="font-mono">
                {global_props.head_block_number.toLocaleString()}
              </span>
              <span className="text-hive-muted-foreground">
                Current Supply
              </span>
              <span className="font-mono">{global_props.current_supply}</span>
              <span className="text-hive-muted-foreground">Head Block ID</span>
              <span className="font-mono text-xs break-all">
                {global_props.head_block_id}
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function HooksTab() {
  return (
    <div className="space-y-6">
      <ConnectionStatusSection />
      <CurrentEndpointSection />
      <AllEndpointsSection />
      <AccountLookupSection />
      <ChainApiSection />
    </div>
  );
}
