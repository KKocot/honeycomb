import {
  defineComponent,
  ref,
  h,
  type PropType,
} from "vue";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from "radix-vue";
import { useHive } from "./hive-provider.js";
import type { EndpointStatus } from "@kkocot/honeycomb-core";

export interface ApiTrackerProps {
  showUrl?: boolean;
  side?: "top" | "bottom";
}

function get_status_color(s: string): string {
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
}

function format_url(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function format_time(timestamp: number | null): string {
  if (timestamp === null) return "Never";
  return new Date(timestamp).toLocaleTimeString();
}

export const ApiTracker = defineComponent({
  name: "ApiTracker",
  props: {
    showUrl: {
      type: Boolean,
      default: false,
    },
    side: {
      type: String as PropType<"top" | "bottom">,
      default: "bottom",
    },
  },
  setup(props) {
    const ctx = useHive();
    const is_refreshing = ref(false);

    const handle_refresh = async () => {
      is_refreshing.value = true;
      try {
        await ctx.refreshEndpoints();
      } finally {
        is_refreshing.value = false;
      }
    };

    const handle_open_change = async (open: boolean) => {
      if (open) {
        is_refreshing.value = true;
        try {
          await ctx.refreshEndpoints();
        } finally {
          is_refreshing.value = false;
        }
      }
    };

    return () => {
      const status_dot = h("div", {
        class: `w-2.5 h-2.5 rounded-full ${get_status_color(ctx.status.value)}`,
      });

      const status_text = h(
        "span",
        { class: "text-sm text-foreground capitalize" },
        ctx.status.value
      );

      const endpoint_url =
        props.showUrl && ctx.apiEndpoint.value
          ? h(
              "span",
              { class: "text-xs text-muted-foreground font-mono truncate max-w-[200px]" },
              format_url(ctx.apiEndpoint.value)
            )
          : null;

      const healthy_count = ctx.endpoints.value.filter(
        (ep: EndpointStatus) => ep.healthy
      ).length;

      const trigger_content = h(
        "div",
        { class: "inline-flex items-center gap-2" },
        [status_dot, status_text, endpoint_url]
      );

      const tooltip_content = h("div", {}, [
        h(
          "div",
          { class: "flex items-center justify-between mb-3" },
          [
            h("div", {}, [
              h("h3", { class: "text-sm font-semibold" }, "API Endpoints"),
              h(
                "p",
                { class: "text-xs text-muted-foreground" },
                `${healthy_count}/${ctx.endpoints.value.length} healthy`
              ),
            ]),
            h(
              "button",
              {
                type: "button",
                onClick: handle_refresh,
                disabled: is_refreshing.value,
                class:
                  "text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 cursor-pointer",
              },
              is_refreshing.value ? "Checking..." : "Refresh"
            ),
          ]
        ),

        h(
          "div",
          { class: "space-y-0" },
          ctx.endpoints.value.length === 0
            ? [
                h(
                  "p",
                  {
                    class: "text-xs text-muted-foreground text-center py-4",
                  },
                  "No endpoints configured"
                ),
              ]
            : ctx.endpoints.value.map((endpoint: EndpointStatus) =>
                h(
                  "div",
                  {
                    class:
                      "flex items-start justify-between gap-2 py-2 border-b border-border last:border-0",
                  },
                  [
                    h(
                      "div",
                      { class: "flex items-start gap-2 flex-1 min-w-0" },
                      [
                        h("div", {
                          class: `w-2 h-2 rounded-full mt-1 ${endpoint.healthy ? "bg-green-500" : "bg-red-500"}`,
                        }),
                        h("div", { class: "flex-1 min-w-0" }, [
                          h(
                            "div",
                            { class: "text-xs font-mono truncate" },
                            format_url(endpoint.url)
                          ),
                          h(
                            "p",
                            { class: "text-xs text-muted-foreground mt-0.5" },
                            `Last check: ${format_time(endpoint.lastCheck)}`
                          ),
                          endpoint.lastError
                            ? h(
                                "p",
                                { class: "text-xs text-red-500 mt-0.5 truncate" },
                                endpoint.lastError
                              )
                            : null,
                        ]),
                      ]
                    ),

                    h(
                      "span",
                      {
                        class: `text-xs px-2 py-0.5 rounded shrink-0 ${
                          endpoint.healthy
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`,
                      },
                      endpoint.healthy ? "Healthy" : "Unhealthy"
                    ),
                  ]
                )
              )
        ),
      ]);

      return h(
        PopoverRoot,
        {
          onUpdateOpen: handle_open_change,
        },
        {
          default: () => [
            h(
              PopoverTrigger,
              {
                asChild: false,
                class:
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors",
              },
              { default: () => trigger_content }
            ),
            h(PopoverPortal, {}, {
              default: () =>
                h(
                  PopoverContent,
                  {
                    side: props.side,
                    sideOffset: 8,
                    align: "start",
                    class:
                      "z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                  },
                  { default: () => tooltip_content }
                ),
            }),
          ],
        }
      );
    };
  },
});
