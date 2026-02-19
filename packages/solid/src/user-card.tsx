import { createMemo, Show, Switch, Match, type Component } from "solid-js";
import { useHiveAccount } from "./use-hive-account";
import { HiveAvatar } from "./avatar";
import { cn } from "./utils";

export type UserCardVariant = "compact" | "default" | "expanded";

export interface UserCardProps {
  username: string;
  variant?: UserCardVariant;
  showStats?: boolean;
  class?: string;
}

interface ProfileMetadata {
  name?: string;
  about?: string;
  location?: string;
  website?: string;
  profile_image?: string;
  cover_image?: string;
}

function parse_metadata(
  account: {
    posting_json_metadata?: string;
    json_metadata?: string;
  } | null,
): ProfileMetadata | null {
  if (!account) return null;

  try {
    if (account.posting_json_metadata) {
      const parsed: unknown = JSON.parse(account.posting_json_metadata);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "profile" in parsed
      ) {
        return (parsed as { profile: ProfileMetadata }).profile;
      }
    }
    if (account.json_metadata) {
      const parsed: unknown = JSON.parse(account.json_metadata);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "profile" in parsed
      ) {
        return (parsed as { profile: ProfileMetadata }).profile;
      }
    }
  } catch {
    // Invalid JSON
  }
  return null;
}

export const UserCard: Component<UserCardProps> = (props) => {
  const { account, is_loading, error } = useHiveAccount(
    () => props.username,
  );

  const variant = () => props.variant || "default";
  const show_stats = () => props.showStats !== false;

  const metadata = createMemo(() => parse_metadata(account()));
  // Reputation already formatted by useHiveAccount hook
  const reputation = createMemo(() => account()?.reputation ?? 25);

  return (
    <Show
      when={!is_loading()}
      fallback={
        <div
          class={cn(
            "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
            props.class,
          )}
        >
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-full bg-hive-muted" />
            <div class="space-y-2">
              <div class="h-4 w-24 bg-hive-muted rounded" />
              <div class="h-3 w-32 bg-hive-muted rounded" />
            </div>
          </div>
        </div>
      }
    >
      <Show
        when={!error() && account()}
        fallback={
          <div
            class={cn(
              "rounded-lg border border-hive-border bg-hive-card p-4",
              props.class,
            )}
          >
            <p class="text-sm text-hive-muted-foreground">
              {error()?.message || "User not found"}
            </p>
          </div>
        }
      >
        <Switch>
          <Match when={variant() === "compact"}>
            <div class={cn("flex items-center gap-2", props.class)}>
              <HiveAvatar username={props.username} size="sm" />
              <div>
                <span class="font-medium">@{props.username}</span>
                <span class="text-hive-muted-foreground text-sm ml-1">
                  ({reputation()})
                </span>
              </div>
            </div>
          </Match>

          <Match when={variant() === "expanded"}>
            <div
              class={cn(
                "rounded-lg border border-hive-border bg-hive-card overflow-hidden",
                props.class,
              )}
            >
              <Show when={metadata()?.cover_image}>
                <img
                  src={metadata()?.cover_image}
                  alt="Cover"
                  class="w-full h-32 object-cover"
                />
              </Show>
              <div class="p-4">
                <div class="flex items-start gap-4">
                  <HiveAvatar
                    username={props.username}
                    size="xl"
                    class={
                      metadata()?.cover_image
                        ? "-mt-10 ring-4 ring-hive-card"
                        : ""
                    }
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-lg truncate">
                      {metadata()?.name || `@${props.username}`}
                    </h3>
                    <p class="text-hive-muted-foreground text-sm">
                      @{props.username} • Rep: {reputation()}
                    </p>
                  </div>
                </div>

                <Show when={metadata()?.about}>
                  <p class="mt-3 text-sm text-hive-muted-foreground line-clamp-2">
                    {metadata()?.about}
                  </p>
                </Show>

                <Show when={show_stats()}>
                  <div class="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p class="text-lg font-bold">
                        {account()?.post_count}
                      </p>
                      <p class="text-xs text-hive-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p class="text-lg font-bold">
                        {account()?.hive_power.split(" ")[0]}
                      </p>
                      <p class="text-xs text-hive-muted-foreground">HP</p>
                    </div>
                    <div>
                      <p class="text-lg font-bold">
                        {account()?.balance.split(" ")[0]}
                      </p>
                      <p class="text-xs text-hive-muted-foreground">HIVE</p>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </Match>

          <Match when={variant() === "default"}>
            <div
              class={cn(
                "rounded-lg border border-hive-border bg-hive-card p-4",
                props.class,
              )}
            >
              <div class="flex items-center gap-3">
                <HiveAvatar username={props.username} size="lg" />
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold truncate">
                    {metadata()?.name || `@${props.username}`}
                  </h3>
                  <p class="text-sm text-hive-muted-foreground">
                    @{props.username} • Rep: {reputation()}
                  </p>
                </div>
              </div>

              <Show when={show_stats()}>
                <div class="mt-3 flex gap-4 text-sm">
                  <span>{account()?.post_count} posts</span>
                  <span>{account()?.hive_power}</span>
                </div>
              </Show>
            </div>
          </Match>
        </Switch>
      </Show>
    </Show>
  );
};
