# @barddev/honeycomb-react

React components and hooks for Hive Blockchain applications. Read-only (passive) - displays blockchain data without auth or transaction signing. SSR-compatible, works with Next.js App Router.

## Installation

```bash
npm install @barddev/honeycomb-react
# or
pnpm add @barddev/honeycomb-react
```

### Peer Dependencies

```bash
npm install @hiveio/wax @radix-ui/react-popover react react-dom
```

### Styles

Import the stylesheet in your layout or entry file:

```tsx
import "@barddev/honeycomb-react/styles.css";
```

Components use Tailwind CSS classes with custom `hive-*` CSS variables. The stylesheet provides default values for these variables.

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

## HiveProvider

Root provider component. Manages blockchain connection with automatic endpoint fallback and health monitoring.

```tsx
<HiveProvider
  apiEndpoints={["https://api.hive.blog", "https://api.deathwing.me"]}
  timeout={5000}
  healthCheckInterval={30000}
  onEndpointChange={(endpoint) => console.log("Switched to:", endpoint)}
>
  {children}
</HiveProvider>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiEndpoints` | `string[]` | `DEFAULT_API_ENDPOINTS` | API endpoints in priority order |
| `timeout` | `number` | `5000` | Request timeout in ms |
| `healthCheckInterval` | `number` | `30000` | Health check interval in ms (0 = disabled) |
| `onEndpointChange` | `(endpoint: string) => void` | - | Callback on endpoint switch |

## Hooks

### useHive()

Full context access. Throws if used outside `HiveProvider`.

```tsx
const {
  chain,              // IHiveChainInterface | null
  is_loading,         // boolean
  error,              // string | null
  is_client,          // boolean
  api_endpoint,       // string | null
  status,             // "connected" | "connecting" | "reconnecting" | "error" | "disconnected"
  endpoints,          // EndpointStatus[]
  refresh_endpoints,  // () => Promise<void>
} = useHive();
```

### useHiveChain()

Returns Hive chain instance (`null` during SSR / before connection).

```tsx
const chain = useHiveChain();

const accounts = await chain?.api.database_api.find_accounts({
  accounts: ["blocktrades"],
});
```

### useApiEndpoint()

Returns currently connected API endpoint or `null`.

```tsx
const endpoint = useApiEndpoint();
```

### useHiveStatus()

Returns connection status and endpoint health.

```tsx
const { status, endpoints } = useHiveStatus();
```

### useHiveAccount(username)

Fetches account data including balances, HP, reputation, and savings.

```tsx
const { account, is_loading, error, refetch } = useHiveAccount("blocktrades");

// account.balance       -> "1,234.567 HIVE"
// account.hbd_balance   -> "100.000 HBD"
// account.hive_power    -> "50,000.000 HP"
// account.effective_hp  -> "55,000.000 HP"
// account.reputation    -> 75
// account.post_count    -> 1234
```

### useHivePost(author, permlink)

Fetches a single post via `condenser_api.get_content`.

```tsx
const { post, is_loading, error } = useHivePost("barddev", "my-post-permlink");

// post.title, post.body, post.votes, post.comments, post.payout, post.created, post.thumbnail
```

### useHivePostList(options?)

Paginated list of ranked posts via `bridge.get_ranked_posts`.

```tsx
const {
  posts,       // RankedPost[]
  is_loading,
  error,
  sort,        // current SortType
  set_sort,    // change sort (resets pagination)
  has_next,
  has_prev,
  next_page,
  prev_page,
  page,        // current page number
} = useHivePostList({ sort: "trending", tag: "hive", limit: 10 });
```

Sort types: `"trending"` | `"hot"` | `"created"` | `"payout"` | `"muted"`

## Components

### HiveAvatar

User avatar with automatic fallback to colored initials.

```tsx
<HiveAvatar username="blocktrades" size="lg" showBorder />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Avatar size |
| `showBorder` | `boolean` | `false` | Show ring border |
| `fallbackColor` | `string` | auto-generated | Custom fallback background color |
| `className` | `string` | - | Additional CSS classes |

### UserCard

User profile card with reputation, stats, and metadata.

```tsx
<UserCard username="blocktrades" variant="expanded" showStats />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"compact" \| "default" \| "expanded"` | `"default"` | Display style |
| `showStats` | `boolean` | `true` | Show post count and balances |
| `className` | `string` | - | Additional CSS classes |

### BalanceCard

Wallet balances display (HIVE, HBD, HP, savings, delegations).

```tsx
<BalanceCard username="blocktrades" variant="expanded" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"compact" \| "default" \| "expanded"` | `"default"` | Display style |
| `className` | `string` | - | Additional CSS classes |

### ApiTracker

Connection status indicator with endpoint health popover. Requires `@radix-ui/react-popover`.

```tsx
<ApiTracker showUrl side="bottom" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showUrl` | `boolean` | `false` | Show current endpoint hostname |
| `side` | `"top" \| "bottom"` | `"bottom"` | Popover position |
| `className` | `string` | - | Additional CSS classes |

### HiveManabar

Voting Power, Downvote Power, and Resource Credits as ring charts.

```tsx
<HiveManabar username="blocktrades" variant="full" showValues showCooldown />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | required | Hive username |
| `variant` | `"full" \| "compact" \| "ring"` | `"full"` | Display style (`ring` = RC only) |
| `showLabels` | `boolean` | `true` | Show manabar labels |
| `showValues` | `boolean` | `false` | Show current/max values |
| `showCooldown` | `boolean` | `true` | Show time to full recharge |
| `className` | `string` | - | Additional CSS classes |

