/**
 * Hive Client
 * Framework-agnostic client for Hive blockchain with automatic endpoint fallback
 */

import { createHiveChain, type IHiveChainInterface } from "@hiveio/wax";
import { EndpointManager } from "./endpoint-manager.js";
import type {
  HiveClientConfig,
  HiveClientState,
  ConnectionStatus,
  StateListener,
} from "./types.js";

/**
 * Default API endpoints (in priority order)
 */
export const DEFAULT_API_ENDPOINTS = [
  "https://api.hive.blog",
  "https://api.openhive.network",
  "https://api.syncad.com",
];

/**
 * Framework-agnostic Hive blockchain client
 * Provides automatic endpoint fallback and health monitoring
 */
export class HiveClient {
  private chain_instance: IHiveChainInterface | null = null;
  private endpoint_manager: EndpointManager;
  private state: HiveClientState;
  private listeners: Set<StateListener> = new Set();
  private config: Required<
    Pick<HiveClientConfig, "timeout" | "healthCheckInterval">
  > & Pick<HiveClientConfig, "onEndpointChange" | "onEndpointError" | "onAllEndpointsFailed">;

  /**
   * Create Hive client
   * @param config - Client configuration
   */
  constructor(config?: HiveClientConfig) {
    const endpoints = config?.endpoints || DEFAULT_API_ENDPOINTS;

    this.config = {
      timeout: config?.timeout ?? 5000,
      healthCheckInterval: config?.healthCheckInterval ?? 30000,
      onEndpointChange: config?.onEndpointChange,
      onEndpointError: config?.onEndpointError,
      onAllEndpointsFailed: config?.onAllEndpointsFailed,
    };

    this.endpoint_manager = new EndpointManager(endpoints, {
      timeout: this.config.timeout,
      healthCheckInterval: this.config.healthCheckInterval,
      onEndpointChange: (endpoint) => {
        this.update_state({
          currentEndpoint: endpoint,
          status: 'connected',
        });
        if (this.config.onEndpointChange) {
          this.config.onEndpointChange(endpoint);
        }
      },
      onEndpointError: this.config.onEndpointError,
      onAllEndpointsFailed: this.config.onAllEndpointsFailed,
    });

    this.state = {
      status: 'disconnected',
      currentEndpoint: null,
      endpoints: this.endpoint_manager.getEndpointsStatus(),
      error: null,
    };
  }

  /**
   * Initialize connection to Hive blockchain
   * Uses sequential fallback to find working endpoint
   */
  async connect(): Promise<void> {
    // Update status
    this.update_state({
      status: 'connecting',
      error: null,
    });

    try {
      // Find working endpoint (sequential fallback)
      const working_endpoint = await this.endpoint_manager.findWorkingEndpoint();

      if (!working_endpoint) {
        throw new Error("All API endpoints are unavailable");
      }

      // Create chain instance
      this.chain_instance = await createHiveChain({
        apiEndpoint: working_endpoint,
        apiTimeout: this.config.timeout,
      });

      // Update state
      this.update_state({
        status: 'connected',
        currentEndpoint: working_endpoint,
        endpoints: this.endpoint_manager.getEndpointsStatus(),
        error: null,
      });

      // Start health monitoring
      this.endpoint_manager.startHealthCheck(
        this.chain_instance,
        (new_endpoint) => {
          this.update_state({
            currentEndpoint: new_endpoint,
            endpoints: this.endpoint_manager.getEndpointsStatus(),
          });
        }
      );
    } catch (error) {
      const error_message = error instanceof Error ? error.message : "Failed to connect to Hive";

      this.update_state({
        status: 'error',
        error: error_message,
        endpoints: this.endpoint_manager.getEndpointsStatus(),
      });

      throw error;
    }
  }

  /**
   * Disconnect from Hive blockchain
   * Stops health monitoring and clears resources
   */
  disconnect(): void {
    this.endpoint_manager.stopHealthCheck();
    this.chain_instance = null;

    this.update_state({
      status: 'disconnected',
      currentEndpoint: null,
      error: null,
    });
  }

  /**
   * Get Hive chain instance
   * @returns Chain instance or null if not connected
   */
  get chain(): IHiveChainInterface | null {
    return this.chain_instance;
  }

  /**
   * Get current client state (returns deep copy to prevent mutations)
   */
  getState(): HiveClientState {
    return {
      ...this.state,
      // Deep copy endpoints array to prevent external mutations
      endpoints: this.state.endpoints.map(ep => ({ ...ep }))
    };
  }

  /**
   * Get current endpoint URL
   * @returns Current endpoint or null if not connected
   */
  get currentEndpoint(): string | null {
    return this.state.currentEndpoint;
  }

  /**
   * Subscribe to state changes
   * @param listener - Callback function
   * @returns Unsubscribe function
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Manually switch to specific endpoint
   * @param url - Endpoint URL
   */
  async switchEndpoint(url: string): Promise<void> {
    if (!this.chain_instance) {
      throw new Error("Client not connected. Call connect() first.");
    }

    this.update_state({
      status: 'reconnecting',
    });

    try {
      // Test endpoint first
      const is_healthy = await this.endpoint_manager.testEndpoint(url);

      if (!is_healthy) {
        throw new Error(`Endpoint ${url} is not healthy`);
      }

      // Switch endpoint
      this.chain_instance.endpointUrl = url;

      this.update_state({
        status: 'connected',
        currentEndpoint: url,
        endpoints: this.endpoint_manager.getEndpointsStatus(),
        error: null,
      });

      if (this.config.onEndpointChange) {
        this.config.onEndpointChange(url);
      }
    } catch (error) {
      const error_message = error instanceof Error ? error.message : "Failed to switch endpoint";

      this.update_state({
        status: 'error',
        error: error_message,
        endpoints: this.endpoint_manager.getEndpointsStatus(),
      });

      throw error;
    }
  }

  /**
   * Update state and notify listeners
   * @param partial_state - Partial state to merge
   */
  private update_state(partial_state: Partial<HiveClientState>): void {
    this.state = {
      ...this.state,
      ...partial_state,
    };

    // Notify all listeners
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }
}
