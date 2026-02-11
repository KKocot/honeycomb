"use client";

import { HivePostCard } from "@kkocot/honeycomb-react";

const GTG_POST = "hive-hardfork-28-jump-starter-kit";
const BLOCKTRADES_POST =
  "updates-for-hive-roadmap-from-the-blocktrades-team";

export default function PostCardTab() {
  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Card Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Default variant with author info, body preview, and post stats.
        </p>
        <div className="max-w-lg">
          <HivePostCard author="gtg" permlink={GTG_POST} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Compact Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Condensed layout ideal for post lists and sidebars.
        </p>
        <div className="max-w-lg space-y-3">
          <HivePostCard
            author="gtg"
            permlink={GTG_POST}
            variant="compact"
          />
          <HivePostCard
            author="blocktrades"
            permlink={BLOCKTRADES_POST}
            variant="compact"
          />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Grid Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Thumbnail-first layout for image galleries and grid views.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <HivePostCard
            author="gtg"
            permlink={GTG_POST}
            variant="grid"
          />
          <HivePostCard
            author="blocktrades"
            permlink={BLOCKTRADES_POST}
            variant="grid"
          />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Hidden Elements</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Hide specific parts of the post card using the hide prop.
        </p>
        <div className="max-w-lg space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              hide={`["author", "thumbnail"]`}
            </p>
            <HivePostCard
              author="gtg"
              permlink={GTG_POST}
              hide={["author", "thumbnail"]}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              hide={`["payout", "votes", "comments"]`}
            </p>
            <HivePostCard
              author="gtg"
              permlink={GTG_POST}
              hide={["payout", "votes", "comments"]}
            />
          </div>
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Custom Link Target</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Links point to different Hive frontends.
        </p>
        <div className="max-w-lg space-y-3">
          <HivePostCard
            author="gtg"
            permlink={GTG_POST}
            linkTarget="https://peakd.com"
            variant="compact"
          />
          <HivePostCard
            author="gtg"
            permlink={GTG_POST}
            linkTarget="https://ecency.com"
            variant="compact"
          />
        </div>
      </section>
    </div>
  );
}
