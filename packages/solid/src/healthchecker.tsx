import { createSignal, createEffect, onCleanup, Show, For, type Component } from "solid-js";
import type { TScoredEndpoint } from "@hiveio/wax";
import type { ApiChecker, ValidationErrorDetails } from "@kkocot/honeycomb-core";
import { Switch } from "@kobalte/core/switch";
import { cn } from "./utils";
import { IconLoaderCircle } from "./healthchecker-icons";
import { ProviderCard } from "./healthchecker-provider-card";
import { ProviderAddition } from "./healthchecker-provider-addition";
import { ValidationErrorDialog } from "./healthchecker-validation-error-dialog";
import { ConfirmationSwitchDialog } from "./healthchecker-confirmation-switch-dialog";
import { useHive } from "./hive-provider";

export interface HealthCheckerComponentProps {
  healthcheckerKey: string;
}

export const HealthCheckerComponent: Component<HealthCheckerComponentProps> = (props) => {
  const { getHealthCheckerService } = useHive();

  const service = () => getHealthCheckerService(props.healthcheckerKey);

  return (
    <Show
      when={service()}
      fallback={
        <div class="rounded-lg border border-hive-border bg-hive-card p-6 animate-pulse">
          <div class="flex items-center justify-center">
            <IconLoaderCircle class="animate-spin h-8 w-8 text-hive-muted-foreground" />
          </div>
          <p class="text-center text-sm text-hive-muted-foreground mt-2">
            Loading health checker...
          </p>
        </div>
      }
    >
      {(svc) => <HealthCheckerComponentInner service={svc()} />}
    </Show>
  );
};

