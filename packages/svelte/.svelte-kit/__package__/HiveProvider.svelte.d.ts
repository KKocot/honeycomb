import type { IHiveChainInterface } from "@hiveio/wax";
import type { Snippet } from "svelte";
import { type ApiChecker } from "@kkocot/honeycomb-core";
export interface HealthCheckerServiceConfig {
    key: string;
    createCheckers: (chain: IHiveChainInterface) => ApiChecker[];
    defaultProviders: string[];
    nodeAddress: string | null;
    onNodeChange: (node: string | null, chain: IHiveChainInterface) => void;
    enableLogs?: boolean;
}
interface Props {
    apiEndpoints?: string[];
    timeout?: number;
    healthCheckInterval?: number;
    onEndpointChange?: (endpoint: string) => void;
    healthCheckerServices?: HealthCheckerServiceConfig[];
    children: Snippet;
}
declare const HiveProvider: import("svelte").Component<Props, {}, "">;
type HiveProvider = ReturnType<typeof HiveProvider>;
export default HiveProvider;
//# sourceMappingURL=HiveProvider.svelte.d.ts.map