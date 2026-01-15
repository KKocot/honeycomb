# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hive UI is a shadcn/ui-style component library for Hive Blockchain applications. Components are meant to be copied into user projects, not installed as npm packages.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run docs dev server (port 3030)
pnpm dev:docs

# Build docs
pnpm build:docs

# Run all apps in dev mode
pnpm dev

# Build all
pnpm build
```

## Architecture

### Monorepo Structure (Turborepo + pnpm workspaces)

- `apps/docs` - Next.js 15 documentation site with App Router
- `packages/react` - React components (placeholder)
- `packages/cli` - CLI tool for adding components (placeholder)

### Docs App (`apps/docs`)

**Key directories:**
- `app/docs/` - Documentation pages (file-based routing)
- `app/examples/` - Component showcase grid
- `components/` - Shared UI components for docs site
- `lib/` - Utilities (highlighter, config, cn helper)

**Documentation structure in `lib/docs-config.ts`:**
- Getting Started (Introduction, Installation, Project Structure)
- Configuration (Hive Provider, API Nodes, Theming)
- Components (Smart Signer, Keychain Login, Avatar, etc.)
- Hooks (useHiveChain, useHiveAuth, useHiveAccount, useVote)

### Code Highlighting

Uses Shiki with singleton pattern (`lib/highlighter.ts`). The `CodeBlock` component wraps highlighted code with copy functionality.

### Styling

- Tailwind CSS with custom Hive colors (`hive-red: #E31337`, `hive-dark: #1A1A1A`)
- CSS variables for theming (border, background, foreground, muted, accent, card)
- `@tailwindcss/typography` for prose content
- `cn()` helper combining clsx + tailwind-merge

## Hive Blockchain Concepts

Components interact with Hive blockchain via `@hiveio/wax` library. Key concepts:
- **Keys**: Posting (social), Active (financial), Memo (encryption), Owner (recovery)
- **Tokens**: HIVE, HBD (stablecoin), HP (staked HIVE)
- **Resource Credits**: Replace transaction fees, regenerate over ~5 days

## Component Categories

Authentication: Smart Signer (8 methods), Keychain Login, Hivesigner Login
Social: Avatar, User Card, Follow Button, Mute Button
Content: Vote Button, Comment Form, Post Editor
Wallet: Balance Card, Transfer Dialog, Delegations
Community: Witness Vote, Proposals, Communities List

## Adding New Documentation Pages

1. Create page in `app/docs/[category]/[component]/page.tsx`
2. Add entry to `lib/docs-config.ts`
3. Use `CodeBlock` component for code examples
4. Follow existing page structure (heading, description, usage, code)
