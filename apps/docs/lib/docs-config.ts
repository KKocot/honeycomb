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
      { title: "Introduction", href: "/introduction" },
      { title: "Installation", href: "/installation" },
      { title: "Project Structure", href: "/project-structure" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "Hive Provider", href: "/hive-provider" },
      { title: "API Nodes", href: "/api-nodes" },
      { title: "Theming", href: "/theming" },
    ],
  },
  // ===========================================
  // PASSIVE COMPONENTS - Display Only
  // ===========================================
  {
    title: "User Display",
    type: "passive",
    items: [
      { title: "Avatar", href: "/components/avatar" },
      { title: "User Card", href: "/components/user-card" },
    ],
  },
  {
    title: "Wallet Display",
    type: "passive",
    items: [
      { title: "Balance Card", href: "/components/balance-card" },
      { title: "Manabar", href: "/components/manabar" },
    ],
  },
  {
    title: "Post Display",
    type: "passive",
    items: [
      { title: "Post Card", href: "/components/post-card" },
    ],
  },
  {
    title: "Content",
    type: "passive",
    items: [
      { title: "Content Renderer", href: "/components/content-renderer" },
      { title: "Markdown Editor", href: "/components/markdown-editor" },
    ],
  },
];
