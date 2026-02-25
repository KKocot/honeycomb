import { type Snippet } from "svelte";
import type { IHiveChainInterface } from "@hiveio/wax";
import type { ConnectionStatus, EndpointStatus, HealthCheckerService } from "@kkocot/honeycomb-core";
import type { HealthCheckerServiceConfig } from "./HiveProvider.svelte";
export declare const HIVE_CONTEXT_KEY: unique symbol;
export interface HiveContextValue {
    readonly chain: IHiveChainInterface | null;
    readonly is_loading: boolean;
    readonly error: string | null;
    readonly is_client: boolean;
    readonly api_endpoint: string | null;
    readonly status: ConnectionStatus;
    readonly endpoints: EndpointStatus[];
    readonly refresh_endpoints: () => Promise<void>;
    readonly get_health_checker_service: (key: string) => HealthCheckerService | null;
}
export interface HiveProviderProps {
    apiEndpoints?: string[];
    timeout?: number;
    healthCheckInterval?: number;
    onEndpointChange?: (endpoint: string) => void;
    healthCheckerServices?: HealthCheckerServiceConfig[];
    children: Snippet;
}
export declare function useHive(): HiveContextValue;
export declare function useHiveChain(): {
    readonly chain: IHiveChainInterface | null;
};
export declare function useApiEndpoint(): {
    readonly url: string | null;
};
export declare function useHiveStatus(): {
    readonly status: ConnectionStatus;
    readonly endpoints: EndpointStatus[];
};
//# sourceMappingURL=context.svelte.d.ts.map