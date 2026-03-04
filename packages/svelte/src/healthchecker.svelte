<script lang="ts" module>
  export interface HealthCheckerComponentProps {
    healthcheckerKey: string;
  }
</script>

<script lang="ts">
  import type { TScoredEndpoint } from "@hiveio/wax";
  import type {
    ApiChecker,
    ValidationErrorDetails,
  } from "@kkocot/honeycomb-core";
  import { Switch } from "bits-ui";
  import { cn } from "./utils";
  import { useHive } from "./context.svelte";
  import HealthCheckerIcon from "./healthchecker-icons.svelte";
  import ProviderCard from "./healthchecker-provider-card.svelte";
  import ProviderAddition from "./healthchecker-provider-addition.svelte";
  import ValidationErrorDialog from "./healthchecker-validation-error-dialog.svelte";
  import ConfirmationSwitchDialog from "./healthchecker-confirmation-switch-dialog.svelte";

  let { healthcheckerKey }: HealthCheckerComponentProps = $props();

  const hive = useHive();

  let api_checkers = $state<ApiChecker[] | undefined>(undefined);
  let scored_endpoints = $state<TScoredEndpoint[] | undefined>(undefined);
  let node_address = $state<string | null>(null);
  let providers = $state<string[] | undefined>(undefined);
  let filter = $state("");
  let failed_checks_by_provider = $state<
    Map<string, ValidationErrorDetails[]>
  >(new Map());
  let is_active = $state<boolean | undefined>(undefined);
  let switch_status = $state<
    "waiting" | "done" | "no_change" | undefined
  >(undefined);

  let is_validation_error_dialog_opened = $state(false);
  let selected_validator = $state<ValidationErrorDetails | undefined>(
    undefined,
  );
  let is_confirmation_switch_dialog_opened = $state(false);
  let pending_provider_switch = $state<string | undefined>(undefined);

  const health_checker_service = $derived(
    hive.get_health_checker_service(healthcheckerKey),
  );

  const filtered_endpoints = $derived.by(() => {
    if (!scored_endpoints) return undefined;
    if (!filter) return scored_endpoints;
    return scored_endpoints.filter((endpoint) =>
      endpoint.endpointUrl.toLowerCase().includes(filter.toLowerCase()),
    );
  });

  const sorted_endpoints = $derived.by(() => {
    if (!filtered_endpoints) return undefined;
    return [...filtered_endpoints].sort((a, b) => {
      if (a.endpointUrl === node_address) return -1;
      if (b.endpointUrl === node_address) return 1;
      return 0;
    });
  });

  function actualize_data() {
    if (!health_checker_service) return;
    const data = health_checker_service.getComponentData();
    if (data) {
      scored_endpoints = data.scoredEndpoints;
      api_checkers = data.apiCheckers;
      providers = data.providers;
      failed_checks_by_provider = data.failedChecksByProvider;
      node_address = data.nodeAddress;
      is_active = data.isActive;
      switch_status = data.switchStatus;
    }
  }

  function change_activity() {
    if (!health_checker_service) return;
    if (is_active) {
      health_checker_service.stopCheckingProcess();
    } else {
      health_checker_service.startCheckingProcess();
    }
  }

  function select_validator(provider_name: string, check_title: string) {
    const found_validator = failed_checks_by_provider
      ?.get(provider_name)
      ?.find((failed_check) => failed_check.checkName === check_title);
    if (found_validator) {
      selected_validator = found_validator;
      is_validation_error_dialog_opened = true;
    }
  }

  function check_if_provider_is_valid(provider_link: string): boolean {
    const scored_endpoint = scored_endpoints?.find(
      (endpoint) => endpoint.endpointUrl === provider_link,
    );
    if (!scored_endpoint) return false;
    const failed_checks =
      failed_checks_by_provider.get(provider_link) || [];
    return (
      scored_endpoint.score > 0 &&
      (!failed_checks || failed_checks.length === 0)
    );
  }

  function handle_switch_to_provider(provider_link: string | null) {
    if (!provider_link || !health_checker_service) return;
    if (check_if_provider_is_valid(provider_link)) {
      health_checker_service.handleChangeOfNode(provider_link);
    } else {
      pending_provider_switch = provider_link;
      is_confirmation_switch_dialog_opened = true;
    }
  }

  function handle_confirm_provider_switch() {
    if (pending_provider_switch && health_checker_service) {
      health_checker_service.handleChangeOfNode(pending_provider_switch);
      pending_provider_switch = undefined;
      is_confirmation_switch_dialog_opened = false;
    }
  }

  function get_provider_latency(
    scored_endpoint: TScoredEndpoint,
  ): number | null {
    if (scored_endpoint.up && scored_endpoint.latencies.length) {
      return scored_endpoint.latencies[
        scored_endpoint.latencies.length - 1
      ];
    }
    return null;
  }

  function is_in_providers(endpoint_url: string): boolean {
    return !!providers?.find(
      (custom_provider) => custom_provider === endpoint_url,
    );
  }

  $effect(() => {
    const service = health_checker_service;
    if (!service) return;

    const handler = () => actualize_data();
    service.addEventListener(
      `stateChange-${service.serviceKey}`,
      handler,
    );
    actualize_data();

    return () => {
      service.removeEventListener(
        `stateChange-${service.serviceKey}`,
        handler,
      );
    };
  });
</script>

