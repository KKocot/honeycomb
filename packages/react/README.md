# @barddev/honeycomb-react

Honeycomb - React components for Hive Blockchain applications. SSR-compatible, works with Next.js App Router.

## Installation

### 1. Configure npm for GitHub Packages

```bash
echo "@kkocot:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

### 2. Install

```bash
npm install @barddev/honeycomb-react
# or
pnpm add @barddev/honeycomb-react
```

## Quick Start

### 1. Add HiveProvider

```tsx
// app/layout.tsx (Next.js App Router)
import { HiveProvider } from '@barddev/honeycomb-react'

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

import { useHive, useHiveUser, useIsLoggedIn } from '@barddev/honeycomb-react'

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

## Auth Components

### KeychainLogin

Login form using Hive Keychain browser extension:

```tsx
'use client'

import { KeychainLogin, hasKeychain } from '@barddev/honeycomb-react'

export function LoginPage() {
  return (
    <KeychainLogin
      onSuccess={(username) => console.log('Logged in:', username)}
      onError={(error) => console.error(error)}
      keyType="Posting"  // or "Active"
    />
  )
}

// Check if Keychain is available
if (hasKeychain()) {
  console.log('Keychain is installed')
}
```

### PeakVaultLogin

Login form using PeakVault browser extension:

```tsx
'use client'

import { PeakVaultLogin, hasPeakVault } from '@barddev/honeycomb-react'

export function LoginPage() {
  return (
    <PeakVaultLogin
      onSuccess={(username) => console.log('Logged in:', username)}
      onError={(error) => console.error(error)}
    />
  )
}
```

## Social Components

### HiveAvatar

Display Hive user avatars with automatic fallback to initials:

```tsx
'use client'

import { HiveAvatar } from '@barddev/honeycomb-react'

export function UserProfile() {
  return (
    <div className="flex items-center gap-4">
      <HiveAvatar username="blocktrades" size="xs" />
      <HiveAvatar username="blocktrades" size="sm" />
      <HiveAvatar username="blocktrades" size="md" />
      <HiveAvatar username="blocktrades" size="lg" />
      <HiveAvatar username="blocktrades" size="xl" />
    </div>
  )
}
```

### UserCard

Display Hive user profile cards with account information:

```tsx
'use client'

import { UserCard } from '@barddev/honeycomb-react'

export function ProfilePage() {
  return (
    <div className="space-y-4">
      {/* Compact - inline display */}
      <UserCard username="blocktrades" variant="compact" />

      {/* Default - card with basic info */}
      <UserCard username="blocktrades" variant="default" />

      {/* Expanded - full profile card with cover image */}
      <UserCard username="blocktrades" variant="expanded" />
    </div>
  )
}
```

### useHiveAccount

Hook to fetch Hive account data:

```tsx
'use client'

import { useHiveAccount } from '@barddev/honeycomb-react'

export function AccountInfo({ username }: { username: string }) {
  const { account, isLoading, error } = useHiveAccount(username)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <p>Balance: {account?.balance}</p>
      <p>Posts: {account?.post_count}</p>
    </div>
  )
}
```

## SSR Compatibility

The package is fully SSR-compatible:

- `chain` is `null` during server-side rendering
- `isClient` flag indicates client-side hydration
- No localStorage access during SSR
- Safe to use in Next.js App Router with `"use client"` components
- Auth components render safely on server (functionality activates on client)

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
