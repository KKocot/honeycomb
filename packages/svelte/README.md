# Honeycomb Svelte

[![npm version](https://img.shields.io/npm/v/@hiveio/honeycomb-svelte)](https://www.npmjs.com/package/@hiveio/honeycomb-svelte) [![license](https://img.shields.io/npm/l/@hiveio/honeycomb-svelte)](https://github.com/KKocot/honeycomb/blob/main/LICENSE)

Svelte 5 components and hooks for Hive Blockchain applications. Read-only (passive) -- displays blockchain data without auth or transaction signing. Uses Svelte 5 runes ($state, $derived, $props).

[Documentation](https://honeycomb.bard-dev.com/docs/svelte/introduction) | [GitHub](https://github.com/KKocot/honeycomb) | [npm](https://www.npmjs.com/package/@hiveio/honeycomb-svelte)

## Requirements

| Dependency | Version | Required |
|------------|---------|----------|
| svelte | >= 5.0.0 | Yes |
| @hiveio/wax | >= 1.28.0 | Yes |
| tailwindcss | >= 4.0.0 | Recommended (for theme.css) |
| bits-ui | >= 1.0.0 | Only for ApiTracker |

## Installation

```bash
npm install @hiveio/honeycomb-svelte @hiveio/wax svelte
# or
pnpm add @hiveio/honeycomb-svelte @hiveio/wax svelte
# or
yarn add @hiveio/honeycomb-svelte @hiveio/wax svelte
# or
bun add @hiveio/honeycomb-svelte @hiveio/wax svelte
```

## CSS Setup

The package exports 3 CSS files -- pick what fits your project:

| File | What it includes | When to use |
|------|-----------------|-------------|
| `styles.css` | CSS vars + component styles + Tailwind utilities + theme tokens | Quick start -- all-in-one, no Tailwind needed |
| `base.css` | CSS vars + component styles only | You have your own Tailwind setup |
| `theme.css` | `@theme inline` tokens only | Add `hive-*` utility classes to your Tailwind project |

### Option A: All-in-one (no Tailwind required)

```ts
import "@hiveio/honeycomb-svelte/styles.css";
```

### Option B: With your own Tailwind CSS (recommended)

1. Import `base.css` for component styles in your entry file:

```ts
import "@hiveio/honeycomb-svelte/base.css";
```

2. Import `theme.css` in your global CSS to get `hive-*` utility classes:

```css
@import "tailwindcss";
@import "@hiveio/honeycomb-svelte/theme.css";

@theme inline {
  --color-background: hsl(var(--hive-background));
  --color-foreground: hsl(var(--hive-foreground));
  --color-border: hsl(var(--hive-border));
  --color-muted: hsl(var(--hive-muted));
  --color-muted-foreground: hsl(var(--hive-muted-foreground));
  --color-card: hsl(var(--hive-card));
  --color-card-foreground: hsl(var(--hive-card-foreground));
}
```

## Dark Mode

Add `dark` class to `<html>` and apply body classes:

```html
<html lang="en" class="dark">
  <body class="min-h-screen antialiased bg-hive-background text-hive-foreground">
```

Light mode works by default (no `dark` class needed).

## Quick Start

### Vite + Svelte (SPA)

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import { HiveProvider } from "@hiveio/honeycomb-svelte";
  import "@hiveio/honeycomb-svelte/styles.css";
  import Inner from "./Inner.svelte";
</script>

<HiveProvider>
  <Inner />
</HiveProvider>
```

```svelte
<!-- src/Inner.svelte -->
<script lang="ts">
  import { useHive, HiveAvatar, UserCard } from "@hiveio/honeycomb-svelte";

  const hive = useHive();
</script>

{#if hive.is_loading}
  <div>Connecting to Hive...</div>
{:else if hive.error}
  <div>Error: {hive.error}</div>
{:else}
  <p>Status: {hive.status}</p>
  <HiveAvatar username="blocktrades" size="lg" />
  <UserCard username="blocktrades" variant="expanded" />
{/if}
```

### SvelteKit

`@hiveio/wax` uses WASM which does not work in Node.js SSR. Use a `{#if browser}` guard to render HiveProvider only on the client.

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { browser } from "$app/environment";
  import { HiveProvider } from "@hiveio/honeycomb-svelte";
  import "@hiveio/honeycomb-svelte/styles.css";
</script>

{#if browser}
  <HiveProvider>
    <YourApp />
  </HiveProvider>
{:else}
  <div class="min-h-screen bg-background"></div>
{/if}
```

```ts
// vite.config.ts (SvelteKit)
import { sveltekit } from "@sveltejs/kit/vite";
import { wasmUrlPlugin } from "@hiveio/honeycomb-svelte/plugins";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), wasmUrlPlugin()],
});
```

### Astro + Svelte

Use `client:only="svelte"` (NOT `client:load`) -- WASM does not work in Node.js SSR.

```astro
---
import DemoApp from "../components/DemoApp.svelte";
import "@hiveio/honeycomb-svelte/styles.css";
---

<html lang="en" class="dark">
  <body class="min-h-screen antialiased bg-hive-background text-hive-foreground">
    <DemoApp client:only="svelte" />
  </body>
</html>
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import { wasmUrlPlugin } from "@hiveio/honeycomb-svelte/plugins";

export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [wasmUrlPlugin()],
  },
});
```

> Note: `wasmUrlPlugin` is required for projects outside the honeycomb monorepo.

## Troubleshooting

**Components render without styles**
- Ensure you import `styles.css` or `base.css` in your entry file.
- If using Option B (own Tailwind), check that `theme.css` is imported in your global CSS.

**White/blank page after adding Tailwind**
- Add `class="dark"` to `<html>` element.
- Add `bg-hive-background text-hive-foreground` to `<body>`.

**WASM error: Failed to fetch dynamically imported module**
- SvelteKit/Astro: add `wasmUrlPlugin()` from `@hiveio/honeycomb-svelte/plugins` to your Vite config.

**SSR errors with SvelteKit**
- Wrap `HiveProvider` in `{#if browser}` guard (import `browser` from `$app/environment`).
- Add `wasmUrlPlugin()` to Vite config.

## Components

- **HiveProvider** -- context provider, wraps your app (uses Svelte context + runes)
- **HiveAvatar** -- user profile picture
- **UserCard** -- user profile card (compact / expanded)
- **BalanceCard** -- HIVE / HBD / HP balances
- **HiveManabar** -- resource credit / voting manabar
- **HivePostCard** -- single post card
- **HivePostList** -- paginated post feed
- **HiveContentRenderer** -- renders Hive Markdown content
- **ApiTracker** -- API endpoint status (requires `bits-ui`)

## Hooks

- `useHive()` -- connection status, chain instance, error state
- `useHiveChain()` -- direct access to the Wax chain object
- `useApiEndpoint()` -- current API endpoint info
- `useHiveStatus()` -- connection status and endpoints
- `useHiveAccount(username)` -- fetch account data
- `useHivePost(author, permlink)` -- fetch a single post
- `useHivePostList(options)` -- fetch paginated post list

## Documentation

Full API reference, live examples, and guides:

**[honeycomb.bard-dev.com/docs/svelte/introduction](https://honeycomb.bard-dev.com/docs/svelte/introduction)**

## License

MIT
