const DEFAULT_DEBOUNCE_MS = 2000;
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
function is_draft_data(value) {
    if (typeof value !== "object" || value === null)
        return false;
    if (!("content" in value) || !("savedAt" in value))
        return false;
    if (typeof value.content !== "string")
        return false;
    if (typeof value.savedAt !== "number")
        return false;
    return true;
}
function read_draft(key, ttl_ms) {
    if (typeof window === "undefined")
        return null;
    try {
        const raw = localStorage.getItem(key);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        if (!is_draft_data(parsed)) {
            return null;
        }
        const age = Date.now() - parsed.savedAt;
        if (age > ttl_ms) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed;
    }
    catch {
        return null;
    }
}
function write_draft(key, draft) {
    if (typeof window === "undefined")
        return;
    try {
        localStorage.setItem(key, JSON.stringify(draft));
    }
    catch {
        // Storage full or unavailable - silently ignore
    }
}
export function create_draft(options) {
    const enabled = options.config?.enabled ?? false;
    const key = options.config?.key ?? "";
    const debounce_ms = options.config?.debounceMs ?? DEFAULT_DEBOUNCE_MS;
    const ttl_ms = options.config?.ttlMs ?? DEFAULT_TTL_MS;
    let timer = null;
    function save(content) {
        if (!enabled || !key)
            return;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            const draft = {
                content,
                savedAt: Date.now(),
            };
            write_draft(key, draft);
            options.on_save?.(draft);
            timer = null;
        }, debounce_ms);
    }
    function restore_draft_fn() {
        if (!enabled || !key)
            return null;
        const draft = read_draft(key, ttl_ms);
        if (draft) {
            options.on_restore?.(draft);
        }
        return draft;
    }
    function clear_draft() {
        if (!key)
            return;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        if (typeof window === "undefined")
            return;
        try {
            localStorage.removeItem(key);
        }
        catch {
            // Silently ignore
        }
    }
    function start_cross_tab_sync() {
        if (!enabled || !key)
            return () => { };
        function handle_storage(event) {
            if (event.key !== key || !event.newValue)
                return;
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
