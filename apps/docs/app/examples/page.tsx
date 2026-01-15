import Link from "next/link";
import {
  Key,
  User,
  MessageSquare,
  ThumbsUp,
  Wallet,
  LogIn,
  Shield,
  Users,
  Send,
  TrendingUp,
  Vote,
  FileText,
  Heart,
  Repeat,
  Bell,
  Award,
  Globe,
  Settings,
  Lock,
  CreditCard,
} from "lucide-react";

interface ComponentCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: "auth" | "social" | "wallet" | "content" | "community";
  status: "available" | "coming-soon";
}

const components: ComponentCard[] = [
  // Authentication
  {
    title: "Smart Signer",
    description: "Multi-method authentication with 8 signing options",
    href: "/docs/components/smart-signer",
    icon: <Shield className="h-6 w-6" />,
    category: "auth",
    status: "available",
  },
  {
    title: "Keychain Login",
    description: "Login with Hive Keychain browser extension",
    href: "/docs/components/keychain-login",
    icon: <Key className="h-6 w-6" />,
    category: "auth",
    status: "available",
  },
  {
    title: "Hivesigner Login",
    description: "OAuth-style authentication with Hivesigner",
    href: "/docs/components/hivesigner-login",
    icon: <LogIn className="h-6 w-6" />,
    category: "auth",
    status: "available",
  },

  // Social / Profile
  {
    title: "Avatar",
    description: "User avatar with fallback and reputation badge",
    href: "/docs/components/avatar",
    icon: <User className="h-6 w-6" />,
    category: "social",
    status: "available",
  },
  {
    title: "User Card",
    description: "User profile card with stats and actions",
    href: "/docs/components/user-card",
    icon: <Users className="h-6 w-6" />,
    category: "social",
    status: "available",
  },
  {
    title: "Follow Button",
    description: "Follow/unfollow user with optimistic updates",
    href: "/docs/components/follow-button",
    icon: <Heart className="h-6 w-6" />,
    category: "social",
    status: "available",
  },
  {
    title: "Mute Button",
    description: "Mute/unmute users to hide their content",
    href: "/docs/components/mute-button",
    icon: <Bell className="h-6 w-6" />,
    category: "social",
    status: "available",
  },
  {
    title: "Badge List",
    description: "Display user achievements and badges",
    href: "/docs/components/badge-list",
    icon: <Award className="h-6 w-6" />,
    category: "social",
    status: "available",
  },

  // Content
  {
    title: "Vote Button",
    description: "Upvote/downvote with weight slider",
    href: "/docs/components/vote-button",
    icon: <ThumbsUp className="h-6 w-6" />,
    category: "content",
    status: "available",
  },
  {
    title: "Comment Form",
    description: "Write and submit comments with markdown",
    href: "/docs/components/comment-form",
    icon: <MessageSquare className="h-6 w-6" />,
    category: "content",
    status: "available",
  },
  {
    title: "Post Editor",
    description: "Full markdown editor with image upload",
    href: "/docs/components/post-editor",
    icon: <FileText className="h-6 w-6" />,
    category: "content",
    status: "available",
  },
  {
    title: "Post Summary",
    description: "Post card preview with thumbnail and stats",
    href: "/docs/components/post-summary",
    icon: <FileText className="h-6 w-6" />,
    category: "content",
    status: "available",
  },
  {
    title: "Reblog Button",
    description: "Reblog posts to your profile",
    href: "/docs/components/reblog-button",
    icon: <Repeat className="h-6 w-6" />,
    category: "content",
    status: "available",
  },

  // Wallet
  {
    title: "Balance Card",
    description: "Display HIVE, HBD, and HP balances",
    href: "/docs/components/balance-card",
    icon: <Wallet className="h-6 w-6" />,
    category: "wallet",
    status: "available",
  },
  {
    title: "Transfer Dialog",
    description: "Multi-purpose transfer form (HIVE, HBD, savings)",
    href: "/docs/components/transfer-dialog",
    icon: <Send className="h-6 w-6" />,
    category: "wallet",
    status: "available",
  },
  {
    title: "Power Up/Down",
    description: "Stake and unstake HIVE to Hive Power",
    href: "/docs/components/power-up-down",
    icon: <TrendingUp className="h-6 w-6" />,
    category: "wallet",
    status: "available",
  },
  {
    title: "Delegation Card",
    description: "Delegate HP to other accounts",
    href: "/docs/components/delegation-card",
    icon: <CreditCard className="h-6 w-6" />,
    category: "wallet",
    status: "available",
  },
  {
    title: "Trade Hive",
    description: "Internal market trading interface",
    href: "/docs/components/trade-hive",
    icon: <TrendingUp className="h-6 w-6" />,
    category: "wallet",
    status: "available",
  },

  // Community / Governance
  {
    title: "Communities List",
    description: "Browse and subscribe to Hive communities",
    href: "/docs/components/communities-list",
    icon: <Globe className="h-6 w-6" />,
    category: "community",
    status: "available",
  },
  {
    title: "Witness Vote",
    description: "Vote for blockchain witnesses",
    href: "/docs/components/witness-vote",
    icon: <Vote className="h-6 w-6" />,
    category: "community",
    status: "available",
  },
  {
    title: "Proposals",
    description: "Vote on DHF proposals",
    href: "/docs/components/proposals",
    icon: <FileText className="h-6 w-6" />,
    category: "community",
    status: "available",
  },
  {
    title: "Authorities",
    description: "Manage account keys and permissions",
    href: "/docs/components/authorities",
    icon: <Lock className="h-6 w-6" />,
    category: "community",
    status: "available",
  },
  {
    title: "Account Settings",
    description: "Profile settings and preferences",
    href: "/docs/components/account-settings",
    icon: <Settings className="h-6 w-6" />,
    category: "community",
    status: "available",
  },
];

