# Honeycomb Vue Demo (Nuxt)

Interactive demo of `@hiveio/honeycomb-vue` components in a **Nuxt 3** project (SPA mode).

**Dev server:** http://localhost:3040/demo/vue-nuxt/

## Adding @hiveio/honeycomb-vue to a Nuxt project

### 1. Create a Nuxt app

```bash
npx nuxi@latest init my-hive-app
cd my-hive-app
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

Nuxt uses Vite natively, so use `@tailwindcss/vite` instead of the PostCSS plugin.

### 3. Configure Nuxt

Disable SSR and exclude `@hiveio/wax` from Vite's dependency optimization:

```ts
// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  ssr: false,

  app: {
    baseURL: "/demo/vue-nuxt",
    head: {
      htmlAttrs: { lang: "en", class: "dark" },
      title: "My Hive App",
    },
  },

  css: [
    "~/assets/css/main.css",
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@hiveio/wax"],
    },
  },

  typescript: {
    strict: true,
  },
});
```

### 4. Set up CSS

Create `assets/css/main.css`:

```css
@import "tailwindcss";
@import "@hiveio/honeycomb-vue/theme.css";

@plugin "@tailwindcss/typography";
```

### 5. Set up the app entry

```vue
<!-- app.vue -->
<template>
  <div class="min-h-screen antialiased bg-hive-background text-hive-foreground">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import "@hiveio/honeycomb-vue/styles.css";
</script>
```

### 6. Use components in a page

```vue
<!-- pages/index.vue -->
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

## Key differences vs Vue Vite

| Aspect | Vite SPA | Nuxt 3 (SPA mode) |
|--------|----------|--------------------|
| SSR | None | Disabled (`ssr: false`) |
| Tailwind | `@tailwindcss/postcss` | `@tailwindcss/vite` (Nuxt uses Vite natively) |
| Routing | Manual or vue-router | File-based (`pages/` directory) |
| Auto-imports | Manual imports | Nuxt auto-imports Vue APIs |
| CSS config | `postcss.config.js` | `css` array in `nuxt.config.ts` |
| `<head>` | Manual in `index.html` | `app.head` in `nuxt.config.ts` |

## Why SPA mode?

`@hiveio/wax` loads a WASM binary at runtime. In SSR mode, this WASM module would need to load in Node.js, which can cause compatibility issues. SPA mode (`ssr: false`) ensures all code runs in the browser where WASM is fully supported.

Nuxt SPA mode generates a single `index.html` at build time and handles all routing on the client.

## Scripts

```bash
pnpm dev        # Start dev server (port 3040)
pnpm build      # Production build
pnpm preview    # Preview production build
pnpm generate   # Generate static site
```
