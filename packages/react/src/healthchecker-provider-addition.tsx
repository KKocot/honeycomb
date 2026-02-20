"use client";

import { useState } from "react";
import { cn } from "./utils";
import { Plus, AlertCircle } from "lucide-react";

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

export function ProviderAddition({ onProviderSubmit }: ProviderAdditionProps) {
  const [providerValue, setProviderValue] = useState<string>("");
  const [error, setError] = useState("");

  const onSubmit = (providerValue: string) => {
    if (!isValidUrl(providerValue)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)"
      );
      return;
    }
    setError("");
    onProviderSubmit(providerValue.trim());
    setProviderValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && providerValue) {
      onSubmit(providerValue);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">Add Custom Node</h3>
        <p className="text-xs text-hive-muted-foreground mt-0.5">
          Enter a custom Hive API endpoint URL
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={providerValue}
            className={cn(
              "flex h-10 w-full rounded-md border bg-hive-card px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-hive-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-hive-border focus-visible:ring-hive-red"
            )}
            type="url"
            data-testid="api-address-input"
            placeholder="https://api.example.com"
            onChange={(e) => {
              setProviderValue(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          disabled={!providerValue}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4",
            "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          onClick={() => onSubmit(providerValue)}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
