<script lang="ts" module>
  export interface ValidationErrorDialogProps {
    isOpened: boolean;
    onDialogOpenChange: (isOpened: boolean) => void;
    validatorDetails?: import("@kkocot/honeycomb-core").ValidationErrorDetails;
    clearValidationError: (providerName: string, checkerName: string) => void;
  }
</script>

<script lang="ts">
  import type { ValidationErrorDetails } from "@kkocot/honeycomb-core";
  import { Dialog } from "bits-ui";
  import { cn } from "./utils";
  import HealthCheckerIcon from "./healthchecker-icons.svelte";

  let {
    isOpened,
    onDialogOpenChange,
    validatorDetails,
    clearValidationError,
  }: ValidationErrorDialogProps = $props();

  const is_server_error = $derived(
    validatorDetails?.status === "serverError",
  );

  const pretty_json = $derived.by(() => {
    if (typeof validatorDetails?.params === "string") {
      try {
        return JSON.stringify(JSON.parse(validatorDetails.params), null, 2);
      } catch {
        return null;
      }
    }
    return null;
  });

  function handle_error_clear_click() {
    if (validatorDetails?.providerName && validatorDetails?.checkName) {
      clearValidationError(
        validatorDetails.providerName,
        validatorDetails.checkName,
      );
      onDialogOpenChange(false);
    }
  }
</script>

<Dialog.Root open={isOpened} onOpenChange={onDialogOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    />
    <Dialog.Content
      class={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-lg max-h-[85vh] overflow-auto",
        "rounded-lg border border-hive-border bg-hive-card p-6 shadow-xl",
      )}
    >
      <!-- Close Button -->
      <Dialog.Close
        class={cn(
          "absolute right-4 top-4 p-1 rounded-md transition-colors cursor-pointer",
          "text-hive-muted-foreground hover:text-foreground hover:bg-hive-muted",
        )}
      >
        <HealthCheckerIcon name="x" class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </Dialog.Close>

      <!-- Header -->
      <div class="flex items-start gap-3 mb-4">
        <div
          class={cn(
            "shrink-0 flex items-center justify-center w-10 h-10 rounded-full",
            is_server_error ? "bg-red-500/10" : "bg-orange-500/10",
          )}
        >
          {#if is_server_error}
            <HealthCheckerIcon
              name="octagon-alert"
              class="w-5 h-5 text-red-500"
            />
          {:else}
            <HealthCheckerIcon
              name="triangle-alert"
              class="w-5 h-5 text-orange-500"
            />
          {/if}
        </div>
        <div class="min-w-0 flex-1 pt-1">
          <Dialog.Title class="text-lg font-semibold">
            {validatorDetails?.checkName}
          </Dialog.Title>
          <p
            class={cn(
              "text-sm font-medium",
              is_server_error ? "text-red-500" : "text-orange-500",
            )}
          >
            {is_server_error ? "Connection Error" : "Validation Error"}
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Message -->
        <div>
          <label
            class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider"
          >
            Message
          </label>
          <p class="mt-1 text-sm">{validatorDetails?.message}</p>
        </div>

        <!-- Path -->
        <div>
          <label
            class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider"
          >
            Path
          </label>
          <pre
            class="mt-1 text-sm bg-hive-muted rounded-md px-3 py-2 overflow-x-auto">{validatorDetails?.paths.join(
              " / ",
            )}</pre>
        </div>

        <!-- Params -->
        {#if validatorDetails?.params}
          <div>
            <label
              class="text-xs font-medium text-hive-muted-foreground uppercase tracking-wider"
            >
              Parameters
            </label>
            <pre
              class="mt-1 text-xs bg-hive-muted rounded-md px-3 py-2 overflow-x-auto max-h-48">{pretty_json}</pre>
          </div>
        {/if}
      </div>

      <!-- Actions -->
      <div
        class="flex justify-end gap-2 mt-6 pt-4 border-t border-hive-border"
      >
        <button
          class={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
            "border border-hive-border bg-transparent",
            "hover:bg-hive-muted transition-colors",
          )}
          onclick={() => onDialogOpenChange(false)}
        >
          Close
        </button>
        <button
          class={cn(
            "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
            "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
          )}
          onclick={handle_error_clear_click}
        >
          <HealthCheckerIcon name="eraser" class="w-4 h-4" />
          Clear Error
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
