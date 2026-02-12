import {
  createSignal,
  createEffect,
  onCleanup,
  Show,
  Switch,
  Match,
  type Component,
  type JSX,
} from "solid-js";
import { useHive } from "./hive-provider";
import { cn } from "./utils";
import {
  calculate_manabar,
  format_mana_number,
  format_cooldown,
  type ManabarData,
} from "@kkocot/honeycomb-core";

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
  upvote: ManabarData;
  downvote: ManabarData;
  rc: ManabarData;
}

const MANA_COLORS = {
  upvote: "#00C040",
  downvote: "#C01000",
  rc: "#0088FE",
};

function ManaRing(props: {
  percentage: number;
  color: string;
  size?: number;
  stroke_width?: number;
  children?: JSX.Element;
}) {
  const size = () => props.size ?? 60;
  const stroke_width = () => props.stroke_width ?? 6;
  const radius = () => (size() - stroke_width()) / 2;
  const circumference = () => radius() * 2 * Math.PI;
  const offset = () =>
    circumference() - (props.percentage / 100) * circumference();

  return (
    <div class="relative" style={{ width: `${size()}px`, height: `${size()}px` }}>
      <svg width={size()} height={size()} class="-rotate-90">
        <circle
          cx={size() / 2}
          cy={size() / 2}
          r={radius()}
          fill="none"
          stroke="currentColor"
          stroke-width={stroke_width()}
          class="text-hive-muted/30"
        />
        <circle
          cx={size() / 2}
          cy={size() / 2}
          r={radius()}
          fill="none"
          stroke={props.color}
          stroke-width={stroke_width()}
          stroke-dasharray={String(circumference())}
          stroke-dashoffset={String(offset())}
          stroke-linecap="round"
          class="transition-all duration-500"
        />
      </svg>
      <Show when={props.children}>
        <div class="absolute inset-0 flex items-center justify-center">
          {props.children}
        </div>
      </Show>
    </div>
  );
}

function SingleManabar(props: {
  title: string;
  data: ManabarData;
  color: string;
  show_values?: boolean;
  show_cooldown?: boolean;
}) {
  return (
    <div class="flex flex-col items-center gap-2">
      <Show when={props.title}>
        <span class="text-sm font-medium text-hive-foreground">
          {props.title}
        </span>
      </Show>
      <ManaRing percentage={props.data.percentage} color={props.color} size={70}>
        <span class="text-sm font-bold text-hive-foreground">
          {Math.round(props.data.percentage)}%
        </span>
      </ManaRing>
      <Show when={props.show_values}>
        <div class="text-xs text-hive-muted-foreground text-center">
          {format_mana_number(props.data.current)} /{" "}
          {format_mana_number(props.data.max)}
        </div>
      </Show>
      <Show when={props.show_cooldown && props.data.percentage < 100}>
        <div class="text-xs text-hive-muted-foreground">
          Full in: {format_cooldown(props.data.cooldown)}
        </div>
      </Show>
    </div>
  );
}

