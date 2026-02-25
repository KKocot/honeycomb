# Honeycomb Svelte Demo (SvelteKit)

Interactive demo of `@barddev/honeycomb-svelte` components in a **SvelteKit** project with SSR.

**Dev server:** http://localhost:3042/

## Adding @barddev/honeycomb-svelte to a SvelteKit project

### 1. Create a SvelteKit app

```bash
npx sv create my-hive-app
cd my-hive-app
```

### 2. Install dependencies

```bash
npm install @barddev/honeycomb-svelte @kkocot/honeycomb-core highlight.js
npm install -D @sveltejs/adapter-node @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

### 3. Configure SvelteKit

```js
// svelte.config.js
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
};
```

Add `wasmUrlPlugin` so `@hiveio/wax` WASM binary resolves correctly:

```ts
// vite.config.ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { wasmUrlPlugin } from "@barddev/honeycomb-svelte/plugins";

export default defineConfig({
  plugins: [sveltekit(), wasmUrlPlugin()],
});
```

### 4. Configure PostCSS

```js
// postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 5. Set up CSS

Create `src/app.css`:

```css
@import "tailwindcss";
@import "@barddev/honeycomb-svelte/theme.css";

@plugin "@tailwindcss/typography";
```

### 6. Set up the root layout

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import "@barddev/honeycomb-svelte/styles.css";
  import "../app.css";

  let { children } = $props();
</script>

<div class="min-h-screen antialiased bg-hive-background text-hive-foreground">
  {@render children()}
</div>
```

### 7. Use components with SSR guard

Since `@hiveio/wax` uses WASM and browser APIs, guard Hive components with `{#if browser}`:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { browser } from "$app/environment";
  import { HiveProvider, HiveAvatar, HiveUserCard } from "@barddev/honeycomb-svelte";
</script>

{#if browser}
  <HiveProvider>
    <div class="space-y-6 p-8">
      <HiveAvatar username="blocktrades" size="lg" />
      <HiveUserCard username="blocktrades" />
    </div>
  </HiveProvider>
{:else}
  <div class="min-h-screen bg-hive-background"></div>
{/if}
```

**Use `{#if browser}` to prevent SSR rendering of Hive components.** The WASM binary and browser APIs are not available during server-side rendering. The `{:else}` block renders a placeholder on the server.

## Key differences vs Svelte Vite

| Aspect | Vite SPA | SvelteKit |
|--------|----------|-----------|
| SSR | None (pure SPA) | Built-in SSR |
| HiveProvider | In `App.svelte` directly | Inside `{#if browser}` guard |
| Routing | Manual | File-based (`src/routes/`) |
| Build tool | Vite + `@sveltejs/vite-plugin-svelte` | Vite + `@sveltejs/kit` |
| WASM config | Works out of the box | Requires `wasmUrlPlugin()` |
| Adapter | N/A | `@sveltejs/adapter-node` |

## Why the browser guard?

`@hiveio/wax` loads a WASM binary at runtime. In SSR mode, this WASM module would need to load in Node.js, which causes compatibility issues. The `{#if browser}` check ensures Hive components render only in the browser where WASM is fully supported, while the server renders a lightweight placeholder.

## Scripts

```bash
pnpm dev        # Start dev server (port 3042)
pnpm build      # Production build
pnpm preview    # Preview production build
pnpm test       # Run Playwright tests
```
