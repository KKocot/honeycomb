<script lang="ts">
  import { setContext, onMount, onDestroy } from "svelte";
  import type { IHiveChainInterface } from "@hiveio/wax";
  import type { Snippet } from "svelte";
  import {
    HiveClient,
    DEFAULT_API_ENDPOINTS,
    HealthCheckerService,
    DEFAULT_HEALTHCHECKER_KEY,
    DEFAULT_HEALTHCHECKER_PROVIDERS,
    createDefaultCheckers,
    type HiveClientState,
    type ConnectionStatus,
    type EndpointStatus,
    type ApiChecker,
  } from "@kkocot/honeycomb-core";
  import { HIVE_CONTEXT_KEY, type HiveContextValue } from "./context.svelte";

  export interface HealthCheckerServiceConfig {
    key: string;
    createCheckers: (chain: IHiveChainInterface) => ApiChecker[];
    defaultProviders: string[];
    nodeAddress: string | null;
    onNodeChange: (node: string | null, chain: IHiveChainInterface) => void;
    enableLogs?: boolean;
  }

  interface Props {
    apiEndpoints?: string[];
    timeout?: number;
    healthCheckInterval?: number;
    onEndpointChange?: (endpoint: string) => void;
    healthCheckerServices?: HealthCheckerServiceConfig[];
    children: Snippet;
  }

  let {
    apiEndpoints = DEFAULT_API_ENDPOINTS,
    timeout = 5000,
    healthCheckInterval = 30000,
    onEndpointChange,
    healthCheckerServices: hc_service_configs,
    children,
  }: Props = $props();

  let chain: IHiveChainInterface | null = $state(null);
  const initial_status: ConnectionStatus = "disconnected";
  let status: ConnectionStatus = $state(initial_status);
  let current_endpoint: string | null = $state(null);
  let error: string | null = $state(null);
  let endpoints: EndpointStatus[] = $state([]);
  let is_client: boolean = $state(false);
  let is_loading: boolean = $state(false);

  let client: HiveClient | null = null;
  let unsubscribe_fn: (() => void) | null = null;
  let hc_services = new Map<string, HealthCheckerService>();

  const refresh_endpoints = async () => {
    if (client) {
      await client.refreshEndpoints();
    }
  };

  const get_health_checker_service = (
    key: string
  ): HealthCheckerService | null => {
    return hc_services.get(key) ?? null;
  };

  setContext<HiveContextValue>(HIVE_CONTEXT_KEY, {
    get chain() {
      return chain;
    },
    get status() {
      return status;
    },
    get api_endpoint() {
      return current_endpoint;
    },
    get error() {
      return error;
    },
    get is_loading() {
      return is_loading;
    },
    get endpoints() {
      return endpoints;
    },
    get is_client() {
      return is_client;
    },
    refresh_endpoints,
    get_health_checker_service,
  });

  function setup_health_checker_services(
    chain_instance: IHiveChainInterface
  ): void {
    cleanup_health_checker_services();

    const configs: HealthCheckerServiceConfig[] = hc_service_configs?.length
      ? hc_service_configs
      : [
          {
            key: DEFAULT_HEALTHCHECKER_KEY,
            createCheckers: createDefaultCheckers,
            defaultProviders: DEFAULT_HEALTHCHECKER_PROVIDERS,
            nodeAddress: null,
            onNodeChange: (node, c) => {
              if (node) {
                c.endpointUrl = node;
              }
            },
          },
        ];

    const new_services = new Map<string, HealthCheckerService>();

    for (const config of configs) {
      const checkers = config.createCheckers(chain_instance);
      const service = new HealthCheckerService(
        config.key,
        checkers,
        config.defaultProviders,
        config.nodeAddress,
        (node) => config.onNodeChange(node, chain_instance),
        config.enableLogs
      );
      new_services.set(config.key, service);
    }

    hc_services = new_services;
  }

  function cleanup_health_checker_services(): void {
    for (const service of hc_services.values()) {
      service.stopCheckingProcess();
    }
    hc_services = new Map();
  }

  onMount(() => {
    is_client = true;

    client = new HiveClient({
      endpoints: apiEndpoints,
      timeout,
      healthCheckInterval,
      onEndpointChange: (endpoint) => {
        if (onEndpointChange) {
          onEndpointChange(endpoint);
        }
      },
    });

    unsubscribe_fn = client.subscribe((new_state: HiveClientState) => {
      status = new_state.status;
      current_endpoint = new_state.currentEndpoint;
      endpoints = new_state.endpoints;
      error = new_state.error;
      is_loading =
        new_state.status === "connecting" ||
        new_state.status === "reconnecting";
      chain = client?.chain ?? null;
    });

    client
      .connect()
      .then(() => {
        chain = client?.chain ?? null;
        if (chain) {
          setup_health_checker_services(chain);
        }
      })
      .catch(() => {
        // Errors handled via state subscription
      });
  });

  onDestroy(() => {
    cleanup_health_checker_services();
    unsubscribe_fn?.();
    client?.disconnect();
    client = null;
    chain = null;
  });
</script>

{@render children()}
