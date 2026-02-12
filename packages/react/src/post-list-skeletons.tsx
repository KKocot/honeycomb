"use client";

import type { PostVariant } from "./post-card";

function CompactSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse">
      <div className="w-20 h-20 rounded bg-hive-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 bg-hive-muted rounded" />
        <div className="h-3 w-1/3 bg-hive-muted rounded" />
        <div className="h-3 w-1/2 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-hive-muted" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-hive-muted rounded" />
          <div className="h-3 w-16 bg-hive-muted rounded" />
        </div>
      </div>
      <div className="h-5 w-3/4 bg-hive-muted rounded mb-2" />
      <div className="h-3 w-full bg-hive-muted rounded mb-1" />
      <div className="h-3 w-2/3 bg-hive-muted rounded" />
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="rounded-lg border border-hive-border bg-hive-card overflow-hidden animate-pulse">
      <div className="aspect-video bg-hive-muted" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 bg-hive-muted rounded" />
        <div className="h-3 w-1/3 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

export { CompactSkeleton };

export function LoadingSkeleton({
  variant,
  count,
}: {
  variant: PostVariant;
  count: number;
}) {
  const items = Array.from({ length: count }, (_, i) => i);
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <GridSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-2">
        {items.map((i) => (
          <CompactSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {items.map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
