# Honeycomb React Demo (React Router)

Interactive demo of `@barddev/honeycomb-react` components in a **React Router 7** project (SPA mode).

**Dev server:** http://localhost:3036/demo/react-remix/

## Adding @barddev/honeycomb-react to a React Router 7 project

### 1. Create a React Router app

```bash
npx create-react-router@latest my-hive-app
cd my-hive-app
```

### 2. Install dependencies

```bash
npm install @barddev/honeycomb-react @kkocot/honeycomb-core @radix-ui/react-popover highlight.js
npm install -D @tailwindcss/postcss @tailwindcss/typography postcss tailwindcss
```

### 3. Configure SPA mode

`@hiveio/wax` uses WASM which may not work in Node.js SSR. Use SPA mode to avoid SSR issues:

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
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

Replace `app/app.css`:

```css
@import "tailwindcss";
@import "@barddev/honeycomb-react/theme.css";

@plugin "@tailwindcss/typography";
```

### 6. Set up the root layout

```tsx
// app/root.tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { HiveProvider } from "@barddev/honeycomb-react";
import "@barddev/honeycomb-react/styles.css";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen antialiased bg-hive-background text-hive-foreground">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <HiveProvider>
      <Outlet />
    </HiveProvider>
  );
}
```

**Import order matters:**

1. `styles.css` first - CSS variables, component styles, and pre-compiled Tailwind utilities
2. `app.css` second - your Tailwind setup with `theme.css` for `hive-*` utility classes

### 7. Use components in a route

```tsx
// app/routes/home.tsx
import { HiveAvatar, UserCard, useHive } from "@barddev/honeycomb-react";
import { useSearchParams } from "react-router";

export function meta() {
  return [{ title: "My Hive App" }];
}

export default function Home() {
  const { status } = useHive();
  return (
    <div className="space-y-6 p-8">
      <p>Status: {status}</p>
      <HiveAvatar username="blocktrades" size="lg" />
      <UserCard username="blocktrades" />
    </div>
  );
}
```

No `"use client"` directive needed - React Router SPA mode runs everything on the client.

## Key differences vs Next.js

| Aspect | Next.js | React Router 7 (SPA) |
|--------|---------|----------------------|
| SSR | Built-in | Disabled (`ssr: false`) |
| `"use client"` | Required on hook-using components | Not needed |
| HiveProvider | In `layout.tsx` | In `root.tsx` default export |
| Query params | `useSearchParams` from `next/navigation` | `useSearchParams` from `react-router` |
| Layout shell | `layout.tsx` exports JSX | `root.tsx` exports `Layout` + default |
| `<head>` management | `metadata` export | `meta()` function export |
| CSS imports | In layout.tsx | In root.tsx |

## Why SPA mode?

`@hiveio/wax` loads a WASM binary at runtime. In SSR mode, this WASM module would need to load in Node.js, which can cause compatibility issues. SPA mode (`ssr: false`) ensures all code runs in the browser where WASM is fully supported.

React Router 7 SPA mode generates a single `index.html` at build time and handles all routing on the client, similar to a traditional Vite SPA but with React Router's layout and routing system.

## Scripts

```bash
pnpm dev        # Start dev server (port 3036)
pnpm build      # Production build
pnpm start      # Serve production build
pnpm test       # Run Playwright tests
```
