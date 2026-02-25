import { defineComponent, ref, h } from "vue";
import { cn } from "./utils.js";

export interface ProviderAdditionProps {
  // onProviderSubmit emitted via events
}

function is_valid_url(url: string): boolean {
  try {
    const parsed = new URL(url);
    const has_valid_protocol = parsed.protocol === "http:" || parsed.protocol === "https:";
    const has_domain_extension = /\.[a-z]{2,}$/i.test(parsed.hostname);
    return has_valid_protocol && has_domain_extension;
  } catch {
    return false;
  }
}

// SVG icon helpers
function icon_plus(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [
      h("path", { d: "M5 12h14" }),
      h("path", { d: "M12 5v14" }),
    ]
  );
}

function icon_alert_circle(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [
      h("circle", { cx: 12, cy: 12, r: 10 }),
      h("line", { x1: 12, y1: 8, x2: 12, y2: 12 }),
      h("line", { x1: 12, y1: 16, x2: 12.01, y2: 16 }),
    ]
  );
}

export const ProviderAddition = defineComponent({
  name: "ProviderAddition",
  emits: ["providerSubmit"],
  setup(_, { emit }) {
    const provider_value = ref("");
    const error = ref("");

    const on_submit = (value: string) => {
      if (!is_valid_url(value)) {
        error.value = "Please enter a valid URL (must start with http:// or https://)";
        return;
      }
      error.value = "";
      emit("providerSubmit", value.trim());
      provider_value.value = "";
    };

    const handle_keydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && provider_value.value) {
        on_submit(provider_value.value);
      }
    };

    return () =>
      h("div", { class: "space-y-3" }, [
        // Header
        h("div", {}, [
          h("h3", { class: "text-sm font-semibold" }, "Add Custom Node"),
          h("p", { class: "text-xs text-hive-muted-foreground mt-0.5" }, "Enter a custom Hive API endpoint URL"),
        ]),

        // Input + Button
        h("div", { class: "flex gap-2" }, [
          h("div", { class: "relative flex-1" }, [
            h("input", {
              value: provider_value.value,
              class: cn(
                "flex h-10 w-full rounded-md border bg-hive-card px-3 py-2 text-sm",
                "ring-offset-background placeholder:text-hive-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error.value
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-hive-border focus-visible:ring-hive-red"
              ),
              type: "url",
              "data-testid": "api-address-input",
              placeholder: "https://api.example.com",
              onInput: (e: Event) => {
                provider_value.value = (e.target as HTMLInputElement).value;
                if (error.value) error.value = "";
              },
              onKeydown: handle_keydown,
            }),
          ]),
          h(
            "button",
            {
              disabled: !provider_value.value,
              class: cn(
                "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
                "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ),
              onClick: () => on_submit(provider_value.value),
            },
            [icon_plus("w-4 h-4"), "Add"]
          ),
        ]),

        // Error
        error.value
          ? h("div", { class: "flex items-center gap-2 text-sm text-red-500" }, [
              icon_alert_circle("w-4 h-4 shrink-0"),
              h("span", {}, error.value),
            ])
          : null,
      ]);
  },
});
