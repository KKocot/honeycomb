# @kkocot/hive-ui

CLI for adding Hive blockchain UI components to your React project. Works like shadcn/ui - components are copied directly into your project, not installed as dependencies.

## Setup

### 1. Configure npm for GitHub Packages

Add to your `~/.npmrc`:

```bash
@kkocot:registry=https://npm.pkg.github.com
```

### 2. Authenticate with GitHub

```bash
npm login --scope=@kkocot --registry=https://npm.pkg.github.com
```

Use your GitHub username and a Personal Access Token with `read:packages` scope.

## Usage

### Initialize project

```bash
npx @kkocot/hive-ui init
```

This creates:
- `lib/utils.ts` - cn() helper function
- `contexts/hive-context.tsx` - HiveProvider React context
- `components/hive/` - directory for components

### Add components

```bash
# Add specific components
npx @kkocot/hive-ui add avatar keychain-login balance-card

# Add all components
npx @kkocot/hive-ui add --all

# Interactive picker
npx @kkocot/hive-ui add
```

### List available components

```bash
npx @kkocot/hive-ui list
```

## Components

### Auth (5)
| Component | Description |
|-----------|-------------|
| `keychain-login` | Login with Hive Keychain browser extension |
| `peakvault-login` | Login with PeakVault browser extension |
| `hiveauth-login` | Login with HiveAuth mobile app via QR code |
| `hbauth-login` | Login with encrypted local key storage (Safe Storage) |
| `wif-login` | Direct private key login (development only) |

### Social (5)
| Component | Description |
|-----------|-------------|
| `avatar` | Display Hive user profile pictures with fallback |
| `user-card` | Display Hive user profile card with metadata |
| `follow-button` | Follow/unfollow button for Hive users |
| `mute-button` | Mute/unmute button for Hive users |
| `badge-list` | Display user badges/roles |

### Content (4)
| Component | Description |
|-----------|-------------|
| `vote-button` | Upvote/downvote button with weight slider |
| `reblog-button` | Reblog/share post button |
| `comment-form` | Comment form with markdown toolbar |
| `post-editor` | Full post editor with preview and tags |

### Wallet (5)
| Component | Description |
|-----------|-------------|
| `balance-card` | Display user wallet balances (HIVE, HBD, HP) |
| `transfer-dialog` | Transfer HIVE/HBD dialog |
| `power-up-down` | Power up or power down HIVE to/from Hive Power |
| `delegation-card` | Manage HP delegations to other users |
| `trade-hive` | Trade HIVE/HBD on internal market |

### Community (4)
| Component | Description |
|-----------|-------------|
| `witness-vote` | Vote for Hive witnesses |
| `proposals` | Vote on DHF proposals |
| `communities-list` | Browse and join Hive communities |
| `account-settings` | Edit user profile settings |

## Requirements

After adding components, install required dependencies:

```bash
npm install @hiveio/wax clsx tailwind-merge lucide-react
```

## Project Setup

### 1. Wrap your app with HiveProvider

```tsx
import { HiveProvider } from "@/contexts/hive-context";

export default function RootLayout({ children }) {
  return (
    <HiveProvider>
      {children}
    </HiveProvider>
  );
}
```

### 2. Configure Tailwind

Add Hive colors to your `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        "hive-red": "#E31337",
        "hive-dark": "#1A1A1A",
      },
    },
  },
};
```

### 3. Use components

```tsx
import { Avatar } from "@/components/hive/avatar";
import { KeychainLogin } from "@/components/hive/keychain-login";
import { BalanceCard } from "@/components/hive/balance-card";

export default function Page() {
  return (
    <div>
      <Avatar username="blocktrades" size="lg" />
      <KeychainLogin onSuccess={(user) => console.log(user)} />
      <BalanceCard username="blocktrades" />
    </div>
  );
}
```

## CLI Options

### `init`
| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation prompt |

### `add`
| Flag | Description |
|------|-------------|
| `-y, --yes` | Skip confirmation prompt |
| `-o, --overwrite` | Overwrite existing files |
| `-a, --all` | Add all components |

## License

MIT
