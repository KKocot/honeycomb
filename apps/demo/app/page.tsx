"use client";

import { useState } from "react";
import { useHive, DEFAULT_USER } from "@/contexts/hive-context";
import {
  Key,
  Wallet,
  Smartphone,
  Lock,
  FileKey,
  User,
  Heart,
  ThumbsUp,
  Repeat,
  Award,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronRight,
  Send,
  TrendingUp,
  Users,
  MessageSquare,
  FileText,
  Eye,
  Globe,
  Settings,
  ArrowUpDown,
} from "lucide-react";
import {
  Avatar,
  UserCard,
  FollowButton,
  MuteButton,
  VoteButton,
  ReblogButton,
  BadgeList,
  BalanceCard,
  KeychainLogin,
  PeakVaultLogin,
  HiveAuthLogin,
  HBAuthLogin,
  WIFLogin,
  TransferDialog,
  PowerUpDown,
  DelegationCard,
  CommentForm,
  PostEditor,
  WitnessVote,
  Proposals,
  CommunitiesList,
  TradeHive,
  AccountSettings,
} from "@/components/hive";

interface DemoSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const sections: DemoSection[] = [
  { id: "auth", title: "Authentication", icon: <Key className="h-5 w-5" />, color: "text-hive-red" },
  { id: "social", title: "Social", icon: <User className="h-5 w-5" />, color: "text-blue-500" },
  { id: "content", title: "Content", icon: <ThumbsUp className="h-5 w-5" />, color: "text-purple-500" },
  { id: "wallet", title: "Wallet", icon: <Wallet className="h-5 w-5" />, color: "text-green-500" },
  { id: "community", title: "Community", icon: <Globe className="h-5 w-5" />, color: "text-orange-500" },
];

