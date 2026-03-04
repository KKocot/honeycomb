import { watch, computed, onUnmounted, type Ref } from "vue";
import type { DraftConfig, DraftData } from "@kkocot/honeycomb-core";

const DEFAULT_DEBOUNCE_MS = 2000;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface UseDraftOptions {
  config: Ref<DraftConfig | undefined>;
  value: Ref<string>;
  on_save?: (draft: DraftData) => void;
  on_restore?: (draft: DraftData) => void;
}

export interface UseDraftReturn {
  restore_draft: () => DraftData | null;
  clear_draft: () => void;
}

function is_draft_data(value: unknown): value is DraftData {
  if (typeof value !== "object" || value === null) return false;
  if (!("content" in value) || !("savedAt" in value)) return false;
  // After `in` checks, TS narrows to `{ content: unknown; savedAt: unknown }`
  const { content, savedAt } = value;
  return typeof content === "string" && typeof savedAt === "number";
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
    // Storage full or unavailable
  }
}

export function use_draft(options: UseDraftOptions): UseDraftReturn {
  const enabled = computed(() => options.config.value?.enabled ?? false);
  const key = computed(() => options.config.value?.key ?? "");
  const debounce_ms = computed(
    () => options.config.value?.debounceMs ?? DEFAULT_DEBOUNCE_MS,
  );
  const ttl_ms = computed(
    () => options.config.value?.ttlMs ?? DEFAULT_TTL_MS,
  );

  let timer: ReturnType<typeof setTimeout> | null = null;

  // Debounced auto-save
  watch(
    () => options.value.value,
    (current_value) => {
      if (!enabled.value || !key.value) return;

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(
        () => {
          const draft: DraftData = {
            content: current_value,
            savedAt: Date.now(),
          };
          write_draft(key.value, draft);
          options.on_save?.(draft);
        },
        debounce_ms.value,
      );
    },
  );

  // Cross-tab sync
  function handle_storage(event: StorageEvent) {
    if (!enabled.value || !key.value) return;
    if (event.key !== key.value || !event.newValue) return;
    const draft = read_draft(key.value, ttl_ms.value);
    if (draft) {
      options.on_restore?.(draft);
    }
  }

  // Re-register storage listener when enabled/key changes
  let listener_registered = false;

  function register_listener() {
    if (typeof window === "undefined") return;
    if (listener_registered) {
      window.removeEventListener("storage", handle_storage);
    }
    if (enabled.value && key.value) {
      window.addEventListener("storage", handle_storage);
      listener_registered = true;
    } else {
      listener_registered = false;
    }
  }

  watch([enabled, key], register_listener, { immediate: true });

  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer);
    }
    if (listener_registered && typeof window !== "undefined") {
      window.removeEventListener("storage", handle_storage);
    }
  });

  function restore_draft(): DraftData | null {
    if (!enabled.value || !key.value) return null;
    const draft = read_draft(key.value, ttl_ms.value);
    if (draft) {
      options.on_restore?.(draft);
    }
    return draft;
  }

  function clear_draft(): void {
    if (!key.value) return;
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key.value);
    } catch {
      // Silently ignore
    }
  }

  return { restore_draft, clear_draft };
}
