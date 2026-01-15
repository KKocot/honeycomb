"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Key,
  User,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
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
  Check,
  Loader2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Copy,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Zap,
  ArrowUpDown,
  VolumeX,
  UserPlus,
  UserMinus,
} from "lucide-react";

// ============ INTERACTIVE DEMO COMPONENTS ============

// Avatar Component Demo
function AvatarDemo() {
  const sizes = ["sm", "md", "lg", "xl"] as const;
  const users = ["blocktrades", "hiveio", "arcange", "gtg"];

  return (
    <div className="flex flex-wrap items-end gap-4">
      {sizes.map((size, i) => {
        const sizeClasses = {
          sm: "w-8 h-8",
          md: "w-10 h-10",
          lg: "w-12 h-12",
          xl: "w-16 h-16",
        };
        return (
          <div key={size} className="flex flex-col items-center gap-1">
            <div className="relative">
              <img
                src={`https://images.hive.blog/u/${users[i]}/avatar`}
                alt={users[i]}
                className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-border`}
              />
              {size === "xl" && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  75
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">@{users[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

// User Card Demo
function UserCardDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card overflow-hidden">
      {/* Cover */}
      <div className="h-20 bg-gradient-to-r from-hive-red to-orange-500" />

      {/* Profile */}
      <div className="relative px-4 pb-4">
        <img
          src="https://images.hive.blog/u/hiveio/avatar"
          alt="hiveio"
          className="absolute -top-8 left-4 h-16 w-16 rounded-full border-4 border-card object-cover"
        />
        <div className="pt-10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">Hive</h3>
            <span className="rounded bg-hive-red/10 px-1.5 py-0.5 text-xs font-medium text-hive-red">
              75
            </span>
          </div>
          <p className="text-sm text-muted-foreground">@hiveio</p>
          <p className="mt-2 text-sm">
            The official Hive blockchain account. Decentralized social media.
          </p>

          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Decentralized
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Mar 2020
            </span>
          </div>

          <div className="mt-3 flex gap-4 text-sm">
            <span>
              <strong>1.2K</strong>{" "}
              <span className="text-muted-foreground">Following</span>
            </span>
            <span>
              <strong>45K</strong>{" "}
              <span className="text-muted-foreground">Followers</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vote Button Demo
function VoteButtonDemo() {
  const [votes, setVotes] = useState(42);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [weight, setWeight] = useState(100);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (voted === "up") {
              setVoted(null);
              setVotes((v) => v - 1);
            } else {
              setVoted("up");
              setVotes((v) => v + (voted === "down" ? 2 : 1));
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSlider(!showSlider);
          }}
          className={`flex items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
            voted === "up"
              ? "bg-green-500 text-white"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{votes}</span>
        </button>

        <button
          onClick={() => {
            if (voted === "down") {
              setVoted(null);
              setVotes((v) => v + 1);
            } else {
              setVoted("down");
              setVotes((v) => v - (voted === "up" ? 2 : 1));
            }
          }}
          className={`rounded-lg p-2 transition-colors ${
            voted === "down"
              ? "bg-red-500 text-white"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>

      {showSlider && (
        <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
          <input
            type="range"
            min="1"
            max="100"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-32"
          />
          <span className="w-12 text-sm font-medium">{weight}%</span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Right-click to adjust vote weight
      </p>
    </div>
  );
}

// Follow Button Demo
function FollowButtonDemo() {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setFollowing(!following);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
          following
            ? "bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500"
            : "bg-hive-red text-white hover:bg-hive-red/90"
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : following ? (
          <>
            <UserMinus className="h-4 w-4" />
            Unfollow
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Follow
          </>
        )}
      </button>
      <div className="flex gap-2">
        <button
          onClick={() => setFollowing(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// Mute Button Demo
function MuteButtonDemo() {
  const [muted, setMuted] = useState(false);

  return (
    <button
      onClick={() => setMuted(!muted)}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
        muted
          ? "bg-orange-500/10 text-orange-500"
          : "bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {muted ? (
        <>
          <VolumeX className="h-4 w-4" />
          Muted
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Mute
        </>
      )}
    </button>
  );
}

// Balance Card Demo
function BalanceCardDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Wallet</h3>
        <span className="text-sm text-muted-foreground">@demo</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-hive-red/10 p-2">
              <Zap className="h-4 w-4 text-hive-red" />
            </div>
            <span className="font-medium">HIVE</span>
          </div>
          <span className="font-bold">1,234.567</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500/10 p-2">
              <Wallet className="h-4 w-4 text-green-500" />
            </div>
            <span className="font-medium">HBD</span>
          </div>
          <span className="font-bold">567.89</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-500/10 p-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <span className="font-medium">HP</span>
          </div>
          <span className="font-bold">12,345.678</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-lg bg-hive-red py-2 text-sm font-medium text-white">
          Transfer
        </button>
        <button className="flex-1 rounded-lg bg-muted py-2 text-sm font-medium">
          Power Up
        </button>
      </div>
    </div>
  );
}

// Badge List Demo
function BadgeListDemo() {
  const badges = [
    { name: "Whale", color: "bg-blue-500", icon: "🐋" },
    { name: "Witness", color: "bg-purple-500", icon: "👁️" },
    { name: "Developer", color: "bg-green-500", icon: "💻" },
    { name: "Curator", color: "bg-orange-500", icon: "✨" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.name}
          className={`flex items-center gap-1 rounded-full ${badge.color} px-3 py-1 text-sm font-medium text-white`}
        >
          <span>{badge.icon}</span>
          {badge.name}
        </span>
      ))}
    </div>
  );
}

// Post Summary Demo
function PostSummaryDemo() {
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-hive-red/20 to-orange-500/20 flex items-center justify-center">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <img
            src="https://images.hive.blog/u/hiveio/avatar/small"
            className="h-6 w-6 rounded-full"
            alt=""
          />
          <span className="text-sm text-muted-foreground">@hiveio</span>
          <span className="text-xs text-muted-foreground">• 2h ago</span>
        </div>
        <h3 className="font-semibold mb-1">Welcome to Hive UI Components</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          A complete library of blockchain components for building Hive
          applications. Copy and paste into your project.
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" /> 42
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> 12
          </span>
          <span className="flex items-center gap-1">
            <Wallet className="h-3 w-3" /> $24.56
          </span>
        </div>
      </div>
    </div>
  );
}

// Smart Signer Demo
function SmartSignerDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  const methods = [
    { id: "keychain", name: "Keychain", icon: Key },
    { id: "hivesigner", name: "Hivesigner", icon: LogIn },
    { id: "hiveauth", name: "HiveAuth", icon: Shield },
    { id: "peaklock", name: "PeakLock", icon: Lock },
  ];

  return (
    <div className="w-full max-w-xs space-y-2">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => setSelected(method.id)}
          className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-colors ${
            selected === method.id
              ? "border-hive-red bg-hive-red/5"
              : "border-border hover:bg-muted/50"
          }`}
        >
          <method.icon
            className={`h-5 w-5 ${selected === method.id ? "text-hive-red" : ""}`}
          />
          <span className="font-medium">{method.name}</span>
          {selected === method.id && (
            <Check className="ml-auto h-4 w-4 text-hive-red" />
          )}
        </button>
      ))}
    </div>
  );
}

// Reblog Button Demo
function ReblogButtonDemo() {
  const [reblogged, setReblogged] = useState(false);

  return (
    <button
      onClick={() => setReblogged(!reblogged)}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
        reblogged
          ? "bg-green-500/10 text-green-500"
          : "bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      <Repeat className={`h-4 w-4 ${reblogged ? "fill-current" : ""}`} />
      {reblogged ? "Reblogged" : "Reblog"}
    </button>
  );
}

// Witness Vote Demo
function WitnessVoteDemo() {
  const [voted, setVoted] = useState<string[]>([]);
  const witnesses = ["blocktrades", "gtg", "arcange", "good-karma"];

  return (
    <div className="w-full max-w-xs space-y-2">
      {witnesses.map((w) => (
        <div
          key={w}
          className="flex items-center justify-between rounded-lg border border-border p-3"
        >
          <div className="flex items-center gap-2">
            <img
              src={`https://images.hive.blog/u/${w}/avatar/small`}
              className="h-8 w-8 rounded-full"
              alt=""
            />
            <span className="font-medium">@{w}</span>
          </div>
          <button
            onClick={() =>
              setVoted((prev) =>
                prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
              )
            }
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              voted.includes(w)
                ? "bg-green-500 text-white"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {voted.includes(w) ? (
              <>
                <Check className="inline h-3 w-3 mr-1" />
                Voted
              </>
            ) : (
              "Vote"
            )}
          </button>
        </div>
      ))}
      <p className="text-center text-xs text-muted-foreground">
        {voted.length}/30 witness votes used
      </p>
    </div>
  );
}

// ============ COMPONENT GRID ============

interface ComponentCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: "auth" | "social" | "wallet" | "content" | "community";
  demo?: React.ReactNode;
}

