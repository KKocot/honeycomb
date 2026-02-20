import { createSignal, Show, For, type Component } from "solid-js";
import { Popover } from "@kobalte/core/popover";
import { useHive } from "./hive-provider";
import type { ConnectionStatus } from "@kkocot/honeycomb-core";

export interface ApiTrackerProps {
  class?: string;
  showUrl?: boolean;
  side?: "top" | "bottom";
}

const get_status_color = (s: ConnectionStatus): string => {
  switch (s) {
    case "connected":
      return "bg-hive-success";
    case "connecting":
    case "reconnecting":
      return "bg-hive-warning animate-pulse";
    case "error":
    case "disconnected":
      return "bg-hive-destructive";
    default:
      return "bg-hive-muted-foreground";
  }
};

const format_url = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

const format_time = (timestamp: number | null): string => {
  if (timestamp === null) return "Never";
  return new Date(timestamp).toLocaleTimeString();
};

export const ApiTracker: Component<ApiTrackerProps> = (props) => {
  const hive = useHive();
  const [is_refreshing, set_is_refreshing] = createSignal(false);

  const handle_open_change = async (open: boolean) => {
    if (open) {
      set_is_refreshing(true);
      try {
        await hive.refresh_endpoints();
      } finally {
        set_is_refreshing(false);
      }
    }
  };

  const handle_refresh = async () => {
    set_is_refreshing(true);
    try {
      await hive.refresh_endpoints();
    } finally {
      set_is_refreshing(false);
    }
  };

  const current_endpoint = () => {
    const endpoint = hive.api_endpoint();
    if (!endpoint) return null;
    return props.showUrl ? format_url(endpoint) : null;
  };

  const healthy_count = () =>
    hive.endpoints().filter((ep) => ep.healthy).length;

  return (
    <Popover
      placement={props.side === "top" ? "top" : "bottom"}
      onOpenChange={handle_open_change}
    >
      <Popover.Trigger
        class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hive-border bg-hive-card cursor-pointer hover:bg-hive-muted/50 transition-colors ${props.class || ""}`}
        data-testid="hive-connect-button"
      >
        <div
          classList={{
            "w-2.5 h-2.5 rounded-full": true,
            [get_status_color(hive.status())]: true,
          }}
        />

        <span class="text-sm text-hive-foreground capitalize" data-testid="hive-connection-status">{hive.status()}</span>

        <Show when={current_endpoint()}>
          <span class="text-xs text-hive-muted-foreground font-mono truncate max-w-[200px]" data-testid="hive-api-endpoint">
            {current_endpoint()}
          </span>
        </Show>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content class="z-50 w-80 rounded-md border bg-hive-popover p-4 text-hive-popover-foreground shadow-md outline-none data-[expanded]:animate-in data-[expanded]:fade-in-0 data-[expanded]:zoom-in-95">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-sm font-semibold">API Endpoints</h3>
              <p class="text-xs text-hive-muted-foreground">
                {healthy_count()}/{hive.endpoints().length} healthy
              </p>
            </div>
            <button
              type="button"
              onClick={handle_refresh}
              disabled={is_refreshing()}
              class="text-xs text-hive-muted-foreground hover:text-hive-foreground disabled:opacity-50 cursor-pointer"
            >
              <Show when={is_refreshing()} fallback="Refresh">
                Checking...
              </Show>
            </button>
          </div>

          <div class="space-y-0" data-testid="hive-endpoint-list">
            <For each={hive.endpoints()}>
              {(endpoint) => (
                <div class="flex items-start justify-between gap-2 py-2 border-b border-hive-border last:border-0" data-testid="hive-endpoint-item">
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <div
                      classList={{
                        "w-2 h-2 rounded-full mt-1": true,
                        "bg-hive-success": endpoint.healthy,
                        "bg-hive-destructive": !endpoint.healthy,
                      }}
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-mono truncate" data-testid="hive-endpoint-url">
                        {format_url(endpoint.url)}
                      </div>
                      <p class="text-xs text-hive-muted-foreground mt-0.5">
                        Last check: {format_time(endpoint.lastCheck)}
                      </p>
                      <Show when={endpoint.lastError}>
                        <p class="text-xs text-hive-destructive mt-0.5 truncate">
                          {endpoint.lastError}
                        </p>
                      </Show>
                    </div>
                  </div>
                  <span
                    classList={{
                      "text-xs px-2 py-0.5 rounded shrink-0": true,
                      "bg-hive-success/10 text-hive-success": endpoint.healthy,
                      "bg-hive-destructive/10 text-hive-destructive": !endpoint.healthy,
                    }}
                    data-testid="hive-endpoint-status"
                  >
                    {endpoint.healthy ? "Healthy" : "Unhealthy"}
                  </span>
                </div>
              )}
            </For>
            <Show when={hive.endpoints().length === 0}>
              <p class="text-xs text-hive-muted-foreground text-center py-4">
                No endpoints configured
              </p>
            </Show>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};
