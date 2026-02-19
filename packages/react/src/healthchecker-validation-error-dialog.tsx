"use client";

import type { ValidationErrorDetails } from "@kkocot/honeycomb-core";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

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

  return (
    <Dialog.Root open={isOpened} onOpenChange={onDialogOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-gray-800 text-white p-6 shadow-lg sm:rounded-lg">
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
          <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
            {validatorDetails?.checkName}{" "}
            {validatorDetails?.status === "serverError"
              ? "connection"
              : "validation"}{" "}
            error
          </Dialog.Title>
          <Dialog.Description asChild>
            <div>
              <div>Message:</div>
              <div>{validatorDetails?.message}</div>
              <div className="mt-4">Path:</div>
              <pre>{validatorDetails?.paths.join("/")}</pre>
              {validatorDetails?.params && (
                <>
                  <div className="mt-4">Params:</div>
                  <pre>{displayPrettyJSON()}</pre>
                </>
              )}
            </div>
          </Dialog.Description>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleErrorClearClick}
            >
              Clear error
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
