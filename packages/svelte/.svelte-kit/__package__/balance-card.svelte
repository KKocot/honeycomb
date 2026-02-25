<script lang="ts" module>
  export type BalanceCardVariant = "compact" | "default" | "expanded";

  export interface BalanceCardProps {
    username: string;
    variant?: BalanceCardVariant;
    class?: string;
  }

  function split_value(formatted: string): { amount: string; symbol: string } {
    const parts = formatted.split(" ");
    return { amount: parts[0] ?? "0", symbol: parts.slice(1).join(" ") };
  }
</script>

<script lang="ts">
  import { useHiveAccount } from "./use-hive-account.svelte";
  import { cn } from "./utils";

  let {
    username,
    variant = "default",
    class: class_name,
  }: BalanceCardProps = $props();

  const { account, is_loading, error } = useHiveAccount(() => username);

  const hive = $derived(account ? split_value(account.balance) : null);
  const hbd = $derived(account ? split_value(account.hbd_balance) : null);
</script>

{#if is_loading}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
      class_name,
    )}
  >
    <div class="h-4 w-32 bg-hive-muted rounded mb-3"></div>
    <div class="space-y-2">
      <div class="h-4 w-full bg-hive-muted rounded"></div>
      <div class="h-4 w-full bg-hive-muted rounded"></div>
      <div class="h-4 w-3/4 bg-hive-muted rounded"></div>
    </div>
  </div>
{:else if error || !account || !hive || !hbd}
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
  <div class={cn("flex items-center gap-3 text-sm", class_name)}>
    <span>
      <span class="font-medium">{hive.amount}</span>
      {" "}
      <span class="text-hive-muted-foreground">{hive.symbol}</span>
    </span>
    <span class="text-hive-muted-foreground">&middot;</span>
    <span>
      <span class="font-medium">{hbd.amount}</span>
      {" "}
      <span class="text-hive-muted-foreground">{hbd.symbol}</span>
    </span>
    <span class="text-hive-muted-foreground">&middot;</span>
    <span>
      <span class="font-medium">
        {split_value(account.hive_power).amount}
      </span>
      {" "}
      <span class="text-hive-muted-foreground">HP</span>
    </span>
  </div>
{:else if variant === "expanded"}
  {@const own_hp = split_value(account.hive_power)}
  {@const received = split_value(account.received_hp)}
  {@const delegated = split_value(account.delegated_hp)}
  {@const effective = split_value(account.effective_hp)}
  {@const savings_hive = split_value(account.savings_balance)}
  {@const savings_hbd = split_value(account.savings_hbd_balance)}
  <div
    class={cn(
      "rounded-lg border border-hive-border bg-hive-card p-4",
      class_name,
    )}
  >
    <h3 class="text-sm font-semibold mb-3">@{username} Wallet</h3>

    <div class="space-y-1">
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground">HIVE</span>
        <span class="font-medium">{hive.amount}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground">HBD</span>
        <span class="font-medium">{hbd.amount}</span>
      </div>
    </div>

    <div class="pt-3 mt-3 border-t border-hive-border space-y-1">
      <p class="text-sm font-semibold mb-1">Hive Power</p>
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground pl-2">Own HP</span>
        <span class="font-medium">{own_hp.amount}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-green-500 pl-2">+ Received</span>
        <span class="font-medium text-green-500">{received.amount}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-red-500 pl-2">- Delegated</span>
        <span class="font-medium text-red-500">{delegated.amount}</span>
      </div>
      <div
        class="flex justify-between pt-1 border-t border-hive-border"
      >
        <span class="text-sm font-bold text-hive-red pl-2">Effective</span>
        <span class="font-bold text-hive-red">{effective.amount}</span>
      </div>
    </div>

    <div class="pt-3 mt-3 border-t border-hive-border space-y-1">
      <p class="text-sm font-semibold mb-1">Savings</p>
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground pl-2">HIVE</span>
        <span class="font-medium">{savings_hive.amount}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground pl-2">HBD</span>
        <span class="font-medium">{savings_hbd.amount}</span>
      </div>
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
    <h3 class="text-sm font-semibold mb-3">@{username} Wallet</h3>

    <div class="space-y-1">
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground">HIVE</span>
        <span class="font-medium">{hive.amount}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground">HBD</span>
        <span class="font-medium">{hbd.amount}</span>
      </div>
    </div>

    <div class="pt-3 mt-3 border-t border-hive-border">
      <div class="flex justify-between">
        <span class="text-sm text-hive-muted-foreground">Hive Power</span>
        <span class="font-medium">
          {split_value(account.hive_power).amount}
        </span>
      </div>
    </div>
  </div>
{/if}
