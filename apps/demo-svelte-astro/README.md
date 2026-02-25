# Honeycomb Svelte Demo (Astro)

Interactive demo of `@barddev/honeycomb-svelte` components in an **Astro 5** project using Svelte islands.

**Dev server:** http://localhost:3043/demo/svelte-astro/

## Adding @barddev/honeycomb-svelte to an Astro project

### 1. Create an Astro app

```bash
npm create astro@latest my-hive-app
cd my-hive-app
npx astro add svelte
```

### 2. Install dependencies

```bash
npm install @barddev/honeycomb-svelte @kkocot/honeycomb-core highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

### 3. Configure Astro

Add `wasmUrlPlugin` so `@hiveio/wax` WASM binary resolves correctly:

```mjs
// astro.config.mjs
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import { wasmUrlPlugin } from "@barddev/honeycomb-svelte/plugins";

export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [wasmUrlPlugin()],
  },
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

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@import "@barddev/honeycomb-svelte/theme.css";

@plugin "@tailwindcss/typography";
```

### 6. Create the Astro layout

```astro
---
// src/layouts/BaseLayout.astro
import "@barddev/honeycomb-svelte/styles.css";
import "../styles/global.css";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body class="min-h-screen antialiased bg-hive-background text-hive-foreground">
    <slot />
  </body>
</html>
```

### 7. Create a Svelte island component

**Important:** `HiveProvider` must be inside the Svelte component, not in `.astro` files. Astro renders `.astro` files on the server where browser APIs are not available.

```svelte
<!-- src/components/HiveApp.svelte -->
<script lang="ts">
  import { HiveProvider, HiveAvatar, HiveUserCard } from "@barddev/honeycomb-svelte";
</script>

<HiveProvider>
  <div class="space-y-6 p-8">
    <HiveAvatar username="blocktrades" size="lg" />
    <HiveUserCard username="blocktrades" />
  </div>
</HiveProvider>
```

### 8. Use in an Astro page

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import HiveApp from "../components/HiveApp.svelte";
---

<BaseLayout title="My Hive App">
  <HiveApp client:only="svelte" />
</BaseLayout>
```

**Use `client:only="svelte"` instead of `client:load`.** The Honeycomb components use browser APIs (`window`, WASM) that are not available during Astro's SSR build. `client:only` skips server rendering entirely and mounts the component only on the client.

## Key differences vs Svelte Vite

| Aspect | Vite SPA | Astro + Svelte |
|--------|----------|----------------|
| Rendering | Full SPA | Static HTML + Svelte islands |
| HiveProvider | In `App.svelte` (root) | Inside Svelte island (client-only) |
| Hydration | Immediate | `client:only="svelte"` required |
| Routing | Manual | Astro file-based routing |
| CSS imports | In `main.ts` entry | In `.astro` layout frontmatter |
| WASM | Works out of the box | Requires `wasmUrlPlugin()` |

## Scripts

```bash
pnpm dev        # Start dev server (port 3043)
pnpm build      # Production build
pnpm test       # Run Playwright tests
```
