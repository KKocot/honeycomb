"use client";

import { HiveAuthorPostList } from "@hiveio/honeycomb-react";

export default function AuthorPostListTab() {
  return (
    <div className="space-y-6">
      {/* Default - full width */}
      <section className="border border-hive-border rounded-lg p-4 sm:p-6 bg-hive-muted/20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
          Default (account=&quot;barddev&quot;)
        </h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Default compact list. Browse top-level posts from a specific Hive
          author.
        </p>
        <HiveAuthorPostList account="barddev" limit={5} />
      </section>

      {/* Two-column grid for smaller demos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="border border-hive-border rounded-lg p-4 sm:p-6 bg-hive-muted/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            With Tag Filter
          </h3>
          <p className="text-sm text-hive-muted-foreground mb-4">
            Posts from <code className="bg-hive-muted px-1 rounded">thebeedevs</code>{" "}
            filtered by tag <code className="bg-hive-muted px-1 rounded">wax</code>.
          </p>
          <HiveAuthorPostList
            account="thebeedevs"
            tag="wax"
            limit={5}
          />
        </section>

        <section className="border border-hive-border rounded-lg p-4 sm:p-6 bg-hive-muted/20">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Card Variant (account=&quot;gtg&quot;)
          </h3>
          <p className="text-sm text-hive-muted-foreground mb-4">
            Full card layout with thumbnails and body preview.
          </p>
          <HiveAuthorPostList account="gtg" variant="card" limit={3} />
        </section>
      </div>

      {/* Grid variant - full width, responsive grid inside */}
      <section className="border border-hive-border rounded-lg p-4 sm:p-6 bg-hive-muted/20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">
          Grid Variant (account=&quot;thebeedevs&quot;)
        </h2>
        <p className="text-sm text-hive-muted-foreground mb-4">
          Grid layout with thumbnail-first design.
        </p>
        <HiveAuthorPostList account="thebeedevs" variant="grid" limit={6} />
      </section>
    </div>
  );
}
