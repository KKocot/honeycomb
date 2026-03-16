# Honeycomb Solid Demo (SolidStart)

Interactive demo of `@hiveio/honeycomb-solid` components in a **SolidStart** project with SSR.

**Dev server:** http://localhost:3037/

## Adding @hiveio/honeycomb-solid to a SolidStart project

### 1. Create a SolidStart app

```bash
npm create solid@latest my-hive-app
cd my-hive-app
```

### 2. Install dependencies

```bash
npm install @hiveio/honeycomb-solid @kkocot/honeycomb-core highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

### 3. Configure SolidStart

`@hiveio/wax` uses WASM which requires special configuration for SSR. Add `wasmUrlPlugin`, resolve conditions, and `noExternal`:

```ts
// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import { wasmUrlPlugin } from "@hiveio/honeycomb-solid/plugins";

export default defineConfig({
  ssr: true,
  vite: {
    plugins: [wasmUrlPlugin()],
    resolve: {
      conditions: ["solid", "browser", "module"],
    },
    ssr: {
      noExternal: ["@hiveio/honeycomb-solid"],
    },
    optimizeDeps: {
      exclude: ["@hiveio/wax"],
    },
  },
});
```

- `wasmUrlPlugin()` - resolves `.wasm` imports as URLs
- `conditions: ["solid"]` - ensures Vite resolves the Solid source export
- `noExternal` - bundles the package instead of treating it as external in SSR
- `optimizeDeps.exclude` - prevents Vite from pre-bundling WASM

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

Create `src/global.css`:

```css
@import "tailwindcss";
@import "@hiveio/honeycomb-solid/theme.css";

@plugin "@tailwindcss/typography";
```

### 6. Set up the app entry

```tsx
// src/app.tsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "@hiveio/honeycomb-solid/styles.css";
import "./global.css";

export default function App() {
  return (
    <Router root={(props) => <Suspense>{props.children}</Suspense>}>
      <FileRoutes />
    </Router>
  );
}
```

### 7. Use clientOnly for Hive components

Since `@hiveio/wax` uses WASM and browser APIs, wrap your Hive components with `clientOnly()` to skip SSR:

```tsx
// src/routes/index.tsx
import { clientOnly } from "@solidjs/start";

const ClientApp = clientOnly(() => import("../ClientApp"));

export default function Home() {
  return (
    <ClientApp fallback={<div class="min-h-screen bg-background" />} />
  );
}
```

```tsx
// src/ClientApp.tsx
import { HiveProvider, HiveAvatar, HiveUserCard } from "@hiveio/honeycomb-solid";

export default function ClientApp() {
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

**Use `clientOnly()` instead of rendering `HiveProvider` directly in routes.** The WASM binary and browser APIs are not available during SSR. `clientOnly()` defers the component to client-side only and renders the `fallback` on the server.

## Key differences vs Solid Vite

| Aspect | Vite SPA | SolidStart |
|--------|----------|------------|
| SSR | None (pure SPA) | Built-in SSR |
| HiveProvider | In `App.tsx` directly | Inside `clientOnly()` wrapper |
| Routing | Manual | `@solidjs/router` file-based |
| Build tool | Vite | Vinxi (Vite-based) |
| WASM config | Works out of the box | Requires `wasmUrlPlugin()` + `noExternal` |

## Why clientOnly?

`@hiveio/wax` loads a WASM binary at runtime. In SSR mode, this WASM module would need to load in Node.js, which causes compatibility issues. `clientOnly()` ensures Hive components render only in the browser where WASM is fully supported, while the server renders the provided fallback.

## Scripts

```bash
pnpm dev        # Start dev server (port 3037)
pnpm build      # Production build
pnpm start      # Serve production build
pnpm test       # Run Playwright tests
```
