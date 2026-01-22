"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  LogOut,
  Loader2,
  ChevronDown,
  ChevronRight,
  FileText,
  Eye,
  Globe,
  Settings,
  Zap,
  X,
  BookOpen,
} from "lucide-react";
import {
  HiveAvatar,
  HiveUserCard,
  HiveFollowButton,
  HiveMuteButton,
  HiveVoteButton,
  HiveReblogButton,
  HiveBalanceCard,
  HiveKeychainLogin,
  HivePeakVaultLogin,
  HiveAuthLogin,
  HiveHBAuthLogin,
  HiveWIFLogin,
  HiveWitnessVote,
  HiveProposals,
  HiveCommunitiesList,
  HiveAccountSettings,
  HivePostCard,
  HiveManabar,
} from "@/components/hive";
import { PostPreviewCard } from "@/components/hive/post-preview-card";

// Alias for Eye icon to use in passive sections
const EyeIcon = Eye;

// Demo post for Content Actions
const DEMO_POST = {
  author: "barddev",
  permlink: "your-blog-your-rules",
};

interface DemoSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  type: "active" | "passive";
}

const sections: DemoSection[] = [
  // ACTIVE - Blockchain actions
  { id: "auth", title: "Authentication", icon: <Key className="h-5 w-5" />, color: "text-hive-red", type: "active" },
  { id: "social-active", title: "Social Actions", icon: <Heart className="h-5 w-5" />, color: "text-blue-500", type: "active" },
  { id: "content-active", title: "Content Actions", icon: <ThumbsUp className="h-5 w-5" />, color: "text-purple-500", type: "active" },
  // wallet-active - hidden (Coming Soon)
  { id: "community-active", title: "Community Actions", icon: <Globe className="h-5 w-5" />, color: "text-orange-500", type: "active" },
  { id: "account-active", title: "Account Management", icon: <Settings className="h-5 w-5" />, color: "text-cyan-500", type: "active" },
  // PASSIVE - Display only
  { id: "user-display", title: "User Display", icon: <User className="h-5 w-5" />, color: "text-blue-500", type: "passive" },
  { id: "wallet-display", title: "Wallet Display", icon: <Wallet className="h-5 w-5" />, color: "text-green-500", type: "passive" },
  { id: "post-display", title: "Post Display", icon: <FileText className="h-5 w-5" />, color: "text-purple-500", type: "passive" },
];

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-hive-red" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <DemoPageContent />
    </Suspense>
  );
}

