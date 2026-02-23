# @barddev/honeycomb-solid

[![npm version](https://img.shields.io/npm/v/@barddev/honeycomb-solid)](https://www.npmjs.com/package/@barddev/honeycomb-solid) [![license](https://img.shields.io/npm/l/@barddev/honeycomb-solid)](https://github.com/KKocot/honeycomb/blob/main/LICENSE)

Solid.js components and hooks for Hive Blockchain applications. Read-only (passive) -- displays blockchain data without auth or transaction signing. SSR-compatible, works with SolidStart and Astro.

[Documentation](https://honeycomb.bard-dev.com/docs/solid/introduction) | [GitHub](https://github.com/KKocot/honeycomb)

## Requirements

| Dependency | Version | Required |
|------------|---------|----------|
| solid-js | >= 1.8.0 | Yes |
| @hiveio/wax | >= 1.28.0 | Yes |
| tailwindcss | >= 4.0.0 | Recommended (for theme.css) |
| @kobalte/core | >= 0.13.0 | Only for ApiTracker |

## Installation

```bash
npm install @barddev/honeycomb-solid @hiveio/wax solid-js
# or
pnpm add @barddev/honeycomb-solid @hiveio/wax solid-js
# or
yarn add @barddev/honeycomb-solid @hiveio/wax solid-js
# or
bun add @barddev/honeycomb-solid @hiveio/wax solid-js
```

## CSS Setup

The package exports 3 CSS files -- pick what fits your project:

| File | What it includes | When to use |
|------|-----------------|-------------|
| `styles.css` | CSS vars + component styles + Tailwind utilities + theme tokens | Quick start -- all-in-one, no Tailwind needed |
| `base.css` | CSS vars + component styles only | You have your own Tailwind setup |
| `theme.css` | `@theme inline` tokens only | Add `hive-*` utility classes to your Tailwind project |

### Option A: All-in-one (no Tailwind required)

Import `styles.css` in your entry file:

```tsx
import "@barddev/honeycomb-solid/styles.css";
```

### Option B: With your own Tailwind CSS (recommended)

1. Import `base.css` for component styles (without Tailwind utilities) in your entry file:

```tsx
import "@barddev/honeycomb-solid/base.css";
```

2. Import `theme.css` in your global CSS to get `hive-*` utility classes:

```css
@import "tailwindcss";
@import "@barddev/honeycomb-solid/theme.css";

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

### Vite + Solid (SPA)

```tsx
// src/index.tsx
import { render } from "solid-js/web";
import { HiveProvider } from "@barddev/honeycomb-solid";
import "@barddev/honeycomb-solid/styles.css";
import App from "./App";

const root_element = document.getElementById("root");
if (!root_element) throw new Error("Root element not found");

render(
  () => (
    <HiveProvider>
      <App />
    </HiveProvider>
  ),
  root_element,
);
```

```tsx
// src/App.tsx
import { Show } from "solid-js";
import { useHive, HiveAvatar, UserCard } from "@barddev/honeycomb-solid";

export default function App() {
  const { is_loading, error, status } = useHive();

  return (
    <Show when={!is_loading()} fallback={<div>Connecting to Hive...</div>}>
      <Show when={!error()} fallback={<div>Error: {error()}</div>}>
        <p>Status: {status()}</p>
        <HiveAvatar username="blocktrades" size="lg" />
        <UserCard username="blocktrades" variant="expanded" />
      </Show>
    </Show>
  );
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
});
```

### Astro + Solid

**Use `client:only="solid-js"` (NOT `client:load`)** -- `@hiveio/wax` uses WASM which does not work in Node.js SSR.

```astro
---
// src/pages/index.astro
import DemoApp from "../components/DemoApp";
import "@barddev/honeycomb-solid/styles.css";
import "../styles/global.css";
---

<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hive App</title>
  </head>
  <body class="min-h-screen antialiased bg-hive-background text-hive-foreground">
    <DemoApp client:only="solid-js" />
  </body>
</html>
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
  integrations: [solidJs()],
});
```

If you get WASM errors in dev, add the `wasmUrlPlugin`:

```js
import { wasmUrlPlugin } from "@barddev/honeycomb-solid/plugins";

export default defineConfig({
  integrations: [solidJs()],
  vite: {
    plugins: [wasmUrlPlugin()],
  },
});
```

### SolidStart

**Wrap Honeycomb components with `clientOnly()`** -- WASM does not work during SSR.

```tsx
// src/routes/index.tsx
import { clientOnly } from "@solidjs/start";

const ClientApp = clientOnly(() => import("../ClientApp"));

export default function Home() {
  return <ClientApp fallback={<div class="min-h-screen bg-background" />} />;
}
```

```tsx
// src/ClientApp.tsx
import { HiveProvider } from "@barddev/honeycomb-solid";
import App from "./App";

export default function ClientApp() {
  return (
    <HiveProvider>
      <App />
    </HiveProvider>
  );
}
```

```ts
// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import { wasmUrlPlugin } from "@barddev/honeycomb-solid/plugins";

export default defineConfig({
  ssr: true,
  vite: {
    plugins: [wasmUrlPlugin()],
    resolve: {
      conditions: ["solid", "browser", "module"],
    },
    ssr: {
      noExternal: ["@barddev/honeycomb-solid"],
    },
    optimizeDeps: {
      exclude: ["@hiveio/wax"],
    },
  },
});
```

> Note: `wasmUrlPlugin` is required for projects outside the honeycomb monorepo.
> Demo apps in the repository may omit it due to Vite workspace resolution.

## Troubleshooting

**Components render without styles**
- Ensure you import `styles.css` or `base.css` in your entry file.
- If using Option B (own Tailwind), check that `theme.css` is imported in your global CSS.

**White/blank page after adding Tailwind**
- Add `class="dark"` to `<html>` element.
- Add `bg-hive-background text-hive-foreground` to `<body>`.

**WASM error: Failed to fetch dynamically imported module**
- Astro/SolidStart: add `wasmUrlPlugin()` from `@barddev/honeycomb-solid/plugins` to your Vite config.

**SSR errors with SolidStart**
- Wrap components with `clientOnly()` from `@solidjs/start`.
- Add `ssr: { noExternal: ["@barddev/honeycomb-solid"] }` to vite config.

## Components

- **HiveProvider** -- context provider, wraps your app
- **HiveAvatar** -- user profile picture
- **UserCard** -- user profile card (compact / expanded)
- **BalanceCard** -- HIVE / HBD / HP balances
- **HiveManabar** -- resource credit / voting manabar
- **HivePostCard** -- single post card
- **HivePostList** -- paginated post feed
- **HiveContentRenderer** -- renders Hive Markdown content
- **ApiTracker** -- API endpoint status (requires `@kobalte/core`)

## Hooks

- `useHive()` -- connection status, chain instance, error state
- `useHiveChain()` -- direct access to the Wax chain object
- `useApiEndpoint()` -- current API endpoint info
- `useHiveStatus()` -- connection status signal
- `useHiveAccount(username)` -- fetch account data
- `useHivePost(author, permlink)` -- fetch a single post
- `useHivePostList(options)` -- fetch paginated post list

## Documentation

Full API reference, live examples, and guides:

**[honeycomb.bard-dev.com/docs/solid/introduction](https://honeycomb.bard-dev.com/docs/solid/introduction)**

## License

MIT
