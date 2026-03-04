import { Show, For, type Component } from "solid-js";
import { cn } from "./utils";
import {
  IconLoaderCircle,
  IconTrash2,
  IconCircleCheck,
  IconOctagonAlert,
  IconTriangleAlert,
  IconClock,
  IconGauge,
} from "./healthchecker-icons";

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
  switchToProvider: (providerLink: string | null) => void;
  deleteProvider: (provider: string) => void;
  selectValidator: (providerName: string, checkTitle: string) => void;
}

export const ProviderCard: Component<ProviderCardProps> = (props) => {
  const handleBadgeClick = (checkerName: string) => {
    if (
      props.failedErrorChecks.includes(checkerName) ||
      props.failedValidationChecks.includes(checkerName)
    ) {
      props.selectValidator(props.providerLink, checkerName);
    }
  };

  return (
    <Show when={!(props.isTop && props.index === 1)}>
      <div
        class={cn(
          "relative rounded-lg border bg-hive-card p-4 transition-all",
          props.isSelected
            ? "border-hive-red ring-2 ring-hive-red/20"
            : "border-hive-border hover:border-hive-red/50",
          props.disabled && "opacity-60",
          props.isTop && "ring-2 ring-green-500/30 border-green-500"
        )}
      >
        {/* Header Row */}
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            {/* Rank Badge */}
            <div
              class={cn(
                "shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                props.isSelected
                  ? "bg-hive-red text-white"
                  : props.isTop
                    ? "bg-green-500 text-white"
                    : "bg-hive-muted text-hive-muted-foreground"
              )}
            >
              {props.index}
            </div>

            {/* Provider URL */}
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p
                  class={cn(
                    "font-medium truncate text-sm",
                    props.disabled && "text-red-500"
                  )}
                  data-testid="hc-api-name"
                  title={props.providerLink}
                >
                  {props.providerLink}
                </p>
                <Show when={props.isProviderValid && props.isHealthCheckerActive}>
                  <IconCircleCheck class="shrink-0 w-4 h-4 text-green-500" />
                </Show>
                <Show when={props.isSelected}>
                  <span class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-hive-red/10 text-hive-red">
                    Active
                  </span>
                </Show>
              </div>

              <Show when={props.disabled}>
                <p class="text-xs text-red-500 mt-1">
                  Connection failed - CORS or network error
                </p>
              </Show>
            </div>
          </div>

          {/* Delete Button */}
          <Show when={!props.isSelected}>
            <button
              class={cn(
                "shrink-0 p-1.5 rounded-md transition-colors cursor-pointer",
                "text-hive-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              )}
              onClick={() => props.deleteProvider(props.providerLink)}
              title="Remove provider"
            >
              <IconTrash2 class="w-4 h-4" />
            </button>
          </Show>
        </div>

        {/* Checks Badges */}
        <Show when={!props.disabled && props.checkerNamesList.length > 0}>
          <div class="flex flex-wrap items-center gap-1.5 mt-3">
            <For each={props.checkerNamesList}>
              {(checkerName) => {
                const isError = () => props.failedErrorChecks.includes(checkerName);
                const isWarning = () => props.failedValidationChecks.includes(checkerName);
                const isClickable = () => isError() || isWarning();

                return (
                  <span
                    class={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
                      isError()
                        ? "bg-red-500/10 text-red-600 border border-red-500/30 cursor-pointer hover:bg-red-500/20"
                        : isWarning()
                          ? "bg-orange-500/10 text-orange-600 border border-orange-500/30 cursor-pointer hover:bg-orange-500/20"
                          : "bg-green-500/10 text-green-600 border border-green-500/30"
                    )}
                    onClick={() => isClickable() && handleBadgeClick(checkerName)}
                    data-testid="hc-validator-badge"
                  >
                    {checkerName}
                    <Show when={isError()}>
                      <IconOctagonAlert class="w-3 h-3" />
                    </Show>
                    <Show when={isWarning()}>
                      <IconTriangleAlert class="w-3 h-3" />
                    </Show>
                    <Show when={!isError() && !isWarning()}>
                      <IconCircleCheck class="w-3 h-3" />
                    </Show>
                  </span>
                );
              }}
            </For>
          </div>
        </Show>

        {/* Stats and Action Row */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-hive-border">
          {/* Stats */}
          <Show when={props.isHealthCheckerActive}>
            <div class="flex items-center gap-4">
              <Show when={props.score === -1}>
                <div class="flex items-center gap-2 text-sm text-hive-muted-foreground">
                  <IconLoaderCircle class="h-4 w-4 animate-spin" />
                  <span>Checking...</span>
                </div>
              </Show>
              <Show when={props.score !== -1 && props.score !== 0}>
                <div class="flex items-center gap-1.5 text-sm">
                  <IconClock class="w-4 h-4 text-hive-muted-foreground" />
                  <span class="text-hive-muted-foreground">Latency:</span>
                  <span class="font-medium">{props.latency}ms</span>
                </div>
                <div class="flex items-center gap-1.5 text-sm">
                  <IconGauge class="w-4 h-4 text-hive-muted-foreground" />
                  <span class="text-hive-muted-foreground">Score:</span>
                  <span
                    class={cn(
                      "font-medium",
                      props.score > 0.8
                        ? "text-green-500"
                        : props.score > 0.5
                          ? "text-orange-500"
                          : "text-red-500"
                    )}
                  >
                    {props.score.toFixed(3)}
                  </span>
                </div>
              </Show>
              <Show when={props.score === 0}>
                <span class="text-sm font-medium text-red-400">Unavailable</span>
              </Show>
            </div>
          </Show>

          {/* Action Button */}
          <div class="shrink-0 sm:ml-auto" data-testid={props.isSelected ? "hc-selected" : undefined}>
            <Show
              when={!props.isSelected}
              fallback={
                <span class="inline-flex items-center gap-1.5 text-sm font-medium text-green-500">
                  <IconCircleCheck class="w-4 h-4" />
                  Currently active
                </span>
              }
            >
              <button
                class={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
                  "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={() => props.switchToProvider(props.providerLink)}
                data-testid="hc-set-api-button"
              >
                Use this provider
              </button>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};
