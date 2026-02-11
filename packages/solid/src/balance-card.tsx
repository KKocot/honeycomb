import { createMemo, Show, Switch, Match, type Component } from "solid-js";
import { useHiveAccount } from "./use-hive-account";
import { cn } from "./utils";

export type BalanceCardVariant = "compact" | "default" | "expanded";

export interface BalanceCardProps {
  username: string;
  variant?: BalanceCardVariant;
  class?: string;
}

interface SplitBalance {
  amount: string;
  symbol: string;
}

function split_value(formatted: string): SplitBalance {
  const parts = formatted.split(" ");
  return { amount: parts[0] ?? "0", symbol: parts.slice(1).join(" ") };
}

export const BalanceCard: Component<BalanceCardProps> = (props) => {
  const { account, isLoading, error } = useHiveAccount(
    () => props.username,
  );

  const variant = () => props.variant ?? "default";

  const hive = createMemo(() => split_value(account()?.balance ?? "0 HIVE"));
  const hbd = createMemo(() => split_value(account()?.hbd_balance ?? "0 HBD"));
  const own_hp = createMemo(() =>
    split_value(account()?.hive_power ?? "0 HP"),
  );
  const received_hp = createMemo(() =>
    split_value(account()?.received_hp ?? "0 HP"),
  );
  const delegated_hp = createMemo(() =>
    split_value(account()?.delegated_hp ?? "0 HP"),
  );
  const effective_hp = createMemo(() =>
    split_value(account()?.effective_hp ?? "0 HP"),
  );
  const savings_hive = createMemo(() =>
    split_value(account()?.savings_balance ?? "0 HIVE"),
  );
  const savings_hbd = createMemo(() =>
    split_value(account()?.savings_hbd_balance ?? "0 HBD"),
  );

  return (
    <Show
      when={!isLoading()}
      fallback={
        <div
          class={cn(
            "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
            props.class,
          )}
        >
          <div class="h-4 w-32 bg-hive-muted rounded mb-3" />
          <div class="space-y-2">
            <div class="h-4 w-full bg-hive-muted rounded" />
            <div class="h-4 w-full bg-hive-muted rounded" />
            <div class="h-4 w-3/4 bg-hive-muted rounded" />
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
              {error()?.message ?? "User not found"}
            </p>
          </div>
        }
      >
        <Switch>
          <Match when={variant() === "compact"}>
            <div
              class={cn("flex items-center gap-3 text-sm", props.class)}
            >
              <span>
                <span class="font-medium">{hive().amount}</span>{" "}
                <span class="text-hive-muted-foreground">
                  {hive().symbol}
                </span>
              </span>
              <span class="text-hive-muted-foreground">&middot;</span>
              <span>
                <span class="font-medium">{hbd().amount}</span>{" "}
                <span class="text-hive-muted-foreground">
                  {hbd().symbol}
                </span>
              </span>
              <span class="text-hive-muted-foreground">&middot;</span>
              <span>
                <span class="font-medium">{own_hp().amount}</span>{" "}
                <span class="text-hive-muted-foreground">HP</span>
              </span>
            </div>
          </Match>

          <Match when={variant() === "expanded"}>
            <div
              class={cn(
                "rounded-lg border border-hive-border bg-hive-card p-4",
                props.class,
              )}
            >
              <h3 class="text-sm font-semibold mb-3">
                @{props.username} Wallet
              </h3>

              <div class="space-y-1">
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground">
                    HIVE
                  </span>
                  <span class="font-medium">{hive().amount}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground">
                    HBD
                  </span>
                  <span class="font-medium">{hbd().amount}</span>
                </div>
              </div>

              <div class="pt-3 mt-3 border-t border-hive-border space-y-1">
                <p class="text-sm font-semibold mb-1">Hive Power</p>
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground pl-2">
                    Own HP
                  </span>
                  <span class="font-medium">{own_hp().amount}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-green-500 pl-2">
                    + Received
                  </span>
                  <span class="font-medium text-green-500">
                    {received_hp().amount}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-red-500 pl-2">
                    - Delegated
                  </span>
                  <span class="font-medium text-red-500">
                    {delegated_hp().amount}
                  </span>
                </div>
                <div class="flex justify-between pt-1 border-t border-hive-border">
                  <span class="text-sm font-bold text-hive-red pl-2">
                    Effective
                  </span>
                  <span class="font-bold text-hive-red">
                    {effective_hp().amount}
                  </span>
                </div>
              </div>

              <div class="pt-3 mt-3 border-t border-hive-border space-y-1">
                <p class="text-sm font-semibold mb-1">Savings</p>
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground pl-2">
                    HIVE
                  </span>
                  <span class="font-medium">
                    {savings_hive().amount}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground pl-2">
                    HBD
                  </span>
                  <span class="font-medium">
                    {savings_hbd().amount}
                  </span>
                </div>
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
              <h3 class="text-sm font-semibold mb-3">
                @{props.username} Wallet
              </h3>

              <div class="space-y-1">
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground">
                    HIVE
                  </span>
                  <span class="font-medium">{hive().amount}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground">
                    HBD
                  </span>
                  <span class="font-medium">{hbd().amount}</span>
                </div>
              </div>

              <div class="pt-3 mt-3 border-t border-hive-border">
                <div class="flex justify-between">
                  <span class="text-sm text-hive-muted-foreground">
                    Hive Power
                  </span>
                  <span class="font-medium">{own_hp().amount}</span>
                </div>
              </div>
            </div>
          </Match>
        </Switch>
      </Show>
    </Show>
  );
};
