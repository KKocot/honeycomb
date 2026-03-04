import { defineComponent, h, type PropType } from "vue";
import { cn } from "./utils.js";
import { icon_loader_circle, icon_trash2, icon_circle_check, icon_octagon_alert, icon_triangle_alert, icon_clock, icon_gauge } from "./healthchecker-icons.js";

export interface ProviderCardProps {
  providerLink: string;
  disabled: boolean;
  isSelected: boolean;
  isTop: boolean;
  checkerNamesList: string[];
  latency: number | null;
  score: number;
  index: number;
  failedErrorChecks: string[];
  failedValidationChecks: string[];
  isHealthCheckerActive: boolean;
  isProviderValid: boolean;
}

export const ProviderCard = defineComponent({
  name: "ProviderCard",
  props: {
    providerLink: { type: String, required: true },
    disabled: { type: Boolean, required: true },
    isSelected: { type: Boolean, required: true },
    isTop: { type: Boolean, required: true },
    checkerNamesList: { type: Array as PropType<string[]>, required: true },
    latency: { type: Number as PropType<number | null>, default: null },
    score: { type: Number, required: true },
    index: { type: Number, required: true },
    failedErrorChecks: { type: Array as PropType<string[]>, required: true },
    failedValidationChecks: { type: Array as PropType<string[]>, required: true },
    isHealthCheckerActive: { type: Boolean, required: true },
    isProviderValid: { type: Boolean, required: true },
  },
  emits: ["switchToProvider", "deleteProvider", "selectValidator"],
  setup(props, { emit }) {
    const handle_badge_click = (checker_name: string) => {
      if (
        props.failedErrorChecks.includes(checker_name) ||
        props.failedValidationChecks.includes(checker_name)
      ) {
        emit("selectValidator", props.providerLink, checker_name);
      }
    };

    return () => {
      if (props.isTop && props.index === 1) return null;

      // Rank Badge
      const rank_badge = h(
        "div",
        {
          class: cn(
            "shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
            props.isSelected
              ? "bg-hive-red text-white"
              : props.isTop
                ? "bg-green-500 text-white"
                : "bg-hive-muted text-hive-muted-foreground"
          ),
        },
        props.index
      );

      // Provider URL
      const provider_url = h("div", { class: "min-w-0 flex-1" }, [
        h("div", { class: "flex items-center gap-2" }, [
          h(
            "p",
            {
              class: cn("font-medium truncate text-sm", props.disabled && "text-red-500"),
              "data-testid": "hc-api-name",
              title: props.providerLink,
            },
            props.providerLink
          ),
          props.isProviderValid && props.isHealthCheckerActive
            ? icon_circle_check("shrink-0 w-4 h-4 text-green-500")
            : null,
          props.isSelected
            ? h(
                "span",
                { class: "shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-hive-red/10 text-hive-red" },
                "Active"
              )
            : null,
        ]),
        props.disabled
          ? h("p", { class: "text-xs text-red-500 mt-1" }, "Connection failed - CORS or network error")
          : null,
      ]);

      // Delete Button
      const delete_button = !props.isSelected
        ? h(
            "button",
            {
              class: cn(
                "shrink-0 p-1.5 rounded-md transition-colors cursor-pointer",
                "text-hive-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              ),
              onClick: () => emit("deleteProvider", props.providerLink),
              title: "Remove provider",
            },
            [icon_trash2("w-4 h-4")]
          )
        : null;

      // Header Row
      const header_row = h("div", { class: "flex items-start justify-between gap-4" }, [
        h("div", { class: "flex items-center gap-3 min-w-0 flex-1" }, [rank_badge, provider_url]),
        delete_button,
      ]);

      // Checks Badges
      const checks_badges =
        !props.disabled && props.checkerNamesList.length > 0
          ? h(
              "div",
              { class: "flex flex-wrap items-center gap-1.5 mt-3" },
              props.checkerNamesList.map((checker_name) => {
                const is_error = props.failedErrorChecks.includes(checker_name);
                const is_warning = props.failedValidationChecks.includes(checker_name);
                const is_clickable = is_error || is_warning;

                return h(
                  "span",
                  {
                    key: checker_name,
                    class: cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
                      is_error
                        ? "bg-red-500/10 text-red-600 border border-red-500/30 cursor-pointer hover:bg-red-500/20"
                        : is_warning
                          ? "bg-orange-500/10 text-orange-600 border border-orange-500/30 cursor-pointer hover:bg-orange-500/20"
                          : "bg-green-500/10 text-green-600 border border-green-500/30"
                    ),
                    onClick: () => is_clickable && handle_badge_click(checker_name),
                    "data-testid": "hc-validator-badge",
                  },
                  [
                    checker_name,
                    is_error ? icon_octagon_alert("w-3 h-3") : null,
                    is_warning ? icon_triangle_alert("w-3 h-3") : null,
                    !is_error && !is_warning ? icon_circle_check("w-3 h-3") : null,
                  ]
                );
              })
            )
          : null;

      // Stats
      let stats_content = null;
      if (props.isHealthCheckerActive) {
        if (props.score === -1) {
          stats_content = h("div", { class: "flex items-center gap-2 text-sm text-hive-muted-foreground" }, [
            icon_loader_circle("h-4 w-4 animate-spin"),
            h("span", {}, "Checking..."),
          ]);
        } else if (props.score !== 0) {
          stats_content = h("div", { class: "flex items-center gap-4" }, [
            h("div", { class: "flex items-center gap-1.5 text-sm" }, [
              icon_clock("w-4 h-4 text-hive-muted-foreground"),
              h("span", { class: "text-hive-muted-foreground" }, "Latency:"),
              h("span", { class: "font-medium" }, `${props.latency}ms`),
            ]),
            h("div", { class: "flex items-center gap-1.5 text-sm" }, [
              icon_gauge("w-4 h-4 text-hive-muted-foreground"),
              h("span", { class: "text-hive-muted-foreground" }, "Score:"),
              h(
                "span",
                {
                  class: cn(
                    "font-medium",
                    props.score > 0.8
                      ? "text-green-500"
                      : props.score > 0.5
                        ? "text-orange-500"
                        : "text-red-500"
                  ),
                },
                props.score.toFixed(3)
              ),
            ]),
          ]);
        } else {
          stats_content = h("span", { class: "text-sm font-medium text-red-400" }, "Unavailable");
        }
      }

      // Action Button
      const action_button = h(
        "div",
        { class: "shrink-0 sm:ml-auto", "data-testid": props.isSelected ? "hc-selected" : undefined },
        [
          !props.isSelected
            ? h(
                "button",
                {
                  class: cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
                    "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  ),
                  onClick: () => emit("switchToProvider", props.providerLink),
                  "data-testid": "hc-set-api-button",
                },
                "Use this provider"
              )
            : h("span", { class: "inline-flex items-center gap-1.5 text-sm font-medium text-green-500" }, [
                icon_circle_check("w-4 h-4"),
                "Currently active",
              ]),
        ]
      );

      // Stats and Action Row
      const stats_row = h(
        "div",
        { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-hive-border" },
        [
          stats_content ? h("div", { class: "flex items-center gap-4" }, [stats_content]) : null,
          action_button,
        ]
      );

      return h(
        "div",
        {
          class: cn(
            "relative rounded-lg border bg-hive-card p-4 transition-all",
            props.isSelected
              ? "border-hive-red ring-2 ring-hive-red/20"
              : "border-hive-border hover:border-hive-red/50",
            props.disabled && "opacity-60",
            props.isTop && "ring-2 ring-green-500/30 border-green-500"
          ),
        },
        [header_row, checks_badges, stats_row]
      );
    };
  },
});
