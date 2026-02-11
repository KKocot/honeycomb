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

// Utils
export {
  format_reputation,
  fetch_bridge_reputation,
  format_nai_asset,
  convert_vests_to_hp,
  calculate_manabar,
  format_mana_number,
  format_cooldown,
  MANA_REGENERATION_SECONDS,
  type NaiAsset,
  type ManabarData,
} from "./utils.js";
