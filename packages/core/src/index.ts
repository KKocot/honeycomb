/**
 * @kkocot/honeycomb-core
 * Framework-agnostic core for Hive Blockchain connectivity with endpoint fallback
 */

// Main client
export { HiveClient, DEFAULT_API_ENDPOINTS } from "./hive-client.js";

// Endpoint management
export { EndpointManager } from "./endpoint-manager.js";

// Types
export type {
  HiveClientConfig,
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
  HiveClientState,
  StateListener,
} from "./types.js";
