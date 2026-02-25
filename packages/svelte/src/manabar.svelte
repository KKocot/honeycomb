<script lang="ts" module>
  export type ManabarVariant = "full" | "compact" | "ring";

  export interface HiveManabarProps {
    username: string;
    variant?: ManabarVariant;
    showLabels?: boolean;
    showValues?: boolean;
    showCooldown?: boolean;
    class?: string;
  }

  interface ManabarsState {
    upvote: import("@kkocot/honeycomb-core").ManabarData;
    downvote: import("@kkocot/honeycomb-core").ManabarData;
    rc: import("@kkocot/honeycomb-core").ManabarData;
  }

  const MANA_COLORS = {
    upvote: "#00C040",
    downvote: "#C01000",
    rc: "#0088FE",
  };
</script>

<script lang="ts">
  import { useHive } from "./context.svelte";
  import { cn } from "./utils";
  import {
    calculate_manabar,
    format_mana_number,
    format_cooldown,
    type ManabarData,
  } from "@kkocot/honeycomb-core";

  let {
    username,
    variant = "full",
    showLabels = true,
    showValues = false,
    showCooldown = true,
    class: class_name,
  }: HiveManabarProps = $props();

  const ctx = useHive();
  let is_loading = $state(true);
  let data: ManabarsState | null = $state(null);
  let error: Error | null = $state(null);

  $effect(() => {
    const chain = ctx.chain;
    const _username = username;

    if (!chain || !_username) return;

    let cancelled = false;
    is_loading = true;

    async function fetch_manabars() {
      if (!chain || !_username) return;

      try {
        const [account_response, rc_response] = await Promise.all([
          chain.api.database_api.find_accounts({
            accounts: [_username.toLowerCase()],
          }),
          chain.api.rc_api.find_rc_accounts({
            accounts: [_username.toLowerCase()],
          }),
        ]);

        if (cancelled) return;

        if (
          account_response.accounts.length === 0 ||
          rc_response.rc_accounts.length === 0
        ) {
          error = new Error("User not found");
          is_loading = false;
          return;
        }

        const acc = account_response.accounts[0];
        const rc_acc = rc_response.rc_accounts[0];

        const upvote = calculate_manabar(
          acc.voting_manabar.current_mana.toString(),
          acc.post_voting_power.amount.toString(),
          acc.voting_manabar.last_update_time,
        );

        const downvote_max = (
          BigInt(acc.post_voting_power.amount) / BigInt(4)
        ).toString();
        const downvote = calculate_manabar(
          acc.downvote_manabar.current_mana.toString(),
          downvote_max,
          acc.downvote_manabar.last_update_time,
        );

        const rc = calculate_manabar(
          rc_acc.rc_manabar.current_mana.toString(),
          rc_acc.max_rc.toString(),
          rc_acc.rc_manabar.last_update_time,
        );

        data = { upvote, downvote, rc };
        error = null;
      } catch {
        if (!cancelled) {
          error = new Error("Failed to load manabars");
        }
      } finally {
        if (!cancelled) {
          is_loading = false;
        }
      }
    }

    fetch_manabars();

    const interval = setInterval(fetch_manabars, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  });

  function ring_offset(
    percentage: number,
    radius: number,
  ): { circumference: number; offset: number } {
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    return { circumference, offset };
  }
</script>

{#snippet mana_ring(
  percentage: number,
  color: string,
  size: number,
  stroke_width: number,
)}
  {@const radius = (size - stroke_width) / 2}
  {@const { circumference, offset } = ring_offset(percentage, radius)}
  <div class="relative" style:width="{size}px" style:height="{size}px">
    <svg width={size} height={size} class="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        stroke-width={stroke_width}
        class="text-hive-muted/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        stroke-width={stroke_width}
        stroke-dasharray={circumference}
        stroke-dashoffset={offset}
        stroke-linecap="round"
        class="transition-all duration-500"
      />
    </svg>
  </div>
{/snippet}

