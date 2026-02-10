<template>
  <div class="space-y-6">
    <!-- Connection Status (useHive) -->
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Connection Status</h2>
      <p class="text-xs text-muted-foreground mb-3 font-mono">useHive()</p>
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-4 h-4 rounded-full',
            hive_status === 'connected'
              ? 'bg-green-500'
              : hive_status === 'error' || hive_status === 'disconnected'
                ? 'bg-red-500'
                : 'bg-yellow-500',
          ]"
          :title="hive_status"
        />
        <span class="text-lg capitalize">{{ hive_status }}</span>
        <span v-if="is_loading" class="text-muted-foreground text-sm"
          >(loading...)</span
        >
      </div>
      <div
        v-if="hive_error"
        class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400"
      >
        <strong>Error:</strong> {{ hive_error }}
      </div>
    </section>

    <!-- Current Endpoint (useApiEndpoint) -->
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Current Endpoint</h2>
      <p class="text-xs text-muted-foreground mb-3 font-mono">
        useApiEndpoint()
      </p>
      <p class="font-mono text-sm text-muted-foreground">
        {{ api_endpoint || "Not connected" }}
      </p>
    </section>

    <!-- All Endpoints (useHiveStatus + refreshEndpoints) -->
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">
        All Endpoints ({{ status_endpoints.length }})
      </h2>
      <p class="text-xs text-muted-foreground mb-3 font-mono">
        useHiveStatus() + refreshEndpoints()
      </p>
      <div class="mb-4">
        <button
          class="px-4 py-2 text-sm rounded bg-hive-red text-white hover:bg-hive-red/90 disabled:opacity-50"
          :disabled="refresh_loading"
          @click="handle_refresh_endpoints"
        >
          {{ refresh_loading ? "Refreshing..." : "Refresh Endpoints" }}
        </button>
      </div>
      <div class="space-y-3">
        <div
          v-for="endpoint in status_endpoints"
          :key="endpoint.url"
          class="flex items-center justify-between p-3 bg-background border border-border rounded"
        >
          <div class="flex items-center gap-3 flex-1">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                endpoint.healthy ? 'bg-green-500' : 'bg-red-500',
              ]"
              :title="endpoint.healthy ? 'Healthy' : 'Unhealthy'"
            />
            <span class="font-mono text-sm">{{ endpoint.url }}</span>
          </div>
          <div class="flex gap-4 text-xs text-muted-foreground">
            <span v-if="endpoint.lastCheck !== null">
              Checked: {{ format_timestamp(endpoint.lastCheck) }}
            </span>
            <span
              v-if="endpoint.lastError"
              class="text-red-400"
              :title="endpoint.lastError"
            >
              Error
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Account Lookup (useHiveAccount) -->
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Account Lookup</h2>
      <p class="text-xs text-muted-foreground mb-3 font-mono">
        useHiveAccount()
      </p>
      <div class="flex gap-2 mb-4">
        <input
          v-model="input_username"
          class="flex-1 px-3 py-2 text-sm border border-border rounded bg-background text-foreground"
          placeholder="Enter Hive username"
          @keyup.enter="handle_lookup"
        />
        <button
          class="px-4 py-2 text-sm rounded bg-hive-red text-white hover:bg-hive-red/90"
          @click="handle_lookup"
        >
          Lookup
        </button>
        <button
          class="px-4 py-2 text-sm rounded border border-border text-foreground hover:bg-muted"
          @click="account_refetch"
        >
          Refetch
        </button>
      </div>

      <div v-if="account_loading" class="text-muted-foreground text-sm">
        Loading account...
      </div>
      <div
        v-else-if="account_error"
        class="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400"
      >
        <strong>Error:</strong> {{ account_error.message }}
      </div>
      <div v-else-if="account" class="space-y-2">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt class="text-muted-foreground">Name</dt>
          <dd class="font-mono">{{ account.name }}</dd>
          <dt class="text-muted-foreground">Reputation</dt>
          <dd class="font-mono">{{ account.reputation }}</dd>
          <dt class="text-muted-foreground">Posts</dt>
          <dd class="font-mono">{{ account.post_count }}</dd>
          <dt class="text-muted-foreground">Balance</dt>
          <dd class="font-mono">{{ account.balance }}</dd>
          <dt class="text-muted-foreground">HBD Balance</dt>
          <dd class="font-mono">{{ account.hbd_balance }}</dd>
          <dt class="text-muted-foreground">Created</dt>
          <dd class="font-mono">{{ account.created }}</dd>
        </div>
      </div>
    </section>

    <!-- Chain API (useHiveChain) -->
    <section class="border border-border rounded-lg p-6 bg-muted/20">
      <h2 class="text-2xl font-semibold mb-4">Chain API</h2>
      <p class="text-xs text-muted-foreground mb-3 font-mono">
        useHiveChain()
      </p>
      <div v-if="chain">
        <button
          class="px-4 py-2 text-sm rounded bg-hive-red text-white hover:bg-hive-red/90 disabled:opacity-50 mb-4"
          :disabled="chain_loading"
          @click="fetch_global_props"
        >
          {{ chain_loading ? "Fetching..." : "Get Global Properties" }}
        </button>

        <div
          v-if="chain_error"
          class="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 mb-4"
        >
          <strong>Error:</strong> {{ chain_error }}
        </div>

        <div v-if="global_props" class="space-y-2">
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt class="text-muted-foreground">Head Block</dt>
            <dd class="font-mono">{{ global_props.head_block_number }}</dd>
            <dt class="text-muted-foreground">Current Supply</dt>
            <dd class="font-mono">{{ global_props.current_supply }}</dd>
            <dt class="text-muted-foreground">Head Block ID</dt>
            <dd class="font-mono text-xs break-all">
              {{ global_props.head_block_id }}
            </dd>
          </div>
        </div>
      </div>
      <p v-else class="text-muted-foreground text-sm">
        Waiting for chain connection...
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  useHive,
  useApiEndpoint,
  useHiveStatus,
  useHiveAccount,
  useHiveChain,
} from "@kkocot/honeycomb-vue";

