"use client";

import { cn } from "./utils";
import {
  IconX,
  IconLoader2,
  IconOctagonAlert,
  IconTriangleAlert,
  IconCircleCheck,
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

export function ProviderCard({
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
  deleteProvider,
  switchToProvider,
  selectValidator,
}: ProviderCardProps) {
  const handleBadgeClick = (checkerName: string) => {
    if (
      failedErrorChecks.includes(checkerName) ||
      failedValidationChecks.includes(checkerName)
    )
      selectValidator(providerLink, checkerName);
  };

  if (isTop && index === 1) return null;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 my-1 p-2 dark:text-white",
        "rounded-lg border dark:border-white bg-card text-card-foreground shadow-sm",
        "lg:flex-row lg:flex-wrap lg:items-center",
        {
          "outline-solid outline-2 outline-offset-2 mb-6": isTop,
        }
      )}
    >
      {!isSelected && (
        <div className="absolute top-0 right-2">
          <button
            className="inline-flex items-center justify-center p-1 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={() => deleteProvider(providerLink)}
          >
            <IconX className="w-4 h-4 dark:text-white" />
          </button>
        </div>
      )}
      <div className="flex flex-wrap justify-around p-4 w-full">
        <div className="flex flex-col w-full md:w-1/2">
          <div className="flex gap-4">
            <p>{index}</p>
            <div>
              <p
                className={cn("text-center", {
                  "text-red-600": disabled,
                })}
                data-testid="hc-api-name"
              >
                {providerLink}
              </p>
              {isProviderValid && isHealthCheckerActive && (
                <IconCircleCheck className="ml-1 inline-block w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 py-2 pl-4">
            {disabled ? (
              <div>
                No connection. Possible CORS error or network's problems
              </div>
            ) : (
              checkerNamesList.map((checkerName) => (
                <span
                  key={checkerName}
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground m-0.5",
                    {
                      "border-red-600 cursor-pointer":
                        failedErrorChecks.includes(checkerName),
                      "border-orange-500 cursor-pointer":
                        failedValidationChecks.includes(checkerName),
                    }
                  )}
                  onClick={() => handleBadgeClick(checkerName)}
                  data-testid="hc-validator-badge"
                >
                  {checkerName}
                  {failedErrorChecks.includes(checkerName) && (
                    <IconOctagonAlert className="ml-1 inline-block w-4 h-4 text-red-600" />
                  )}
                  {failedValidationChecks.includes(checkerName) && (
                    <IconTriangleAlert className="ml-1 inline-block w-4 h-4 text-orange-500" />
                  )}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="flex flex-col w-full md:w-1/2 align-center justify-center">
          {isHealthCheckerActive && (
            <div className="flex w-full justify-center align-center">
              {score !== -1 ? (
                score !== 0 && (
                  <div className="flex gap-6">
                    <p>Latency: {latency}</p>
                    <p>Score: {score.toFixed(3)}</p>
                  </div>
                )
              ) : (
                <IconLoader2 className="h-6 w-6 animate-spin" />
              )}
            </div>
          )}
          <div className="flex w-full items-end justify-center text-center">
            {!isSelected ? (
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:bg-slate-400 w-full max-w-[200px]"
                onClick={() => switchToProvider(providerLink)}
                data-testid="hc-set-api-button"
              >
                Set Main
              </button>
            ) : (
              <div className="text-green-600" data-testid="hc-selected">
                Selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
