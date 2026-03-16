# Honeycomb Vue Demo (Astro)

Interactive demo of `@hiveio/honeycomb-vue` components in an **Astro 5** project using Vue islands.

**Dev server:** http://localhost:3039/demo/vue-astro/

## Adding @hiveio/honeycomb-vue to an Astro project

### 1. Create an Astro app

```bash
npm create astro@latest my-hive-app
cd my-hive-app
npx astro add vue
```

### 2. Install dependencies

```bash
npm install @hiveio/honeycomb-vue @kkocot/honeycomb-core highlight.js
npm install -D @tailwindcss/vite @tailwindcss/typography tailwindcss
```

Peer dependencies:
- `@kkocot/honeycomb-core` - core types and utilities
- `highlight.js` - optional, for code syntax highlighting in ContentRenderer

`radix-vue` is bundled as a dependency of `@hiveio/honeycomb-vue` and installed automatically.

### 3. Configure Astro

Add `@tailwindcss/vite` and `wasmUrlPlugin` so Tailwind and `@hiveio/wax` WASM binary work correctly:

```mjs
// astro.config.mjs
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { wasmUrlPlugin } from "@hiveio/honeycomb-vue/plugins";

export default defineConfig({
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss(), wasmUrlPlugin()],
  },
});
```

### 4. Set up CSS

Create `src/styles/global.css`:

```css
@import "tailwindcss";
@import "@hiveio/honeycomb-vue/theme.css";

@plugin "@tailwindcss/typography";
```

### 5. Create the Astro layout

```astro
---
// src/layouts/BaseLayout.astro
import "@hiveio/honeycomb-vue/styles.css";
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

### 6. Create a Vue island component

**Important:** `HiveProvider` must be inside the Vue component, not in `.astro` files. Astro renders `.astro` files on the server where browser APIs are not available.

```vue
<!-- src/components/HiveApp.vue -->
<template>
  <HiveProvider>
    <div class="space-y-6 p-8">
      <HiveAvatar username="blocktrades" size="lg" />
      <HiveUserCard username="blocktrades" />
    </div>
  </HiveProvider>
</template>

<script setup lang="ts">
import { HiveProvider, HiveAvatar, HiveUserCard } from "@hiveio/honeycomb-vue";
</script>
```

### 7. Use in an Astro page

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import HiveApp from "../components/HiveApp.vue";
---

<BaseLayout title="My Hive App">
  <HiveApp client:only="vue" />
</BaseLayout>
```

**Use `client:only="vue"` instead of `client:load`.** The Honeycomb components use browser APIs (`window`, WASM) that are not available during Astro's SSR build. `client:only` skips server rendering entirely and mounts the component only on the client.

## Key differences vs Vue Vite

| Aspect | Vite SPA | Astro + Vue |
|--------|----------|-------------|
| Rendering | Full SPA | Static HTML + Vue islands |
| HiveProvider | In `App.vue` (root) | Inside Vue island (client-only) |
| Hydration | Immediate | `client:only="vue"` required |
| Routing | Manual or vue-router | Astro file-based routing |
| CSS imports | In `main.ts` entry | In `.astro` layout frontmatter |
| WASM | Works out of the box | Requires `wasmUrlPlugin()` |

## Scripts

```bash
pnpm dev        # Start dev server (port 3039)
pnpm build      # Production build
pnpm preview    # Preview production build
```
