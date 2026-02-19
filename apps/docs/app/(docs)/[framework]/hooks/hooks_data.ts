export const CODE = {
  // useHive
  useHiveReact: `import { useHive } from "@barddev/honeycomb-react";

function StatusBar() {
  const {
    chain,
    is_loading,
    error,
    is_client,
    api_endpoint,
    status,
    endpoints,
    refresh_endpoints,
  } = useHive();

  if (is_loading) return <p>Connecting to Hive...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <p>Status: {status}</p>
      <p>Endpoint: {api_endpoint}</p>
      <p>Healthy nodes: {endpoints.filter((ep) => ep.healthy).length}</p>
      <button onClick={() => refresh_endpoints()}>
        Refresh Endpoints
      </button>
    </div>
  );
}`,
  useHiveSolid: `import { useHive } from "@barddev/honeycomb-solid";

function StatusBar() {
  const {
    chain,
    is_loading,
    error,
    is_client,
    api_endpoint,
    status,
    endpoints,
    refresh_endpoints,
  } = useHive();

  // All values are signal getters - call them as functions
  return (
    <div>
      {is_loading() ? (
        <p>Connecting to Hive...</p>
      ) : error() ? (
        <p>Error: {error()}</p>
      ) : (
        <>
          <p>Status: {status()}</p>
          <p>Endpoint: {api_endpoint()}</p>
          <p>Healthy: {endpoints().filter((ep) => ep.healthy).length}</p>
          <button onClick={() => refresh_endpoints()}>
            Refresh Endpoints
          </button>
        </>
      )}
    </div>
  );
}`,
  useHiveVue: `<template>
  <div>
    <p v-if="isLoading">Connecting to Hive...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <div v-else>
      <p>Status: {{ status }}</p>
      <p>Endpoint: {{ apiEndpoint }}</p>
      <p>Healthy: {{ healthy_count }}</p>
      <button @click="refreshEndpoints">Refresh Endpoints</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHive } from "@barddev/honeycomb-vue";

const { chain, isLoading, error, apiEndpoint, status, endpoints, refreshEndpoints } =
  useHive();

// All values are Vue Refs - access via .value in script, auto-unwrapped in template
const healthy_count = computed(() =>
  endpoints.value.filter((ep) => ep.healthy).length
);
</script>`,

  // useHiveChain
  useHiveChainReact: `import { useHiveChain } from "@barddev/honeycomb-react";

function AccountLookup({ username }: { username: string }) {
  const chain = useHiveChain();

  async function fetch_account() {
    if (!chain) return;

    const result = await chain.api.database_api.find_accounts({
      accounts: [username],
    });
    // result.accounts[0] contains full account data
  }

  async function fetch_global_props() {
    if (!chain) return;

    const global_props =
      await chain.api.database_api.get_dynamic_global_properties({});
    // global_props.head_block_number, global_props.current_supply, etc.
  }

  return (
    <div>
      <button onClick={fetch_account}>Fetch Account</button>
      <button onClick={fetch_global_props}>Fetch Global Props</button>
    </div>
  );
}`,
  useHiveChainSolid: `import { useHiveChain } from "@barddev/honeycomb-solid";

function AccountLookup(props: { username: string }) {
  // Returns a signal getter
  const chain = useHiveChain();

  async function fetch_account() {
    const c = chain();
    if (!c) return;

    const result = await c.api.database_api.find_accounts({
      accounts: [props.username],
    });
    // result.accounts[0] contains full account data
  }

  async function fetch_global_props() {
    const c = chain();
    if (!c) return;

    const global_props =
      await c.api.database_api.get_dynamic_global_properties({});
    // global_props.head_block_number, global_props.current_supply, etc.
  }

  return (
    <div>
      <button onClick={fetch_account}>Fetch Account</button>
      <button onClick={fetch_global_props}>Fetch Global Props</button>
    </div>
  );
}`,
  useHiveChainVue: `<template>
  <div>
    <button @click="fetch_account">Fetch Account</button>
    <button @click="fetch_global_props">Fetch Global Props</button>
  </div>
</template>

<script setup lang="ts">
import { useHiveChain } from "@barddev/honeycomb-vue";

const props = defineProps<{ username: string }>();

// Returns a Vue Ref
const chain = useHiveChain();

async function fetch_account() {
  if (!chain.value) return;

  const result = await chain.value.api.database_api.find_accounts({
    accounts: [props.username],
  });
  // result.accounts[0] contains full account data
}

async function fetch_global_props() {
  if (!chain.value) return;

  const result =
    await chain.value.api.database_api.get_dynamic_global_properties({});
  // result.head_block_number, result.current_supply, etc.
}
</script>`,

  // useApiEndpoint
  useApiEndpointReact: `import { useApiEndpoint } from "@barddev/honeycomb-react";

function EndpointDisplay() {
  const endpoint = useApiEndpoint();
  return <p>Connected to: {endpoint ?? "none"}</p>;
}`,
  useApiEndpointSolid: `import { useApiEndpoint } from "@barddev/honeycomb-solid";

function EndpointDisplay() {
  const endpoint = useApiEndpoint();
  // Signal getter - call as function
  return <p>Connected to: {endpoint() ?? "none"}</p>;
}`,
  useApiEndpointVue: `<template>
  <p>Connected to: {{ apiEndpoint ?? "none" }}</p>
</template>

<script setup lang="ts">
import { useApiEndpoint } from "@barddev/honeycomb-vue";

// Returns a Ref - auto-unwrapped in template
const apiEndpoint = useApiEndpoint();
</script>`,

  // useHiveStatus
  useHiveStatusReact: `import { useHiveStatus } from "@barddev/honeycomb-react";

function ConnectionMonitor() {
  const { status, endpoints } = useHiveStatus();
  const healthy = endpoints.filter((ep) => ep.healthy).length;

  return (
    <div>
      <p>Status: {status}</p>
      <p>Healthy endpoints: {healthy} / {endpoints.length}</p>
      <ul>
        {endpoints.map((ep) => (
          <li key={ep.url}>
            {ep.url} - {ep.healthy ? "OK" : ep.lastError ?? "unhealthy"}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
  useHiveStatusSolid: `import { useHiveStatus } from "@barddev/honeycomb-solid";

function ConnectionMonitor() {
  // Returns a signal getter for { status, endpoints }
  const hive_status = useHiveStatus();

  return (
    <div>
      <p>Status: {hive_status().status}</p>
      <p>
        Healthy: {hive_status().endpoints.filter((ep) => ep.healthy).length}
        {" / "}
        {hive_status().endpoints.length}
      </p>
    </div>
  );
}`,
  useHiveStatusVue: `<template>
  <div>
    <p>Status: {{ status }}</p>
    <p>Healthy: {{ healthy_count }} / {{ endpoints.length }}</p>
    <ul>
      <li v-for="ep in endpoints" :key="ep.url">
        {{ ep.url }} - {{ ep.healthy ? "OK" : ep.lastError ?? "unhealthy" }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHiveStatus } from "@barddev/honeycomb-vue";

// Returns { status: Ref, endpoints: Ref }
const { status, endpoints } = useHiveStatus();
const healthy_count = computed(
  () => endpoints.value.filter((ep) => ep.healthy).length
);
</script>`,

  // useHiveAccount
  useHiveAccountReact: `import { useHiveAccount } from "@barddev/honeycomb-react";

function UserProfile({ username }: { username: string }) {
  const { account, is_loading, error, refetch } = useHiveAccount(username);

  if (is_loading) return <p>Loading account...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!account) return <p>Account not found</p>;

  return (
    <div>
      <h2>{account.name}</h2>
      <p>Balance: {account.balance}</p>
      <p>HBD: {account.hbd_balance}</p>
      <p>Posts: {account.post_count}</p>
      <p>Joined: {account.created}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}`,
  useHiveAccountSolid: `import { useHiveAccount } from "@barddev/honeycomb-solid";

function UserProfile(props: { username: string }) {
  const { account, is_loading, error, refetch } = useHiveAccount(props.username);

  return (
    <div>
      {is_loading() ? (
        <p>Loading account...</p>
      ) : error() ? (
        <p>Error: {error()?.message}</p>
      ) : !account() ? (
        <p>Account not found</p>
      ) : (
        <>
          <h2>{account()?.name}</h2>
          <p>Balance: {account()?.balance}</p>
          <p>HBD: {account()?.hbd_balance}</p>
          <p>Posts: {account()?.post_count}</p>
          <p>Joined: {account()?.created}</p>
          <button onClick={refetch}>Refresh</button>
        </>
      )}
    </div>
  );
}`,
  useHiveAccountVue: `<template>
  <div>
    <p v-if="isLoading">Loading account...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <p v-else-if="!account">Account not found</p>
    <div v-else>
      <h2>{{ account.name }}</h2>
      <p>Balance: {{ account.balance }}</p>
      <p>HBD: {{ account.hbd_balance }}</p>
      <p>Posts: {{ account.post_count }}</p>
      <p>Joined: {{ account.created }}</p>
      <button @click="refetch">Refresh</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHiveAccount } from "@barddev/honeycomb-vue";

