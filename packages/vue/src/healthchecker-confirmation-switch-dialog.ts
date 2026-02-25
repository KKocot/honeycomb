import { defineComponent, h } from "vue";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "radix-vue";
import { cn } from "./utils.js";

// SVG icon helpers
function icon_x(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [
      h("path", { d: "M18 6 6 18" }),
      h("path", { d: "m6 6 12 12" }),
    ]
  );
}

function icon_alert_triangle(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [
      h("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }),
      h("line", { x1: 12, y1: 9, x2: 12, y2: 13 }),
      h("line", { x1: 12, y1: 17, x2: 12.01, y2: 17 }),
    ]
  );
}

export const ConfirmationSwitchDialog = defineComponent({
  name: "ConfirmationSwitchDialog",
  props: {
    isOpened: { type: Boolean, required: true },
    providerLink: { type: String, default: undefined },
  },
  emits: ["update:isOpened", "confirm"],
  setup(props, { emit }) {
    return () =>
      h(
        DialogRoot,
        {
          open: props.isOpened,
          onUpdateOpen: (val: boolean) => emit("update:isOpened", val),
        },
        {
          default: () =>
            h(DialogPortal, {}, {
              default: () =>
                h(
                  DialogOverlay,
                  { class: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" },
                  {
                    default: () =>
                      h(
                        DialogContent,
                        {
                          class: cn(
                            "relative w-full max-w-md",
                            "rounded-lg border border-hive-border bg-hive-card p-6 shadow-xl",
                            "animate-in fade-in-0 zoom-in-95"
                          ),
                        },
                        {
                          default: () => [
                            // Close Button
                            h(
                              DialogClose,
                              {
                                class: cn(
                                  "absolute right-4 top-4 p-1 rounded-md transition-colors cursor-pointer",
                                  "text-hive-muted-foreground hover:text-foreground hover:bg-hive-muted"
                                ),
                              },
                              { default: () => [icon_x("h-4 w-4"), h("span", { class: "sr-only" }, "Close")] }
                            ),

                            // Warning Icon
                            h(
                              "div",
                              { class: "flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-4" },
                              [icon_alert_triangle("w-6 h-6 text-orange-500")]
                            ),

                            // Title
                            h(DialogTitle, { class: "text-lg font-semibold mb-2" }, { default: () => "Switch to Unverified Provider?" }),

                            // Description
                            h(DialogDescription, { class: "text-sm text-hive-muted-foreground mb-6" }, {
                              default: () => [
                                "This provider has not passed all validation checks. Are you sure you want to switch to ",
                                h("span", { class: "font-medium text-foreground break-all" }, props.providerLink),
                                "?",
                              ],
                            }),

                            // Actions
                            h("div", { class: "flex flex-col-reverse sm:flex-row sm:justify-end gap-2" }, [
                              h(
                                DialogClose,
                                { asChild: true },
                                {
                                  default: () =>
                                    h(
                                      "button",
                                      {
                                        class: cn(
                                          "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
                                          "border border-hive-border bg-transparent",
                                          "hover:bg-hive-muted transition-colors"
                                        ),
                                      },
                                      "Cancel"
                                    ),
                                }
                              ),
                              h(
                                "button",
                                {
                                  class: cn(
                                    "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
                                    "bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                                  ),
                                  onClick: () => emit("confirm"),
                                },
                                "Switch Anyway"
                              ),
                            ]),
                          ],
                        }
                      ),
                  }
                ),
            }),
        }
      );
  },
});
