"use client";

import { useEffect, useState } from "react";
import type { TScoredEndpoint } from "@hiveio/wax";
import type {
  ApiChecker,
  ValidationErrorDetails,
} from "@kkocot/honeycomb-core";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "./utils";
import { LoaderCircle } from "lucide-react";
import { ProviderCard } from "./healthchecker-provider-card";
import { ProviderAddition } from "./healthchecker-provider-addition";
import { ValidationErrorDialog } from "./healthchecker-validation-error-dialog";
import { ConfirmationSwitchDialog } from "./healthchecker-confirmation-switch-dialog";
import { useHive } from "./hive-provider";

export interface HealthCheckerComponentProps {
  healthcheckerKey: string;
}

export function HealthCheckerComponent({
  healthcheckerKey,
}: HealthCheckerComponentProps) {
  const { getHealthCheckerService } = useHive();
  const healthCheckerService = getHealthCheckerService(healthcheckerKey);

  if (!healthCheckerService) {
    return (
      <div className="rounded-lg border border-hive-border bg-hive-card p-6 animate-pulse">
        <div className="flex items-center justify-center">
          <LoaderCircle className="animate-spin h-8 w-8 text-hive-muted-foreground" />
        </div>
        <p className="text-center text-sm text-hive-muted-foreground mt-2">
          Loading health checker...
        </p>
      </div>
    );
  }

  return <HealthCheckerComponentInner healthCheckerService={healthCheckerService} />;
}