function HealthCheckerComponentInner(props: {
  service: NonNullable<ReturnType<ReturnType<typeof useHive>["getHealthCheckerService"]>>;
}) {
  const [apiCheckers, setApiCheckers] = createSignal<ApiChecker[] | undefined>(undefined);
  const [scoredEndpoints, setScoredEndpoints] = createSignal<TScoredEndpoint[] | undefined>(undefined);
  const [nodeAddress, setNodeAddress] = createSignal<string | null>(null);
  const [providers, setProviders] = createSignal<string[] | undefined>(undefined);
  const [filter, setFilter] = createSignal("");
  const [failedChecksByProvider, setFailedChecksByProvider] = createSignal<Map<string, ValidationErrorDetails[]>>(new Map());
  const [isActive, setIsActive] = createSignal<boolean | undefined>(undefined);
  const [switchStatus, setSwitchStatus] = createSignal<"waiting" | "done" | "no_change" | undefined>(undefined);

  const [isValidationErrorDialogOpened, setIsValidationErrorDialogOpened] = createSignal(false);
  const [selectedValidator, setSelectedValidator] = createSignal<ValidationErrorDetails | undefined>(undefined);
  const [isConfirmationSwitchDialogOpened, setIsConfirmationSwitchDialogOpened] = createSignal(false);
  const [pendingProviderSwitch, setPendingProviderSwitch] = createSignal<string | undefined>(undefined);

  const selectValidator = (providerName: string, checkTitle: string) => {
    const foundValidator = failedChecksByProvider()
      ?.get(providerName)
      ?.find((failedCheck) => failedCheck.checkName === checkTitle);
    if (foundValidator) {
      setSelectedValidator(foundValidator);
      setIsValidationErrorDialogOpened(true);
    }
  };

  const checkIfProviderIsValid = (providerLink: string): boolean => {
    const scoredEndpoint = scoredEndpoints()?.find(
      (endpoint) => endpoint.endpointUrl === providerLink
    );
    if (!scoredEndpoint) return false;
    const failedChecks = failedChecksByProvider().get(providerLink) || [];
    return (
      scoredEndpoint.score > 0 &&
      (!failedChecks || failedChecks.length === 0)
    );
  };

  const handleSwitchToProvider = (providerLink: string | null) => {
    if (!providerLink) return;
    if (checkIfProviderIsValid(providerLink)) {
      props.service.handleChangeOfNode(providerLink);
    } else {
      setPendingProviderSwitch(providerLink);
      setIsConfirmationSwitchDialogOpened(true);
    }
  };

  const handleConfirmProviderSwitch = () => {
    const pending = pendingProviderSwitch();
    if (pending) {
      props.service.handleChangeOfNode(pending);
      setPendingProviderSwitch(undefined);
      setIsConfirmationSwitchDialogOpened(false);
    }
  };

  const actualizeData = () => {
    const hcData = props.service.getComponentData();
    if (hcData) {
      setScoredEndpoints(hcData.scoredEndpoints);
      setApiCheckers(hcData.apiCheckers);
      setProviders(hcData.providers);
      setFailedChecksByProvider(hcData.failedChecksByProvider);
      setNodeAddress(hcData.nodeAddress);
      setIsActive(hcData.isActive);
      setSwitchStatus(hcData.switchStatus);
    }
  };

  const changeActivity = () => {
    if (isActive()) {
      props.service.stopCheckingProcess();
    } else {
      props.service.startCheckingProcess();
    }
  };

  createEffect(() => {
    const handler = () => actualizeData();
    const serviceKey = props.service.serviceKey;
    props.service.addEventListener(`stateChange-${serviceKey}`, handler);
    actualizeData();

    onCleanup(() => {
      props.service.removeEventListener(`stateChange-${serviceKey}`, handler);
    });
  });

  const filteredEndpoints = () => {
    const endpoints = scoredEndpoints();
    if (!endpoints) return undefined;
    const f = filter();
    if (!f) return endpoints;
    return endpoints.filter((endpoint) =>
      endpoint.endpointUrl.toLowerCase().includes(f.toLowerCase())
    );
  };

  const sortedEndpoints = () => {
    const endpoints = filteredEndpoints();
    if (!endpoints) return undefined;
    const addr = nodeAddress();
    return [...endpoints].sort((a, b) => {
      if (a.endpointUrl === addr) return -1;
      if (b.endpointUrl === addr) return 1;
      return 0;
    });
  };

  return (
    <div class="space-y-4">
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">API Health Monitor</h2>
          <p class="text-sm text-hive-muted-foreground">
            Monitor and manage Hive API endpoints
          </p>
        </div>
        <div class="flex items-center gap-3" data-testid="toggle">
          <span class="text-sm text-hive-muted-foreground">Auto-check</span>
          <Switch
            checked={!!isActive()}
            onChange={() => changeActivity()}
            class={cn(
              "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
              isActive()
                ? "justify-end bg-hive-red"
                : "justify-start bg-hive-muted"
            )}
          >
            <Switch.Input />
            <Switch.Control class={cn(
              "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
              isActive()
                ? "justify-end bg-hive-red"
                : "justify-start bg-hive-muted"
            )}>
              <Switch.Thumb class="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
            </Switch.Control>
          </Switch>
        </div>
      </div>

      {/* Controls */}
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <input
            type="text"
            placeholder="Filter providers by URL..."
            value={filter()}
            onInput={(e) => setFilter(e.currentTarget.value)}
            class={cn(
              "flex h-10 w-full rounded-md border border-hive-border bg-hive-card px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-hive-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hive-red focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <Show when={filter()}>
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-hive-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setFilter("")}
              aria-label="Clear filter"
            >
              Clear
            </button>
          </Show>
        </div>
        <button
          class={cn(
            "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
            "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          onClick={() => props.service.evaluateAndSwitch()}
        >
          <Show when={!switchStatus()}>
            <span>Switch to Best</span>
          </Show>
          <Show when={switchStatus() === "waiting"}>
            <span class="inline-flex items-center gap-2">
              Evaluating
              <IconLoaderCircle class="animate-spin h-4 w-4" />
            </span>
          </Show>
          <Show when={switchStatus() === "done"}>
            <span class="text-green-600">Switching...</span>
          </Show>
          <Show when={switchStatus() === "no_change"}>
            <span class="text-hive-muted-foreground">Already on best</span>
          </Show>
        </button>
      </div>

      {/* Provider List */}
      <Show
        when={scoredEndpoints()?.length}
        fallback={
          <div class="flex flex-col items-center justify-center py-8">
            <IconLoaderCircle class="animate-spin h-8 w-8 text-hive-muted-foreground" />
            <p class="text-sm text-hive-muted-foreground mt-2">
              Checking API servers...
            </p>
          </div>
        }
      >
        <Show
          when={sortedEndpoints()?.length}
          fallback={
            <div class="rounded-lg border border-hive-border bg-hive-card p-6 text-center">
              <p class="text-sm text-hive-muted-foreground">
                No providers match your filter.
              </p>
            </div>
          }
        >
          <div class="space-y-2">
            <For each={sortedEndpoints()}>
              {(scoredEndpoint, index) => {
                const endpointUrl = scoredEndpoint.endpointUrl;
                const lastLatency = () => {
                  if (scoredEndpoint.up && scoredEndpoint.latencies.length) {
                    return scoredEndpoint.latencies[scoredEndpoint.latencies.length - 1];
                  }
                  return null;
                };

                return (
                  <Show when={providers()?.find((p) => p === endpointUrl)}>
                    <ProviderCard
                      isTop={false}
                      providerLink={endpointUrl}
                      switchToProvider={handleSwitchToProvider}
                      disabled={scoredEndpoint.score === 0}
                      latency={lastLatency()}
                      isSelected={endpointUrl === nodeAddress()}
                      checkerNamesList={apiCheckers()?.map((c) => c.title) || []}
                      index={index() + 1}
                      score={scoredEndpoint.score}
                      deleteProvider={(p) => props.service.removeProvider(p)}
                      failedErrorChecks={
                        failedChecksByProvider()
                          .get(endpointUrl)
                          ?.filter((fc) => fc.status === "serverError")
                          ?.map((fc) => fc.checkName) || []
                      }
                      failedValidationChecks={
                        failedChecksByProvider()
                          .get(endpointUrl)
                          ?.filter((fc) => fc.status === "validation")
                          ?.map((fc) => fc.checkName) || []
                      }
                      selectValidator={selectValidator}
                      isProviderValid={checkIfProviderIsValid(endpointUrl)}
                      isHealthCheckerActive={!!isActive()}
                    />
                  </Show>
                );
              }}
            </For>
          </div>
        </Show>
      </Show>

      {/* Add Provider Section */}
      <div class="pt-4 border-t border-hive-border">
        <ProviderAddition onProviderSubmit={(p) => props.service.addProvider(p)} />
      </div>

      {/* Reset Button */}
      <button
        class={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 cursor-pointer",
          "text-hive-muted-foreground hover:text-foreground",
          "border border-hive-border hover:border-hive-red/50 transition-colors"
        )}
        onClick={() => props.service.resetProviders()}
      >
        Reset to defaults
      </button>

      <ValidationErrorDialog
        isOpened={isValidationErrorDialogOpened()}
        onDialogOpenChange={setIsValidationErrorDialogOpened}
        validatorDetails={selectedValidator()}
        clearValidationError={(providerName, checkerName) =>
          props.service.clearValidationError(providerName, checkerName)
        }
      />
      <ConfirmationSwitchDialog
        isOpened={isConfirmationSwitchDialogOpened()}
        onDialogOpenChange={setIsConfirmationSwitchDialogOpened}
        onConfirm={handleConfirmProviderSwitch}
        providerLink={pendingProviderSwitch()}
      />
    </div>
  );
}
