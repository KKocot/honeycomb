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
    title: "Content",
    type: "passive",
    items: [
      { title: "Content Renderer", href: "/docs/components/content-renderer" },
      { title: "Markdown Editor", href: "/docs/components/markdown-editor" },
    ],
  },
];
