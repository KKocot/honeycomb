import { createSignal, Show, type Component } from "solid-js";
import { cn } from "./utils";
import { IconPlus, IconAlertCircle } from "./healthchecker-icons";

export interface ProviderAdditionProps {
  onProviderSubmit: (provider: string) => void;
}

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const hasValidProtocol =
      parsed.protocol === "http:" || parsed.protocol === "https:";
    const hasDomainExtension = /\.[a-z]{2,}$/i.test(parsed.hostname);
    return hasValidProtocol && hasDomainExtension;
  } catch {
    return false;
  }
};

export const ProviderAddition: Component<ProviderAdditionProps> = (props) => {
  const [providerValue, setProviderValue] = createSignal("");
  const [error, setError] = createSignal("");

  const onSubmit = (value: string) => {
    if (!isValidUrl(value)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)"
      );
      return;
    }
    setError("");
    props.onProviderSubmit(value.trim());
    setProviderValue("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && providerValue()) {
      onSubmit(providerValue());
    }
  };

  return (
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
            value={providerValue()}
            class={cn(
              "flex h-10 w-full rounded-md border bg-hive-card px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-hive-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error()
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-hive-border focus-visible:ring-hive-red"
            )}
            type="url"
            data-testid="api-address-input"
            placeholder="https://api.example.com"
            onInput={(e) => {
              setProviderValue(e.currentTarget.value);
              if (error()) setError("");
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          disabled={!providerValue()}
          class={cn(
            "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
            "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          onClick={() => onSubmit(providerValue())}
        >
          <IconPlus class="w-4 h-4" />
          Add
        </button>
      </div>

      <Show when={error()}>
        <div class="flex items-center gap-2 text-sm text-red-500">
          <IconAlertCircle class="w-4 h-4 shrink-0" />
          <span>{error()}</span>
        </div>
      </Show>
    </div>
  );
};
