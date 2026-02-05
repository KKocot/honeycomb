/**
 * Common types for Hive Core
 * Framework-agnostic type definitions for Hive blockchain connectivity
 */

/**
 * Configuration for Hive client
 */
export interface HiveClientConfig {
  /**
   * List of endpoints in priority order. First = preferred.
   * @default DEFAULT_API_ENDPOINTS
   */
  endpoints?: string[];

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

  /**
   * Callback fired when endpoint fails
   */
  onEndpointError?: (endpoint: string, error: Error) => void;

  /**
   * Callback fired when all endpoints fail
   */
  onAllEndpointsFailed?: (errors: EndpointError[]) => void;
}

/**
 * Connection status states
 */
export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

/**
 * Status of a single endpoint
 */
export interface EndpointStatus {
  /** Endpoint URL */
  url: string;
  /** Is endpoint healthy */
  healthy: boolean;
  /** Timestamp of last health check (null if never checked) */
  lastCheck: number | null;
  /** Last error message (null if no error) */
  lastError: string | null;
}

/**
 * Endpoint error details
 */
export interface EndpointError {
  /** Endpoint URL that failed */
  endpoint: string;
  /** Error that occurred */
  error: Error;
  /** Timestamp when error occurred */
  timestamp: number;
}

/**
 * Hive client state - framework-agnostic, for subscriptions
 */
export interface HiveClientState {
  /** Current connection status */
  status: ConnectionStatus;
  /** Currently connected endpoint (null if not connected) */
  currentEndpoint: string | null;
  /** Status of all endpoints */
  endpoints: EndpointStatus[];
  /** Current error message (null if no error) */
  error: string | null;
}

/**
 * Listener function for state changes
 */
export type StateListener = (state: HiveClientState) => void;
