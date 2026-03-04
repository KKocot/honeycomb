import { Show, type Component } from "solid-js";
import type { ValidationErrorDetails } from "@kkocot/honeycomb-core";
import { Dialog } from "@kobalte/core/dialog";
import { cn } from "./utils";
import { IconX, IconOctagonAlert, IconTriangleAlert, IconEraser } from "./healthchecker-icons";

export interface ValidationErrorDialogProps {
  isOpened: boolean;
  onDialogOpenChange: (isOpened: boolean) => void;
  validatorDetails?: ValidationErrorDetails;
  clearValidationError: (providerName: string, checkerName: string) => void;
}

export const ValidationErrorDialog: Component<ValidationErrorDialogProps> = (props) => {
  const handleErrorClearClick = () => {
    if (props.validatorDetails?.providerName && props.validatorDetails?.checkName) {
      props.clearValidationError(
        props.validatorDetails.providerName,
        props.validatorDetails.checkName
      );
      props.onDialogOpenChange(false);
    }
  };

  const displayPrettyJSON = () => {
    try {
      return typeof props.validatorDetails?.params === "string"
        ? JSON.stringify(JSON.parse(props.validatorDetails.params), null, 2)
        : null;
    } catch {
      return null;
    }
  };

  const isServerError = () => props.validatorDetails?.status === "serverError";

  return (
    <Dialog open={props.isOpened} onOpenChange={props.onDialogOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Dialog.Content
            class={cn(
              "relative w-full max-w-lg max-h-[85vh] overflow-auto",
              "rounded-lg border border-hive-border bg-hive-card p-6 shadow-xl",
              "animate-in fade-in-0 zoom-in-95"
            )}
          >
            {/* Close Button */}
            <Dialog.CloseButton
              class={cn(
                "absolute right-4 top-4 p-1 rounded-md transition-colors cursor-pointer",
                "text-hive-muted-foreground hover:text-foreground hover:bg-hive-muted"
              )}
            >
              <IconX class="h-4 w-4" />
              <span class="sr-only">Close</span>
            </Dialog.CloseButton>

            {/* Header */}
            <div class="flex items-start gap-3 mb-4">
              <div
                class={cn(
                  "shrink-0 flex items-center justify-center w-10 h-10 rounded-full",
                  isServerError() ? "bg-red-500/10" : "bg-orange-500/10"
                )}
              >
                <Show
                  when={isServerError()}
                  fallback={
                    <IconTriangleAlert class={cn("w-5 h-5", "text-orange-500")} />
                  }
                >
                  <IconOctagonAlert class={cn("w-5 h-5", "text-red-500")} />
                </Show>
              </div>
              <div class="min-w-0 flex-1 pt-1">
                <Dialog.Title class="text-lg font-semibold">
                  {props.validatorDetails?.checkName}
                </Dialog.Title>
                <p
                  class={cn(
                    "text-sm font-medium",
                    isServerError() ? "text-red-500" : "text-orange-500"
                  )}
                >
                  {isServerError() ? "Connection Error" : "Validation Error"}
                </p>
              </div>
            </div>

            {/* Content */}
            <Dialog.Description as="div" class="space-y-4">
              {/* Message */}
              <div>
                <label class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider">
                  Message
                </label>
                <p class="mt-1 text-sm">{props.validatorDetails?.message}</p>
              </div>

              {/* Path */}
              <div>
                <label class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider">
                  Path
                </label>
                <pre class="mt-1 text-sm bg-hive-muted rounded-md px-3 py-2 overflow-x-auto">
                  {props.validatorDetails?.paths.join(" / ")}
                </pre>
              </div>

              {/* Params */}
              <Show when={props.validatorDetails?.params}>
                <div>
                  <label class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider">
                    Parameters
                  </label>
                  <pre class="mt-1 text-xs bg-hive-muted rounded-md px-3 py-2 overflow-x-auto max-h-48">
                    {displayPrettyJSON()}
                  </pre>
                </div>
              </Show>
            </Dialog.Description>

            {/* Actions */}
            <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-hive-border">
              <button
                class={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
                  "border border-hive-border bg-transparent",
                  "hover:bg-hive-muted transition-colors"
                )}
                onClick={() => props.onDialogOpenChange(false)}
              >
                Close
              </button>
              <button
                class={cn(
                  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
                  "bg-hive-red text-white hover:bg-hive-red/90 transition-colors"
                )}
                onClick={handleErrorClearClick}
              >
                <IconEraser class="w-4 h-4" />
                Clear Error
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog>
  );
};
