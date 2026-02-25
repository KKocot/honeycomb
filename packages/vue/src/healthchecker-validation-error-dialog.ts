import { defineComponent, h, type PropType } from "vue";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "radix-vue";
import type { ValidationErrorDetails } from "@kkocot/honeycomb-core";
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

function icon_octagon_alert(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [
      h("path", { d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" }),
      h("line", { x1: 12, y1: 8, x2: 12, y2: 12 }),
      h("line", { x1: 12, y1: 16, x2: 12.01, y2: 16 }),
    ]
  );
}

function icon_triangle_alert(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [
      h("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }),
      h("line", { x1: 12, y1: 9, x2: 12, y2: 13 }),
      h("line", { x1: 12, y1: 17, x2: 12.01, y2: 17 }),
    ]
  );
}

function icon_eraser(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [
      h("path", { d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" }),
      h("path", { d: "M22 21H7" }),
      h("path", { d: "m5 11 9 9" }),
    ]
  );
}

export const ValidationErrorDialog = defineComponent({
  name: "ValidationErrorDialog",
  props: {
    isOpened: { type: Boolean, required: true },
    validatorDetails: { type: Object as PropType<ValidationErrorDetails | undefined>, default: undefined },
  },
  emits: ["update:isOpened", "clearValidationError"],
  setup(props, { emit }) {
    const handle_error_clear_click = () => {
      if (props.validatorDetails?.providerName && props.validatorDetails?.checkName) {
        emit("clearValidationError", props.validatorDetails.providerName, props.validatorDetails.checkName);
        emit("update:isOpened", false);
      }
    };

    const display_pretty_json = (): string => {
      try {
        return typeof props.validatorDetails?.params === "string"
          ? JSON.stringify(JSON.parse(props.validatorDetails.params), null, 2)
          : "";
      } catch {
        return "";
      }
    };

    return () => {
      const is_server_error = props.validatorDetails?.status === "serverError";
      const error_icon_fn = is_server_error ? icon_octagon_alert : icon_triangle_alert;

      return h(
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
                            "relative w-full max-w-lg max-h-[85vh] overflow-auto",
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

                            // Header
                            h("div", { class: "flex items-start gap-3 mb-4" }, [
                              h(
                                "div",
                                {
                                  class: cn(
                                    "shrink-0 flex items-center justify-center w-10 h-10 rounded-full",
                                    is_server_error ? "bg-red-500/10" : "bg-orange-500/10"
                                  ),
                                },
                                [error_icon_fn(cn("w-5 h-5", is_server_error ? "text-red-500" : "text-orange-500"))]
                              ),
                              h("div", { class: "min-w-0 flex-1 pt-1" }, [
                                h(DialogTitle, { class: "text-lg font-semibold" }, { default: () => props.validatorDetails?.checkName }),
                                h(
                                  "p",
                                  { class: cn("text-sm font-medium", is_server_error ? "text-red-500" : "text-orange-500") },
                                  is_server_error ? "Connection Error" : "Validation Error"
                                ),
                              ]),
                            ]),

                            // Content
                            h(DialogDescription, { asChild: true }, {
                              default: () =>
                                h("div", { class: "space-y-4" }, [
                                  // Message
                                  h("div", {}, [
                                    h("label", { class: "text-xs font-medium text-hive-muted-foreground uppercase tracking-wider" }, "Message"),
                                    h("p", { class: "mt-1 text-sm" }, props.validatorDetails?.message ?? ""),
                                  ]),

                                  // Path
                                  h("div", {}, [
                                    h("label", { class: "text-xs font-medium text-hive-muted-foreground uppercase tracking-wider" }, "Path"),
                                    h("pre", { class: "mt-1 text-sm bg-hive-muted rounded-md px-3 py-2 overflow-x-auto" }, props.validatorDetails?.paths.join(" / ") ?? ""),
                                  ]),

                                  // Params
                                  props.validatorDetails?.params
                                    ? h("div", {}, [
                                        h("label", { class: "text-xs font-medium text-hive-muted-foreground uppercase tracking-wider" }, "Parameters"),
                                        h("pre", { class: "mt-1 text-xs bg-hive-muted rounded-md px-3 py-2 overflow-x-auto max-h-48" }, display_pretty_json()),
                                      ])
                                    : null,
                                ]),
                            }),

                            // Actions
                            h("div", { class: "flex justify-end gap-2 mt-6 pt-4 border-t border-hive-border" }, [
                              h(
                                DialogClose,
                                {
                                  asChild: true,
                                },
                                {
                                  default: () =>
                                    h(
                                      "button",
                                      {
                                        class: cn(
                                          "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
                                          "border border-hive-border bg-transparent",
                                          "hover:bg-hive-muted transition-colors"
                                        ),
                                      },
                                      "Close"
                                    ),
                                }
                              ),
                              h(
                                "button",
                                {
                                  class: cn(
                                    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-4 cursor-pointer",
                                    "bg-hive-red text-white hover:bg-hive-red/90 transition-colors"
                                  ),
                                  onClick: handle_error_clear_click,
                                },
                                [icon_eraser("w-4 h-4"), "Clear Error"]
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
    };
  },
});
