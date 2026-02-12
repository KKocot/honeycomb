"use client";

import { HivePostList } from "@kkocot/honeycomb-react";

const PINNED_POSTS = [
  { author: "gtg", permlink: "hive-hardfork-28-jump-starter-kit" },
];

export default function PostListTab() {
  return (
    <div className="space-y-6">
      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Sort Controls</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Interactive sort controls to browse different post rankings.
        </p>
        <div className="max-w-2xl">
          <HivePostList show_sort_controls={true} limit={5} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Compact Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Default compact list ideal for post feeds.
        </p>
        <div className="max-w-2xl">
          <HivePostList variant="compact" limit={5} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Card Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Full card layout with thumbnails and body preview.
        </p>
        <div className="max-w-2xl">
          <HivePostList variant="card" limit={3} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Grid Variant</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Grid layout with thumbnail-first design.
        </p>
        <div className="max-w-2xl">
          <HivePostList variant="grid" limit={6} />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Pinned Posts</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Pinned posts appear at the top with a badge.
        </p>
        <div className="max-w-2xl">
          <HivePostList
            pinned_posts={PINNED_POSTS}
            limit={5}
            variant="compact"
          />
        </div>
      </section>

      <section className="border border-border rounded-lg p-6 bg-muted/20">
        <h2 className="text-2xl font-semibold mb-2">Hidden Elements</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Hide specific elements from post cards.
        </p>
        <div className="max-w-2xl">
          <HivePostList hide={["thumbnail", "payout"]} limit={5} />
        </div>
      </section>
    </div>
  );
}
