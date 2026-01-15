import Link from "next/link";
import { ArrowRight, Info, Settings, User, Image, Bell, Lock, Save } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  component: `"use client";

import { useState } from "react";
import { Settings, User, Image, Bell, Lock, Save, Loader2, Check } from "lucide-react";

interface AccountSettingsProps {
  username: string;
  profile: {
    name?: string;
    about?: string;
    location?: string;
    website?: string;
    profile_image?: string;
    cover_image?: string;
  };
  preferences?: {
    nsfw?: boolean;
    blogDefault?: string;
    defaultBeneficiaries?: { account: string; weight: number }[];
  };
  onSaveProfile?: (profile: any) => Promise<void>;
  onSavePreferences?: (preferences: any) => Promise<void>;
  className?: string;
}

export function AccountSettings({
  username,
  profile,
  preferences = {},
  onSaveProfile,
  onSavePreferences,
  className = "",
}: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "notifications">("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(profile.name || "");
  const [about, setAbout] = useState(profile.about || "");
  const [location, setLocation] = useState(profile.location || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [profileImage, setProfileImage] = useState(profile.profile_image || "");
  const [coverImage, setCoverImage] = useState(profile.cover_image || "");

  const [showNsfw, setShowNsfw] = useState(preferences.nsfw || false);
  const [defaultBlog, setDefaultBlog] = useState(preferences.blogDefault || "");

  async function handleSaveProfile() {
    setIsSaving(true);
    try {
      await onSaveProfile?.({
        name,
        about,
        location,
        website,
        profile_image: profileImage,
        cover_image: coverImage,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSavePreferences() {
    setIsSaving(true);
    try {
      await onSavePreferences?.({
        nsfw: showNsfw,
        blogDefault: defaultBlog,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  return (
    <div className={\`rounded-xl border border-border bg-card \${className}\`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Account Settings</h3>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={\`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors \${
                activeTab === tab.id
                  ? "border-b-2 border-hive-red text-hive-red"
                  : "text-muted-foreground hover:text-foreground"
              }\`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "profile" && (
          <div className="space-y-4">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={username}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about yourself"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cover Image URL</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full py-3 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Show NSFW Content</p>
                <p className="text-sm text-muted-foreground">
                  Display posts marked as not safe for work
                </p>
              </div>
              <button
                onClick={() => setShowNsfw(!showNsfw)}
                className={\`w-12 h-6 rounded-full transition-colors \${
                  showNsfw ? "bg-hive-red" : "bg-muted-foreground/30"
                }\`}
              >
                <div
                  className={\`w-5 h-5 rounded-full bg-white transition-transform \${
                    showNsfw ? "translate-x-6" : "translate-x-0.5"
                  }\`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Default Blog Community</label>
              <input
                type="text"
                value={defaultBlog}
                onChange={(e) => setDefaultBlog(e.target.value)}
                placeholder="hive-123456"
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:border-hive-red focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Posts will default to this community
              </p>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="w-full py-3 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Notification settings coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}`,
  basicUsage: `"use client";

import { AccountSettings } from "@/components/hive/account-settings";
import { useHiveAuth } from "@/hooks/use-hive-auth";
import { useHiveAccount } from "@/hooks/use-hive-account";
import { useUpdateProfile } from "@/hooks/use-update-profile";

export function SettingsPage() {
  const { user } = useHiveAuth();
  const { account } = useHiveAccount(user?.username);
  const { updateProfile } = useUpdateProfile();

  if (!user || !account) return null;

  const profile = JSON.parse(account.posting_json_metadata || "{}").profile || {};

  return (
    <AccountSettings
      username={user.username}
      profile={profile}
      onSaveProfile={updateProfile}
    />
  );
}`,
  hook: `"use client";

import { useCallback } from "react";
import { useHiveChain } from "@/hooks/use-hive-chain";
import { useHiveAuth } from "@/hooks/use-hive-auth";

export function useUpdateProfile() {
  const { chain } = useHiveChain();
  const { user, signTransaction } = useHiveAuth();

  const updateProfile = useCallback(async (profile: {
    name?: string;
    about?: string;
    location?: string;
    website?: string;
    profile_image?: string;
    cover_image?: string;
  }) => {
    if (!user || !chain) return;

    const tx = chain.createTransaction();
    tx.pushOperation({
      account_update2: {
        account: user.username,
        json_metadata: "",
        posting_json_metadata: JSON.stringify({ profile }),
        extensions: [],
      },
    });

    await signTransaction(tx);
  }, [user, chain, signTransaction]);

  return { updateProfile };
}`,
};

export default async function AccountSettingsPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage profile information and account preferences.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Profile Metadata</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Profile data is stored in posting_json_metadata. Updating profile
              requires the posting key. Some apps may also store preferences locally.
            </p>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-xl mx-auto rounded-xl border border-border">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Account Settings</h3>
              <p className="text-sm text-muted-foreground">@alice</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-hive-red text-hive-red">
              <User className="h-4 w-4" /> Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground">
              <Settings className="h-4 w-4" /> Preferences
            </button>
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground">
              <Bell className="h-4 w-4" /> Notifications
            </button>
          </div>

          {/* Form preview */}
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                <div className="px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground">
                  https://...
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <div className="px-3 py-2 rounded-lg bg-muted border border-border">
                Alice
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About</label>
              <div className="px-3 py-2 rounded-lg bg-muted border border-border h-20 text-muted-foreground">
                Tell us about yourself
              </div>
            </div>
            <button className="w-full py-3 rounded-lg bg-hive-red text-white font-medium flex items-center justify-center gap-2">
              <Save className="h-4 w-4" /> Save Profile
            </button>
          </div>
        </div>
      </section>

      {/* Component Code */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Component</h2>
        <CodeBlock
          filename="components/hive/account-settings.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Hook */}
      <section>
        <h2 className="text-xl font-semibold mb-4">useUpdateProfile Hook</h2>
        <CodeBlock
          filename="hooks/use-update-profile.ts"
          code={CODE.hook}
          language="typescript"
        />
      </section>

      {/* Done */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Explore More</h2>
        <div className="flex gap-4">
          <Link
            href="/examples"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            View All Components
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
