/**
 * Endpoint Manager
 * Sequential fallback and health monitoring for Hive API endpoints
 */

import type { IHiveChainInterface } from "@hiveio/wax";
import type { EndpointStatus, EndpointError, HiveClientConfig } from "./types.js";

/**
 * Configuration for endpoint manager
 */
interface EndpointManagerConfig {
  /** Request timeout in milliseconds */
  timeout: number;
  /** Health check interval in milliseconds (0 = disabled) */
  healthCheckInterval: number;
  /** Callback when endpoint changes */
  onEndpointChange?: (endpoint: string) => void;
  /** Callback when endpoint fails */
  onEndpointError?: (endpoint: string, error: Error) => void;
  /** Callback when all endpoints fail */
  onAllEndpointsFailed?: (errors: EndpointError[]) => void;
}

/**
 * Manages Hive API endpoints with sequential fallback and health monitoring
 */
export class EndpointManager {
  private endpoints: string[];
  private config: EndpointManagerConfig;
  private endpointStatuses: Map<string, EndpointStatus>;
  private healthCheckTimer: ReturnType<typeof setInterval> | null = null;

  /**
   * Create endpoint manager
   * @param endpoints - List of API endpoints
   * @param config - Manager configuration
   */
  constructor(endpoints: string[], config: EndpointManagerConfig) {
    this.endpoints = endpoints;
    this.config = config;
    this.endpointStatuses = new Map();

    // Initialize endpoint statuses
    for (const url of endpoints) {
      this.endpointStatuses.set(url, {
        url,
        healthy: true,
        lastCheck: null,
        lastError: null,
      });
    }
  }

  /**
   * Test single endpoint health
   * @param url - Endpoint URL to test
   * @returns True if endpoint is healthy
   */
  async testEndpoint(url: string): Promise<boolean> {
    const controller = new AbortController();
    const timeout_id = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "condenser_api.get_version",
          params: [],
          id: 1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout_id);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await response.json();

      // Update status
      const status = this.endpointStatuses.get(url);
      if (status) {
        status.healthy = true;
        status.lastCheck = Date.now();
        status.lastError = null;
      }

      return true;
    } catch (error) {
      // CRITICAL: Always clear timeout to prevent memory leak
      clearTimeout(timeout_id);

      const error_obj = error instanceof Error ? error : new Error(String(error));

      // Update status
      const status = this.endpointStatuses.get(url);
      if (status) {
        status.healthy = false;
        status.lastCheck = Date.now();
        status.lastError = error_obj.message;
      }

      // Trigger error callback
      if (this.config.onEndpointError) {
        this.config.onEndpointError(url, error_obj);
      }

      return false;
    } finally {
      // CRITICAL: Guarantee timeout cleanup even if error in catch block
      clearTimeout(timeout_id);
    }
  }

  /**
   * Find working endpoint using sequential fallback
   * Tries endpoints in order, returns first that responds
   * @returns Working endpoint URL or null if all failed
   */
  async findWorkingEndpoint(): Promise<string | null> {
    const errors: EndpointError[] = [];

    // Try endpoints sequentially (NOT in parallel)
    for (const url of this.endpoints) {
      const is_healthy = await this.testEndpoint(url);

      if (is_healthy) {
        return url;
      }

      // Collect error for callback
      const status = this.endpointStatuses.get(url);
      if (status && status.lastError) {
        errors.push({
          endpoint: url,
          error: new Error(status.lastError),
          timestamp: status.lastCheck || Date.now(),
        });
      }
    }

    // All endpoints failed
    if (this.config.onAllEndpointsFailed) {
      this.config.onAllEndpointsFailed(errors);
    }

    return null;
  }

  /**
   * Start periodic health check
   * @param chain - Hive chain instance
   * @param on_switch - Callback when switching to new endpoint
   */
  startHealthCheck(
    chain: IHiveChainInterface,
    on_switch: (new_endpoint: string) => void
  ): void {
    if (this.config.healthCheckInterval === 0) {
      return;
    }

    // Clear existing timer
    this.stopHealthCheck();

    this.healthCheckTimer = setInterval(async () => {
      const current_endpoint = chain.endpointUrl;

      // Test current endpoint
      const is_healthy = await this.testEndpoint(current_endpoint);

      if (!is_healthy) {
        // Current endpoint failed, find alternative
        const new_endpoint = await this.findWorkingEndpoint();

        if (new_endpoint && new_endpoint !== current_endpoint) {
          // Switch to new endpoint
          chain.endpointUrl = new_endpoint;

          if (this.config.onEndpointChange) {
            this.config.onEndpointChange(new_endpoint);
          }

          on_switch(new_endpoint);
        }
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * Stop health check
   */
  stopHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }

  /**
   * Get status of all endpoints
   * @returns Array of endpoint statuses
   */
  getEndpointsStatus(): EndpointStatus[] {
    return Array.from(this.endpointStatuses.values());
  }

  /**
   * Update endpoints list
   * @param endpoints - New endpoints list
   */
  setEndpoints(endpoints: string[]): void {
    this.endpoints = endpoints;

    // Update statuses map
    const new_statuses = new Map<string, EndpointStatus>();

    for (const url of endpoints) {
      // Preserve existing status if available
      const existing = this.endpointStatuses.get(url);
      new_statuses.set(url, existing || {
        url,
        healthy: true,
        lastCheck: null,
        lastError: null,
      });
    }

    this.endpointStatuses = new_statuses;
  }
}
