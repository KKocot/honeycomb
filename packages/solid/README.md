# @barddev/honeycomb-solid

[![npm version](https://img.shields.io/npm/v/@barddev/honeycomb-solid)](https://www.npmjs.com/package/@barddev/honeycomb-solid) [![license](https://img.shields.io/npm/l/@barddev/honeycomb-solid)](https://github.com/KKocot/honeycomb/blob/main/LICENSE)

Solid.js components and hooks for Hive Blockchain applications. Read-only (passive) - displays blockchain data without auth or transaction signing. SSR-compatible, works with SolidStart and Astro.

[Documentation](https://honeycomb.bard-dev.com/docs/solid/introduction) | [GitHub](https://github.com/KKocot/honeycomb)

## Installation

```bash
npm install @barddev/honeycomb-solid
# or
pnpm add @barddev/honeycomb-solid
# or
yarn add @barddev/honeycomb-solid
# or
bun add @barddev/honeycomb-solid
```

### Peer Dependencies

```bash
npm install @hiveio/wax @kobalte/core solid-js
# or
pnpm add @hiveio/wax @kobalte/core solid-js
# or
yarn add @hiveio/wax @kobalte/core solid-js
# or
bun add @hiveio/wax @kobalte/core solid-js
```

`@kobalte/core` is only required if you use the `ApiTracker` component.

### Styles

Import the bundled stylesheet in your entry file (e.g. `index.tsx`, `root.tsx`):

```tsx
import "@barddev/honeycomb-solid/styles.css";
```

Includes CSS variables, component styles, Tailwind utilities, and theme tokens.

## Quick Start

```tsx
// src/index.tsx (Vite + Solid)
import { render } from "solid-js/web";
import { HiveProvider } from "@barddev/honeycomb-solid";
import "@barddev/honeycomb-solid/styles.css";
import App from "./App";

render(
  () => (
    <HiveProvider>
      <App />
    </HiveProvider>
  ),
  document.getElementById("root")!,
);
```

```tsx
// src/App.tsx
import { Show } from "solid-js";
import { useHive, HiveAvatar, UserCard } from "@barddev/honeycomb-solid";

export default function App() {
  const { chain, is_loading, error, status } = useHive();

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

## Documentation

Full API reference, live examples, and guides:

**[honeycomb.bard-dev.com/docs/solid/introduction](https://honeycomb.bard-dev.com/docs/solid/introduction)**

- HiveProvider configuration
- Hooks API
- Components (HiveAvatar, UserCard, BalanceCard, ApiTracker, HiveManabar, HivePostCard, HivePostList, HiveContentRenderer)
- SSR compatibility
- TypeScript types

## License

MIT
