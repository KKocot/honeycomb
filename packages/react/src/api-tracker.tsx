"use client";

import { useState, useCallback } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useHive } from "./hive-provider";
import { cn } from "./utils";
import type { ConnectionStatus } from "@kkocot/honeycomb-core";

export interface ApiTrackerProps {
  className?: string;
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

export function ApiTracker({
  className,
  showUrl = false,
  side = "bottom",
}: ApiTrackerProps) {
  const { status, endpoints, api_endpoint, refresh_endpoints } = useHive();
  const [is_refreshing, set_is_refreshing] = useState(false);

  const handle_open_change = useCallback(
    async (open: boolean) => {
      if (open) {
        set_is_refreshing(true);
        try {
          await refresh_endpoints();
        } catch {
          // Error handled by HiveClient state
        } finally {
          set_is_refreshing(false);
        }
      }
    },
    [refresh_endpoints]
  );

  const handle_refresh = useCallback(async () => {
    set_is_refreshing(true);
    try {
      await refresh_endpoints();
    } catch {
      // Error handled by HiveClient state
    } finally {
      set_is_refreshing(false);
    }
  }, [refresh_endpoints]);

  const healthy_count = endpoints.filter((ep) => ep.healthy).length;

  return (
    <Popover.Root onOpenChange={handle_open_change}>
      <Popover.Trigger
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors",
          className
        )}
        type="button"
      >
        <span className={cn("w-2.5 h-2.5 rounded-full", get_status_color(status))} />
        <span className="text-sm text-foreground capitalize">{status}</span>
        {showUrl && api_endpoint && (
          <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
            {format_url(api_endpoint)}
          </span>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side={side}
          sideOffset={8}
          align="start"
          className={cn(
            "z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">API Endpoints</h3>
              <p className="text-xs text-muted-foreground">
                {healthy_count}/{endpoints.length} healthy
              </p>
            </div>
            <button
              onClick={handle_refresh}
              disabled={is_refreshing}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
              type="button"
            >
              {is_refreshing ? "Checking..." : "Refresh"}
            </button>
          </div>

          <div className="space-y-0">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.url}
                className="flex items-start justify-between gap-2 py-2 border-b border-border last:border-0"
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full mt-1",
                      endpoint.healthy ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono truncate">
                      {format_url(endpoint.url)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last check: {format_time(endpoint.lastCheck)}
                    </p>
                    {endpoint.lastError && (
                      <p className="text-xs text-red-500 mt-0.5 truncate">
                        {endpoint.lastError}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded shrink-0",
                    endpoint.healthy
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {endpoint.healthy ? "Healthy" : "Unhealthy"}
                </span>
              </div>
            ))}
          </div>

          {endpoints.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No endpoints configured
            </p>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
