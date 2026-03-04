<script lang="ts" module>
  export interface ProviderAdditionProps {
    onProviderSubmit: (provider: string) => void;
  }
</script>

<script lang="ts">
  import { cn } from "./utils";
  import HealthCheckerIcon from "./healthchecker-icons.svelte";

  let { onProviderSubmit }: ProviderAdditionProps = $props();

  let provider_value = $state("");
  let error = $state("");

  function is_valid_url(url: string): boolean {
    try {
      const parsed = new URL(url);
      const has_valid_protocol =
        parsed.protocol === "http:" || parsed.protocol === "https:";
      const has_domain_extension = /\.[a-z]{2,}$/i.test(parsed.hostname);
      return has_valid_protocol && has_domain_extension;
    } catch {
      return false;
    }
  }

  function on_submit(value: string) {
    if (!is_valid_url(value)) {
      error =
        "Please enter a valid URL (must start with http:// or https://)";
      return;
    }
    error = "";
    onProviderSubmit(value.trim());
    provider_value = "";
  }
</script>

<div class="space-y-3">
  <div>
    <h3 class="text-sm font-semibold">Add Custom Node</h3>
    <p class="text-xs text-hive-muted-foreground mt-0.5">
      Enter a custom Hive API endpoint URL
    </p>
  </div>

  <div class="flex gap-2">
    <div class="relative flex-1">
      <input
        bind:value={provider_value}
        oninput={() => {
          if (error) error = "";
        }}
        onkeydown={(e) => {
          if (e.key === "Enter" && provider_value) on_submit(provider_value);
        }}
        class={cn(
          "flex h-10 w-full rounded-md border bg-hive-card px-3 py-2 text-sm",
          "ring-offset-background placeholder:text-hive-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-hive-border focus-visible:ring-hive-red",
        )}
        type="url"
        data-testid="api-address-input"
        placeholder="https://api.example.com"
      />
    </div>
    <button
      disabled={!provider_value}
      class={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4",
        "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
      onclick={() => on_submit(provider_value)}
    >
      <HealthCheckerIcon name="plus" class="w-4 h-4" />
      Add
    </button>
  </div>

  {#if error}
    <div class="flex items-center gap-2 text-sm text-red-500">
      <HealthCheckerIcon name="alert-circle" class="w-4 h-4 shrink-0" />
      <span>{error}</span>
    </div>
  {/if}
</div>
