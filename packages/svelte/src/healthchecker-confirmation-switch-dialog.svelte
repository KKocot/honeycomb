<script lang="ts" module>
  export interface ConfirmationSwitchDialogProps {
    isOpened: boolean;
    onDialogOpenChange: (isOpened: boolean) => void;
    onConfirm: () => void;
    providerLink?: string;
  }
</script>

<script lang="ts">
  import { Dialog } from "bits-ui";
  import { cn } from "./utils";
  import HealthCheckerIcon from "./healthchecker-icons.svelte";

  let {
    isOpened,
    onDialogOpenChange,
    onConfirm,
    providerLink,
  }: ConfirmationSwitchDialogProps = $props();
</script>

<Dialog.Root open={isOpened} onOpenChange={onDialogOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    />
    <Dialog.Content
      class={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-md",
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

      <!-- Warning Icon -->
      <div
        class="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4"
      >
        <HealthCheckerIcon
          name="triangle-alert"
          class="w-6 h-6 text-orange-500"
        />
      </div>

      <!-- Title -->
      <Dialog.Title class="text-lg font-semibold mb-2">
        Switch to Unverified Provider?
      </Dialog.Title>

      <!-- Description -->
      <Dialog.Description class="text-sm text-hive-muted-foreground mb-6">
        This provider has not passed all validation checks. Are you sure you
        want to switch to
        <span class="font-medium text-foreground break-all"
          >{providerLink}</span
        >?
      </Dialog.Description>

      <!-- Actions -->
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button
          class={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
            "border border-hive-border bg-transparent",
            "hover:bg-hive-muted transition-colors",
          )}
          onclick={() => onDialogOpenChange(false)}
        >
          Cancel
        </button>
        <button
          class={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
            "bg-orange-500 text-white hover:bg-orange-600 transition-colors",
          )}
          onclick={onConfirm}
        >
          Switch Anyway
        </button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