export const HiveManabar: Component<HiveManabarProps> = (props) => {
  const hive = useHive();
  const [is_loading, set_is_loading] = createSignal(true);
  const [data, set_data] = createSignal<ManabarsState | null>(null);
  const [error, set_error] = createSignal<Error | null>(null);

  const variant = () => props.variant ?? "full";
  const show_labels = () => props.showLabels !== false;
  const show_values = () => props.showValues ?? false;
  const show_cooldown = () => props.showCooldown !== false;

  createEffect(() => {
    const chain = hive.chain();
    const username = props.username;

    if (!chain || !username) return;

    let cancelled = false;

    async function fetch_manabars() {
      if (!chain || !username) return;

      try {
        const [account_response, rc_response] = await Promise.all([
          chain.api.database_api.find_accounts({ accounts: [username.toLowerCase()] }),
          chain.api.rc_api.find_rc_accounts({ accounts: [username.toLowerCase()] }),
        ]);

        if (cancelled) return;

        if (
          account_response.accounts.length === 0 ||
          rc_response.rc_accounts.length === 0
        ) {
          set_error(new Error("User not found"));
          set_is_loading(false);
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

        set_data({ upvote, downvote, rc });
        set_error(null);
      } catch {
        if (!cancelled) {
          set_error(new Error("Failed to load manabars"));
        }
      } finally {
        if (!cancelled) {
          set_is_loading(false);
        }
      }
    }

    set_is_loading(true);
    fetch_manabars();

    const interval = setInterval(fetch_manabars, 60000);

    onCleanup(() => {
      cancelled = true;
      clearInterval(interval);
    });
  });

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
          <div class="flex justify-center gap-6">
            <div class="h-[70px] w-[70px] rounded-full bg-hive-muted" />
            <div class="h-[70px] w-[70px] rounded-full bg-hive-muted" />
            <div class="h-[70px] w-[70px] rounded-full bg-hive-muted" />
          </div>
        </div>
      }
    >
      <Show
        when={!error() && data()}
        fallback={
          <div
            class={cn(
              "rounded-lg border border-hive-border bg-hive-card p-4",
              props.class,
            )}
          >
            <p class="text-sm text-hive-muted-foreground">
              {error()?.message ?? "Failed to load manabars"}
            </p>
          </div>
        }
      >
        {(safe_data) => (
          <Switch>
            <Match when={variant() === "compact"}>
              <div class={cn("flex items-center gap-3", props.class)}>
                <ManaRing
                  percentage={safe_data().upvote.percentage}
                  color={MANA_COLORS.upvote}
                  size={40}
                  stroke_width={4}
                >
                  <span
                    class="text-[10px] font-bold"
                    style={{ color: MANA_COLORS.upvote }}
                  >
                    {Math.round(safe_data().upvote.percentage)}
                  </span>
                </ManaRing>
                <ManaRing
                  percentage={safe_data().downvote.percentage}
                  color={MANA_COLORS.downvote}
                  size={40}
                  stroke_width={4}
                >
                  <span
                    class="text-[10px] font-bold"
                    style={{ color: MANA_COLORS.downvote }}
                  >
                    {Math.round(safe_data().downvote.percentage)}
                  </span>
                </ManaRing>
                <ManaRing
                  percentage={safe_data().rc.percentage}
                  color={MANA_COLORS.rc}
                  size={40}
                  stroke_width={4}
                >
                  <span
                    class="text-[10px] font-bold"
                    style={{ color: MANA_COLORS.rc }}
                  >
                    {Math.round(safe_data().rc.percentage)}
                  </span>
                </ManaRing>
              </div>
            </Match>

            <Match when={variant() === "ring"}>
              <div class={cn("relative", props.class)}>
                <ManaRing
                  percentage={safe_data().rc.percentage}
                  color={MANA_COLORS.rc}
                  size={50}
                  stroke_width={5}
                >
                  <span class="text-xs font-bold text-hive-foreground">
                    {Math.round(safe_data().rc.percentage)}%
                  </span>
                </ManaRing>
              </div>
            </Match>

            <Match when={variant() === "full"}>
              <div
                class={cn("flex flex-wrap justify-center gap-6", props.class)}
              >
                <SingleManabar
                  title={show_labels() ? "Voting Power" : ""}
                  data={safe_data().upvote}
                  color={MANA_COLORS.upvote}
                  show_values={show_values()}
                  show_cooldown={show_cooldown()}
                />
                <SingleManabar
                  title={show_labels() ? "Downvote" : ""}
                  data={safe_data().downvote}
                  color={MANA_COLORS.downvote}
                  show_values={show_values()}
                  show_cooldown={show_cooldown()}
                />
                <SingleManabar
                  title={show_labels() ? "Resource Credits" : ""}
                  data={safe_data().rc}
                  color={MANA_COLORS.rc}
                  show_values={show_values()}
                  show_cooldown={show_cooldown()}
                />
              </div>
            </Match>
          </Switch>
        )}
      </Show>
    </Show>
  );
};
