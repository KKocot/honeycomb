# @kkocot/hive-ui-react

React components for Hive Blockchain applications. SSR-compatible, works with Next.js App Router.

## Installation

### 1. Configure npm for GitHub Packages

```bash
echo "@kkocot:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

### 2. Install

```bash
npm install @kkocot/hive-ui-react
# or
pnpm add @kkocot/hive-ui-react
```

## Quick Start

### 1. Add HiveProvider

```tsx
// app/layout.tsx (Next.js App Router)
import { HiveProvider } from '@kkocot/hive-ui-react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <HiveProvider>
          {children}
        </HiveProvider>
      </body>
    </html>
  )
}
```

### 2. Use hooks

```tsx
// app/page.tsx
'use client'

import { useHive, useHiveUser, useIsLoggedIn } from '@kkocot/hive-ui-react'

export default function Page() {
  const { chain, isLoading, error } = useHive()
  const user = useHiveUser()
  const isLoggedIn = useIsLoggedIn()

  if (isLoading) return <div>Connecting to Hive...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome, @{user.username}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

## API Reference

### HiveProvider

Root provider component. Must wrap your app.

```tsx
<HiveProvider
  storageKey="hive-ui-session"  // localStorage key for session
  apiEndpoint="https://api.hive.blog"  // Hive API node
  onLogin={(user) => console.log('Logged in:', user)}
  onLogout={() => console.log('Logged out')}
>
  {children}
</HiveProvider>
```

### Hooks

#### useHive()

Returns full context:

```tsx
const {
  chain,      // IHiveChainInterface | null
  isLoading,  // boolean
  error,      // string | null
  user,       // HiveUser | null
  login,      // (username: string, method: string) => void
  logout,     // () => void
  isClient,   // boolean - true when on client
} = useHive()
```

#### useHiveChain()

Returns Hive chain instance (null during SSR):

```tsx
const chain = useHiveChain()

// Use for API calls
const accounts = await chain?.api.database_api.find_accounts({
  accounts: ['blocktrades']
})
```

#### useHiveUser()

Returns current user or null:

```tsx
const user = useHiveUser()
// { username: 'alice', loginMethod: 'keychain' } | null
```

#### useIsLoggedIn()

Returns boolean:

```tsx
const isLoggedIn = useIsLoggedIn()
```

#### useHiveAuth()

Returns auth-related values:

```tsx
const { user, login, logout, isLoading } = useHiveAuth()
```

## SSR Compatibility

The package is fully SSR-compatible:

- `chain` is `null` during server-side rendering
- `isClient` flag indicates client-side hydration
- No localStorage access during SSR
- Safe to use in Next.js App Router with `"use client"` components

## Types

```tsx
interface HiveUser {
  username: string
  loginMethod: string
}

interface HiveProviderProps {
  children: ReactNode
  storageKey?: string
  apiEndpoint?: string
  onLogin?: (user: HiveUser) => void
  onLogout?: () => void
}
```

## License

MIT
