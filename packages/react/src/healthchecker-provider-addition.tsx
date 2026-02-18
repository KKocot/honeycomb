"use client";

import { useState } from "react";
import { cn } from "./utils";

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

  return (
    <div className="flex flex-col justify left">
      <div className="font-semibold">Add Custom Node:</div>
      <div className="text-sm mb-2">Enter a custom Hive node URL.</div>
      <div className="flex w-full">
        <input
          value={providerValue}
          autoFocus={true}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus:bg-white dark:focus:bg-gray-700"
          )}
          type="url"
          data-testid="api-address-input"
          placeholder="(e.g., https://example.com)"
          onChange={(e) => setProviderValue(e.target.value)}
        />
        <button
          disabled={providerValue === ""}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:bg-slate-400 ml-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => {
            onSubmit(providerValue);
          }}
        >
          Add
        </button>
      </div>
      {error ? <div className="flex text-red-500">{error}</div> : null}
    </div>
  );
}