const components: ComponentCard[] = [
  // Authentication
  {
    title: "Smart Signer",
    description: "Multi-method authentication with 8 signing options",
    href: "/docs/components/smart-signer",
    icon: <Shield className="h-6 w-6" />,
    category: "auth",
    demo: <SmartSignerDemo />,
  },
  {
    title: "Keychain Login",
    description: "Login with Hive Keychain browser extension",
    href: "/docs/components/keychain-login",
    icon: <Key className="h-6 w-6" />,
    category: "auth",
  },
  {
    title: "Hivesigner Login",
    description: "OAuth-style authentication with Hivesigner",
    href: "/docs/components/hivesigner-login",
    icon: <LogIn className="h-6 w-6" />,
    category: "auth",
  },

  // Social
  {
    title: "Avatar",
    description: "User avatar with fallback and reputation badge",
    href: "/docs/components/avatar",
    icon: <User className="h-6 w-6" />,
    category: "social",
    demo: <AvatarDemo />,
  },
  {
    title: "User Card",
    description: "User profile card with stats and actions",
    href: "/docs/components/user-card",
    icon: <Users className="h-6 w-6" />,
    category: "social",
    demo: <UserCardDemo />,
  },
  {
    title: "Follow Button",
    description: "Follow/unfollow user with optimistic updates",
    href: "/docs/components/follow-button",
    icon: <Heart className="h-6 w-6" />,
    category: "social",
    demo: <FollowButtonDemo />,
  },
  {
    title: "Mute Button",
    description: "Mute/unmute users to hide their content",
    href: "/docs/components/mute-button",
    icon: <Bell className="h-6 w-6" />,
    category: "social",
    demo: <MuteButtonDemo />,
  },
  {
    title: "Badge List",
    description: "Display user achievements and badges",
    href: "/docs/components/badge-list",
    icon: <Award className="h-6 w-6" />,
    category: "social",
    demo: <BadgeListDemo />,
  },

  // Content
  {
    title: "Vote Button",
    description: "Upvote/downvote with weight slider",
    href: "/docs/components/vote-button",
    icon: <ThumbsUp className="h-6 w-6" />,
    category: "content",
    demo: <VoteButtonDemo />,
  },
  {
    title: "Comment Form",
    description: "Write and submit comments with markdown",
    href: "/docs/components/comment-form",
    icon: <MessageSquare className="h-6 w-6" />,
    category: "content",
  },
  {
    title: "Post Editor",
    description: "Full markdown editor with image upload",
    href: "/docs/components/post-editor",
    icon: <FileText className="h-6 w-6" />,
    category: "content",
  },
  {
    title: "Post Summary",
    description: "Post card preview with thumbnail and stats",
    href: "/docs/components/post-summary",
    icon: <FileText className="h-6 w-6" />,
    category: "content",
    demo: <PostSummaryDemo />,
  },
  {
    title: "Reblog Button",
    description: "Reblog posts to your profile",
    href: "/docs/components/reblog-button",
    icon: <Repeat className="h-6 w-6" />,
    category: "content",
    demo: <ReblogButtonDemo />,
  },

  // Wallet
  {
    title: "Balance Card",
    description: "Display HIVE, HBD, and HP balances",
    href: "/docs/components/balance-card",
    icon: <Wallet className="h-6 w-6" />,
    category: "wallet",
    demo: <BalanceCardDemo />,
  },
  {
    title: "Transfer Dialog",
    description: "Multi-purpose transfer form (HIVE, HBD, savings)",
    href: "/docs/components/transfer-dialog",
    icon: <Send className="h-6 w-6" />,
    category: "wallet",
  },
  {
    title: "Power Up/Down",
    description: "Stake and unstake HIVE to Hive Power",
    href: "/docs/components/power-up-down",
    icon: <TrendingUp className="h-6 w-6" />,
    category: "wallet",
  },
  {
    title: "Delegation Card",
    description: "Delegate HP to other accounts",
    href: "/docs/components/delegation-card",
    icon: <CreditCard className="h-6 w-6" />,
    category: "wallet",
  },
  {
    title: "Trade Hive",
    description: "Internal market trading interface",
    href: "/docs/components/trade-hive",
    icon: <ArrowUpDown className="h-6 w-6" />,
    category: "wallet",
  },

  // Community
  {
    title: "Communities List",
    description: "Browse and subscribe to Hive communities",
    href: "/docs/components/communities-list",
    icon: <Globe className="h-6 w-6" />,
    category: "community",
  },
  {
    title: "Witness Vote",
    description: "Vote for blockchain witnesses",
    href: "/docs/components/witness-vote",
    icon: <Vote className="h-6 w-6" />,
    category: "community",
    demo: <WitnessVoteDemo />,
  },
  {
    title: "Proposals",
    description: "Vote on DHF proposals",
    href: "/docs/components/proposals",
    icon: <FileText className="h-6 w-6" />,
    category: "community",
  },
  {
    title: "Authorities",
    description: "Manage account keys and permissions",
    href: "/docs/components/authorities",
    icon: <Lock className="h-6 w-6" />,
    category: "community",
  },
  {
    title: "Account Settings",
    description: "Profile settings and preferences",
    href: "/docs/components/account-settings",
    icon: <Settings className="h-6 w-6" />,
    category: "community",
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedComponent, setExpandedComponent] = useState<string | null>(
    null
  );

  const filteredComponents = activeCategory
    ? components.filter((c) => c.category === activeCategory)
    : components;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Interactive Examples
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Try the components live. Click on any card to see interactive demos
          and explore the documentation.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === null
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({components.length})
        </button>
        {Object.entries(categoryLabels).map(([key, { label, color }]) => {
          const count = components.filter((c) => c.category === key).length;
          return (
            <button
              key={key}
              onClick={() =>
                setActiveCategory(activeCategory === key ? null : key)
              }
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === key
                  ? `${color} text-white`
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${activeCategory === key ? "bg-white" : color}`}
              />
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Components Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredComponents.map((component) => {
          const isExpanded = expandedComponent === component.title;

          return (
            <div
              key={component.title}
              className={`group rounded-xl border-2 transition-all ${categoryColors[component.category]} ${
                isExpanded ? "md:col-span-2 lg:col-span-3" : ""
              }`}
            >
              {/* Header */}
              <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={() =>
                  setExpandedComponent(isExpanded ? null : component.title)
                }
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-background/80 p-2 text-foreground">
                    {component.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-hive-red">
                      {component.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {component.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${categoryLabels[component.category].color}`}
                  >
                    {categoryLabels[component.category].label}
                  </span>
                  {component.demo && (
                    <div className="text-muted-foreground">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Demo Area */}
              {isExpanded && component.demo && (
                <div className="border-t border-border/50 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Live Demo
                    </h4>
                    <Link
                      href={component.href}
                      className="flex items-center gap-1 text-sm text-hive-red hover:underline"
                    >
                      View Documentation
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-center rounded-lg bg-background/50 p-8">
                    {component.demo}
                  </div>
                </div>
              )}

              {/* Quick link for components without demo */}
              {!component.demo && (
                <Link
                  href={component.href}
                  className="block border-t border-border/50 p-3 text-center text-sm text-muted-foreground hover:bg-background/50 hover:text-foreground"
                >
                  View Documentation →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-8">
        <div className="grid gap-8 text-center sm:grid-cols-4">
          <div>
            <div className="text-4xl font-bold text-hive-red">
              {components.length}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Total Components
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-500">
              {components.filter((c) => c.demo).length}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Interactive Demos
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">5</div>
            <div className="mt-1 text-sm text-muted-foreground">Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500">100%</div>
            <div className="mt-1 text-sm text-muted-foreground">TypeScript</div>
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
