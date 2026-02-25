/**
 * Vue 3 Provider for Hive Blockchain
 * Provides composables for accessing Hive chain via provide/inject pattern
 */

import {
  defineComponent,
  h,
  provide,
  inject,
  ref,
  shallowRef,
  watch,
  onMounted,
  onUnmounted,
  type InjectionKey,
  type PropType,
  type Ref,
  type App,
} from "vue";
import type { IHiveChainInterface } from "@hiveio/wax";
import {
  HiveClient,
  DEFAULT_API_ENDPOINTS,
  HealthCheckerService,
  DEFAULT_HEALTHCHECKER_KEY,
  DEFAULT_HEALTHCHECKER_PROVIDERS,
  createDefaultCheckers,
  type HiveClientState,
  type ConnectionStatus,
  type ApiChecker,
} from "@kkocot/honeycomb-core";

export interface HealthCheckerServiceConfig {
  /** Unique key to identify this service instance */
  key: string;
  /** Factory that receives chain and returns checkers array */
  createCheckers: (chain: IHiveChainInterface) => ApiChecker[];
  /** Default API endpoint URLs to check */
  defaultProviders: string[];
  /** Currently active node address for this service */
  nodeAddress: string | null;
  /** Callback fired when the healthchecker switches to a different node */
  onNodeChange: (node: string | null, chain: IHiveChainInterface) => void;
  /** Enable console logs for debugging */
  enableLogs?: boolean;
}

/**
 * Context value provided by HiveProvider
 */
export interface HiveContextValue {
  /** Hive chain instance (null when disconnected) */
  chain: Ref<IHiveChainInterface | null>;
  /** Loading state (true during connection) */
  isLoading: Ref<boolean>;
  /** Error message (null if no error) */
  error: Ref<string | null>;
  /** Current API endpoint URL (null if disconnected) */
  apiEndpoint: Ref<string | null>;
  /** Connection status */
  status: Ref<ConnectionStatus>;
  /** Status of all endpoints */
  endpoints: Ref<HiveClientState["endpoints"]>;
  /** Refresh all endpoints health status */
  refreshEndpoints: () => Promise<void>;
  /** Get a HealthCheckerService instance by key */
  getHealthCheckerService: (key: string) => HealthCheckerService | null;
}

/**
 * Injection key for Hive context
 */
const HIVE_INJECTION_KEY: InjectionKey<HiveContextValue> = Symbol("hive");

/**
 * Vue 3 Provider component for Hive Blockchain
 * Manages connection to Hive blockchain with automatic endpoint fallback
 *
 * @example
 * ```vue
 * <template>
 *   <HiveProvider :api-endpoints="endpoints">
 *     <YourApp />
 *   </HiveProvider>
 * </template>
 *
 * <script setup>
 * import { HiveProvider } from '@barddev/honeycomb-vue';
 *
 * const endpoints = ['https://api.hive.blog', 'https://api.openhive.network'];
 * </script>
 * ```
 */
