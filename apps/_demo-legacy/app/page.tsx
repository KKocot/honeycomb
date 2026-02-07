"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useHive, DEFAULT_USER } from "@/contexts/hive-context";
import {
  Wallet,
  User,
  Loader2,
  FileText,
  Eye,
  Zap,
  BookOpen,
} from "lucide-react";
import {
  HiveAvatar,
  HiveUserCard,
  HiveBalanceCard,
  HivePostCard,
  HiveManabar,
} from "@/components/hive";
// Alias for Eye icon to use in passive sections
const EyeIcon = Eye;

interface DemoSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  type: "active" | "passive";
}

const sections: DemoSection[] = [
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
  const { chain, is_loading } = useHive();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get tab from URL or default to "user-display"
  const tabFromUrl = searchParams.get("tab");
  const validTabs = sections.map(s => s.id);
  const initialTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "user-display";

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

  if (is_loading) {
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

          <div className="text-sm text-muted-foreground">
            Demo user: <span className="font-mono">@{demoUser}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Section Tabs */}
        <div className="space-y-4 mb-8">
          {/* PASSIVE Components */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">PASSIVE COMPONENTS</span>
              <span className="text-xs text-muted-foreground">Display Only</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sections.map((section) => (
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
