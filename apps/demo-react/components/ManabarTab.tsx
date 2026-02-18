"use client";

import { HiveManabar } from "@barddev/honeycomb-react";

const DEMO_USERS = ["blocktrades", "barddev", "arcange", "good-karma"];

export default function ManabarTab() {
  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Full Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Three rings with labels and cooldown timers (default).
        </p>
        <HiveManabar username="blocktrades" />
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Compact Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Small inline rings without labels.
        </p>
        <HiveManabar username="blocktrades" variant="compact" />
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Ring Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Single RC ring for minimal display.
        </p>
        <HiveManabar username="blocktrades" variant="ring" />
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">With Values</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Full variant with numeric current/max values.
        </p>
        <HiveManabar username="blocktrades" showValues />
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Multiple Users</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Compact manabars for several accounts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_USERS.map((user) => (
            <div key={user} className="flex items-center gap-3">
              <span className="text-sm font-medium min-w-[100px]">
                @{user}
              </span>
              <HiveManabar username={user} variant="compact" />
            </div>
          ))}
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Custom Styling</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Override styles with className prop.
        </p>
        <HiveManabar
          username="arcange"
          className="border-hive-red/50"
        />
      </section>
    </div>
  );
}