{#snippet single_manabar(
  title: string,
  mana_data: ManabarData,
  color: string,
  show_values: boolean,
  show_cooldown: boolean,
)}
  {@const radius_70 = (70 - 6) / 2}
  {@const ring_70 = ring_offset(mana_data.percentage, radius_70)}
  <div class="flex flex-col items-center gap-2">
    {#if title}
      <span class="text-sm font-medium text-hive-foreground">{title}</span>
    {/if}
    <div class="relative" style:width="70px" style:height="70px">
      <svg width={70} height={70} class="-rotate-90">
        <circle
          cx={35}
          cy={35}
          r={radius_70}
          fill="none"
          stroke="currentColor"
          stroke-width={6}
          class="text-hive-muted/30"
        />
        <circle
          cx={35}
          cy={35}
          r={radius_70}
          fill="none"
          stroke={color}
          stroke-width={6}
          stroke-dasharray={ring_70.circumference}
          stroke-dashoffset={ring_70.offset}
          stroke-linecap="round"
          class="transition-all duration-500"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-sm font-bold text-hive-foreground">
          {Math.round(mana_data.percentage)}%
        </span>
      </div>
    </div>
    {#if show_values}
      <div class="text-xs text-hive-muted-foreground text-center">
        {format_mana_number(mana_data.current)} / {format_mana_number(mana_data.max)}
      </div>
    {/if}
    {#if show_cooldown && mana_data.percentage < 100}
      <div class="text-xs text-hive-muted-foreground">
        Full in: {format_cooldown(mana_data.cooldown)}
      </div>
    {/if}
  </div>
{/snippet}

{#if is_loading}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
      class_name,
    )}
  >
    <div class="flex justify-center gap-6">
      <div class="h-[70px] w-[70px] rounded-full bg-hive-muted"></div>
      <div class="h-[70px] w-[70px] rounded-full bg-hive-muted"></div>
      <div class="h-[70px] w-[70px] rounded-full bg-hive-muted"></div>
    </div>
  </div>
{:else if error || !data}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4",
      class_name,
    )}
  >
    <p class="text-sm text-hive-muted-foreground">
      {error?.message ?? "Failed to load manabars"}
    </p>
  </div>
{:else if variant === "compact"}
  <div class={cn("flex items-center gap-3", class_name)}>
    {#each [
      { mana: data.upvote, color: MANA_COLORS.upvote },
      { mana: data.downvote, color: MANA_COLORS.downvote },
      { mana: data.rc, color: MANA_COLORS.rc },
    ] as item}
      {@const radius_40 = (40 - 4) / 2}
      {@const ring_40 = ring_offset(item.mana.percentage, radius_40)}
      <div class="relative" style:width="40px" style:height="40px">
        <svg width={40} height={40} class="-rotate-90">
          <circle
            cx={20}
            cy={20}
            r={radius_40}
            fill="none"
            stroke="currentColor"
            stroke-width={4}
            class="text-hive-muted/30"
          />
          <circle
            cx={20}
            cy={20}
            r={radius_40}
            fill="none"
            stroke={item.color}
            stroke-width={4}
            stroke-dasharray={ring_40.circumference}
            stroke-dashoffset={ring_40.offset}
            stroke-linecap="round"
            class="transition-all duration-500"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span
            class="text-[10px] font-bold"
            style:color={item.color}
          >
            {Math.round(item.mana.percentage)}
          </span>
        </div>
      </div>
    {/each}
  </div>
{:else if variant === "ring"}
  {@const radius_50 = (50 - 5) / 2}
  {@const ring_50 = ring_offset(data.rc.percentage, radius_50)}
  <div class={cn("relative", class_name)}>
    <div class="relative" style:width="50px" style:height="50px">
      <svg width={50} height={50} class="-rotate-90">
        <circle
          cx={25}
          cy={25}
          r={radius_50}
          fill="none"
          stroke="currentColor"
          stroke-width={5}
          class="text-hive-muted/30"
        />
        <circle
          cx={25}
          cy={25}
          r={radius_50}
          fill="none"
          stroke={MANA_COLORS.rc}
          stroke-width={5}
          stroke-dasharray={ring_50.circumference}
          stroke-dashoffset={ring_50.offset}
          stroke-linecap="round"
          class="transition-all duration-500"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xs font-bold text-hive-foreground">
          {Math.round(data.rc.percentage)}%
        </span>
      </div>
    </div>
  </div>
{:else}
  <!-- Full variant -->
  <div class={cn("flex flex-wrap justify-center gap-6", class_name)}>
    {@render single_manabar(
      showLabels ? "Voting Power" : "",
      data.upvote,
      MANA_COLORS.upvote,
      showValues,
      showCooldown,
    )}
    {@render single_manabar(
      showLabels ? "Downvote" : "",
      data.downvote,
      MANA_COLORS.downvote,
      showValues,
      showCooldown,
    )}
    {@render single_manabar(
      showLabels ? "Resource Credits" : "",
      data.rc,
      MANA_COLORS.rc,
      showValues,
      showCooldown,
    )}
  </div>
{/if}
