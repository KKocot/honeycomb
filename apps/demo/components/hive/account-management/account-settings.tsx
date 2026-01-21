"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Loader2, AlertCircle, User, Link, MapPin, FileText, RefreshCw, Shield, Eye, EyeOff, X, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHive } from "@/contexts/hive-context";
import { useRequireKey } from "@/hooks/use-require-key";
import { useBroadcast, BroadcastOperation } from "@/hooks/use-broadcast";
import { LoginPromptDialog } from "../active/login-prompt-dialog";

interface AccountSettingsProps {
  username: string;
  onSave?: (data: ProfileData) => void;
  className?: string;
}

interface ProfileData {
  name: string;
  about: string;
  location: string;
  website: string;
  cover_image: string;
  profile_image: string;
}

const defaultProfile: ProfileData = {
  name: "",
  about: "",
  location: "",
  website: "",
  cover_image: "",
  profile_image: "",
};

export function HiveAccountSettings({
  username,
  onSave,
  className,
}: AccountSettingsProps) {
  const { user } = useHive();
  // Profile updates use posting key via account_update2
  const { requireKey, isPending: isEscalating, hasAccess } = useRequireKey({
    requiredKeyType: "posting",
    reason: "Update your profile information",
  });
  const {
    broadcast,
    isLoading: isBroadcasting,
    needsWifKey,
    setWifKey,
    confirmWithWifKey,
    cancelWifKeyPrompt,
  } = useBroadcast({ keyType: "posting" });

  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [originalProfile, setOriginalProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [wifKeyInput, setWifKeyInput] = useState("");
  const [showWifKey, setShowWifKey] = useState(false);

  // Fetch current profile data
  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;

      setLoadingData(true);
      try {
        const response = await fetch("https://api.hive.blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_accounts",
            params: [[username]],
            id: 1,
          }),
        });

        const data = await response.json();
        if (data.result?.[0]) {
          const account = data.result[0];
          let metadata: any = {};

          // Parse posting_json_metadata or json_metadata
          try {
            const jsonMetadata = account.posting_json_metadata || account.json_metadata;
            if (jsonMetadata) {
              metadata = JSON.parse(jsonMetadata);
            }
          } catch (e) {
            console.error("Failed to parse metadata:", e);
          }

          const profileData: ProfileData = {
            name: metadata.profile?.name || "",
            about: metadata.profile?.about || "",
            location: metadata.profile?.location || "",
            website: metadata.profile?.website || "",
            cover_image: metadata.profile?.cover_image || "",
            profile_image: metadata.profile?.profile_image || "",
          };

          setProfile(profileData);
          setOriginalProfile(profileData);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoadingData(false);
      }
    }

    fetchProfile();
  }, [username]);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasChanges(changed);
  }, [profile, originalProfile]);

  const handleChange = (key: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setProfile(originalProfile);
  };

  const handleSave = async () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    // Check if user is editing their own profile
    if (user.username !== username) {
      setError("You can only edit your own profile");
      return;
    }

    // Profile updates use posting key - if user is logged in, they have at least posting access
    // Only request escalation if they somehow don't have posting key access
    if (!hasAccess) {
      const canProceed = await requireKey();
      if (!canProceed) {
        // User cancelled
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build posting_json_metadata with profile data
      const postingJsonMetadata = JSON.stringify({
        profile: {
          name: profile.name || undefined,
          about: profile.about || undefined,
          location: profile.location || undefined,
          website: profile.website || undefined,
          cover_image: profile.cover_image || undefined,
          profile_image: profile.profile_image || undefined,
        },
      });

      // Build account_update2 operation
      const operation: BroadcastOperation = [
        "account_update2",
        {
          account: user.username,
          json_metadata: "",
          posting_json_metadata: postingJsonMetadata,
          extensions: [],
        },
      ];

      // Use universal broadcast hook
      const result = await broadcast([operation]);

      if (!result.success) {
        throw new Error(result.error || "Broadcast failed");
      }

      onSave?.(profile);
      setOriginalProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle WIF key confirmation for HB-Auth/WIF login
  const handleWifKeyConfirm = async () => {
    setWifKey(wifKeyInput);
    const result = await confirmWithWifKey();
    if (result.success) {
      onSave?.(profile);
      setOriginalProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to save");
    }
    setWifKeyInput("");
  };

  const handleWifKeyCancel = () => {
    cancelWifKeyPrompt();
    setWifKeyInput("");
    setIsLoading(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    handleSave();
  };

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold">Profile Settings</h3>
            {loadingData && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {user ? (
              <>Update your public profile information</>
            ) : (
              <>Login to edit your profile settings</>
            )}
          </p>
        </div>

        {/* Preview */}
        <div className="relative">
          <div
            className="h-24 bg-gradient-to-r from-hive-red to-orange-500"
            style={
              profile.cover_image
                ? {
                    backgroundImage: `url(${profile.cover_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          />
          <div className="absolute -bottom-8 left-4">
            <img
              src={
                profile.profile_image ||
                `https://images.hive.blog/u/${username}/avatar`
              }
              alt={username}
              className="w-16 h-16 rounded-full border-4 border-card object-cover"
            />
          </div>
        </div>

        {/* Form */}
        <div className="p-4 pt-12 space-y-4">
          {loadingData ? (
            <div className="py-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
            </div>
          ) : (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <User className="h-4 w-4" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your display name"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <FileText className="h-4 w-4" />
                  About
                </label>
                <textarea
                  value={profile.about}
                  onChange={(e) => handleChange("about", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                  <Link className="h-4 w-4" />
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={profile.profile_image}
                    onChange={(e) => handleChange("profile_image", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={profile.cover_image}
                    onChange={(e) => handleChange("cover_image", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <Save className="h-4 w-4" />
                  Profile saved successfully!
                </div>
              )}

              {/* Key requirement indicator */}
              {!hasAccess && user && hasChanges && (
                <div className="flex items-center gap-2 text-sm text-blue-500 bg-blue-500/10 rounded-lg p-2">
                  <Shield className="h-4 w-4" />
                  <span>Saving requires Posting key authorization</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loadingData && (
          <div className="p-4 border-t border-border bg-muted/30 flex gap-2">
            {hasChanges && (
              <button
                onClick={handleReset}
                disabled={isLoading || isEscalating}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isLoading || isEscalating || !hasChanges}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
            >
              {isLoading || isEscalating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      <LoginPromptDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
        title="Login Required"
        description="You need to be logged in to save profile changes."
      />

      {/* WIF Key Dialog for HB-Auth/WIF */}
      {needsWifKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleWifKeyCancel}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-500" />
                Sign Transaction
              </h3>
              <button
                onClick={handleWifKeyCancel}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Enter your <strong>Private Posting Key</strong> (WIF format) to sign and broadcast this transaction.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showWifKey ? "text" : "password"}
                  value={wifKeyInput}
                  onChange={(e) => setWifKeyInput(e.target.value)}
                  placeholder="5..."
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono text-sm"
                  onKeyDown={(e) => e.key === "Enter" && wifKeyInput && handleWifKeyConfirm()}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowWifKey(!showWifKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showWifKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                <p className="text-xs text-orange-600">
                  <strong>Warning:</strong> Your key is used only to sign this transaction and is not stored.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleWifKeyCancel}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-muted text-foreground font-medium hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWifKeyConfirm}
                  disabled={!wifKeyInput || isBroadcasting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isBroadcasting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Sign & Broadcast"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
