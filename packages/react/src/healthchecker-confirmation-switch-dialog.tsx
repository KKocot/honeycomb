"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "./utils";

export interface ConfirmationSwitchDialogProps {
  isOpened: boolean;
  onDialogOpenChange: (isOpened: boolean) => void;
  onConfirm: () => void;
  providerLink?: string;
}

export function ConfirmationSwitchDialog({
  isOpened,
  onDialogOpenChange,
  onConfirm,
  providerLink,
}: ConfirmationSwitchDialogProps) {
  return (
    <Dialog.Root open={isOpened} onOpenChange={onDialogOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              "relative w-full max-w-md",
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

            {/* Warning Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>

            {/* Title */}
            <Dialog.Title className="text-lg font-semibold mb-2">
              Switch to Unverified Provider?
            </Dialog.Title>

            {/* Description */}
            <Dialog.Description className="text-sm text-hive-muted-foreground mb-6">
              This provider has not passed all validation checks. Are you sure you want to switch to{" "}
              <span className="font-medium text-foreground break-all">
                {providerLink}
              </span>
              ?
            </Dialog.Description>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4",
                    "border border-hive-border bg-transparent",
                    "hover:bg-hive-muted transition-colors"
                  )}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4",
                  "bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                )}
                onClick={onConfirm}
              >
                Switch Anyway
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
