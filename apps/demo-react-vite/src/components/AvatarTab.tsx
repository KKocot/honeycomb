import { HiveAvatar } from "@barddev/honeycomb-react";

const DEMO_USERS = [
  "barddev",
  "blocktrades",
  "arcange",
  "good-karma",
  "therealwolf",
];

export default function AvatarTab() {
  return (
    <div className="space-y-6">
      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Sizes</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          All available avatar sizes from xs to xl.
        </p>
        <div className="flex items-end gap-6">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <HiveAvatar username="blocktrades" size={size} />
              <span className="text-xs text-hive-muted-foreground">
                {size}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">With Border</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Ring border for emphasis or selection state.
        </p>
        <div className="flex items-center gap-6">
          <HiveAvatar username="blocktrades" size="lg" />
          <HiveAvatar username="blocktrades" size="lg" showBorder />
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Overlapping Stack</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Avatars stacked with overlap, commonly used for team members or PR
          reviewers.
        </p>
        <div className="flex -space-x-3">
          {DEMO_USERS.map((user) => (
            <HiveAvatar
              key={user}
              username={user}
              size="lg"
              showBorder
              className="ring-hive-background"
            />
          ))}
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">With Status Indicator</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Wrap avatar in a relative container to add online/offline indicators.
        </p>
        <div className="flex items-center gap-6">
          <div className="relative">
            <HiveAvatar username="blocktrades" size="lg" />
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-hive-success ring-2 ring-hive-background" />
          </div>
          <div className="relative">
            <HiveAvatar username="barddev" size="lg" />
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-hive-muted-foreground ring-2 ring-hive-background" />
          </div>
          <div className="relative">
            <HiveAvatar username="arcange" size="lg" />
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-hive-warning ring-2 ring-hive-background" />
          </div>
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Avatar Group</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Stacked avatars with a &quot;+N more&quot; counter badge.
        </p>
        <div className="flex -space-x-2 items-center">
          {DEMO_USERS.slice(0, 3).map((user) => (
            <HiveAvatar
              key={user}
              username={user}
              size="md"
              showBorder
              className="ring-hive-background"
            />
          ))}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hive-muted text-xs font-medium text-hive-muted-foreground ring-2 ring-hive-background">
            +{DEMO_USERS.length - 3}
          </div>
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Custom Fallback Colors</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Override auto-generated fallback color with the fallbackColor prop.
        </p>
        <div className="flex items-center gap-4">
          <HiveAvatar
            username="no-avatar-user-a"
            size="lg"
            fallbackColor="#E31337"
          />
          <HiveAvatar
            username="no-avatar-user-b"
            size="lg"
            fallbackColor="#3B82F6"
          />
          <HiveAvatar
            username="no-avatar-user-c"
            size="lg"
            fallbackColor="#10B981"
          />
          <HiveAvatar
            username="no-avatar-user-d"
            size="lg"
            fallbackColor="#8B5CF6"
          />
        </div>
      </section>

      <section className="border border-hive-border rounded-lg p-6 bg-hive-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Fallback Initials</h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          When profile image is unavailable, avatar shows user initials with
          auto-generated color.
        </p>
        <div className="flex items-end gap-6">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <HiveAvatar username="this-user-does-not-exist-xyz" size={size} />
              <span className="text-xs text-hive-muted-foreground">
                {size}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
