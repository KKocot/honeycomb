"use client";

import { UserCard } from "@kkocot/honeycomb-react";

const DEMO_USERS = ["barddev", "blocktrades", "gtg", "arcange"];

export default function UserCardTab() {
  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Default Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Standard card with avatar, name, reputation, and optional stats.
        </p>
        <div className="max-w-sm">
          <UserCard username="blocktrades" />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Compact Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Inline display with small avatar, username and reputation.
        </p>
        <div className="space-y-2">
          {DEMO_USERS.map((user) => (
            <UserCard key={user} username={user} variant="compact" />
          ))}
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Expanded Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Full profile card with cover image, bio, and detailed stats.
        </p>
        <div className="max-w-md">
          <UserCard username="blocktrades" variant="expanded" />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Without Stats</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Hide post count and balances by setting showStats to false.
        </p>
        <div className="max-w-sm">
          <UserCard username="gtg" showStats={false} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">User List</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Multiple default cards in a grid layout.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEMO_USERS.map((user) => (
            <UserCard key={user} username={user} />
          ))}
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Custom Styling</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Override appearance with className prop.
        </p>
        <div className="max-w-sm">
          <UserCard
            username="arcange"
            className="bg-hive-red/10 border-hive-red"
          />
        </div>
      </section>
    </div>
  );
}