const props = defineProps<{ username: string }>();

const { account, isLoading, error, refetch } = useHiveAccount(props.username);
</script>`,
};

export const USE_HIVE_ACCOUNT_RETURN_VALUES = [
  {
    react: "account",
    solid: "account",
    vue: "account",
    type: "HiveAccount | null",
    desc: "Account data (name, balance, hbd_balance, post_count, etc.)",
  },
  {
    react: "is_loading",
    solid: "is_loading",
    vue: "isLoading",
    type: "boolean",
    desc: "True while fetching account data",
  },
  {
    react: "error",
    solid: "error",
    vue: "error",
    type: "Error | null",
    desc: "Error if fetch failed",
  },
  {
    react: "refetch",
    solid: "refetch",
    vue: "refetch",
    type: "() => void",
    desc: "Manually re-fetch account data",
  },
];

export const USE_HIVE_RETURN_VALUES = [
  {
    react: "chain",
    solid: "chain",
    vue: "chain",
    type: "IHiveChainInterface | null",
    desc: "Hive chain instance for API calls",
  },
  {
    react: "is_loading",
    solid: "is_loading",
    vue: "isLoading",
    type: "boolean",
    desc: "True while connecting to blockchain",
  },
  {
    react: "error",
    solid: "error",
    vue: "error",
    type: "string | null",
    desc: "Error message if connection failed",
  },
  {
    react: "is_client",
    solid: "is_client",
    vue: "N/A",
    type: "boolean",
    desc: "True when running on client (SSR detection). Not available in Vue package.",
  },
  {
    react: "api_endpoint",
    solid: "api_endpoint",
    vue: "apiEndpoint",
    type: "string | null",
    desc: "Currently active API endpoint URL",
  },
  {
    react: "status",
    solid: "status",
    vue: "status",
    type: "ConnectionStatus",
    desc: "Connection state: connecting | connected | reconnecting | disconnected | error",
  },
  {
    react: "endpoints",
    solid: "endpoints",
    vue: "endpoints",
    type: "EndpointStatus[]",
    desc: "Health status of all configured endpoints",
  },
  {
    react: "refresh_endpoints",
    solid: "refresh_endpoints",
    vue: "refreshEndpoints",
    type: "() => Promise<void>",
    desc: "Manually trigger endpoint health checks",
  },
];
