"use client";

import { HealthCheckerComponent } from "@barddev/honeycomb-react";

export default function HealthCheckerTab() {
  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">Health Checker</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Monitors Hive API endpoint health, latency and validity. Toggle
          continuous checking, switch to the best provider, or add custom nodes.
        </p>
        <HealthCheckerComponent healthcheckerKey="demo-react-hc" />
      </section>
    </div>
  );
}
