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
      return "bg-green-500";
    case "connecting":
    case "reconnecting":
      return "bg-yellow-500 animate-pulse";
    case "error":
    case "disconnected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
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
        await hive.refreshEndpoints();
      } finally {
        set_is_refreshing(false);
      }
    }
  };

  const handle_refresh = async () => {
    set_is_refreshing(true);
    try {
      await hive.refreshEndpoints();
    } finally {
      set_is_refreshing(false);
    }
  };

  const current_endpoint = () => {
    const endpoint = hive.apiEndpoint();
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
        class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors ${props.class || ""}`}
      >
        <div
          classList={{
            "w-2.5 h-2.5 rounded-full": true,
            [get_status_color(hive.status())]: true,
          }}
        />

        <span class="text-sm text-foreground capitalize">{hive.status()}</span>

        <Show when={current_endpoint()}>
          <span class="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
            {current_endpoint()}
          </span>
        </Show>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content class="z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[expanded]:animate-in data-[expanded]:fade-in-0 data-[expanded]:zoom-in-95">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-sm font-semibold">API Endpoints</h3>
              <p class="text-xs text-muted-foreground">
                {healthy_count()}/{hive.endpoints().length} healthy
              </p>
            </div>
            <button
              type="button"
              onClick={handle_refresh}
              disabled={is_refreshing()}
              class="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 cursor-pointer"
            >
              <Show when={is_refreshing()} fallback="Refresh">
                Checking...
              </Show>
            </button>
          </div>

          <div class="space-y-0">
            <For each={hive.endpoints()}>
              {(endpoint) => (
                <div class="flex items-start justify-between gap-2 py-2 border-b border-border last:border-0">
                  <div class="flex items-start gap-2 flex-1 min-w-0">
                    <div
                      classList={{
                        "w-2 h-2 rounded-full mt-1": true,
                        "bg-green-500": endpoint.healthy,
                        "bg-red-500": !endpoint.healthy,
                      }}
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-mono truncate">
                        {format_url(endpoint.url)}
                      </div>
                      <p class="text-xs text-muted-foreground mt-0.5">
                        Last check: {format_time(endpoint.lastCheck)}
                      </p>
                      <Show when={endpoint.lastError}>
                        <p class="text-xs text-red-500 mt-0.5 truncate">
                          {endpoint.lastError}
                        </p>
                      </Show>
                    </div>
                  </div>
                  <span
                    classList={{
                      "text-xs px-2 py-0.5 rounded shrink-0": true,
                      "bg-green-500/10 text-green-500": endpoint.healthy,
                      "bg-red-500/10 text-red-500": !endpoint.healthy,
                    }}
                  >
                    {endpoint.healthy ? "Healthy" : "Unhealthy"}
                  </span>
                </div>
              )}
            </For>
            <Show when={hive.endpoints().length === 0}>
              <p class="text-xs text-muted-foreground text-center py-4">
                No endpoints configured
              </p>
            </Show>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};
