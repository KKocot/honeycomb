import {
  defineComponent,
  ref,
  watch,
  onUnmounted,
  h,
  type PropType,
  type VNode,
} from "vue";
import { useHive } from "./hive-provider.js";
import { cn } from "./utils.js";
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

interface ManabarsData {
  upvote: ManabarData;
  downvote: ManabarData;
  rc: ManabarData;
}

const MANA_COLORS = {
  upvote: "#00C040",
  downvote: "#C01000",
  rc: "#0088FE",
};

function render_loading(class_name: string | undefined) {
  return h(
    "div",
    {
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card p-4 animate-pulse",
        class_name,
      ),
    },
    [
      h("div", { class: "flex justify-center gap-6" }, [
        h("div", {
          class: "h-[70px] w-[70px] rounded-full bg-hive-muted",
        }),
        h("div", {
          class: "h-[70px] w-[70px] rounded-full bg-hive-muted",
        }),
        h("div", {
          class: "h-[70px] w-[70px] rounded-full bg-hive-muted",
        }),
      ]),
    ],
  );
}

function render_error(
  message: Error | null,
  class_name: string | undefined,
) {
  return h(
    "div",
    {
      class: cn(
        "rounded-lg border border-hive-border bg-hive-card p-4",
        class_name,
      ),
    },
    [
      h(
        "p",
        { class: "text-sm text-hive-muted-foreground" },
        message?.message ?? "Failed to load manabars",
      ),
    ],
  );
}

function render_mana_ring(
  percentage: number,
  color: string,
  size: number,
  stroke_width: number,
  children?: VNode,
) {
  const radius = (size - stroke_width) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return h(
    "div",
    {
      class: "relative",
      style: { width: `${size}px`, height: `${size}px` },
    },
    [
      h(
        "svg",
        { width: size, height: size, class: "-rotate-90" },
        [
          h("circle", {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: "currentColor",
            "stroke-width": stroke_width,
            class: "text-hive-muted/30",
          }),
          h("circle", {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: color,
            "stroke-width": stroke_width,
            "stroke-dasharray": circumference,
            "stroke-dashoffset": offset,
            "stroke-linecap": "round",
            class: "transition-all duration-500",
          }),
        ],
      ),
      children
        ? h(
            "div",
            { class: "absolute inset-0 flex items-center justify-center" },
            [children],
          )
        : null,
    ],
  );
}

function render_single_manabar(
  title: string,
  data: ManabarData,
  color: string,
  show_values: boolean,
  show_cooldown: boolean,
) {
  const children: (VNode | null)[] = [];

  if (title) {
    children.push(
      h(
        "span",
        { class: "text-sm font-medium text-hive-foreground" },
        title,
      ),
    );
  }

  children.push(
    render_mana_ring(
      data.percentage,
      color,
      70,
      6,
      h(
        "span",
        { class: "text-sm font-bold text-hive-foreground" },
        `${Math.round(data.percentage)}%`,
      ),
    ),
  );

  if (show_values) {
    children.push(
      h(
        "div",
        { class: "text-xs text-hive-muted-foreground text-center" },
        `${format_mana_number(data.current)} / ${format_mana_number(data.max)}`,
      ),
    );
  }

  if (show_cooldown && data.percentage < 100) {
    children.push(
      h(
        "div",
        { class: "text-xs text-hive-muted-foreground" },
        `Full in: ${format_cooldown(data.cooldown)}`,
      ),
    );
  }

  return h("div", { class: "flex flex-col items-center gap-2" }, children);
}