function DemoPageContent() {
  const { chain, isLoading, user, login, logout } = useHive();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get tab from URL or default to "auth"
  const tabFromUrl = searchParams.get("tab");
  const validTabs = sections.map(s => s.id);
  const initialTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "auth";

  const [activeSection, setActiveSection] = useState<string>(initialTab);
  const [demoUser] = useState(DEFAULT_USER);

  // Sync URL when tab changes
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", sectionId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Sync state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl) && tabFromUrl !== activeSection) {
      setActiveSection(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Handle login from new auth components
  const handleLogin = (result: { username: string; loginMethod: string; keyType: string }) => {
    login(result as Parameters<typeof login>[0]);
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
            <a
              href="http://localhost:3030"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Documentation"
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </a>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <HiveAvatar username={user.username} size="sm" />
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
        <div className="space-y-4 mb-8">
          {/* ACTIVE Components */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-hive-red" />
              <span className="text-sm font-semibold text-hive-red">ACTIVE</span>
              <span className="text-xs text-muted-foreground">Blockchain Actions</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sections.filter(s => s.type === "active").map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? "bg-hive-red text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className={activeSection === section.id ? "text-white" : section.color}>
                    {section.icon}
                  </span>
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* PASSIVE Components */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">PASSIVE</span>
              <span className="text-xs text-muted-foreground">Display Only</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sections.filter(s => s.type === "passive").map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
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
          </div>
        </div>

        {/* Authentication Section */}
        {activeSection === "auth" && (
          <AuthenticationSection onLogin={handleLogin} />
        )}

        {/* Social Actions Section */}
        {activeSection === "social-active" && (
          <SocialActionsSection user={user} />
        )}

        {/* Content Actions Section */}
        {activeSection === "content-active" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="h-6 w-6 text-hive-red" />
                Content Actions
              </h2>
              <p className="text-muted-foreground mb-6">
                Voting, commenting, posting, and reblogging content.
                {user ? (
                  <span> Logged in as <span className="font-mono text-foreground">@{user.username}</span>.</span>
                ) : (
                  <span> Click buttons to login and interact.</span>
                )}
              </p>
            </div>

            {/* Post Preview */}
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Test Post</h3>
              <PostPreviewCard author={DEMO_POST.author} permlink={DEMO_POST.permlink} />
            </div>

            {/* Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <ComponentCard title="Vote" icon={<ThumbsUp className="h-5 w-5 text-purple-500" />}>
                <HiveVoteButton
                  author={DEMO_POST.author}
                  permlink={DEMO_POST.permlink}
                  onVote={(vote, weight) => console.log("Vote:", vote, weight)}
                />
              </ComponentCard>

              <ComponentCard title="Reblog" icon={<Repeat className="h-5 w-5 text-purple-500" />}>
                <HiveReblogButton
                  author={DEMO_POST.author}
                  permlink={DEMO_POST.permlink}
                  onReblog={(reblogged) => console.log("Reblog:", reblogged)}
                />
              </ComponentCard>
            </div>
          </div>
        )}

        {/* Community Actions Section */}
        {activeSection === "community-active" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="h-6 w-6 text-hive-red" />
                Community Actions
              </h2>
              <p className="text-muted-foreground mb-8">
                Witness voting, proposals, and communities.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ComponentCard title="Witness Vote" icon={<Eye className="h-5 w-5 text-orange-500" />}>
                <HiveWitnessVote
                  username={demoUser}
                  onVote={(witness, approve) => console.log("Vote witness:", witness, approve)}
                />
              </ComponentCard>

              <ComponentCard title="DHF Proposals" icon={<FileText className="h-5 w-5 text-orange-500" />}>
                <HiveProposals
                  username={demoUser}
                  onVote={(id, approve) => console.log("Vote proposal:", id, approve)}
                />
              </ComponentCard>

              <ComponentCard title="Communities" icon={<Globe className="h-5 w-5 text-orange-500" />}>
                <HiveCommunitiesList
                  username={demoUser}
                  onSubscribe={(community, subscribed) =>
                    console.log("Subscribe:", community, subscribed)
                  }
                />
              </ComponentCard>
            </div>
          </div>
        )}

        {/* Account Management Section (ACTIVE) */}
        {activeSection === "account-active" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Zap className="h-6 w-6 text-hive-red" />
                Account Management
              </h2>
              <p className="text-muted-foreground mb-8">
                Manage your profile settings. Using @{demoUser} as demo user.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ComponentCard title="Profile Settings" icon={<Settings className="h-5 w-5 text-cyan-500" />}>
                <HiveAccountSettings
                  username={demoUser}
                  onSave={(data) => console.log("Save settings:", data)}
                />
              </ComponentCard>
            </div>
          </div>
        )}

        {/* User Display Section (PASSIVE) */}
        {activeSection === "user-display" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <EyeIcon className="h-6 w-6 text-muted-foreground" />
                User Display
              </h2>
              <p className="text-muted-foreground mb-8">
                Components for displaying user information. Using @{demoUser} as demo user.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ComponentCard title="Avatar" icon={<User className="h-5 w-5 text-blue-500" />}>
                <div className="flex flex-wrap items-end gap-4">
                  <HiveAvatar username={demoUser} size="sm" />
                  <HiveAvatar username={demoUser} size="md" />
                  <HiveAvatar username={demoUser} size="lg" />
                  <HiveAvatar username={demoUser} size="xl" showReputation reputation={75} />
                </div>
              </ComponentCard>

              <ComponentCard title="User Card" icon={<User className="h-5 w-5 text-blue-500" />}>
                <HiveUserCard username={demoUser} />
              </ComponentCard>
            </div>
          </div>
        )}

        {/* Wallet Display Section (PASSIVE) */}
        {activeSection === "wallet-display" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <EyeIcon className="h-6 w-6 text-muted-foreground" />
                Wallet Display
              </h2>
              <p className="text-muted-foreground mb-8">
                Components for displaying wallet balances. Using @{demoUser} as demo user.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ComponentCard title="Balance Card" icon={<Wallet className="h-5 w-5 text-green-500" />}>
                <HiveBalanceCard username={demoUser} />
              </ComponentCard>

              <ComponentCard title="Manabar (Full)" icon={<Zap className="h-5 w-5 text-blue-500" />}>
                <HiveManabar username={demoUser} variant="full" showValues />
              </ComponentCard>

              <ComponentCard title="Manabar (Compact)" icon={<Zap className="h-5 w-5 text-blue-500" />}>
                <HiveManabar username={demoUser} variant="compact" />
              </ComponentCard>

              <ComponentCard title="Manabar (Ring)" icon={<Zap className="h-5 w-5 text-blue-500" />}>
                <div className="flex items-center gap-4">
                  <HiveManabar username={demoUser} variant="ring" />
                  <span className="text-sm text-muted-foreground">RC only (for headers/navbars)</span>
                </div>
              </ComponentCard>
            </div>
          </div>
        )}

        {/* Post Display Section (PASSIVE) */}
        {activeSection === "post-display" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <EyeIcon className="h-6 w-6 text-muted-foreground" />
                Post Display
              </h2>
              <p className="text-muted-foreground mb-8">
                Components for displaying posts. Showing <span className="font-mono text-foreground">@barddev/your-blog-your-rules</span>
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <ComponentCard title="Post Card (Card)" icon={<FileText className="h-5 w-5 text-purple-500" />}>
                <HivePostCard
                  author="barddev"
                  permlink="your-blog-your-rules"
                  variant="card"
                  interactive={false}
                />
              </ComponentCard>

              <ComponentCard title="Post Card (Compact)" icon={<FileText className="h-5 w-5 text-purple-500" />}>
                <HivePostCard
                  author="barddev"
                  permlink="your-blog-your-rules"
                  variant="compact"
                  interactive={false}
                />
              </ComponentCard>

              <ComponentCard title="Post Card (Grid)" icon={<FileText className="h-5 w-5 text-purple-500" />}>
                <HivePostCard
                  author="barddev"
                  permlink="your-blog-your-rules"
                  variant="grid"
                  interactive={false}
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
  comingSoon = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  comingSoon?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card relative ${comingSoon ? "overflow-hidden" : ""}`}>
      <button
        onClick={comingSoon ? undefined : onToggle}
        className={`w-full flex items-center justify-between p-4 ${comingSoon ? "cursor-default" : ""}`}
        disabled={comingSoon}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
          <div className="text-left">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {comingSoon ? (
          <span className="rounded bg-hive-red/10 px-2 py-0.5 text-xs text-hive-red">
            Coming Soon
          </span>
        ) : expanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {expanded && !comingSoon && <div className="p-4 pt-0">{children}</div>}
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-hive-red animate-pulse" />
              Coming Soon
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Authentication Section with dialogs
type AuthMethod = "keychain" | "peakvault" | "hiveauth" | "hbauth" | "wif" | null;

const authMethods = [
  {
    id: "keychain" as const,
    name: "Keychain",
    description: "Browser extension",
    icon: Key,
    color: "text-hive-red",
    bg: "bg-hive-red/10",
    hoverBorder: "hover:border-hive-red/50",
    hoverBg: "hover:bg-hive-red/5",
  },
  {
    id: "peakvault" as const,
    name: "PeakVault",
    description: "PeakD extension",
    icon: Wallet,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/50",
    hoverBg: "hover:bg-blue-500/5",
  },
  {
    id: "hiveauth" as const,
    name: "HiveAuth",
    description: "Mobile QR code",
    icon: Smartphone,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    hoverBorder: "hover:border-purple-500/50",
    hoverBg: "hover:bg-purple-500/5",
  },
  {
    id: "hbauth" as const,
    name: "HB-Auth",
    description: "Safe Storage",
    icon: Lock,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-500/5",
  },
  {
    id: "wif" as const,
    name: "WIF",
    description: "Direct Key (Dev)",
    icon: FileKey,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    hoverBorder: "hover:border-orange-500/50",
    hoverBg: "hover:bg-orange-500/5",
  },
];

function AuthenticationSection({ onLogin }: { onLogin: (result: { username: string; loginMethod: string; keyType: string }) => void }) {
  const [openMethod, setOpenMethod] = useState<AuthMethod>(null);

  const handleSuccess = (result: { username: string; loginMethod: string; keyType: string }) => {
    setOpenMethod(null);
    onLogin(result);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Authentication Components</h2>
        <p className="text-muted-foreground">
          Choose a login method. Each component can be used independently in your app.
        </p>
      </div>

      {/* Auth Method Buttons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {authMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setOpenMethod(method.id)}
            className={`flex flex-col items-start p-4 rounded-xl border border-border bg-card ${method.hoverBorder} ${method.hoverBg} transition-colors text-left`}
          >
            <div className={`p-2 rounded-lg ${method.bg} mb-3`}>
              <method.icon className={`h-5 w-5 ${method.color}`} />
            </div>
            <h3 className="font-semibold">{method.name}</h3>
            <p className="text-xs text-muted-foreground">{method.description}</p>
          </button>
        ))}
      </div>

      {/* Auth Dialog */}
      {openMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpenMethod(null)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const method = authMethods.find((m) => m.id === openMethod);
                  if (!method) return null;
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${method.bg}`}>
                        <method.icon className={`h-5 w-5 ${method.color}`} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{method.name} Login</h2>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={() => setOpenMethod(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Login Component */}
            {openMethod === "keychain" && (
              <HiveKeychainLogin
                onSuccess={handleSuccess}
                onError={(e) => console.error("Keychain error:", e.message)}
              />
            )}
            {openMethod === "peakvault" && (
              <HivePeakVaultLogin
                onSuccess={handleSuccess}
                onError={(e) => console.error("PeakVault error:", e.message)}
              />
            )}
            {openMethod === "hiveauth" && (
              <HiveAuthLogin
                onSuccess={handleSuccess}
                onError={(e) => console.error("HiveAuth error:", e.message)}
              />
            )}
            {openMethod === "hbauth" && (
              <HiveHBAuthLogin
                onSuccess={handleSuccess}
                onError={(e) => console.error("HB-Auth error:", e.message)}
              />
            )}
            {openMethod === "wif" && (
              <HiveWIFLogin
                onSuccess={handleSuccess}
                onError={(e) => console.error("WIF error:", e.message)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Social Actions Section with target user input
function SocialActionsSection({ user }: { user: { username: string; loginMethod: string } | null }) {
  const [targetUser, setTargetUser] = useState("guest4test");
  const [inputValue, setInputValue] = useState("guest4test");

  const handleUserChange = () => {
    const cleaned = inputValue.toLowerCase().replace(/[^a-z0-9.-]/g, "").trim();
    if (cleaned && cleaned !== targetUser) {
      setTargetUser(cleaned);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Zap className="h-6 w-6 text-hive-red" />
          Social Actions
        </h2>
        <p className="text-muted-foreground mb-4">
          Follow, mute, and interact with other users.
          {user ? (
            <span> Logged in as <span className="font-mono text-foreground">@{user.username}</span>.</span>
          ) : (
            <span> Login to test the actions.</span>
          )}
        </p>
      </div>

      {/* Target User Input */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <label className="text-sm font-medium whitespace-nowrap">Target User:</label>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-muted-foreground">@</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ""))}
            onBlur={handleUserChange}
            onKeyDown={(e) => e.key === "Enter" && handleUserChange()}
            placeholder="username"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50 font-mono"
          />
          <button
            onClick={handleUserChange}
            disabled={inputValue === targetUser}
            className="px-4 py-2 rounded-lg bg-hive-red text-white text-sm font-medium hover:bg-hive-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ComponentCard title="Follow Button" icon={<Heart className="h-5 w-5 text-blue-500" />}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Target user: <span className="font-mono text-foreground">@{targetUser}</span>
            </p>
            {user && user.username === targetUser && (
              <p className="text-xs text-orange-500">You cannot follow yourself.</p>
            )}
            <HiveFollowButton
              key={`follow-${targetUser}`}
              username={targetUser}
              onFollow={(following) => console.log("Follow state:", following)}
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Mute Button" icon={<User className="h-5 w-5 text-blue-500" />}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Target user: <span className="font-mono text-foreground">@{targetUser}</span>
            </p>
            {user && user.username === targetUser && (
              <p className="text-xs text-orange-500">You cannot mute yourself.</p>
            )}
            <HiveMuteButton
              key={`mute-${targetUser}`}
              username={targetUser}
              onMute={(muted) => console.log("Mute state:", muted)}
            />
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

function ComponentCard({
  title,
  icon,
  children,
  fullWidth = false,
  comingSoon = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
  comingSoon?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 relative ${
        fullWidth ? "lg:col-span-2" : ""
      } ${comingSoon ? "overflow-hidden" : ""}`}
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
        {comingSoon && (
          <span className="ml-auto rounded bg-hive-red/10 px-2 py-0.5 text-xs text-hive-red">
            Coming Soon
          </span>
        )}
      </h3>
      <div className={comingSoon ? "opacity-50 pointer-events-none blur-[1px]" : ""}>
        {children}
      </div>
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-hive-red animate-pulse" />
              Coming Soon
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
