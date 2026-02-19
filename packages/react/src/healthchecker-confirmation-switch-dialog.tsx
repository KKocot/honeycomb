"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-gray-800 text-white p-6 shadow-lg sm:rounded-lg">
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
          <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
            Confirm Provider Switch
          </Dialog.Title>
          <Dialog.Description>
            Are you sure you want to switch to unconfirmed{" "}
            <span className="font-semibold">{providerLink}</span>?
          </Dialog.Description>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Dialog.Close asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-black dark:text-white">
                Cancel
              </button>
            </Dialog.Close>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
