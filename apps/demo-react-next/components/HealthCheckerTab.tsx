"use client";

import { useState } from "react";
import { HealthCheckerComponent } from "@barddev/honeycomb-react";

const HC_TABS = [
  {
    key: "hive-node-api",
    label: "Hive Node API",
    description:
      "Core Hive node checks: account lookup, bridge posts, communities and ranked posts.",
  },
  {
    key: "hive-wallet-api",
    label: "Hive Wallet API",
    description:
      "Wallet-oriented checks: account lookup, dynamic global properties and witness lookup.",
  },
] as const;

export default function HealthCheckerTab() {
  const [activeHc, setActiveHc] = useState<string>(HC_TABS[0].key);
  const current = HC_TABS.find((t) => t.key === activeHc)!;

  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <div className="flex gap-2 mb-6">
          {HC_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveHc(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeHc === tab.key
                  ? "bg-hive-foreground text-hive-background"
                  : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {current.description}
        </p>
        {HC_TABS.map((tab) => (
          <div key={tab.key} className={activeHc === tab.key ? "" : "hidden"}>
            <HealthCheckerComponent healthcheckerKey={tab.key} />
          </div>
        ))}
      </section>
    </div>
  );
}
