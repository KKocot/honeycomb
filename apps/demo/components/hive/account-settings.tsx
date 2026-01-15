"use client";

import { useState } from "react";
import { Settings, Save, Loader2, AlertCircle, User, Link, MapPin, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSettingsProps {
  username: string;
  initialProfile?: ProfileData;
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

export function AccountSettings({
  username,
  initialProfile = defaultProfile,
  onSave,
  className,
}: AccountSettingsProps) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (key: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      onSave?.(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold">Profile Settings</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your public profile information
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
