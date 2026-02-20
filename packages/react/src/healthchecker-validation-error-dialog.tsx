"use client";

import type { ValidationErrorDetails } from "@kkocot/honeycomb-core";
import * as Dialog from "@radix-ui/react-dialog";
import { X, OctagonAlert, TriangleAlert, Eraser } from "lucide-react";
import { cn } from "./utils";

export interface ValidationErrorDialogProps {
  isOpened: boolean;
  onDialogOpenChange: (isOpened: boolean) => void;
  validatorDetails?: ValidationErrorDetails;
  clearValidationError: (providerName: string, checkerName: string) => void;
}

export function ValidationErrorDialog({
  isOpened,
  validatorDetails,
  onDialogOpenChange,
  clearValidationError,
}: ValidationErrorDialogProps) {
  const handleErrorClearClick = () => {
    if (validatorDetails?.providerName && validatorDetails?.checkName) {
      clearValidationError(
        validatorDetails.providerName,
        validatorDetails.checkName
      );
      onDialogOpenChange(false);
    }
  };

  const displayPrettyJSON = () => {
    return typeof validatorDetails?.params === "string"
      ? JSON.stringify(JSON.parse(validatorDetails.params), null, 2)
      : null;
  };

  const isServerError = validatorDetails?.status === "serverError";
  const ErrorIcon = isServerError ? OctagonAlert : TriangleAlert;

  return (
    <Dialog.Root open={isOpened} onOpenChange={onDialogOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              "relative w-full max-w-lg max-h-[85vh] overflow-auto",
              "rounded-lg border border-hive-border bg-hive-card p-6 shadow-xl",
              "animate-in fade-in-0 zoom-in-95"
            )}
          >
            {/* Close Button */}
            <Dialog.Close
              className={cn(
                "absolute right-4 top-4 p-1 rounded-md transition-colors",
                "text-hive-muted-foreground hover:text-foreground hover:bg-hive-muted"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className={cn(
                  "shrink-0 flex items-center justify-center w-10 h-10 rounded-full",
                  isServerError ? "bg-red-500/10" : "bg-orange-500/10"
                )}
              >
                <ErrorIcon
                  className={cn(
                    "w-5 h-5",
                    isServerError ? "text-red-500" : "text-orange-500"
                  )}
                />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <Dialog.Title className="text-lg font-semibold">
                  {validatorDetails?.checkName}
                </Dialog.Title>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isServerError ? "text-red-500" : "text-orange-500"
                  )}
                >
                  {isServerError ? "Connection Error" : "Validation Error"}
                </p>
              </div>
            </div>

            {/* Content */}
            <Dialog.Description asChild>
              <div className="space-y-4">
                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider">
                    Message
                  </label>
                  <p className="mt-1 text-sm">{validatorDetails?.message}</p>
                </div>

                {/* Path */}
                <div>
                  <label className="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider">
                    Path
                  </label>
                  <pre className="mt-1 text-sm bg-hive-muted rounded-md px-3 py-2 overflow-x-auto">
                    {validatorDetails?.paths.join(" / ")}
                  </pre>
                </div>

                {/* Params */}
                {validatorDetails?.params && (
                  <div>
                    <label className="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider">
                      Parameters
                    </label>
                    <pre className="mt-1 text-xs bg-hive-muted rounded-md px-3 py-2 overflow-x-auto max-h-48">
                      {displayPrettyJSON()}
                    </pre>
                  </div>
                )}
              </div>
            </Dialog.Description>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-hive-border">
              <Dialog.Close asChild>
                <button
                  className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4",
                    "border border-hive-border bg-transparent",
                    "hover:bg-hive-muted transition-colors"
                  )}
                >
                  Close
                </button>
              </Dialog.Close>
              <button
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-4",
                  "bg-hive-red text-white hover:bg-hive-red/90 transition-colors"
                )}
                onClick={handleErrorClearClick}
              >
                <Eraser className="w-4 h-4" />
                Clear Error
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
