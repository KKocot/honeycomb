import { getContext, type Snippet } from "svelte";
import type { IHiveChainInterface } from "@hiveio/wax";
import type {
  ConnectionStatus,
  EndpointStatus,
  HealthCheckerService,
} from "@kkocot/honeycomb-core";
import type { HealthCheckerServiceConfig } from "./HiveProvider.svelte";

export const HIVE_CONTEXT_KEY = Symbol("hive");

export interface HiveContextValue {
  readonly chain: IHiveChainInterface | null;
  readonly is_loading: boolean;
  readonly error: string | null;
  readonly is_client: boolean;
  readonly api_endpoint: string | null;
  readonly status: ConnectionStatus;
  readonly endpoints: EndpointStatus[];
  readonly refresh_endpoints: () => Promise<void>;
  readonly get_health_checker_service: (
    key: string
  ) => HealthCheckerService | null;
}

export interface HiveProviderProps {
  apiEndpoints?: string[];
  timeout?: number;
  healthCheckInterval?: number;
  onEndpointChange?: (endpoint: string) => void;
  healthCheckerServices?: HealthCheckerServiceConfig[];
  children: Snippet;
}

export function useHive(): HiveContextValue {
  const ctx = getContext<HiveContextValue | undefined>(HIVE_CONTEXT_KEY);
  if (!ctx) {
    throw new Error("useHive must be used within a HiveProvider");
  }
  return ctx;
}

export function useHiveChain(): { readonly chain: IHiveChainInterface | null } {
  const ctx = useHive();
  return {
    get chain() {
      return ctx.chain;
    },
  };
}

export function useApiEndpoint(): { readonly url: string | null } {
  const ctx = useHive();
  return {
    get url() {
      return ctx.api_endpoint;
    },
  };
}

export function useHiveStatus(): {
  readonly status: ConnectionStatus;
  readonly endpoints: EndpointStatus[];
} {
  const ctx = useHive();
  return {
    get status() {
      return ctx.status;
    },
    get endpoints() {
      return ctx.endpoints;
    },
  };
}
