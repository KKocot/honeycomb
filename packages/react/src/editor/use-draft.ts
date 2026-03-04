"use client";

import { useEffect, useRef, useCallback } from "react";
import type { DraftConfig, DraftData } from "@kkocot/honeycomb-core";

const DEFAULT_DEBOUNCE_MS = 2000;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface UseDraftOptions {
  config: DraftConfig | undefined;
  value: string;
  on_save?: (draft: DraftData) => void;
  on_restore?: (draft: DraftData) => void;
}

interface UseDraftReturn {
  restore_draft: () => DraftData | null;
  clear_draft: () => void;
}

function read_draft(key: string, ttl_ms: number): DraftData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("content" in parsed) ||
      !("savedAt" in parsed) ||
      typeof (parsed as Record<string, unknown>).content !== "string" ||
      typeof (parsed as Record<string, unknown>).savedAt !== "number"
    ) {
      return null;
    }

    const draft = parsed as DraftData;
    const age = Date.now() - draft.savedAt;
    if (age > ttl_ms) {
      localStorage.removeItem(key);
      return null;
    }

    return draft;
  } catch {
    return null;
  }
}

function write_draft(key: string, draft: DraftData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Storage full or unavailable - silently ignore
  }
}

export function use_draft(options: UseDraftOptions): UseDraftReturn {
  const { config, value, on_save, on_restore } = options;
  const timer_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const on_save_ref = useRef(on_save);
  const on_restore_ref = useRef(on_restore);

  on_save_ref.current = on_save;
  on_restore_ref.current = on_restore;

  const enabled = config?.enabled ?? false;
  const key = config?.key ?? "";
  const debounce_ms = config?.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const ttl_ms = config?.ttlMs ?? DEFAULT_TTL_MS;

  // Debounced auto-save
  useEffect(() => {
    if (!enabled || !key) return;

    if (timer_ref.current) {
      clearTimeout(timer_ref.current);
    }

    timer_ref.current = setTimeout(() => {
      const draft: DraftData = {
        content: value,
        savedAt: Date.now(),
      };
      write_draft(key, draft);
      on_save_ref.current?.(draft);
    }, debounce_ms);

    return () => {
      if (timer_ref.current) {
        clearTimeout(timer_ref.current);
      }
    };
  }, [enabled, key, value, debounce_ms]);

  // Cross-tab sync
  useEffect(() => {
    if (!enabled || !key) return;

    function handle_storage(event: StorageEvent) {
      if (event.key !== key || !event.newValue) return;
      const draft = read_draft(key, ttl_ms);
      if (draft) {
        on_restore_ref.current?.(draft);
      }
    }

    window.addEventListener("storage", handle_storage);
    return () => window.removeEventListener("storage", handle_storage);
  }, [enabled, key, ttl_ms]);

  const restore_draft = useCallback((): DraftData | null => {
    if (!enabled || !key) return null;
    const draft = read_draft(key, ttl_ms);
    if (draft) {
      on_restore_ref.current?.(draft);
    }
    return draft;
  }, [enabled, key, ttl_ms]);

  const clear_draft = useCallback(() => {
    if (!key) return;
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently ignore
    }
  }, [key]);

  return { restore_draft, clear_draft };
}
