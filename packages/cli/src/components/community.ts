import type { ComponentDefinition } from "../registry.js";

export const witnessVote: ComponentDefinition = {
  name: "witness-vote",
  description: "Vote for Hive witnesses",
  category: "community",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "hive-provider"],
  files: [
    {
      path: "components/hive/witness-vote.tsx",
      content: `"use client";

import { useState } from "react";
import { Eye, Check, Loader2, Search, ExternalLink } from "lucide-react";
import { useHive } from "@/contexts/hive-context";
import { cn } from "@/lib/utils";

interface Witness {
  owner: string;
  votes: string;
  running_version: string;
  url: string;
  is_disabled: boolean;
}

interface WitnessVoteProps {
  username: string;
  onVote?: (witness: string, approve: boolean) => void;
  className?: string;
}

const mockWitnesses: Witness[] = [
  { owner: "blocktrades", votes: "120000000000", running_version: "1.27.5", url: "https://blocktrades.us", is_disabled: false },
  { owner: "gtg", votes: "115000000000", running_version: "1.27.5", url: "https://gtg.openhive.network", is_disabled: false },
  { owner: "arcange", votes: "110000000000", running_version: "1.27.5", url: "https://arcange.eu", is_disabled: false },
  { owner: "good-karma", votes: "105000000000", running_version: "1.27.5", url: "https://ecency.com", is_disabled: false },
  { owner: "roelandp", votes: "100000000000", running_version: "1.27.5", url: "https://roelandp.nl/witness", is_disabled: false },
];

export function WitnessVote({ username, onVote, className }: WitnessVoteProps) {
  const { chain } = useHive();
  const [witnesses, setWitnesses] = useState<Witness[]>(mockWitnesses);
  const [votedWitnesses, setVotedWitnesses] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const filteredWitnesses = witnesses.filter((w) =>
    w.owner.toLowerCase().includes(search.toLowerCase())
  );

  const handleVote = async (witness: string) => {
    const isVoted = votedWitnesses.includes(witness);
    setIsLoading(witness);

    try {
      await new Promise((r) => setTimeout(r, 800));

      if (isVoted) {
        setVotedWitnesses((prev) => prev.filter((w) => w !== witness));
      } else {
        if (votedWitnesses.length >= 30) {
          alert("You can only vote for 30 witnesses");
          return;
        }
        setVotedWitnesses((prev) => [...prev, witness]);
      }

      onVote?.(witness, !isVoted);
    } finally {
      setIsLoading(null);
    }
  };

  const formatVotes = (votes: string) => {
    const num = parseInt(votes) / 1000000;
    if (num >= 1000000) return \`\${(num / 1000000).toFixed(1)}T\`;
    if (num >= 1000) return \`\${(num / 1000).toFixed(1)}B\`;
    return \`\${num.toFixed(1)}M\`;
  };

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Witness Votes</h3>
            </div>
            <span className="text-sm text-muted-foreground">{votedWitnesses.length}/30 votes</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search witnesses..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
        </div>

        {/* Witness List */}
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {filteredWitnesses.map((witness, index) => {
            const isVoted = votedWitnesses.includes(witness.owner);
            const isLoadingThis = isLoading === witness.owner;

            return (
              <div key={witness.owner} className={cn("flex items-center justify-between p-4", witness.is_disabled && "opacity-50")}>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">#{index + 1}</span>
                  <img src={\`https://images.hive.blog/u/\${witness.owner}/avatar/small\`} alt={witness.owner} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">@{witness.owner}</span>
                      {witness.url && (
                        <a href={witness.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatVotes(witness.votes)} VESTS</span>
                      <span>v{witness.running_version}</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => handleVote(witness.owner)} disabled={isLoadingThis || witness.is_disabled}
                  className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isVoted ? "bg-green-500 text-white" : "bg-muted hover:bg-muted/80")}>
                  {isLoadingThis ? <Loader2 className="h-4 w-4 animate-spin" /> : isVoted ? <><Check className="h-4 w-4" />Voted</> : "Vote"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Witnesses secure the Hive blockchain. Vote for trusted node operators. You can vote for up to 30 witnesses.
          </p>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};

export const proposals: ComponentDefinition = {
  name: "proposals",
  description: "Vote on DHF proposals",
  category: "community",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/proposals.tsx",
      content: `"use client";

import { useState } from "react";
import { FileText, ThumbsUp, ThumbsDown, Loader2, Calendar, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface Proposal {
  id: number;
  creator: string;
  subject: string;
  daily_pay: string;
  total_votes: string;
  status: "active" | "inactive" | "expired";
  start_date: string;
  end_date: string;
}

interface ProposalsProps {
  username: string;
  onVote?: (proposalId: number, approve: boolean) => void;
  className?: string;
}

const mockProposals: Proposal[] = [
  { id: 245, creator: "hiveio", subject: "Core Development - Q1 2024", daily_pay: "500.000 HBD", total_votes: "85000000000", status: "active", start_date: "2024-01-01", end_date: "2024-03-31" },
  { id: 244, creator: "ecency", subject: "Ecency Development & Infrastructure", daily_pay: "350.000 HBD", total_votes: "75000000000", status: "active", start_date: "2024-01-01", end_date: "2024-06-30" },
  { id: 243, creator: "peakd", subject: "PeakD Frontend Development", daily_pay: "300.000 HBD", total_votes: "70000000000", status: "active", start_date: "2024-01-01", end_date: "2024-12-31" },
  { id: 242, creator: "hivewatchers", subject: "Anti-Abuse Operations", daily_pay: "200.000 HBD", total_votes: "60000000000", status: "active", start_date: "2024-01-01", end_date: "2024-06-30" },
];

export function Proposals({ username, onVote, className }: ProposalsProps) {
  const [proposals] = useState<Proposal[]>(mockProposals);
  const [votedProposals, setVotedProposals] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "voted" | "unvoted">("all");

  const handleVote = async (proposalId: number, approve: boolean) => {
    setIsLoading(proposalId);

    try {
      await new Promise((r) => setTimeout(r, 800));
      setVotedProposals((prev) => ({ ...prev, [proposalId]: approve }));
      onVote?.(proposalId, approve);
    } finally {
      setIsLoading(null);
    }
  };

  const formatVotes = (votes: string) => {
    const num = parseInt(votes) / 1000000;
    if (num >= 1000000) return \`\${(num / 1000000).toFixed(1)}T\`;
    if (num >= 1000) return \`\${(num / 1000).toFixed(1)}B\`;
    return \`\${num.toFixed(1)}M\`;
  };

  const filteredProposals = proposals.filter((p) => {
    if (filter === "voted") return votedProposals[p.id] !== undefined;
    if (filter === "unvoted") return votedProposals[p.id] === undefined;
    return true;
  });

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">DHF Proposals</h3>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(["all", "voted", "unvoted"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-3 py-1.5 rounded-lg text-sm font-medium capitalize", filter === f ? "bg-orange-500 text-white" : "bg-muted")}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Proposals List */}
        <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
          {filteredProposals.map((proposal) => {
            const voted = votedProposals[proposal.id];
            const isLoadingThis = isLoading === proposal.id;

            return (
              <div key={proposal.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">#{proposal.id}</span>
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium",
                        proposal.status === "active" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground")}>
                        {proposal.status}
                      </span>
                    </div>

                    <h4 className="font-medium mb-1">{proposal.subject}</h4>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <img src={\`https://images.hive.blog/u/\${proposal.creator}/avatar/small\`} alt={proposal.creator} className="w-4 h-4 rounded-full" />
                      <span>@{proposal.creator}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{proposal.daily_pay}/day</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{formatVotes(proposal.total_votes)} VESTS</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{proposal.start_date} - {proposal.end_date}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleVote(proposal.id, true)} disabled={isLoadingThis}
                      className={cn("flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
                        voted === true ? "bg-green-500 text-white" : "bg-muted hover:bg-green-500/10 hover:text-green-500")}>
                      {isLoadingThis ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleVote(proposal.id, false)} disabled={isLoadingThis}
                      className={cn("flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
                        voted === false ? "bg-red-500 text-white" : "bg-muted hover:bg-red-500/10 hover:text-red-500")}>
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            The Decentralized Hive Fund (DHF) funds community proposals. Vote for proposals you believe benefit the ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};

export const communitiesList: ComponentDefinition = {
  name: "communities-list",
  description: "Browse and join Hive communities",
  category: "community",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/communities-list.tsx",
      content: `"use client";

import { useState } from "react";
import { Globe, Users, Bell, BellOff, Loader2, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Community {
  name: string;
  title: string;
  about: string;
  subscribers: number;
  num_pending: number;
  num_authors: number;
}

interface CommunitiesListProps {
  username: string;
  onSubscribe?: (community: string, subscribed: boolean) => void;
  className?: string;
}

const mockCommunities: Community[] = [
  { name: "hive-167922", title: "LeoFinance", about: "Pair crypto & finance content creators with a token-powered community.", subscribers: 12500, num_pending: 150, num_authors: 890 },
  { name: "hive-174578", title: "OCD", about: "Original Content & Curation on Hive", subscribers: 10200, num_pending: 200, num_authors: 750 },
  { name: "hive-140217", title: "Hive Gaming", about: "Community for gamers on Hive blockchain", subscribers: 8900, num_pending: 180, num_authors: 620 },
  { name: "hive-148441", title: "Pinmapple", about: "Travel community. Share your adventures!", subscribers: 7500, num_pending: 120, num_authors: 450 },
  { name: "hive-163772", title: "Photography Lovers", about: "A community for photography enthusiasts", subscribers: 6800, num_pending: 95, num_authors: 380 },
];

export function CommunitiesList({ username, onSubscribe, className }: CommunitiesListProps) {
  const [communities] = useState<Community[]>(mockCommunities);
  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (communityName: string) => {
    const isSubscribed = subscribed.includes(communityName);
    setIsLoading(communityName);

    try {
      await new Promise((r) => setTimeout(r, 600));

      if (isSubscribed) {
        setSubscribed((prev) => prev.filter((c) => c !== communityName));
      } else {
        setSubscribed((prev) => [...prev, communityName]);
      }

      onSubscribe?.(communityName, !isSubscribed);
    } finally {
      setIsLoading(null);
    }
  };

  const filteredCommunities = communities.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.about.toLowerCase().includes(search.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000) return \`\${(num / 1000).toFixed(1)}K\`;
    return num.toString();
  };

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Communities</h3>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
        </div>

        {/* Communities List */}
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {filteredCommunities.map((community) => {
            const isSubscribed = subscribed.includes(community.name);
            const isLoadingThis = isLoading === community.name;

            return (
              <div key={community.name} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {community.title.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium truncate">{community.title}</h4>
                      <button onClick={() => handleSubscribe(community.name)} disabled={isLoadingThis}
                        className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium shrink-0",
                          isSubscribed ? "bg-muted text-foreground" : "bg-blue-500 text-white hover:bg-blue-600")}>
                        {isLoadingThis ? <Loader2 className="h-4 w-4 animate-spin" /> :
                          isSubscribed ? <><BellOff className="h-4 w-4" />Joined</> : <><Bell className="h-4 w-4" />Join</>}
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{community.about}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(community.subscribers)}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{community.num_pending} pending</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">Join communities to see their posts in your feed</p>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};

export const accountSettings: ComponentDefinition = {
  name: "account-settings",
  description: "Edit user profile settings",
  category: "community",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/hive/account-settings.tsx",
      content: `"use client";

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
          <p className="mt-1 text-sm text-muted-foreground">Update your public profile information</p>
        </div>

        {/* Preview */}
        <div className="relative">
          <div className="h-24 bg-gradient-to-r from-hive-red to-orange-500"
            style={profile.cover_image ? { backgroundImage: \`url(\${profile.cover_image})\`, backgroundSize: "cover", backgroundPosition: "center" } : {}} />
          <div className="absolute -bottom-8 left-4">
            <img src={profile.profile_image || \`https://images.hive.blog/u/\${username}/avatar\`} alt={username}
              className="w-16 h-16 rounded-full border-4 border-card object-cover" />
          </div>
        </div>

        {/* Form */}
        <div className="p-4 pt-12 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5"><User className="h-4 w-4" />Display Name</label>
            <input type="text" value={profile.name} onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your display name" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5"><FileText className="h-4 w-4" />About</label>
            <textarea value={profile.about} onChange={(e) => handleChange("about", e.target.value)}
              placeholder="Tell us about yourself..." rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5"><MapPin className="h-4 w-4" />Location</label>
            <input type="text" value={profile.location} onChange={(e) => handleChange("location", e.target.value)}
              placeholder="City, Country" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5"><Link className="h-4 w-4" />Website</label>
            <input type="url" value={profile.website} onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourwebsite.com" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Profile Image URL</label>
              <input type="url" value={profile.profile_image} onChange={(e) => handleChange("profile_image", e.target.value)}
                placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Cover Image URL</label>
              <input type="url" value={profile.cover_image} onChange={(e) => handleChange("cover_image", e.target.value)}
                placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>

          {error && <div className="flex items-center gap-2 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{error}</div>}
          {success && <div className="flex items-center gap-2 text-sm text-green-500"><Save className="h-4 w-4" />Profile saved successfully!</div>}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <button onClick={handleSave} disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium hover:bg-hive-red/90 disabled:opacity-50">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" />Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};