### HivePostCard

Single post card with thumbnail, author, stats, and content preview.

```tsx
<HivePostCard author="blocktrades" permlink="my-post" variant="card" hide={["payout"]} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `author` | `string` | required | Post author |
| `permlink` | `string` | required | Post permlink |
| `variant` | `"card" \| "compact" \| "grid"` | `"card"` | Display style |
| `hide` | `PostHideOption[]` | `[]` | Hide elements: `"author"`, `"thumbnail"`, `"payout"`, `"votes"`, `"comments"`, `"time"` |
| `linkTarget` | `string` | `"https://blog.openhive.network"` | Base URL for post links |
| `className` | `string` | - | Additional CSS classes |

### HivePostList

Paginated post feed with sort controls and pinned posts.

```tsx
<HivePostList
  sort="trending"
  tag="hive"
  limit={20}
  show_sort_controls
  variant="compact"
  pinned_posts={[{ author: "hiveio", permlink: "announcement" }]}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sort` | `SortType` | `"trending"` | Initial sort order |
| `tag` | `string` | - | Community or tag filter |
| `limit` | `number` | `20` | Posts per page |
| `pinned_posts` | `{ author, permlink }[]` | - | Pinned posts at the top |
| `show_sort_controls` | `boolean` | `false` | Show sort buttons |
| `variant` | `"card" \| "compact" \| "grid"` | `"compact"` | Post card variant |
| `hide` | `PostHideOption[]` | `[]` | Hide elements on cards |
| `linkTarget` | `string` | `"https://blog.openhive.network"` | Base URL for post links |
| `className` | `string` | - | Additional CSS classes |

### HiveContentRenderer

Renders Hive post markdown/HTML body with plugin support (tables, embeds, syntax highlighting).

```tsx
import { HiveContentRenderer, DEFAULT_PLUGINS } from "@barddev/honeycomb-react";

<HiveContentRenderer
  body={post.body}
  author="blocktrades"
  permlink="my-post"
  plugins={DEFAULT_PLUGINS}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `body` | `string` | required | Post body (markdown/HTML) |
| `author` | `string` | - | Post author (for image proxy) |
| `permlink` | `string` | - | Post permlink |
| `options` | `Partial<RendererOptions>` | - | Renderer options |
| `plugins` | `RendererPlugin[]` | `DEFAULT_PLUGINS` | Renderer plugins |
| `className` | `string` | - | Additional CSS classes |

Available plugins: `TablePlugin`, `TwitterPlugin`, `TwitterResizePlugin`, `InstagramPlugin`, `InstagramResizePlugin`, `HighlightPlugin`, `DEFAULT_PLUGINS` (all bundled).

## SSR Compatibility

- `chain` is `null` during server-side rendering
- `is_client` flag indicates client-side hydration
- No `localStorage` / `window` access during SSR
- Components render loading skeletons on server, fetch data on client
- Safe to use in Next.js App Router with `"use client"` directive

## Types

All types are exported for direct use:

```tsx
import type {
  // Provider
  HiveContextValue,
  HiveProviderProps,
  // Core
  ConnectionStatus,
  EndpointStatus,
  HiveClientState,
  // Account
  HiveAccount,
  UseHiveAccountResult,
  // Posts
  HivePost,
  UseHivePostResult,
  UseHivePostListOptions,
  UseHivePostListResult,
  SortType,
  PaginationCursor,
  RankedPost,
  RankedPostsResult,
  // Components
  HiveAvatarProps,
  AvatarSize,
  UserCardProps,
  UserCardVariant,
  BalanceCardProps,
  BalanceCardVariant,
  ApiTrackerProps,
  HiveManabarProps,
  ManabarVariant,
  HivePostCardProps,
  PostVariant,
  PostHideOption,
  HivePostListProps,
  HiveContentRendererProps,
  // Renderer
  RendererOptions,
  RendererPlugin,
  PostContext,
} from "@barddev/honeycomb-react";
```

## License

MIT
