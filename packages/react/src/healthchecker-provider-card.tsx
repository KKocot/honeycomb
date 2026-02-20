"use client";

import { cn } from "./utils";
import {
  LoaderCircle,
  OctagonAlert,
  TriangleAlert,
  CircleCheck,
  Gauge,
  Clock,
  Trash2,
} from "lucide-react";

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
        "relative rounded-lg border bg-hive-card p-4 transition-all",
        isSelected
          ? "border-hive-red ring-2 ring-hive-red/20"
          : "border-hive-border hover:border-hive-red/50",
        disabled && "opacity-60",
        isTop && "ring-2 ring-green-500/30 border-green-500"
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Rank Badge */}
          <div
            className={cn(
              "shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
              isSelected
                ? "bg-hive-red text-white"
                : isTop
                  ? "bg-green-500 text-white"
                  : "bg-hive-muted text-hive-muted-foreground"
            )}
          >
            {index}
          </div>

          {/* Provider URL */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  "font-medium truncate text-sm",
                  disabled && "text-red-500"
                )}
                data-testid="hc-api-name"
                title={providerLink}
              >
                {providerLink}
              </p>
              {isProviderValid && isHealthCheckerActive && (
                <CircleCheck className="shrink-0 w-4 h-4 text-green-500" />
              )}
              {isSelected && (
                <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-hive-red/10 text-hive-red">
                  Active
                </span>
              )}
            </div>

            {/* Status message for disabled */}
            {disabled && (
              <p className="text-xs text-red-500 mt-1">
                Connection failed - CORS or network error
              </p>
            )}
          </div>
        </div>

        {/* Delete Button */}
        {!isSelected && (
          <button
            className={cn(
              "shrink-0 p-1.5 rounded-md transition-colors",
              "text-hive-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            )}
            onClick={() => deleteProvider(providerLink)}
            title="Remove provider"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Checks Badges */}
      {!disabled && checkerNamesList.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {checkerNamesList.map((checkerName) => {
            const isError = failedErrorChecks.includes(checkerName);
            const isWarning = failedValidationChecks.includes(checkerName);
            const isClickable = isError || isWarning;

            return (
              <span
                key={checkerName}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
                  isError
                    ? "bg-red-500/10 text-red-600 border border-red-500/30 cursor-pointer hover:bg-red-500/20"
                    : isWarning
                      ? "bg-orange-500/10 text-orange-600 border border-orange-500/30 cursor-pointer hover:bg-orange-500/20"
                      : "bg-green-500/10 text-green-600 border border-green-500/30"
                )}
                onClick={() => isClickable && handleBadgeClick(checkerName)}
                data-testid="hc-validator-badge"
              >
                {checkerName}
                {isError && <OctagonAlert className="w-3 h-3" />}
                {isWarning && <TriangleAlert className="w-3 h-3" />}
                {!isError && !isWarning && <CircleCheck className="w-3 h-3" />}
              </span>
            );
          })}
        </div>
      )}

      {/* Stats and Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-hive-border">
        {/* Stats */}
        {isHealthCheckerActive && (
          <div className="flex items-center gap-4">
            {score === -1 ? (
              <div className="flex items-center gap-2 text-sm text-hive-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </div>
            ) : score !== 0 ? (
              <>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-hive-muted-foreground" />
                  <span className="text-hive-muted-foreground">Latency:</span>
                  <span className="font-medium">{latency}ms</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Gauge className="w-4 h-4 text-hive-muted-foreground" />
                  <span className="text-hive-muted-foreground">Score:</span>
                  <span
                    className={cn(
                      "font-medium",
                      score > 0.8
                        ? "text-green-500"
                        : score > 0.5
                          ? "text-orange-500"
                          : "text-red-500"
                    )}
                  >
                    {score.toFixed(3)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm text-red-500">Unavailable</span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="shrink-0" data-testid={isSelected ? "hc-selected" : undefined}>
          {!isSelected ? (
            <button
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4",
                "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={() => switchToProvider(providerLink)}
              data-testid="hc-set-api-button"
            >
              Use this provider
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-500">
              <CircleCheck className="w-4 h-4" />
              Currently active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
