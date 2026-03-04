<script lang="ts" module>
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
</script>

<script lang="ts">
  import { cn } from "./utils";
  import HealthCheckerIcon from "./healthchecker-icons.svelte";

  let {
    providerLink,
    disabled,
    isSelected,
    isTop,
    checkerNamesList,
    latency,
    score,
    index,
    failedErrorChecks,
    failedValidationChecks,
    isHealthCheckerActive,
    isProviderValid,
    switchToProvider,
    deleteProvider,
    selectValidator,
  }: ProviderCardProps = $props();

  function handle_badge_click(checker_name: string) {
    if (
      failedErrorChecks.includes(checker_name) ||
      failedValidationChecks.includes(checker_name)
    ) {
      selectValidator(providerLink, checker_name);
    }
  }
</script>

{#if !(isTop && index === 1)}
  <div
    class={cn(
      "relative rounded-lg border bg-hive-card p-4 transition-all",
      isSelected
        ? "border-hive-red ring-2 ring-hive-red/20"
        : "border-hive-border hover:border-hive-red/50",
      disabled && "opacity-60",
      isTop && "ring-2 ring-green-500/30 border-green-500",
    )}
  >
    <!-- Header Row -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <!-- Rank Badge -->
        <div
          class={cn(
            "shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
            isSelected
              ? "bg-hive-red text-white"
              : isTop
                ? "bg-green-500 text-white"
                : "bg-hive-muted text-hive-muted-foreground",
          )}
        >
          {index}
        </div>

        <!-- Provider URL -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p
              class={cn(
                "font-medium truncate text-sm",
                disabled && "text-red-500",
              )}
              data-testid="hc-api-name"
              title={providerLink}
            >
              {providerLink}
            </p>
            {#if isProviderValid && isHealthCheckerActive}
              <HealthCheckerIcon
                name="circle-check"
                class="shrink-0 w-4 h-4 text-green-500"
              />
            {/if}
            {#if isSelected}
              <span
                class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-hive-red/10 text-hive-red"
              >
                Active
              </span>
            {/if}
          </div>

          {#if disabled}
            <p class="text-xs text-red-500 mt-1">
              Connection failed - CORS or network error
            </p>
          {/if}
        </div>
      </div>

      <!-- Delete Button -->
      {#if !isSelected}
        <button
          class={cn(
            "shrink-0 p-1.5 rounded-md transition-colors",
            "text-hive-muted-foreground hover:text-red-500 hover:bg-red-500/10",
          )}
          onclick={() => deleteProvider(providerLink)}
          title="Remove provider"
        >
          <HealthCheckerIcon name="trash-2" class="w-4 h-4" />
        </button>
      {/if}
    </div>

    <!-- Checks Badges -->
    {#if !disabled && checkerNamesList.length > 0}
      <div class="flex flex-wrap items-center gap-1.5 mt-3">
        {#each checkerNamesList as checker_name (checker_name)}
          {@const is_error = failedErrorChecks.includes(checker_name)}
          {@const is_warning = failedValidationChecks.includes(checker_name)}
          {@const is_clickable = is_error || is_warning}
          <span
            class={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
              is_error
                ? "bg-red-500/10 text-red-600 border border-red-500/30 cursor-pointer hover:bg-red-500/20"
                : is_warning
                  ? "bg-orange-500/10 text-orange-600 border border-orange-500/30 cursor-pointer hover:bg-orange-500/20"
                  : "bg-green-500/10 text-green-600 border border-green-500/30",
            )}
            onclick={() => is_clickable && handle_badge_click(checker_name)}
            role={is_clickable ? "button" : undefined}
            tabindex={is_clickable ? 0 : undefined}
            data-testid="hc-validator-badge"
          >
            {checker_name}
            {#if is_error}
              <HealthCheckerIcon name="octagon-alert" class="w-3 h-3" />
            {:else if is_warning}
              <HealthCheckerIcon name="triangle-alert" class="w-3 h-3" />
            {:else}
              <HealthCheckerIcon name="circle-check" class="w-3 h-3" />
            {/if}
          </span>
        {/each}
      </div>
    {/if}

    <!-- Stats and Action Row -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-hive-border"
    >
      <!-- Stats -->
      {#if isHealthCheckerActive}
        <div class="flex items-center gap-4">
          {#if score === -1}
            <div
              class="flex items-center gap-2 text-sm text-hive-muted-foreground"
            >
              <HealthCheckerIcon
                name="loader-circle"
                class="h-4 w-4 animate-spin"
              />
              <span>Checking...</span>
            </div>
          {:else if score !== 0}
            <div class="flex items-center gap-1.5 text-sm">
              <HealthCheckerIcon
                name="clock"
                class="w-4 h-4 text-hive-muted-foreground"
              />
              <span class="text-hive-muted-foreground">Latency:</span>
              <span class="font-medium">{latency}ms</span>
            </div>
            <div class="flex items-center gap-1.5 text-sm">
              <HealthCheckerIcon
                name="gauge"
                class="w-4 h-4 text-hive-muted-foreground"
              />
              <span class="text-hive-muted-foreground">Score:</span>
              <span
                class={cn(
                  "font-medium",
                  score > 0.8
                    ? "text-green-500"
                    : score > 0.5
                      ? "text-orange-500"
                      : "text-red-500",
                )}
              >
                {score.toFixed(3)}
              </span>
            </div>
          {:else}
            <span class="text-sm font-medium text-red-400">Unavailable</span>
          {/if}
        </div>
      {/if}

      <!-- Action Button -->
      <div
        class="shrink-0 sm:ml-auto"
        data-testid={isSelected ? "hc-selected" : undefined}
      >
        {#if !isSelected}
          <button
            class={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
              "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            onclick={() => switchToProvider(providerLink)}
            data-testid="hc-set-api-button"
          >
            Use this provider
          </button>
        {:else}
          <span
            class="inline-flex items-center gap-1.5 text-sm font-medium text-green-500"
          >
            <HealthCheckerIcon name="circle-check" class="w-4 h-4" />
            Currently active
          </span>
        {/if}
      </div>
    </div>
  </div>
{/if}
