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
      <div className="flex items-center justify-center p-4">
        <LoaderCircle className="animate-spin h-8 w-8" />
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
        <LoaderCircle className="ml-2 animate-spin h-8 w-8 justify-self-center mb-4" />
      );

    const filteredEndpoints = filter
      ? scoredEndpoints.filter((endpoint) =>
          endpoint.endpointUrl
            .toLowerCase()
            .includes(filter.toLowerCase())
        )
      : scoredEndpoints;

    return (
      <>
        {filteredEndpoints
          .sort((a, b) => {
            if (a.endpointUrl === nodeAddress) return -1;
            if (b.endpointUrl === nodeAddress) return 1;
            return 0;
          })
          .map((scoredEndpoint, index) =>
            renderProvider(scoredEndpoint, index)
          )}
      </>
    );
  };

  const renderSwitchStatus = () => {
    if (!switchStatus) return <>Switch to Best</>;
    if (switchStatus === "waiting")
      return (
        <>
          Evaluating{" "}
          <LoaderCircle className="animate-spin h-6 w-6" />
        </>
      );
    if (switchStatus === "done") return <>Endpoint found, switching</>;
    if (switchStatus === "no_change")
      return <>Already on the best provider</>;
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-left">
          Healthchecker for API servers
        </h2>
        <div className="flex items-center space-x-2 my-2">
          <div
            className="flex gap-x-2 items-center"
            data-testid="toggle"
          >
            <p>Continuous Check</p>
            <Switch.Root
              checked={!!isActive}
              onCheckedChange={() => changeActivity()}
              className={cn(
                "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
                isActive
                  ? "justify-end bg-[hsl(var(--hive-primary))]"
                  : "justify-start bg-[hsl(var(--hive-input))]"
              )}
            >
              <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-[hsl(var(--hive-background))] shadow-sm" />
            </Switch.Root>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 justify-between my-2 w-full">
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground mt-2 order-1 sm:order-2"
          onClick={evaluateAndSwitch}
        >
          {renderSwitchStatus()}
        </button>

        <div className="flex mt-2 w-full sm:w-1/2 order-2 sm:order-1">
          <input
            type="text"
            placeholder="Filter by URL…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
          {filter && (
            <button
              className="inline-flex items-center justify-center text-sm font-medium h-10 w-10 hover:bg-accent hover:text-accent-foreground ml-2"
              onClick={() => setFilter("")}
              aria-label="Clear filter"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {renderProviders()}
      <ProviderAddition onProviderSubmit={handleAdditionOfProvider} />
      <button
        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground mt-2"
        onClick={resetProviders}
      >
        Restore default API server set
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
