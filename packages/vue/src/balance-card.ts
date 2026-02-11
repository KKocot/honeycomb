import { defineComponent, h, type PropType } from "vue";
import { useHiveAccount } from "./use-hive-account.js";
import { cn } from "./utils.js";

export type BalanceCardVariant = "compact" | "default" | "expanded";

export interface BalanceCardProps {
  username: string;
  variant?: BalanceCardVariant;
  class?: string;
}

interface SplitValue {
  amount: string;
  symbol: string;
}

function split_value(formatted: string): SplitValue {
  const parts = formatted.split(" ");
  return { amount: parts[0] ?? "0", symbol: parts.slice(1).join(" ") };
}

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
      h("div", { class: "h-4 w-32 bg-hive-muted rounded mb-3" }),
      h("div", { class: "space-y-2" }, [
        h("div", { class: "h-4 w-full bg-hive-muted rounded" }),
        h("div", { class: "h-4 w-full bg-hive-muted rounded" }),
        h("div", { class: "h-4 w-3/4 bg-hive-muted rounded" }),
      ]),
    ],
  );
}

function render_error(
  message: string | undefined,
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
        message || "User not found",
      ),
    ],
  );
}

function render_balance_row(label: string, amount: string, label_class?: string) {
  return h("div", { class: "flex justify-between" }, [
    h(
      "span",
      { class: cn("text-sm text-hive-muted-foreground", label_class) },
      label,
    ),
    h("span", { class: "font-medium" }, amount),
  ]);
}

function render_compact(
  hive: SplitValue,
  hbd: SplitValue,
  hp: SplitValue,
  class_name: string | undefined,
) {
  const balance_span = (val: SplitValue) =>
    h("span", {}, [
      h("span", { class: "font-medium" }, val.amount),
      " ",
      h("span", { class: "text-hive-muted-foreground" }, val.symbol),
    ]);

  const make_separator = () =>
    h("span", { class: "text-hive-muted-foreground" }, "\u00B7");

  return h(
    "div",
    { class: cn("flex items-center gap-3 text-sm", class_name) },
    [balance_span(hive), make_separator(), balance_span(hbd), make_separator(), balance_span(hp)],
  );
}

function render_expanded(
  username: string,
  hive: SplitValue,
  hbd: SplitValue,
  own_hp: SplitValue,
  received: SplitValue,
  delegated: SplitValue,
  effective: SplitValue,
  savings_hive: SplitValue,
  savings_hbd: SplitValue,
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
      h("h3", { class: "text-sm font-semibold mb-3" }, `@${username} Wallet`),

      h("div", { class: "space-y-1" }, [
        render_balance_row("HIVE", hive.amount),
        render_balance_row("HBD", hbd.amount),
      ]),

      h(
        "div",
        { class: "pt-3 mt-3 border-t border-hive-border space-y-1" },
        [
          h("p", { class: "text-sm font-semibold mb-1" }, "Hive Power"),
          render_balance_row("Own HP", own_hp.amount, "pl-2"),
          h("div", { class: "flex justify-between" }, [
            h("span", { class: "text-sm text-green-500 pl-2" }, "+ Received"),
            h(
              "span",
              { class: "font-medium text-green-500" },
              received.amount,
            ),
          ]),
          h("div", { class: "flex justify-between" }, [
            h("span", { class: "text-sm text-red-500 pl-2" }, "- Delegated"),
            h(
              "span",
              { class: "font-medium text-red-500" },
              delegated.amount,
            ),
          ]),
          h(
            "div",
            {
              class:
                "flex justify-between pt-1 border-t border-hive-border",
            },
            [
              h(
                "span",
                { class: "text-sm font-bold text-hive-red pl-2" },
                "Effective",
              ),
              h(
                "span",
                { class: "font-bold text-hive-red" },
                effective.amount,
              ),
            ],
          ),
        ],
      ),

      h(
        "div",
        { class: "pt-3 mt-3 border-t border-hive-border space-y-1" },
        [
          h("p", { class: "text-sm font-semibold mb-1" }, "Savings"),
          render_balance_row("HIVE", savings_hive.amount, "pl-2"),
          render_balance_row("HBD", savings_hbd.amount, "pl-2"),
        ],
      ),
    ],
  );
}

function render_default(
  username: string,
  hive: SplitValue,
  hbd: SplitValue,
  hp: SplitValue,
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
      h("h3", { class: "text-sm font-semibold mb-3" }, `@${username} Wallet`),

      h("div", { class: "space-y-1" }, [
        render_balance_row("HIVE", hive.amount),
        render_balance_row("HBD", hbd.amount),
      ]),

      h("div", { class: "pt-3 mt-3 border-t border-hive-border" }, [
        render_balance_row("Hive Power", hp.amount),
      ]),
    ],
  );
}

export const BalanceCard = defineComponent({
  name: "BalanceCard",
  props: {
    username: {
      type: String,
      required: true,
    },
    variant: {
      type: String as PropType<BalanceCardVariant>,
      default: "default",
    },
    class: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const { account, isLoading, error } = useHiveAccount(
      () => props.username,
    );

    return () => {
      if (isLoading.value) {
        return render_loading(props.class);
      }

      if (error.value || !account.value) {
        return render_error(error.value?.message, props.class);
      }

      const acc = account.value;
      const hive = split_value(acc.balance);
      const hbd = split_value(acc.hbd_balance);

      if (props.variant === "compact") {
        return render_compact(
          hive,
          hbd,
          split_value(acc.hive_power),
          props.class,
        );
      }

      if (props.variant === "expanded") {
        return render_expanded(
          props.username,
          hive,
          hbd,
          split_value(acc.hive_power),
          split_value(acc.received_hp),
          split_value(acc.delegated_hp),
          split_value(acc.effective_hp),
          split_value(acc.savings_balance),
          split_value(acc.savings_hbd_balance),
          props.class,
        );
      }

      return render_default(
        props.username,
        hive,
        hbd,
        split_value(acc.hive_power),
        props.class,
      );
    };
  },
});
