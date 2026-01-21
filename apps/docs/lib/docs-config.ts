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
  type?: "active" | "passive";
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
  // ===========================================
  // ACTIVE COMPONENTS - Blockchain Actions
  // ===========================================
  {
    title: "Authentication",
    type: "active",
    items: [
      { title: "Smart Signer", href: "/docs/components/smart-signer" },
    ],
  },
  {
    title: "Social Actions",
    type: "active",
    items: [
      { title: "Follow Button", href: "/docs/components/follow-button" },
      { title: "Mute Button", href: "/docs/components/mute-button" },
    ],
  },
  {
    title: "Content Actions",
    type: "active",
    items: [
      { title: "Vote Button", href: "/docs/components/vote-button" },
      { title: "Comment Form", href: "/docs/components/comment-form" },
      { title: "Post Editor", href: "/docs/components/post-editor" },
      { title: "Reblog Button", href: "/docs/components/reblog-button" },
    ],
  },
  {
    title: "Wallet Actions",
    type: "active",
    items: [
      { title: "Transfer Dialog", href: "/docs/components/transfer-dialog" },
      { title: "Power Up/Down", href: "/docs/components/power-up-down" },
      { title: "Delegation Card", href: "/docs/components/delegation-card" },
      { title: "Trade Hive", href: "/docs/components/trade-hive" },
    ],
  },
  {
    title: "Community Actions",
    type: "active",
    items: [
      { title: "Communities List", href: "/docs/components/communities-list" },
      { title: "Witness Vote", href: "/docs/components/witness-vote" },
      { title: "Proposals", href: "/docs/components/proposals" },
    ],
  },
  // ===========================================
  // PASSIVE COMPONENTS - Display Only
  // ===========================================
  {
    title: "User Display",
    type: "passive",
    items: [
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "User Card", href: "/docs/components/user-card" },
    ],
  },
  {
    title: "Wallet Display",
    type: "passive",
    items: [
      { title: "Balance Card", href: "/docs/components/balance-card" },
      { title: "Manabar", href: "/docs/components/manabar" },
    ],
  },
  {
    title: "Post Display",
    type: "passive",
    items: [
      { title: "Post Card", href: "/docs/components/post-card" },
    ],
  },
  {
    title: "Account Management",
    type: "active",
    items: [
      { title: "Account Settings", href: "/docs/components/account-settings" },
      { title: "Authorities", href: "/docs/components/authorities" },
    ],
  },
  // ===========================================
  // HOOKS
  // ===========================================
  {
    title: "Hooks",
    items: [
      { title: "useHiveChain", href: "/docs/hooks/use-hive-chain", disabled: true, label: "Coming Soon" },
      { title: "useHiveAuth", href: "/docs/hooks/use-hive-auth", disabled: true, label: "Coming Soon" },
      { title: "useHiveAccount", href: "/docs/hooks/use-hive-account", disabled: true, label: "Coming Soon" },
      { title: "useVote", href: "/docs/hooks/use-vote", disabled: true, label: "Coming Soon" },
    ],
  },
];
