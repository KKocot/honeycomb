import type { IHiveChainInterface } from "@hiveio/wax";
import type { ApiChecker } from "./healthchecker-service.js";
import { DEFAULT_API_ENDPOINTS } from "./hive-client.js";

/**
 * Default key used for the auto-created HealthCheckerService
 * when HiveProvider receives no explicit healthCheckerServices prop.
 */
export const DEFAULT_HEALTHCHECKER_KEY = "default";

/**
 * Default providers for the auto-created HealthCheckerService.
 */
export const DEFAULT_HEALTHCHECKER_PROVIDERS: string[] = DEFAULT_API_ENDPOINTS;

/**
 * Creates a set of basic API checkers that work on any standard Hive node.
 * Used as default when no custom checkers are configured.
 */
export function createDefaultCheckers(
  chain: IHiveChainInterface
): ApiChecker[] {
  return [
    {
      title: "Database - Find accounts",
      method: chain.api.database_api.find_accounts,
      params: { accounts: ["hiveio"], delayed_votes_active: false },
      validatorFunction: (data: any) =>
        data?.accounts?.[0]?.name === "hiveio"
          ? true
          : "Find accounts error",
    },
    {
      title: "Database - Dynamic global properties",
      method: chain.api.database_api.get_dynamic_global_properties,
      params: {},
      validatorFunction: (data: any) =>
        !!data?.head_block_number
          ? true
          : "Dynamic global properties error",
    },
  ];
}