{#if !health_checker_service}
  <div
    class="rounded-lg border border-hive-border bg-hive-card p-6 animate-pulse"
  >
    <div class="flex items-center justify-center">
      <HealthCheckerIcon
        name="loader-circle"
        class="animate-spin h-8 w-8 text-hive-muted-foreground"
      />
    </div>
    <p class="text-center text-sm text-hive-muted-foreground mt-2">
      Loading health checker...
    </p>
  </div>
{:else}
  <div class="space-y-4">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <h2 class="text-lg font-semibold">API Health Monitor</h2>
        <p class="text-sm text-hive-muted-foreground">
          Monitor and manage Hive API endpoints
        </p>
      </div>
      <div class="flex items-center gap-3" data-testid="toggle">
        <span class="text-sm text-hive-muted-foreground">Auto-check</span>
        <Switch.Root
          checked={!!is_active}
          onCheckedChange={() => change_activity()}
          class={cn(
            "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
            is_active
              ? "justify-end bg-hive-red"
              : "justify-start bg-hive-muted",
          )}
        >
          <Switch.Thumb
            class="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
          />
        </Switch.Root>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <input
          type="text"
          placeholder="Filter providers by URL..."
          bind:value={filter}
          class={cn(
            "flex h-10 w-full rounded-md border border-hive-border bg-hive-card px-3 py-2 text-sm",
            "ring-offset-background placeholder:text-hive-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hive-red focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        {#if filter}
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-hive-muted-foreground hover:text-foreground transition-colors"
            onclick={() => (filter = "")}
            aria-label="Clear filter"
          >
            Clear
          </button>
        {/if}
      </div>
      <button
        class={cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
          "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        onclick={() => health_checker_service.evaluateAndSwitch()}
      >
        {#if !switch_status}
          <span>Switch to Best</span>
        {:else if switch_status === "waiting"}
          <span class="inline-flex items-center gap-2">
            Evaluating
            <HealthCheckerIcon
              name="loader-circle"
              class="animate-spin h-4 w-4"
            />
          </span>
        {:else if switch_status === "done"}
          <span class="text-green-600">Switching...</span>
        {:else if switch_status === "no_change"}
          <span class="text-hive-muted-foreground">Already on best</span>
        {/if}
      </button>
    </div>

    <!-- Provider List -->
    {#if !sorted_endpoints || sorted_endpoints.length === 0}
      {#if !scored_endpoints || scored_endpoints.length === 0}
        <div class="flex flex-col items-center justify-center py-8">
          <HealthCheckerIcon
            name="loader-circle"
            class="animate-spin h-8 w-8 text-hive-muted-foreground"
          />
          <p class="text-sm text-hive-muted-foreground mt-2">
            Checking API servers...
          </p>
        </div>
      {:else}
        <div
          class="rounded-lg border border-hive-border bg-hive-card p-6 text-center"
        >
          <p class="text-sm text-hive-muted-foreground">
            No providers match your filter.
          </p>
        </div>
      {/if}
    {:else}
      <div class="space-y-2">
        {#each sorted_endpoints as scored_endpoint, index (scored_endpoint.endpointUrl)}
          {#if is_in_providers(scored_endpoint.endpointUrl)}
            <ProviderCard
              isTop={false}
              providerLink={scored_endpoint.endpointUrl}
              switchToProvider={handle_switch_to_provider}
              disabled={scored_endpoint.score === 0}
              latency={get_provider_latency(scored_endpoint)}
              isSelected={scored_endpoint.endpointUrl === node_address}
              checkerNamesList={api_checkers?.map(
                (checker) => checker.title,
              ) || []}
              {index}
              score={scored_endpoint.score}
              deleteProvider={health_checker_service.removeProvider}
              failedErrorChecks={failed_checks_by_provider
                .get(scored_endpoint.endpointUrl)
                ?.filter((c) => c.status === "serverError")
                ?.map((c) => c.checkName) || []}
              failedValidationChecks={failed_checks_by_provider
                .get(scored_endpoint.endpointUrl)
                ?.filter((c) => c.status === "validation")
                ?.map((c) => c.checkName) || []}
              selectValidator={select_validator}
              isProviderValid={check_if_provider_is_valid(
                scored_endpoint.endpointUrl,
              )}
              isHealthCheckerActive={!!is_active}
            />
          {/if}
        {/each}
      </div>
    {/if}

    <!-- Add Provider Section -->
    <div class="pt-4 border-t border-hive-border">
      <ProviderAddition
        onProviderSubmit={(provider) =>
          health_checker_service.addProvider(provider)}
      />
    </div>

    <!-- Reset Button -->
    <button
      class={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3",
        "text-hive-muted-foreground hover:text-foreground",
        "border border-hive-border hover:border-hive-red/50 transition-colors",
      )}
      onclick={() => health_checker_service.resetProviders()}
    >
      Reset to defaults
    </button>

    <ValidationErrorDialog
      isOpened={is_validation_error_dialog_opened}
      onDialogOpenChange={(opened) =>
        (is_validation_error_dialog_opened = opened)}
      validatorDetails={selected_validator}
      clearValidationError={health_checker_service.clearValidationError}
    />
    <ConfirmationSwitchDialog
      isOpened={is_confirmation_switch_dialog_opened}
      onDialogOpenChange={(opened) =>
        (is_confirmation_switch_dialog_opened = opened)}
      onConfirm={handle_confirm_provider_switch}
      providerLink={pending_provider_switch}
    />
  </div>
{/if}
