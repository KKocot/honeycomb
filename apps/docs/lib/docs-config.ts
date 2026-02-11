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
      { title: "Introduction", href: "/react/introduction" },
      { title: "Installation", href: "/react/installation" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Hive Provider", href: "/react/hive-provider" },
      { title: "Hooks", href: "/react/hooks" },
      { title: "Theming", href: "/react/theming" },
      { title: "API Tracker", href: "/react/api-tracker" },
    ],
  },
  // ===========================================
  // PASSIVE COMPONENTS - Display Only
  // ===========================================
  {
    title: "User Display",
    type: "passive",
    items: [
      { title: "Avatar", href: "/react/avatar" },
      { title: "User Card", href: "/react/user-card" },
    ],
  },
  {
    title: "Wallet Display",
    type: "passive",
    items: [
      { title: "Balance Card", href: "/react/balance-card" },
      { title: "Manabar", href: "/react/manabar" },
    ],
  },
  {
    title: "Post Display",
    type: "passive",
    items: [
      { title: "Post Card", href: "/react/post-card" },
    ],
  },
  {
    title: "Content",
    type: "passive",
    items: [
      { title: "Content Renderer", href: "/react/content-renderer" },
      { title: "Markdown Editor", href: "/react/markdown-editor" },
    ],
  },
];