// Connection Status
const {
  isLoading: is_loading,
  error: hive_error,
  refreshEndpoints: refresh_endpoints,
} = useHive();
const api_endpoint = useApiEndpoint();
const { status: hive_status, endpoints: status_endpoints } = useHiveStatus();

const refresh_loading = ref(false);

async function handle_refresh_endpoints() {
  refresh_loading.value = true;
  try {
    await refresh_endpoints();
  } finally {
    refresh_loading.value = false;
  }
}

function format_timestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

// Account Lookup
const input_username = ref("barddev");
const username_to_fetch = ref("barddev");

const {
  account,
  isLoading: account_loading,
  error: account_error,
  refetch: account_refetch,
} = useHiveAccount(username_to_fetch);

function handle_lookup() {
  const trimmed = input_username.value.trim().toLowerCase();
  if (trimmed) {
    username_to_fetch.value = trimmed;
  }
}

// Chain API
const chain = useHiveChain();

interface GlobalProps {
  head_block_number: number;
  current_supply: string;
  head_block_id: string;
}

interface DynamicGlobalProps {
  head_block_number: number;
  current_supply: { amount?: string; nai?: string } | string;
  head_block_id: string;
}

function has_prop<K extends string>(
  obj: object,
  key: K,
): obj is Record<K, unknown> {
  return key in obj;
}

function is_dynamic_global_props(
  value: unknown,
): value is DynamicGlobalProps {
  if (typeof value !== "object" || value === null) return false;
  if (
    !has_prop(value, "head_block_number") ||
    !has_prop(value, "head_block_id") ||
    !has_prop(value, "current_supply")
  )
    return false;
  return (
    typeof value.head_block_number === "number" &&
    typeof value.head_block_id === "string" &&
    ((typeof value.current_supply === "object" &&
      value.current_supply !== null) ||
      typeof value.current_supply === "string")
  );
}

function format_supply(supply: DynamicGlobalProps["current_supply"]): string {
  if (typeof supply === "string") return supply;
  if (supply?.amount) {
    return `${(parseInt(supply.amount, 10) / 1000).toFixed(3)} HIVE`;
  }
  return "N/A";
}

const global_props = ref<GlobalProps | null>(null);
const chain_loading = ref(false);
const chain_error = ref<string | null>(null);

async function fetch_global_props() {
  if (!chain.value) return;
  chain_loading.value = true;
  chain_error.value = null;
  try {
    const result: unknown =
      await chain.value.api.database_api.get_dynamic_global_properties({});
    if (!is_dynamic_global_props(result)) {
      throw new Error("Unexpected API response format");
    }
    global_props.value = {
      head_block_number: result.head_block_number,
      current_supply: format_supply(result.current_supply),
      head_block_id: result.head_block_id,
    };
  } catch (err) {
    chain_error.value =
      err instanceof Error
        ? err.message
        : "Failed to fetch global properties";
  } finally {
    chain_loading.value = false;
  }
}
</script>
