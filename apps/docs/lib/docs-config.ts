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
      { title: "Smart Signer", href: "/docs/components/smart-signer" },
      { title: "Keychain Login", href: "/docs/components/keychain-login" },
      { title: "Hivesigner Login", href: "/docs/components/hivesigner-login" },
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "User Card", href: "/docs/components/user-card" },
      { title: "Vote Button", href: "/docs/components/vote-button" },
      { title: "Balance Card", href: "/docs/components/balance-card" },
      { title: "Comment Form", href: "/docs/components/comment-form" },
    ],
  },
  {
    title: "Hooks",
    items: [
      { title: "useHiveChain", href: "/docs/hooks/use-hive-chain" },
      { title: "useHiveAuth", href: "/docs/hooks/use-hive-auth" },
      { title: "useHiveAccount", href: "/docs/hooks/use-hive-account" },
      { title: "useVote", href: "/docs/hooks/use-vote" },
    ],
  },
];
