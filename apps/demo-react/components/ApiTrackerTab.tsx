"use client";

import { ApiTracker } from "@kkocot/honeycomb-react";

export default function ApiTrackerTab() {
  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-4">API Tracker</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the tracker to see all API endpoints and their health status.
        </p>
        <ApiTracker />
      </section>
    </div>
  );
}
