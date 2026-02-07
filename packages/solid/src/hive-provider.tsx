import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  onCleanup,
  createMemo,
  type ParentComponent,
  type JSX,
} from "solid-js";
import type { IHiveChainInterface } from "@hiveio/wax";
import {
  HiveClient,
  DEFAULT_API_ENDPOINTS,
  type HiveClientState,
  type ConnectionStatus,
  type EndpointStatus,
} from "@kkocot/honeycomb-core";

// Re-export for convenience
export { DEFAULT_API_ENDPOINTS };

// ============== Types ==============

/**
 * Hive context value - all values are signal getters
 */
export interface HiveContextValue {
  /** Hive chain instance getter - returns null during SSR and initial load */
  chain: () => IHiveChainInterface | null;
  /** Loading state getter - true while chain is initializing */
  isLoading: () => boolean;
  /** Error getter - error message if chain initialization failed */
  error: () => string | null;
  /** Client-side detection getter - check if running on client */
  isClient: () => boolean;
  /** API endpoint getter - currently connected API endpoint */
  apiEndpoint: () => string | null;
  /** Connection status getter */
  status: () => ConnectionStatus;
  /** Endpoints status getter - status of all endpoints */
  endpoints: () => EndpointStatus[];
  /** Refresh all endpoints health status */
  refreshEndpoints: () => Promise<void>;
}

/**
 * HiveProvider component props
 */
export interface HiveProviderProps {
  /**
   * List of API endpoints to try in priority order.
   * @default DEFAULT_API_ENDPOINTS
   */
  apiEndpoints?: string[];
  /**
   * Timeout for single request in milliseconds
   * @default 5000
   */
  timeout?: number;
  /**
   * Health check interval in milliseconds (0 = disabled)
   * @default 30000
   */
  healthCheckInterval?: number;
  /**
   * Callback fired when endpoint changes
   */
  onEndpointChange?: (endpoint: string) => void;
}

// ============== Context ==============

const HiveContext = createContext<HiveContextValue | null>(null);

// ============== Provider ==============

/**
 * HiveProvider Component
 *
 * Provides Hive blockchain connectivity using @kkocot/honeycomb-core.
 * Automatically manages endpoint fallback and health monitoring.
 * SSR-compatible - safely handles server-side rendering.
 *
 * @example
 * ```tsx
 * <HiveProvider>
 *   <App />
 * </HiveProvider>
 * ```
 */
export const HiveProvider: ParentComponent<HiveProviderProps> = (props) => {
  // Client-side detection
  const [is_client, set_is_client] = createSignal(false);

  // Client state from HiveClient
  const [client_state, set_client_state] = createSignal<HiveClientState>({
    status: "disconnected",
    currentEndpoint: null,
    endpoints: [],
    error: null,
  });

  // Store HiveClient instance reference
  let client_instance: HiveClient | null = null;

  // Detect client-side
  createEffect(() => {
    set_is_client(true);
  });

  // Function to refresh endpoints
  const refresh_endpoints = async () => {
    if (client_instance) {
      await client_instance.refreshEndpoints();
    }
  };

  // Initialize HiveClient when on client-side
  createEffect(() => {
    if (!is_client()) return;

    // Create HiveClient instance
    client_instance = new HiveClient({
      endpoints: props.apiEndpoints || DEFAULT_API_ENDPOINTS,
      timeout: props.timeout,
      healthCheckInterval: props.healthCheckInterval,
      onEndpointChange: props.onEndpointChange,
    });

    // Subscribe to state changes
    const unsubscribe = client_instance.subscribe((state) => {
      set_client_state(state);
    });

    // Connect to Hive blockchain
    client_instance.connect().catch(() => {
      // Errors are handled via state subscription
    });

    // Cleanup on unmount
    onCleanup(() => {
      unsubscribe();
      client_instance?.disconnect();
      client_instance = null;
    });
  });

  // Memoize context value with signal getters
  const value = createMemo<HiveContextValue>(() => ({
    chain: () => client_instance?.chain || null,
    isLoading: () => {
      const state = client_state();
      return state.status === "connecting" || state.status === "reconnecting";
    },
    error: () => client_state().error,
    isClient: () => is_client(),
    apiEndpoint: () => client_state().currentEndpoint,
    status: () => client_state().status,
    endpoints: () => client_state().endpoints,
    refreshEndpoints: refresh_endpoints,
  }));

  return <HiveContext.Provider value={value()}>{props.children}</HiveContext.Provider>;
};

// ============== Hooks ==============

/**
 * Hook to access full Hive context
 * @throws Error if used outside of HiveProvider
 * @returns HiveContextValue with signal getters
 */
export function useHive(): HiveContextValue {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHive must be used within a HiveProvider");
  }
  return context;
}

/**
 * Hook to access Hive chain instance
 * Returns signal getter that returns null during SSR and when not connected
 * @returns Signal getter for IHiveChainInterface | null
 */
export function useHiveChain(): () => IHiveChainInterface | null {
  const { chain } = useHive();
  return chain;
}

/**
 * Hook to get current API endpoint
 * @returns Signal getter for current endpoint URL or null
 */
export function useApiEndpoint(): () => string | null {
  const { apiEndpoint } = useHive();
  return apiEndpoint;
}

/**
 * Hook to get Hive connection status with endpoints info
 * @returns Signal getter for status object
 */
export function useHiveStatus(): () => {
  status: ConnectionStatus;
  endpoints: EndpointStatus[];
} {
  const { status, endpoints } = useHive();
  return createMemo(() => ({
    status: status(),
    endpoints: endpoints(),
  }));
}
