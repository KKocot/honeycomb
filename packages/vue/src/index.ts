/**
 * @kkocot/honeycomb-vue
 * Vue 3 composables for Hive Blockchain applications
 */

// Provider and composables
export {
  HiveProvider,
  useHive,
  useHiveChain,
  useApiEndpoint,
  useHiveStatus,
  hivePlugin,
  type HiveContextValue,
} from "./hive-provider.js";

// Components
export { ApiTracker, type ApiTrackerProps } from "./api-tracker.js";

// Re-export core types
export type {
  HiveClientConfig,
  ConnectionStatus,
  EndpointStatus,
  EndpointError,
  HiveClientState,
  StateListener,
} from "@kkocot/honeycomb-core";

// Re-export default endpoints
export { DEFAULT_API_ENDPOINTS } from "@kkocot/honeycomb-core";
