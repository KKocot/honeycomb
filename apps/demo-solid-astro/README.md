# Honeycomb Solid Demo (Astro)

Interactive demo of `@hiveio/honeycomb-solid` components in an **Astro 5** project using Solid.js islands.

**Dev server:** http://localhost:3038/demo/solid-astro/

## Adding @hiveio/honeycomb-solid to an Astro project

### 1. Create an Astro app

```bash
npm create astro@latest my-hive-app
cd my-hive-app
npx astro add solid-js
```

### 2. Install dependencies

```bash
npm install @hiveio/honeycomb-solid @kkocot/honeycomb-core highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

### 3. Configure Astro

Add the `wasmUrlPlugin` so `@hiveio/wax` WASM binary resolves correctly:

```mjs
// astro.config.mjs
import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import { wasmUrlPlugin } from "@hiveio/honeycomb-solid/plugins";

export default defineConfig({
  integrations: [solidJs()],
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
@import "@hiveio/honeycomb-solid/theme.css";

@plugin "@tailwindcss/typography";
```

### 6. Create the Astro layout

```astro
---
// src/layouts/BaseLayout.astro
import "@hiveio/honeycomb-solid/styles.css";
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

### 7. Create a Solid island component

**Important:** `HiveProvider` must be inside the Solid component, not in `.astro` files. Astro renders `.astro` files on the server where browser APIs are not available.

```tsx
// src/components/HiveApp.tsx
import { HiveProvider, HiveAvatar, HiveUserCard } from "@hiveio/honeycomb-solid";

export default function HiveApp() {
  return (
    <HiveProvider>
      <div class="space-y-6 p-8">
        <HiveAvatar username="blocktrades" size="lg" />
        <HiveUserCard username="blocktrades" />
      </div>
    </HiveProvider>
  );
}
```

### 8. Use in an Astro page

```astro
---
// src/pages/index.astro
import BaseLayout from "../layouts/BaseLayout.astro";
import HiveApp from "../components/HiveApp";
---

<BaseLayout title="My Hive App">
  <HiveApp client:only="solid-js" />
</BaseLayout>
```

**Use `client:only="solid-js"` instead of `client:load`.** The Honeycomb components use browser APIs (`window`, WASM) that are not available during Astro's SSR build. `client:only` skips server rendering entirely and mounts the component only on the client.

## Key differences vs Solid Vite

| Aspect | Vite SPA | Astro + Solid |
|--------|----------|---------------|
| Rendering | Full SPA | Static HTML + Solid islands |
| HiveProvider | In `App.tsx` (root) | Inside Solid island (client-only) |
| Hydration | Immediate | `client:only="solid-js"` required |
| Routing | Manual or library | Astro file-based routing |
| CSS imports | In `index.tsx` entry | In `.astro` layout frontmatter |
| WASM | Works out of the box | Requires `wasmUrlPlugin()` |

## Scripts

```bash
pnpm dev        # Start dev server (port 3038)
pnpm build      # Production build
pnpm test       # Run Playwright tests
```
