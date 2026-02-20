import { For, Switch, Match } from "solid-js";
import type { PostVariant } from "./post-card";

export function CompactSkeleton() {
  return (
    <div class="flex gap-4 p-4 rounded-lg border border-hive-border bg-hive-card animate-pulse">
      <div class="w-20 h-20 rounded bg-hive-muted shrink-0" />
      <div class="flex-1 space-y-2">
        <div class="h-5 w-3/4 bg-hive-muted rounded" />
        <div class="h-3 w-1/3 bg-hive-muted rounded" />
        <div class="h-3 w-1/2 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div class="rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse">
      <div class="flex items-center gap-3 mb-3">
        <div class="h-10 w-10 rounded-full bg-hive-muted" />
        <div class="space-y-2">
          <div class="h-4 w-24 bg-hive-muted rounded" />
          <div class="h-3 w-16 bg-hive-muted rounded" />
        </div>
      </div>
      <div class="h-5 w-3/4 bg-hive-muted rounded mb-2" />
      <div class="h-3 w-full bg-hive-muted rounded mb-1" />
      <div class="h-3 w-2/3 bg-hive-muted rounded" />
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div class="rounded-lg border border-hive-border bg-hive-card overflow-hidden animate-pulse">
      <div class="aspect-video bg-hive-muted" />
      <div class="p-4 space-y-2">
        <div class="h-5 w-3/4 bg-hive-muted rounded" />
        <div class="h-3 w-1/3 bg-hive-muted rounded" />
      </div>
    </div>
  );
}

export function LoadingSkeleton(props: {
  variant: PostVariant;
  count: number;
}) {
  const items = () =>
    Array.from({ length: props.count }, (_, i) => i);

  return (
    <Switch fallback={null}>
      <Match when={props.variant === "grid"}>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={items()}>{() => <GridSkeleton />}</For>
        </div>
      </Match>
      <Match when={props.variant === "compact"}>
        <div class="flex flex-col gap-2">
          <For each={items()}>{() => <CompactSkeleton />}</For>
        </div>
      </Match>
      <Match when={props.variant === "card"}>
        <div class="flex flex-col gap-4">
          <For each={items()}>{() => <CardSkeleton />}</For>
        </div>
      </Match>
    </Switch>
  );
}
