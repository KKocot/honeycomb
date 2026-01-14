export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const docsConfig: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Project Structure", href: "/docs/project-structure" },
      { title: "Changelog", href: "/docs/changelog", disabled: true },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Hive Provider", href: "/docs/hive-provider" },
      { title: "API Nodes", href: "/docs/api-nodes" },
      { title: "Theming", href: "/docs/theming" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Keychain Login", href: "/docs/components/keychain-login", disabled: true },
      { title: "Hivesigner Login", href: "/docs/components/hivesigner-login", disabled: true },
      { title: "Avatar", href: "/docs/components/avatar", disabled: true },
      { title: "User Card", href: "/docs/components/user-card", disabled: true },
      { title: "Vote Button", href: "/docs/components/vote-button", disabled: true },
      { title: "Balance Card", href: "/docs/components/balance-card", disabled: true },
    ],
  },
  {
    title: "Hooks",
    items: [
      { title: "useHiveChain", href: "/docs/hooks/use-hive-chain", disabled: true },
      { title: "useHiveAuth", href: "/docs/hooks/use-hive-auth", disabled: true },
      { title: "useHiveAccount", href: "/docs/hooks/use-hive-account", disabled: true },
      { title: "useVote", href: "/docs/hooks/use-vote", disabled: true },
    ],
  },
];
