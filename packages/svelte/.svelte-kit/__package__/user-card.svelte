<script lang="ts" module>
  export type UserCardVariant = "compact" | "default" | "expanded";

  export interface UserCardProps {
    /** Hive username */
    username: string;
    /** Card display style */
    variant?: UserCardVariant;
    /** Show post count and balances */
    showStats?: boolean;
    /** Additional CSS classes */
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

  function has_profile(
    data: unknown,
  ): data is { profile: ProfileMetadata } {
    if (typeof data !== "object" || data === null) return false;
    if (!("profile" in data)) return false;
    const candidate = data.profile;
    return typeof candidate === "object" && candidate !== null;
  }

  /**
   * Parse profile metadata from account JSON
   */
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
        if (has_profile(parsed)) {
          return parsed.profile;
        }
      }
      if (account.json_metadata) {
        const parsed: unknown = JSON.parse(account.json_metadata);
        if (has_profile(parsed)) {
          return parsed.profile;
        }
      }
    } catch {
      // Invalid JSON
    }
    return null;
  }
</script>

<script lang="ts">
  import { useHiveAccount } from "./use-hive-account.svelte";
  import HiveAvatar from "./avatar.svelte";
  import { cn } from "./utils";

  let {
    username,
    variant = "default",
    showStats = true,
    class: class_name,
  }: UserCardProps = $props();

  const { account, is_loading, error } = useHiveAccount(() => username);

  const metadata = $derived(parse_metadata(account));
</script>

{#if is_loading}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
      class_name,
    )}
  >
    <div class="flex items-center gap-3">
      <div class="h-12 w-12 rounded-full bg-hive-muted"></div>
      <div class="space-y-2">
        <div class="h-4 w-24 bg-hive-muted rounded"></div>
        <div class="h-3 w-32 bg-hive-muted rounded"></div>
      </div>
    </div>
  </div>
{:else if error || !account}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4",
      class_name,
    )}
  >
    <p class="text-sm text-hive-muted-foreground">
      {error?.message || "User not found"}
    </p>
  </div>
{:else if variant === "compact"}
  <div class={cn("flex items-center gap-2", class_name)}>
    <HiveAvatar {username} size="sm" />
    <div>
      <span class="font-medium">@{username}</span>
      <span class="text-hive-muted-foreground text-sm ml-1">
        ({account.reputation})
      </span>
    </div>
  </div>
{:else if variant === "expanded"}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card overflow-hidden",
      class_name,
    )}
  >
    {#if metadata?.cover_image}
      <img
        src={metadata.cover_image}
        alt="Cover"
        class="w-full h-32 object-cover"
      />
    {/if}
    <div class="p-4">
      <div class="flex items-start gap-4">
        <HiveAvatar
          {username}
          size="xl"
          class={metadata?.cover_image
            ? "-mt-10 ring-4 ring-hive-card"
            : ""}
        />
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-lg truncate">
            {metadata?.name || `@${username}`}
          </h3>
          <p class="text-hive-muted-foreground text-sm">
            @{username} &bull; Rep: {account.reputation}
          </p>
        </div>
      </div>

      {#if metadata?.about}
        <p class="mt-3 text-sm text-hive-muted-foreground line-clamp-2">
          {metadata.about}
        </p>
      {/if}

      {#if showStats}
        <div class="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-lg font-bold">{account.post_count}</p>
            <p class="text-xs text-hive-muted-foreground">Posts</p>
          </div>
          <div>
            <p class="text-lg font-bold">
              {account.hive_power.split(" ")[0]}
            </p>
            <p class="text-xs text-hive-muted-foreground">HP</p>
          </div>
          <div>
            <p class="text-lg font-bold">
              {account.balance.split(" ")[0]}
            </p>
            <p class="text-xs text-hive-muted-foreground">HIVE</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <!-- Default variant -->
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4",
      class_name,
    )}
  >
    <div class="flex items-center gap-3">
      <HiveAvatar {username} size="lg" />
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold truncate">
          {metadata?.name || `@${username}`}
        </h3>
        <p class="text-sm text-hive-muted-foreground">
          @{username} &bull; Rep: {account.reputation}
        </p>
      </div>
    </div>

    {#if showStats}
      <div class="mt-3 flex gap-4 text-sm">
        <span>{account.post_count} posts</span>
        <span>{account.hive_power}</span>
      </div>
    {/if}
  </div>
{/if}
