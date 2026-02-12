import { HivePostCard } from "@kkocot/honeycomb-solid";
import type { PostHideOption } from "@kkocot/honeycomb-solid";

const POST_A = {
  author: "barddev",
  permlink: "honeycomb-hive-ui-library",
};
const POST_B = {
  author: "blocktrades",
  permlink: "updates-for-hive-roadmap-from-the-blocktrades-team",
};

const HIDDEN_ELEMENTS: PostHideOption[] = ["payout", "votes"];

/** Demo tab showcasing HivePostCard variants and options. */
export default function PostCardTab() {
  return (
    <div class="space-y-6">
      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Card Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Default full card with thumbnail, author, title, body preview, and
          stats.
        </p>
        <div class="max-w-lg">
          <HivePostCard author={POST_A.author} permlink={POST_A.permlink} />
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Compact Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Inline layout with small thumbnail, title, and stats. Good for lists
          and sidebars.
        </p>
        <div class="max-w-lg space-y-3">
          <HivePostCard
            author={POST_A.author}
            permlink={POST_A.permlink}
            variant="compact"
          />
          <HivePostCard
            author={POST_B.author}
            permlink={POST_B.permlink}
            variant="compact"
          />
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Grid Variant</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Image-first layout designed for grid displays and content feeds.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HivePostCard
            author={POST_A.author}
            permlink={POST_A.permlink}
            variant="grid"
          />
          <HivePostCard
            author={POST_B.author}
            permlink={POST_B.permlink}
            variant="grid"
          />
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Hidden Elements</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Use the <code class="text-xs bg-muted px-1 py-0.5 rounded">hide</code>{" "}
          prop to selectively remove payout, votes, comments, author, thumbnail,
          or time.
        </p>
        <div class="max-w-lg">
          <HivePostCard
            author={POST_A.author}
            permlink={POST_A.permlink}
            hide={HIDDEN_ELEMENTS}
          />
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Custom Link Target</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Override the default link base URL with{" "}
          <code class="text-xs bg-muted px-1 py-0.5 rounded">linkTarget</code>.
          Links below point to peakd.com.
        </p>
        <div class="max-w-lg">
          <HivePostCard
            author={POST_B.author}
            permlink={POST_B.permlink}
            linkTarget="https://peakd.com"
          />
        </div>
      </section>
    </div>
  );
}