export const HiveProvider = defineComponent({
  name: "HiveProvider",
  props: {
    /**
     * List of API endpoints (in priority order)
     * @default DEFAULT_API_ENDPOINTS
     */
    apiEndpoints: {
      type: Array as PropType<string[]>,
      default: () => DEFAULT_API_ENDPOINTS,
    },
    /**
     * Request timeout in milliseconds
     * @default 5000
     */
    timeout: {
      type: Number,
      default: 5000,
    },
    /**
     * Health check interval in milliseconds (0 = disabled)
     * @default 30000
     */
    healthCheckInterval: {
      type: Number,
      default: 30000,
    },
    /**
     * Callback fired when endpoint changes
     */
    onEndpointChange: {
      type: Function as PropType<(endpoint: string) => void>,
      default: undefined,
    },
    /**
     * HealthChecker service configurations
     */
    healthCheckerServices: {
      type: Array as PropType<HealthCheckerServiceConfig[]>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    // Reactive state
    const chain = shallowRef<IHiveChainInterface | null>(null);
    const is_loading = ref(true);
    const error = ref<string | null>(null);
    const api_endpoint = ref<string | null>(null);
    const status = ref<ConnectionStatus>("disconnected");
    const endpoint_statuses = ref<HiveClientState["endpoints"]>([]);

    let client: HiveClient | null = null;
    let unsubscribe: (() => void) | null = null;

    // HealthChecker services (shallowRef to preserve class instances)
    const hc_services = shallowRef<Map<string, HealthCheckerService>>(new Map());

    /**
     * Initialize Hive client and connect to blockchain
     */
    onMounted(async () => {
      client = new HiveClient({
        endpoints: props.apiEndpoints,
        timeout: props.timeout,
        healthCheckInterval: props.healthCheckInterval,
        onEndpointChange: props.onEndpointChange,
      });

      // Subscribe to state changes
      unsubscribe = client.subscribe((state) => {
        chain.value = client?.chain ?? null;
        is_loading.value = state.status === "connecting" || state.status === "reconnecting";
        error.value = state.error;
        api_endpoint.value = state.currentEndpoint;
        status.value = state.status;
        endpoint_statuses.value = state.endpoints;
      });

      // Connect to blockchain
      try {
        await client.connect();
        chain.value = client.chain;
      } catch {
        // Errors are handled via subscribe callback
      }
    });

    // Initialize HealthChecker services when chain becomes available
    watch(chain, (new_chain) => {
      // Cleanup old services
      for (const service of hc_services.value.values()) {
        service.stopCheckingProcess();
      }
      hc_services.value = new Map();

      if (!new_chain) return;

      const configs: HealthCheckerServiceConfig[] =
        props.healthCheckerServices?.length
          ? props.healthCheckerServices
          : [
              {
                key: DEFAULT_HEALTHCHECKER_KEY,
                createCheckers: createDefaultCheckers,
                defaultProviders: DEFAULT_HEALTHCHECKER_PROVIDERS,
                nodeAddress: null,
                onNodeChange: (node, chain_ref) => {
                  if (node) {
                    chain_ref.endpointUrl = node;
                  }
                },
              },
            ];

      const new_services = new Map<string, HealthCheckerService>();

      for (const config of configs) {
        const checkers = config.createCheckers(new_chain);
        const service = new HealthCheckerService(
          config.key,
          checkers,
          config.defaultProviders,
          config.nodeAddress,
          (node) => config.onNodeChange(node, new_chain),
          config.enableLogs,
        );
        new_services.set(config.key, service);
      }

      hc_services.value = new_services;
    });

    /**
     * Cleanup on unmount
     */
    onUnmounted(() => {
      for (const service of hc_services.value.values()) {
        service.stopCheckingProcess();
      }
      hc_services.value = new Map();
      unsubscribe?.();
      client?.disconnect();
      client = null;
    });

    /**
     * Refresh all endpoints health status
     */
    const refresh_endpoints = async () => {
      if (client) {
        await client.refreshEndpoints();
      }
    };

    /**
     * Get a HealthCheckerService instance by key
     */
    const get_health_checker_service = (key: string): HealthCheckerService | null => {
      return hc_services.value.get(key) ?? null;
    };

    // Provide context to children
    provide(HIVE_INJECTION_KEY, {
      chain,
      isLoading: is_loading,
      error,
      apiEndpoint: api_endpoint,
      status,
      endpoints: endpoint_statuses,
      refreshEndpoints: refresh_endpoints,
      getHealthCheckerService: get_health_checker_service,
    });

    // Renderless component - just render default slot
    return () => slots.default?.();
  },
});

/**
 * Get full Hive context
 * Must be used within HiveProvider
 *
 * @returns HiveContextValue with all reactive refs
 * @throws Error if used outside HiveProvider
 *
 * @example
 * ```typescript
 * const { chain, isLoading, error, status } = useHive();
 *
 * watch(chain, (value) => {
 *   if (value) {
 *     console.log('Connected to Hive!');
 *   }
 * });
 * ```
 */
export function useHive(): HiveContextValue {
  const context = inject(HIVE_INJECTION_KEY);
  if (!context) {
    throw new Error("useHive must be used within HiveProvider");
  }
  return context;
}

/**
 * Get Hive chain instance
 * Convenience composable for accessing chain only
 *
 * @returns Ref<IHiveChainInterface | null>
 * @throws Error if used outside HiveProvider
 *
 * @example
 * ```typescript
 * const chain = useHiveChain();
 *
 * async function get_account(username: string) {
 *   if (!chain.value) return null;
 *   return await chain.value.getAccount(username);
 * }
 * ```
 */
export function useHiveChain(): Ref<IHiveChainInterface | null> {
  return useHive().chain;
}

/**
 * Get current API endpoint URL
 * Convenience composable for monitoring active endpoint
 *
 * @returns Ref<string | null>
 * @throws Error if used outside HiveProvider
 *
 * @example
 * ```typescript
 * const endpoint = useApiEndpoint();
 *
 * watch(endpoint, (url) => {
 *   console.log('Now using endpoint:', url);
 * });
 * ```
 */
export function useApiEndpoint(): Ref<string | null> {
  return useHive().apiEndpoint;
}

/**
 * Get connection status and endpoint health
 * Convenience composable for monitoring connection state
 *
 * @returns Object with status and endpoints refs
 * @throws Error if used outside HiveProvider
 *
 * @example
 * ```typescript
 * const { status, endpoints } = useHiveStatus();
 *
 * const healthy_count = computed(() =>
 *   endpoints.value.filter(ep => ep.healthy).length
 * );
 * ```
 */
export function useHiveStatus(): {
  status: Ref<ConnectionStatus>;
  endpoints: Ref<HiveClientState["endpoints"]>;
} {
  const ctx = useHive();
  return { status: ctx.status, endpoints: ctx.endpoints };
}

/**
 * Vue plugin for registering HiveProvider globally
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue';
 * import { hivePlugin } from '@barddev/honeycomb-vue';
 *
 * const app = createApp(App);
 * app.use(hivePlugin, {
 *   endpoints: ['https://api.hive.blog'],
 *   timeout: 10000
 * });
 * ```
 */
export const hivePlugin = {
  install(
    app: App,
    options?: {
      endpoints?: string[];
      timeout?: number;
      healthCheckInterval?: number;
    }
  ) {
    const ConfiguredProvider = defineComponent({
      name: "HiveProvider",
      setup(_, { slots, attrs }) {
        return () =>
          h(
            HiveProvider,
            {
              apiEndpoints: options?.endpoints,
              timeout: options?.timeout,
              healthCheckInterval: options?.healthCheckInterval,
              ...attrs,
            },
            slots
          );
      },
    });
    app.component("HiveProvider", ConfiguredProvider);
  },
};
