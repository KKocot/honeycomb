import { createEffect, onCleanup } from "solid-js";
import type { DraftConfig, DraftData } from "@kkocot/honeycomb-core";

const DEFAULT_DEBOUNCE_MS = 2000;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CreateDraftOptions {
  config: DraftConfig | undefined;
  value: () => string;
  on_save?: (draft: DraftData) => void;
  on_restore?: (draft: DraftData) => void;
}

interface CreateDraftReturn {
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

export function create_draft(options: CreateDraftOptions): CreateDraftReturn {
  const enabled = options.config?.enabled ?? false;
  const key = options.config?.key ?? "";
  const debounce_ms = options.config?.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const ttl_ms = options.config?.ttlMs ?? DEFAULT_TTL_MS;

  // Debounced auto-save
  createEffect(() => {
    if (!enabled || !key) return;

    const current_value = options.value();
    const timer = setTimeout(() => {
      const draft: DraftData = {
        content: current_value,
        savedAt: Date.now(),
      };
      write_draft(key, draft);
      options.on_save?.(draft);
    }, debounce_ms);

    onCleanup(() => clearTimeout(timer));
  });

  // Cross-tab sync
  createEffect(() => {
    if (!enabled || !key) return;

    function handle_storage(event: StorageEvent) {
      if (event.key !== key || !event.newValue) return;
      const draft = read_draft(key, ttl_ms);
      if (draft) {
        options.on_restore?.(draft);
      }
    }

    window.addEventListener("storage", handle_storage);
    onCleanup(() => window.removeEventListener("storage", handle_storage));
  });

  function restore_draft(): DraftData | null {
    if (!enabled || !key) return null;
    const draft = read_draft(key, ttl_ms);
    if (draft) {
      options.on_restore?.(draft);
    }
    return draft;
  }

  function clear_draft(): void {
    if (!key) return;
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently ignore
    }
  }

  return { restore_draft, clear_draft };
}
