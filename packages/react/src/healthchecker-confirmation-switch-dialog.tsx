"use client";

import { IconX } from "./healthchecker-icons";

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
  if (!isOpened) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/80"
        onClick={() => onDialogOpenChange(false)}
      />
      <div className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-gray-800 text-white p-6 shadow-lg sm:rounded-lg">
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          onClick={() => onDialogOpenChange(false)}
        >
          <IconX className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="text-lg font-semibold leading-none tracking-tight">
            Confirm Provider Switch
          </div>
        </div>
        <div>
          Are you sure you want to switch to unconfirmed{" "}
          <span className="font-semibold">{providerLink}</span>?
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-black dark:text-white"
            onClick={() => onDialogOpenChange(false)}
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
