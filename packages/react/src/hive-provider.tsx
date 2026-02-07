"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type { IHiveChainInterface } from "@hiveio/wax";
import {
  HiveClient,
  DEFAULT_API_ENDPOINTS,
  type HiveClientState,
  type ConnectionStatus,
  type EndpointStatus,
} from "@kkocot/honeycomb-core";

// Re-export for backward compatibility
export { DEFAULT_API_ENDPOINTS };

// ============== Types ==============

export interface HiveContextValue {
  /** Hive chain instance - null during SSR and initial load */
  chain: IHiveChainInterface | null;
  /** True while chain is initializing */
  is_loading: boolean;
  /** Error message if chain initialization failed */
  error: string | null;
  /** Check if running on client */
  is_client: boolean;
  /** Currently connected API endpoint */
  api_endpoint: string | null;
  /** Connection status */
  status: ConnectionStatus;
  /** Status of all endpoints */
  endpoints: EndpointStatus[];
  /** Refresh all endpoints health status */
  refresh_endpoints: () => Promise<void>;
}

export interface HiveProviderProps {
  children: ReactNode;
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
 * Provides Hive blockchain connectivity for passive (read-only) operations.
 * Automatically manages endpoint fallback and health monitoring using HiveClient.
 * SSR-compatible - safely handles server-side rendering.
 *
 * @example
 * ```tsx
 * <HiveProvider>
 *   <App />
 * </HiveProvider>
 * ```
 */
export function HiveProvider({
  children,
  apiEndpoints = DEFAULT_API_ENDPOINTS,
  timeout = 5000,
  healthCheckInterval = 30000,
  onEndpointChange,
}: HiveProviderProps) {
  const [state, setState] = useState<HiveClientState>({
    status: 'disconnected',
    currentEndpoint: null,
    endpoints: [],
    error: null,
  });
  const [is_client, set_is_client] = useState(false);
  const [chain_instance, set_chain_instance] = useState<IHiveChainInterface | null>(null);
  const client_ref = useRef<HiveClient | null>(null);
  const on_endpoint_change_ref = useRef(onEndpointChange);

  // Update callback ref when prop changes
  useEffect(() => {
    on_endpoint_change_ref.current = onEndpointChange;
  }, [onEndpointChange]);

  // Detect client-side
  useEffect(() => {
    set_is_client(true);
  }, []);

  // Initialize HiveClient and connect (client-side only)
  useEffect(() => {
    if (!is_client) return;

    // Create client instance
    const client = new HiveClient({
      endpoints: apiEndpoints,
      timeout,
      healthCheckInterval,
      onEndpointChange: (endpoint) => {
        if (on_endpoint_change_ref.current) {
          on_endpoint_change_ref.current(endpoint);
        }
      },
    });

    client_ref.current = client;

    // Subscribe to state changes
    const unsubscribe = client.subscribe((new_state) => {
      setState(new_state);
      set_chain_instance(client.chain);
    });

    // Connect to Hive blockchain
    client.connect().catch(() => {
      // Error already in state.error - no console.error needed
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      client.disconnect();
      client_ref.current = null;
      set_chain_instance(null);
    };
  }, [is_client, apiEndpoints, timeout, healthCheckInterval]);

  // Refresh endpoints function
  const refresh_endpoints = async () => {
    if (client_ref.current) {
      await client_ref.current.refreshEndpoints();
    }
  };

  // Memoize context value
  const value = useMemo<HiveContextValue>(
    () => ({
      chain: chain_instance,
      is_loading: state.status === 'connecting' || state.status === 'reconnecting',
      error: state.error,
      is_client,
      api_endpoint: state.currentEndpoint,
      status: state.status,
      endpoints: state.endpoints,
      refresh_endpoints,
    }),
    [state, is_client, chain_instance]
  );

  return <HiveContext.Provider value={value}>{children}</HiveContext.Provider>;
}

// ============== Hooks ==============

/**
 * Hook to access full Hive context
 * @throws Error if used outside of HiveProvider
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
 * Returns null during SSR and when not connected
 */
export function useHiveChain(): IHiveChainInterface | null {
  const { chain } = useHive();
  return chain;
}

/**
 * Hook to get current API endpoint
 * Returns null when not connected
 */
export function useApiEndpoint(): string | null {
  const { api_endpoint } = useHive();
  return api_endpoint;
}

/**
 * Hook to get connection status and endpoint health
 * Returns status, error, and endpoints array
 */
export function useHiveStatus(): {
  status: ConnectionStatus;
  endpoints: EndpointStatus[];
} {
  const { status, endpoints } = useHive();
  return { status, endpoints };
}
