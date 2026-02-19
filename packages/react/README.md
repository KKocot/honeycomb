# @barddev/honeycomb-react

[![npm version](https://img.shields.io/npm/v/@barddev/honeycomb-react)](https://www.npmjs.com/package/@barddev/honeycomb-react) [![license](https://img.shields.io/npm/l/@barddev/honeycomb-react)](https://github.com/KKocot/honeycomb/blob/main/LICENSE)

React components and hooks for Hive Blockchain applications. Read-only (passive) - displays blockchain data without auth or transaction signing. SSR-compatible, works with Next.js App Router.

[Documentation](https://honeycomb.bard-dev.com/docs/react/introduction) | [GitHub](https://github.com/KKocot/honeycomb)

## Installation

```bash
npm install @barddev/honeycomb-react
# or
pnpm add @barddev/honeycomb-react
# or
yarn add @barddev/honeycomb-react
# or
bun add @barddev/honeycomb-react
```

### Peer Dependencies

```bash
npm install @hiveio/wax @radix-ui/react-popover react react-dom
# or
pnpm add @hiveio/wax @radix-ui/react-popover react react-dom
# or
yarn add @hiveio/wax @radix-ui/react-popover react react-dom
# or
bun add @hiveio/wax @radix-ui/react-popover react react-dom
```

`@radix-ui/react-popover` is only required if you use the `ApiTracker` component.

### Styles

Import the bundled stylesheet in your entry file (e.g. `main.tsx`, `layout.tsx`):

```tsx
import "@barddev/honeycomb-react/styles.css";
```

Includes CSS variables, component styles, Tailwind utilities, and theme tokens.

## Quick Start

```tsx
// app/layout.tsx (Next.js App Router)
import { HiveProvider } from "@barddev/honeycomb-react";
import "@barddev/honeycomb-react/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <HiveProvider>{children}</HiveProvider>
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
"use client";

import { useHive, HiveAvatar, UserCard } from "@barddev/honeycomb-react";

export default function Page() {
  const { chain, is_loading, error, status } = useHive();

  if (is_loading) return <div>Connecting to Hive...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Status: {status}</p>
      <HiveAvatar username="blocktrades" size="lg" />
      <UserCard username="blocktrades" variant="expanded" />
    </div>
  );
}
```

## Documentation

Full API reference, live examples, and guides:

**[honeycomb.bard-dev.com/docs/react/introduction](https://honeycomb.bard-dev.com/docs/react/introduction)**

- HiveProvider configuration
- Hooks API
- Components (HiveAvatar, UserCard, BalanceCard, ApiTracker, HiveManabar, HivePostCard, HivePostList, HiveContentRenderer)
- SSR compatibility
- TypeScript types

## License

MIT
