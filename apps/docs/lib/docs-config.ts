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
    title: "Authentication",
    items: [
      { title: "Smart Signer", href: "/docs/components/smart-signer" },
      { title: "Keychain Login", href: "/docs/components/keychain-login" },
      { title: "Hivesigner Login", href: "/docs/components/hivesigner-login" },
    ],
  },
  {
    title: "Social",
    items: [
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "User Card", href: "/docs/components/user-card" },
      { title: "Follow Button", href: "/docs/components/follow-button" },
      { title: "Mute Button", href: "/docs/components/mute-button" },
      { title: "Badge List", href: "/docs/components/badge-list" },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Vote Button", href: "/docs/components/vote-button" },
      { title: "Comment Form", href: "/docs/components/comment-form" },
      { title: "Post Editor", href: "/docs/components/post-editor" },
      { title: "Post Summary", href: "/docs/components/post-summary" },
      { title: "Reblog Button", href: "/docs/components/reblog-button" },
    ],
  },
  {
    title: "Wallet",
    items: [
      { title: "Balance Card", href: "/docs/components/balance-card" },
      { title: "Transfer Dialog", href: "/docs/components/transfer-dialog" },
      { title: "Power Up/Down", href: "/docs/components/power-up-down" },
      { title: "Delegation Card", href: "/docs/components/delegation-card" },
      { title: "Trade Hive", href: "/docs/components/trade-hive" },
    ],
  },
  {
    title: "Community",
    items: [
      { title: "Communities List", href: "/docs/components/communities-list" },
      { title: "Witness Vote", href: "/docs/components/witness-vote" },
      { title: "Proposals", href: "/docs/components/proposals" },
      { title: "Authorities", href: "/docs/components/authorities" },
      { title: "Account Settings", href: "/docs/components/account-settings" },
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
