import { For, type Component } from "solid-js";
import { cn } from "./utils";
import type { SortType } from "@kkocot/honeycomb-core";

const SORT_LABELS: Record<SortType, string> = {
  trending: "Trending",
  hot: "Hot",
  created: "New",
  payout: "Payout",
  muted: "Muted",
};

const SORT_OPTIONS: SortType[] = [
  "trending",
  "hot",
  "created",
  "payout",
  "muted",
];

export const SortControls: Component<{
  sort: SortType;
  on_change: (s: SortType) => void;
}> = (props) => {
  return (
    <div class="flex flex-wrap gap-2 mb-4">
      <For each={SORT_OPTIONS}>
        {(option) => (
          <button
            type="button"
            onClick={() => props.on_change(option)}
            class={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              option === props.sort
                ? "bg-foreground text-background"
                : "bg-hive-muted text-hive-muted-foreground hover:text-hive-foreground",
            )}
          >
            {SORT_LABELS[option]}
          </button>
        )}
      </For>
    </div>
  );
};

export const PaginationControls: Component<{
  page: number;
  has_prev: boolean;
  has_next: boolean;
  on_prev: () => void;
  on_next: () => void;
}> = (props) => {
  return (
    <div class="flex items-center justify-between mt-6">
      <button
        type="button"
        onClick={props.on_prev}
        disabled={!props.has_prev}
        class={cn(
          "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
          !props.has_prev &&
            "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
      >
        Prev Page
      </button>
      <span class="text-sm text-hive-muted-foreground">
        Page {props.page}
      </span>
      <button
        type="button"
        onClick={props.on_next}
        disabled={!props.has_next}
        class={cn(
          "rounded-lg border border-hive-border px-4 py-2 text-sm font-medium hover:bg-hive-muted transition-colors",
          !props.has_next &&
            "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
      >
        Next Page
      </button>
    </div>
  );
};