export default function DemoPage() {
  const { chain, isLoading, user, login, logout } = useHive();
  const [activeSection, setActiveSection] = useState<string>("auth");
  const [expandedAuth, setExpandedAuth] = useState<string | null>("keychain");
  const [demoUser] = useState(DEFAULT_USER);

  const handleLogin = (username: string, method: string) => {
    login(username, method);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-hive-red" />
          <p className="mt-2 text-muted-foreground">Connecting to Hive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-hive-red flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-bold text-xl">Hive UI Demo</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Avatar username={user.username} size="sm" />
              <div className="text-sm">
                <p className="font-medium">@{user.username}</p>
                <p className="text-xs text-muted-foreground">via {user.loginMethod}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-muted"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Default user: <span className="font-mono">@{demoUser}</span>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Section Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={activeSection === section.id ? "" : section.color}>
                {section.icon}
              </span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Authentication Section */}
        {activeSection === "auth" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Authentication Components</h2>
            <p className="text-muted-foreground mb-8">
              Test different login methods. Each component can be used independently.
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Keychain */}
              <AuthCard
                title="Keychain Login"
                description="Browser extension"
                icon={<Key className="h-5 w-5 text-hive-red" />}
                iconBg="bg-hive-red/10"
                expanded={expandedAuth === "keychain"}
                onToggle={() => setExpandedAuth(expandedAuth === "keychain" ? null : "keychain")}
              >
                <KeychainLogin
                  onSuccess={(u) => handleLogin(u.username, "Keychain")}
                  onError={(e) => console.error(e)}
                />
              </AuthCard>

              {/* PeakVault */}
              <AuthCard
                title="PeakVault Login"
                description="PeakD extension"
                icon={<Wallet className="h-5 w-5 text-blue-500" />}
                iconBg="bg-blue-500/10"
                expanded={expandedAuth === "peakvault"}
                onToggle={() => setExpandedAuth(expandedAuth === "peakvault" ? null : "peakvault")}
              >
                <PeakVaultLogin
                  onSuccess={(u) => handleLogin(u.username, "PeakVault")}
                  onError={(e) => console.error(e)}
                />
              </AuthCard>

              {/* HiveAuth */}
              <AuthCard
                title="HiveAuth Login"
                description="Mobile QR code"
                icon={<Smartphone className="h-5 w-5 text-hive-red" />}
                iconBg="bg-hive-red/10"
                expanded={expandedAuth === "hiveauth"}
                onToggle={() => setExpandedAuth(expandedAuth === "hiveauth" ? null : "hiveauth")}
              >
                <HiveAuthLogin
                  onSuccess={(u) => handleLogin(u.username, "HiveAuth")}
                  onError={(e) => console.error(e)}
                />
              </AuthCard>

              {/* HB-Auth */}
              <AuthCard
                title="HB-Auth Login"
                description="Safe Storage"
                icon={<Lock className="h-5 w-5 text-emerald-500" />}
                iconBg="bg-emerald-500/10"
                expanded={expandedAuth === "hbauth"}
                onToggle={() => setExpandedAuth(expandedAuth === "hbauth" ? null : "hbauth")}
              >
                <HBAuthLogin
                  onSuccess={(u) => handleLogin(u.username, "HB-Auth")}
                  onError={(e) => console.error(e)}
                />
              </AuthCard>

              {/* WIF Login */}
              <AuthCard
                title="WIF Login"
                description="Direct Key"
                icon={<FileKey className="h-5 w-5 text-orange-500" />}
                iconBg="bg-orange-500/10"
                expanded={expandedAuth === "wif"}
                onToggle={() => setExpandedAuth(expandedAuth === "wif" ? null : "wif")}
              >
                <WIFLogin
                  onSuccess={(u) => handleLogin(u.username, "WIF")}
                  onError={(e) => console.error(e)}
                />
              </AuthCard>
            </div>
          </div>
        )}

        {/* Social Section */}
        {activeSection === "social" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Social Components</h2>
              <p className="text-muted-foreground mb-8">
                User profiles, avatars, and social interactions. Using @{demoUser} as demo user.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ComponentCard title="Avatar" icon={<User className="h-5 w-5 text-blue-500" />}>
                <div className="flex flex-wrap items-end gap-4">
                  <Avatar username={demoUser} size="sm" />
                  <Avatar username={demoUser} size="md" />
                  <Avatar username={demoUser} size="lg" />
                  <Avatar username={demoUser} size="xl" showReputation reputation={75} />
                </div>
              </ComponentCard>

              <ComponentCard title="User Card" icon={<User className="h-5 w-5 text-blue-500" />}>
                <UserCard username={demoUser} />
              </ComponentCard>

              <ComponentCard title="Follow & Mute Buttons" icon={<Heart className="h-5 w-5 text-blue-500" />}>
                <div className="flex flex-wrap gap-4">
                  <FollowButton username={demoUser} />
                  <MuteButton username={demoUser} />
                </div>
              </ComponentCard>

              <ComponentCard title="Badge List" icon={<Award className="h-5 w-5 text-blue-500" />}>
                <BadgeList
                  badges={[
                    { name: "Developer", color: "bg-green-500", icon: "💻" },
                    { name: "Active", color: "bg-blue-500", icon: "🔥" },
                    { name: "Curator", color: "bg-purple-500", icon: "✨" },
                  ]}
                />
              </ComponentCard>
            </div>
          </div>
        )}

        {/* Content Section */}
        {activeSection === "content" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Content Components</h2>
              <p className="text-muted-foreground mb-8">
                Voting, comments, posts, and content interaction components.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ComponentCard title="Vote Button" icon={<ThumbsUp className="h-5 w-5 text-purple-500" />}>
                <VoteButton initialVotes={42} />
              </ComponentCard>

              <ComponentCard title="Reblog Button" icon={<Repeat className="h-5 w-5 text-purple-500" />}>
                <div className="flex justify-center">
                  <ReblogButton author={demoUser} permlink="demo-post" />
                </div>
              </ComponentCard>

              <ComponentCard title="Comment Form" icon={<MessageSquare className="h-5 w-5 text-purple-500" />} fullWidth>
                <CommentForm
                  parentAuthor={demoUser}
                  parentPermlink="demo-post"
                  username={demoUser}
                  onSubmit={(body) => console.log("Comment:", body)}
                />
              </ComponentCard>

              <ComponentCard title="Post Editor" icon={<FileText className="h-5 w-5 text-purple-500" />} fullWidth>
                <PostEditor
                  username={demoUser}
                  onPublish={(data) => console.log("Post:", data)}
                />
              </ComponentCard>
            </div>
          </div>
        )}

        {/* Wallet Section */}
        {activeSection === "wallet" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Wallet Components</h2>
              <p className="text-muted-foreground mb-8">
                Balance display, transfers, staking, and trading. Showing real data for @{demoUser}.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <ComponentCard title="Balance Card" icon={<Wallet className="h-5 w-5 text-green-500" />}>
                <BalanceCard username={demoUser} />
              </ComponentCard>

              <ComponentCard title="Transfer" icon={<Send className="h-5 w-5 text-green-500" />}>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Send HIVE or HBD to another account
                  </p>
                  <TransferDialog
                    username={demoUser}
                    onTransfer={(data) => console.log("Transfer:", data)}
                  />
                </div>
              </ComponentCard>

              <ComponentCard title="Power Up/Down" icon={<TrendingUp className="h-5 w-5 text-green-500" />}>
                <PowerUpDown
                  username={demoUser}
                  hiveBalance="1000.000"
                  vestingShares="50000.000000"
                  onPowerUp={(amount) => console.log("Power up:", amount)}
                  onPowerDown={(amount) => console.log("Power down:", amount)}
                />
              </ComponentCard>

              <ComponentCard title="Delegations" icon={<Users className="h-5 w-5 text-green-500" />}>
                <DelegationCard
                  username={demoUser}
                  availableHP="5000"
                  onDelegate={(to, amount) => console.log("Delegate:", to, amount)}
                  onUndelegate={(to) => console.log("Undelegate:", to)}
                />
              </ComponentCard>

              <ComponentCard title="Trade HIVE" icon={<ArrowUpDown className="h-5 w-5 text-green-500" />}>
                <TradeHive
                  username={demoUser}
                  hiveBalance="1000.000"
                  hbdBalance="500.000"
                  onTrade={(data) => console.log("Trade:", data)}
                />
              </ComponentCard>
            </div>
          </div>
        )}

        {/* Community Section */}
        {activeSection === "community" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Community Components</h2>
              <p className="text-muted-foreground mb-8">
                Governance, communities, and account management.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ComponentCard title="Witness Vote" icon={<Eye className="h-5 w-5 text-orange-500" />}>
                <WitnessVote
                  username={demoUser}
                  onVote={(witness, approve) => console.log("Vote witness:", witness, approve)}
                />
              </ComponentCard>

              <ComponentCard title="DHF Proposals" icon={<FileText className="h-5 w-5 text-orange-500" />}>
                <Proposals
                  username={demoUser}
                  onVote={(id, approve) => console.log("Vote proposal:", id, approve)}
                />
              </ComponentCard>

              <ComponentCard title="Communities" icon={<Globe className="h-5 w-5 text-orange-500" />}>
                <CommunitiesList
                  username={demoUser}
                  onSubscribe={(community, subscribed) =>
                    console.log("Subscribe:", community, subscribed)
                  }
                />
              </ComponentCard>

              <ComponentCard title="Account Settings" icon={<Settings className="h-5 w-5 text-orange-500" />}>
                <AccountSettings
                  username={demoUser}
                  onSave={(data) => console.log("Save settings:", data)}
                />
              </ComponentCard>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Hive UI Demo - Testing all components with @{demoUser}
          </p>
          <p className="mt-1">
            Connected to: {chain ? "Hive Blockchain" : "Not connected"}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function AuthCard({
  title,
  description,
  icon,
  iconBg,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
          <div className="text-left">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {expanded && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
}

function ComponentCard({
  title,
  icon,
  children,
  fullWidth = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 ${
        fullWidth ? "lg:col-span-2" : ""
      }`}
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}
