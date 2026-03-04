import type { DraftConfig, DraftData } from "@kkocot/honeycomb-core";

const DEFAULT_DEBOUNCE_MS = 2000;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface CreateDraftOptions {
  config: DraftConfig | undefined;
  on_save?: (draft: DraftData) => void;
  on_restore?: (draft: DraftData) => void;
}

export interface CreateDraftReturn {
  save: (content: string) => void;
  restore_draft: () => DraftData | null;
  clear_draft: () => void;
  start_cross_tab_sync: () => () => void;
}

function is_draft_data(value: unknown): value is DraftData {
  if (typeof value !== "object" || value === null) return false;
  if (!("content" in value) || !("savedAt" in value)) return false;
  if (typeof value.content !== "string") return false;
  if (typeof value.savedAt !== "number") return false;
  return true;
}

function read_draft(key: string, ttl_ms: number): DraftData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!is_draft_data(parsed)) {
      return null;
    }

    const age = Date.now() - parsed.savedAt;
    if (age > ttl_ms) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed;
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

  let timer: ReturnType<typeof setTimeout> | null = null;

  function save(content: string): void {
    if (!enabled || !key) return;

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      const draft: DraftData = {
        content,
        savedAt: Date.now(),
      };
      write_draft(key, draft);
      options.on_save?.(draft);
      timer = null;
    }, debounce_ms);
  }

  function restore_draft_fn(): DraftData | null {
    if (!enabled || !key) return null;
    const draft = read_draft(key, ttl_ms);
    if (draft) {
      options.on_restore?.(draft);
    }
    return draft;
  }

  function clear_draft(): void {
    if (!key) return;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently ignore
    }
  }

  function start_cross_tab_sync(): () => void {
    if (!enabled || !key) return () => {};

    function handle_storage(event: StorageEvent): void {
      if (event.key !== key || !event.newValue) return;
      const draft = read_draft(key, ttl_ms);
      if (draft) {
        options.on_restore?.(draft);
      }
    }

    window.addEventListener("storage", handle_storage);
    return () => {
      window.removeEventListener("storage", handle_storage);
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
  }

  return {
    save,
    restore_draft: restore_draft_fn,
    clear_draft,
    start_cross_tab_sync,
  };
}