const categoryColors = {
  auth: "border-hive-red/50 bg-hive-red/5",
  social: "border-blue-500/50 bg-blue-500/5",
  wallet: "border-green-500/50 bg-green-500/5",
  content: "border-purple-500/50 bg-purple-500/5",
  community: "border-orange-500/50 bg-orange-500/5",
};

const categoryLabels = {
  auth: { label: "Authentication", color: "bg-hive-red" },
  social: { label: "Social", color: "bg-blue-500" },
  wallet: { label: "Wallet", color: "bg-green-500" },
  content: { label: "Content", color: "bg-purple-500" },
  community: { label: "Community", color: "bg-orange-500" },
};

export default function ExamplesPage() {
  const availableComponents = components.filter((c) => c.status === "available");
  const comingSoonComponents = components.filter((c) => c.status === "coming-soon");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Component Examples</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A complete collection of Hive blockchain components. Click any card to view
          documentation and code examples.
        </p>
      </div>

      {/* Category Legend */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {Object.entries(categoryLabels).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${color}`} />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Available Components */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold">
          Available Components
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({availableComponents.length})
          </span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {availableComponents.map((component) => (
            <Link
              key={component.title}
              href={component.href}
              className={`group relative flex flex-col rounded-xl border-2 p-5 transition-all hover:scale-[1.02] hover:shadow-lg ${categoryColors[component.category]}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-background/80 p-2 text-foreground">
                  {component.icon}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${categoryLabels[component.category].color}`}
                >
                  {categoryLabels[component.category].label}
                </span>
              </div>
              <h3 className="mb-1 font-semibold group-hover:text-hive-red">
                {component.title}
              </h3>
              <p className="text-sm text-muted-foreground">{component.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon Components */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">
          Coming Soon
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({comingSoonComponents.length})
          </span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {comingSoonComponents.map((component) => (
            <div
              key={component.title}
              className={`relative flex flex-col rounded-xl border-2 p-5 opacity-60 ${categoryColors[component.category]}`}
            >
              <div className="absolute right-3 top-3 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                Coming Soon
              </div>
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-background/80 p-2 text-foreground">
                  {component.icon}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${categoryLabels[component.category].color}`}
                >
                  {categoryLabels[component.category].label}
                </span>
              </div>
              <h3 className="mb-1 font-semibold">{component.title}</h3>
              <p className="text-sm text-muted-foreground">{component.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-8">
        <div className="grid gap-8 text-center sm:grid-cols-4">
          <div>
            <div className="text-4xl font-bold text-hive-red">{components.length}</div>
            <div className="mt-1 text-sm text-muted-foreground">Total Components</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-500">
              {availableComponents.length}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Available Now</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-500">
              {comingSoonComponents.length}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Coming Soon</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500">5</div>
            <div className="mt-1 text-sm text-muted-foreground">Categories</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 text-center">
        <p className="text-muted-foreground">
          Want to contribute a component?{" "}
          <a
            href="https://github.com/KKocot/hive-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-hive-red hover:underline"
          >
            Open a PR on GitHub
          </a>
        </p>
      </section>
    </div>
  );
}
