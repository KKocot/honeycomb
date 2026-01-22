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
      { title: "Keychain Login", href: "/docs/components/keychain-login" },
      { title: "PeakVault Login", href: "/docs/components/peakvault-login" },
      { title: "HiveAuth Login", href: "/docs/components/hiveauth-login" },
      { title: "HB-Auth Login", href: "/docs/components/hbauth-login" },
      { title: "WIF Login", href: "/docs/components/wif-login" },
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
      { title: "Reblog Button", href: "/docs/components/reblog-button" },
    ],
  },
  {
    title: "Community Actions",
    type: "active",
    items: [
      { title: "Witness Vote", href: "/docs/components/witness-vote" },
      { title: "Proposals", href: "/docs/components/proposals" },
      { title: "Communities List", href: "/docs/components/communities-list" },
    ],
  },
  {
    title: "Account Management",
    type: "active",
    items: [
      { title: "Account Settings", href: "/docs/components/account-settings" },
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
];