function render_compact(data: ManabarsData, class_name: string | undefined) {
  const entries: Array<{ key: keyof typeof MANA_COLORS; data: ManabarData }> = [
    { key: "upvote", data: data.upvote },
    { key: "downvote", data: data.downvote },
    { key: "rc", data: data.rc },
  ];

  return h(
    "div",
    { class: cn("flex items-center gap-3", class_name) },
    entries.map((entry) =>
      render_mana_ring(
        entry.data.percentage,
        MANA_COLORS[entry.key],
        40,
        4,
        h(
          "span",
          {
            class: "text-[10px] font-bold",
            style: { color: MANA_COLORS[entry.key] },
          },
          String(Math.round(entry.data.percentage)),
        ),
      ),
    ),
  );
}

function render_ring(data: ManabarsData, class_name: string | undefined) {
  return h(
    "div",
    { class: cn("relative", class_name) },
    [
      render_mana_ring(
        data.rc.percentage,
        MANA_COLORS.rc,
        50,
        5,
        h(
          "span",
          { class: "text-xs font-bold text-hive-foreground" },
          `${Math.round(data.rc.percentage)}%`,
        ),
      ),
    ],
  );
}

export const HiveManabar = defineComponent({
  name: "HiveManabar",
  props: {
    username: {
      type: String,
      required: true,
    },
    variant: {
      type: String as PropType<ManabarVariant>,
      default: "full",
    },
    showLabels: {
      type: Boolean,
      default: true,
    },
    showValues: {
      type: Boolean,
      default: false,
    },
    showCooldown: {
      type: Boolean,
      default: true,
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const { chain } = useHive();
    const is_loading = ref(true);
    const error = ref<Error | null>(null);
    const data = ref<ManabarsData | null>(null);

    let interval_id: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    async function fetch_manabars() {
      if (!chain.value || !props.username) return;

      try {
        const [account_response, rc_response] = await Promise.all([
          chain.value.api.database_api.find_accounts({
            accounts: [props.username.toLowerCase()],
          }),
          chain.value.api.rc_api.find_rc_accounts({
            accounts: [props.username.toLowerCase()],
          }),
        ]);

        if (cancelled) return;

        if (
          account_response.accounts.length === 0 ||
          rc_response.rc_accounts.length === 0
        ) {
          error.value = new Error("User not found");
          is_loading.value = false;
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

        if (!cancelled) {
          data.value = { upvote, downvote, rc };
          error.value = null;
        }
      } catch {
        if (!cancelled) {
          error.value = new Error("Failed to load manabars");
        }
      } finally {
        if (!cancelled) {
          is_loading.value = false;
        }
      }
    }

    function start_polling() {
      stop_polling();
      cancelled = false;
      is_loading.value = true;
      fetch_manabars();
      interval_id = setInterval(fetch_manabars, 60000);
    }

    function stop_polling() {
      cancelled = true;
      if (interval_id !== null) {
        clearInterval(interval_id);
        interval_id = null;
      }
    }

    watch(
      () => [chain.value, props.username],
      () => start_polling(),
      { immediate: true },
    );

    onUnmounted(() => {
      stop_polling();
    });

    return () => {
      if (is_loading.value) {
        return render_loading(props.class);
      }

      if (error.value || !data.value) {
        return render_error(error.value, props.class);
      }

      if (props.variant === "compact") {
        return render_compact(data.value, props.class);
      }

      if (props.variant === "ring") {
        return render_ring(data.value, props.class);
      }

      return h(
        "div",
        {
          class: cn(
            "flex flex-wrap justify-center gap-6",
            props.class,
          ),
        },
        [
          render_single_manabar(
            props.showLabels ? "Voting Power" : "",
            data.value.upvote,
            MANA_COLORS.upvote,
            props.showValues,
            props.showCooldown,
          ),
          render_single_manabar(
            props.showLabels ? "Downvote" : "",
            data.value.downvote,
            MANA_COLORS.downvote,
            props.showValues,
            props.showCooldown,
          ),
          render_single_manabar(
            props.showLabels ? "Resource Credits" : "",
            data.value.rc,
            MANA_COLORS.rc,
            props.showValues,
            props.showCooldown,
          ),
        ],
      );
    };
  },
});
