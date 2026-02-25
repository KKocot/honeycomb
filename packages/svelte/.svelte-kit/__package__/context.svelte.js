import { getContext } from "svelte";
export const HIVE_CONTEXT_KEY = Symbol("hive");
export function useHive() {
    const ctx = getContext(HIVE_CONTEXT_KEY);
    if (!ctx) {
        throw new Error("useHive must be used within a HiveProvider");
    }
    return ctx;
}
export function useHiveChain() {
    const ctx = useHive();
    return {
        get chain() {
            return ctx.chain;
        },
    };
}
export function useApiEndpoint() {
    const ctx = useHive();
    return {
        get url() {
            return ctx.api_endpoint;
        },
    };
}
export function useHiveStatus() {
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