function HealthCheckerComponentInner({
  healthCheckerService,
}: {
  healthCheckerService: NonNullable<ReturnType<ReturnType<typeof useHive>["getHealthCheckerService"]>>;
}) {
  const {
    addProvider,
    removeProvider,
    resetProviders,
    clearValidationError,
    handleChangeOfNode,
    startCheckingProcess,
    stopCheckingProcess,
    evaluateAndSwitch,
    serviceKey,
  } = healthCheckerService;

  const [apiCheckers, setApiCheckers] = useState<ApiChecker[] | undefined>(
    undefined
  );
  const [scoredEndpoints, setScoredEndpoints] = useState<
    TScoredEndpoint[] | undefined
  >(undefined);
  const [nodeAddress, setNodeAddress] = useState<string | null>(null);
  const [providers, setProviders] = useState<string[] | undefined>(undefined);
  const [filter, setFilter] = useState("");
  const [failedChecksByProvider, setFailedChecksByProvider] = useState<
    Map<string, ValidationErrorDetails[]>
  >(new Map());
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [switchStatus, setSwitchStatus] = useState<
    "waiting" | "done" | "no_change" | undefined
  >(undefined);

  const [isValidationErrorDialogOpened, setIsValidationErrorDialogOpened] =
    useState<boolean>(false);
  const [selectedValidator, setSelectedValidator] = useState<
    ValidationErrorDetails | undefined
  >(undefined);
  const [
    isConfirmationSwitchDialogOpened,
    setIsConfirmationSwitchDialogOpened,
  ] = useState<boolean>(false);
  const [pendingProviderSwitch, setPendingProviderSwitch] = useState<
    string | undefined
  >(undefined);

  const handleAdditionOfProvider = (provider: string) => {
    addProvider(provider);
  };

  const selectValidator = (providerName: string, checkTitle: string) => {
    const foundValidator = failedChecksByProvider
      ?.get(providerName)
      ?.find((failedCheck) => failedCheck.checkName === checkTitle);
    if (foundValidator) {
      setSelectedValidator(foundValidator);
      setIsValidationErrorDialogOpened(true);
    }
  };

  const checkIfProviderIsValid = (providerLink: string): boolean => {
    const scoredEndpoint = scoredEndpoints?.find(
      (endpoint) => endpoint.endpointUrl === providerLink
    );
    if (!scoredEndpoint) return false;
    const failedChecks = failedChecksByProvider.get(providerLink) || [];
    return (
      scoredEndpoint.score > 0 &&
      (!failedChecks || failedChecks.length === 0)
    );
  };

  const handleSwitchToProvider = (providerLink: string | null) => {
    if (!providerLink) return;
    if (checkIfProviderIsValid(providerLink)) {
      handleChangeOfNode(providerLink);
    } else {
      setPendingProviderSwitch(providerLink);
      setIsConfirmationSwitchDialogOpened(true);
    }
  };

  const handleConfirmProviderSwitch = () => {
    if (pendingProviderSwitch) {
      handleChangeOfNode(pendingProviderSwitch);
      setPendingProviderSwitch(undefined);
      setIsConfirmationSwitchDialogOpened(false);
    }
  };

  const actualizeData = () => {
    const hcData = healthCheckerService.getComponentData();
    if (hcData) {
      setScoredEndpoints(hcData?.scoredEndpoints);
      setApiCheckers(hcData?.apiCheckers);
      setProviders(hcData?.providers);
      setFailedChecksByProvider(hcData.failedChecksByProvider);
      setNodeAddress(hcData?.nodeAddress);
      setIsActive(hcData?.isActive);
      setSwitchStatus(hcData?.switchStatus);
    }
  };

  const changeActivity = () => {
    if (isActive) {
      stopCheckingProcess();
    } else {
      startCheckingProcess();
    }
  };

  useEffect(() => {
    const handler = () => actualizeData();
    healthCheckerService.addEventListener(
      `stateChange-${serviceKey}`,
      handler
    );
    actualizeData();
    return () => {
      healthCheckerService.removeEventListener(
        `stateChange-${serviceKey}`,
        handler
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderProvider = (
    scoredEndpoint: TScoredEndpoint,
    index: number,
    isTop?: boolean
  ) => {
    const { endpointUrl, score, up } = scoredEndpoint;
    let lastLatency: number | null = null;
    if (up && scoredEndpoint.latencies.length) {
      lastLatency =
        scoredEndpoint.latencies[scoredEndpoint.latencies.length - 1];
    }
    if (
      !providers?.find((customProvider) => customProvider === endpointUrl)
    ) {
      return null;
    }
    return (
      <ProviderCard
        isTop={!!isTop}
        key={endpointUrl}
        providerLink={endpointUrl}
        switchToProvider={handleSwitchToProvider}
        disabled={score === 0}
        latency={lastLatency}
        isSelected={scoredEndpoint.endpointUrl === nodeAddress}
        checkerNamesList={
          apiCheckers?.map((apiChecker) => apiChecker.title) || []
        }
        index={index + 1}
        score={scoredEndpoint.score}
        deleteProvider={removeProvider}
        failedErrorChecks={
          failedChecksByProvider
            .get(endpointUrl)
            ?.filter(
              (failedCheck) => failedCheck.status === "serverError"
            )
            ?.map((failedCheck) => failedCheck.checkName) || []
        }
        failedValidationChecks={
          failedChecksByProvider
            .get(endpointUrl)
            ?.filter(
              (failedCheck) => failedCheck.status === "validation"
            )
            ?.map((failedCheck) => failedCheck.checkName) || []
        }
        selectValidator={selectValidator}
        isProviderValid={checkIfProviderIsValid(endpointUrl)}
        isHealthCheckerActive={!!isActive}
      />
    );
  };

  const renderProviders = () => {
    if (!scoredEndpoints || !scoredEndpoints.length)
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <LoaderCircle className="animate-spin h-8 w-8 text-hive-muted-foreground" />
          <p className="text-sm text-hive-muted-foreground mt-2">
            Checking API servers...
          </p>
        </div>
      );

    const filteredEndpoints = filter
      ? scoredEndpoints.filter((endpoint) =>
          endpoint.endpointUrl
            .toLowerCase()
            .includes(filter.toLowerCase())
        )
      : scoredEndpoints;

    if (filteredEndpoints.length === 0) {
      return (
        <div className="rounded-lg border border-hive-border bg-hive-card p-6 text-center">
          <p className="text-sm text-hive-muted-foreground">
            No providers match your filter.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {filteredEndpoints
          .sort((a, b) => {
            if (a.endpointUrl === nodeAddress) return -1;
            if (b.endpointUrl === nodeAddress) return 1;
            return 0;
          })
          .map((scoredEndpoint, index) =>
            renderProvider(scoredEndpoint, index)
          )}
      </div>
    );
  };

  const renderSwitchStatus = () => {
    if (!switchStatus) return <span>Switch to Best</span>;
    if (switchStatus === "waiting")
      return (
        <span className="inline-flex items-center gap-2">
          Evaluating
          <LoaderCircle className="animate-spin h-4 w-4" />
        </span>
      );
    if (switchStatus === "done") return <span className="text-green-600">Switching...</span>;
    if (switchStatus === "no_change")
      return <span className="text-hive-muted-foreground">Already on best</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">API Health Monitor</h2>
          <p className="text-sm text-hive-muted-foreground">
            Monitor and manage Hive API endpoints
          </p>
        </div>
        <div
          className="flex items-center gap-3"
          data-testid="toggle"
        >
          <span className="text-sm text-hive-muted-foreground">Auto-check</span>
          <Switch.Root
            checked={!!isActive}
            onCheckedChange={() => changeActivity()}
            className={cn(
              "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
              isActive
                ? "justify-end bg-hive-red"
                : "justify-start bg-hive-muted"
            )}
          >
            <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
          </Switch.Root>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Filter providers by URL..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={cn(
              "flex h-10 w-full rounded-md border border-hive-border bg-hive-card px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-hive-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hive-red focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          {filter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-hive-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setFilter("")}
              aria-label="Clear filter"
            >
              Clear
            </button>
          )}
        </div>
        <button
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4",
            "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          onClick={evaluateAndSwitch}
        >
          {renderSwitchStatus()}
        </button>
      </div>

      {/* Provider List */}
      {renderProviders()}

      {/* Add Provider Section */}
      <div className="pt-4 border-t border-hive-border">
        <ProviderAddition onProviderSubmit={handleAdditionOfProvider} />
      </div>

      {/* Reset Button */}
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3",
          "text-hive-muted-foreground hover:text-foreground",
          "border border-hive-border hover:border-hive-red/50 transition-colors"
        )}
        onClick={resetProviders}
      >
        Reset to defaults
      </button>

      <ValidationErrorDialog
        isOpened={isValidationErrorDialogOpened}
        onDialogOpenChange={setIsValidationErrorDialogOpened}
        validatorDetails={selectedValidator}
        clearValidationError={clearValidationError}
      />
      <ConfirmationSwitchDialog
        isOpened={isConfirmationSwitchDialogOpened}
        onDialogOpenChange={setIsConfirmationSwitchDialogOpened}
        onConfirm={handleConfirmProviderSwitch}
        providerLink={pendingProviderSwitch}
      />
    </div>
  );
}
