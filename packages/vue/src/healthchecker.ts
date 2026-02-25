import { defineComponent, ref, computed, h, watch, onUnmounted } from "vue";
import type { TScoredEndpoint } from "@hiveio/wax";
import type { ApiChecker, ValidationErrorDetails } from "@kkocot/honeycomb-core";
import { SwitchRoot, SwitchThumb } from "radix-vue";
import { cn } from "./utils.js";
import { ProviderCard } from "./healthchecker-provider-card.js";
import { ProviderAddition } from "./healthchecker-provider-addition.js";
import { ValidationErrorDialog } from "./healthchecker-validation-error-dialog.js";
import { ConfirmationSwitchDialog } from "./healthchecker-confirmation-switch-dialog.js";
import { useHive } from "./hive-provider.js";

export interface HealthCheckerComponentProps {
  healthcheckerKey: string;
}

// SVG icon helper
function icon_loader_circle(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [h("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })]
  );
}

function icon_loader_circle_sm(cls: string) {
  return h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", class: cls },
    [h("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })]
  );
}

export const HealthCheckerComponent = defineComponent({
  name: "HealthCheckerComponent",
  props: {
    healthcheckerKey: { type: String, required: true },
  },
  setup(props) {
    const { getHealthCheckerService } = useHive();

    const api_checkers = ref<ApiChecker[] | undefined>(undefined);
    const scored_endpoints = ref<TScoredEndpoint[] | undefined>(undefined);
    const node_address = ref<string | null>(null);
    const providers = ref<string[] | undefined>(undefined);
    const filter = ref("");
    const failed_checks_by_provider = ref<Map<string, ValidationErrorDetails[]>>(new Map());
    const is_active = ref<boolean | undefined>(undefined);
    const switch_status = ref<"waiting" | "done" | "no_change" | undefined>(undefined);

    const is_validation_error_dialog_opened = ref(false);
    const selected_validator = ref<ValidationErrorDetails | undefined>(undefined);
    const is_confirmation_switch_dialog_opened = ref(false);
    const pending_provider_switch = ref<string | undefined>(undefined);

    let handler: (() => void) | null = null;

    const service_ref = computed(() => getHealthCheckerService(props.healthcheckerKey));

    const actualize_data = () => {
      const service = service_ref.value;
      if (!service) return;
      const hc_data = service.getComponentData();
      if (hc_data) {
        scored_endpoints.value = hc_data.scoredEndpoints;
        api_checkers.value = hc_data.apiCheckers;
        providers.value = hc_data.providers;
        failed_checks_by_provider.value = hc_data.failedChecksByProvider;
        node_address.value = hc_data.nodeAddress;
        is_active.value = hc_data.isActive;
        switch_status.value = hc_data.switchStatus;
      }
    };

    const select_validator = (provider_name: string, check_title: string) => {
      const found = failed_checks_by_provider.value
        ?.get(provider_name)
        ?.find((fc) => fc.checkName === check_title);
      if (found) {
        selected_validator.value = found;
        is_validation_error_dialog_opened.value = true;
      }
    };

    const check_if_provider_is_valid = (provider_link: string): boolean => {
      const scored = scored_endpoints.value?.find((ep) => ep.endpointUrl === provider_link);
      if (!scored) return false;
      const failed = failed_checks_by_provider.value.get(provider_link) || [];
      return scored.score > 0 && (!failed || failed.length === 0);
    };

    const handle_switch_to_provider = (provider_link: string | null) => {
      if (!provider_link) return;
      const service = service_ref.value;
      if (!service) return;
      if (check_if_provider_is_valid(provider_link)) {
        service.handleChangeOfNode(provider_link);
      } else {
        pending_provider_switch.value = provider_link;
        is_confirmation_switch_dialog_opened.value = true;
      }
    };

    const handle_confirm_provider_switch = () => {
      const service = service_ref.value;
      if (pending_provider_switch.value && service) {
        service.handleChangeOfNode(pending_provider_switch.value);
        pending_provider_switch.value = undefined;
        is_confirmation_switch_dialog_opened.value = false;
      }
    };

    const change_activity = () => {
      const service = service_ref.value;
      if (!service) return;
      if (is_active.value) {
        service.stopCheckingProcess();
      } else {
        service.startCheckingProcess();
      }
    };

    watch(service_ref, (new_service, old_service) => {
      if (old_service && handler) {
        old_service.removeEventListener(`stateChange-${old_service.serviceKey}`, handler);
        handler = null;
      }
      if (!new_service) return;
      handler = () => actualize_data();
      new_service.addEventListener(`stateChange-${new_service.serviceKey}`, handler);
      actualize_data();
    }, { immediate: true });

    onUnmounted(() => {
      const service = service_ref.value;
      if (service && handler) {
        service.removeEventListener(`stateChange-${service.serviceKey}`, handler);
      }
    });

    return () => {
      const service = service_ref.value;

      if (!service) {
        return h("div", { class: "rounded-lg border border-hive-border bg-hive-card p-6 animate-pulse" }, [
          h("div", { class: "flex items-center justify-center" }, [
            icon_loader_circle("animate-spin h-8 w-8 text-hive-muted-foreground"),
          ]),
          h("p", { class: "text-center text-sm text-hive-muted-foreground mt-2" }, "Loading health checker..."),
        ]);
      }

      // Render switch status text
      let switch_status_content;
      if (!switch_status.value) {
        switch_status_content = h("span", {}, "Switch to Best");
      } else if (switch_status.value === "waiting") {
        switch_status_content = h("span", { class: "inline-flex items-center gap-2" }, [
          "Evaluating",
          icon_loader_circle_sm("animate-spin h-4 w-4"),
        ]);
      } else if (switch_status.value === "done") {
        switch_status_content = h("span", { class: "text-green-600" }, "Switching...");
      } else if (switch_status.value === "no_change") {
        switch_status_content = h("span", { class: "text-hive-muted-foreground" }, "Already on best");
      }

      // Render providers
      let providers_content;
      if (!scored_endpoints.value || !scored_endpoints.value.length) {
        providers_content = h("div", { class: "flex flex-col items-center justify-center py-8" }, [
          icon_loader_circle("animate-spin h-8 w-8 text-hive-muted-foreground"),
          h("p", { class: "text-sm text-hive-muted-foreground mt-2" }, "Checking API servers..."),
        ]);
      } else {
        const filtered_endpoints = filter.value
          ? scored_endpoints.value.filter((ep) =>
              ep.endpointUrl.toLowerCase().includes(filter.value.toLowerCase())
            )
          : scored_endpoints.value;

        if (filtered_endpoints.length === 0) {
          providers_content = h("div", { class: "rounded-lg border border-hive-border bg-hive-card p-6 text-center" }, [
            h("p", { class: "text-sm text-hive-muted-foreground" }, "No providers match your filter."),
          ]);
        } else {
          const sorted = [...filtered_endpoints].sort((a, b) => {
            if (a.endpointUrl === node_address.value) return -1;
            if (b.endpointUrl === node_address.value) return 1;
            return 0;
          });

          providers_content = h(
            "div",
            { class: "space-y-2" },
            sorted
              .map((scored_endpoint, index) => {
                const { endpointUrl, score, up } = scored_endpoint;
                let last_latency: number | null = null;
                if (up && scored_endpoint.latencies.length) {
                  last_latency = scored_endpoint.latencies[scored_endpoint.latencies.length - 1];
                }
                if (!providers.value?.find((p) => p === endpointUrl)) {
                  return null;
                }
                return h(ProviderCard, {
                  key: endpointUrl,
                  providerLink: endpointUrl,
                  disabled: score === 0,
                  isSelected: endpointUrl === node_address.value,
                  isTop: false,
                  checkerNamesList: api_checkers.value?.map((c) => c.title) || [],
                  latency: last_latency,
                  score: scored_endpoint.score,
                  index: index + 1,
                  failedErrorChecks:
                    failed_checks_by_provider.value
                      .get(endpointUrl)
                      ?.filter((fc) => fc.status === "serverError")
                      ?.map((fc) => fc.checkName) || [],
                  failedValidationChecks:
                    failed_checks_by_provider.value
                      .get(endpointUrl)
                      ?.filter((fc) => fc.status === "validation")
                      ?.map((fc) => fc.checkName) || [],
                  isHealthCheckerActive: !!is_active.value,
                  isProviderValid: check_if_provider_is_valid(endpointUrl),
                  onSwitchToProvider: handle_switch_to_provider,
                  onDeleteProvider: (p: string) => service.removeProvider(p),
                  onSelectValidator: select_validator,
                });
              })
              .filter(Boolean)
          );
        }
      }

      return h("div", { class: "space-y-4" }, [
        // Header
        h("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" }, [
          h("div", {}, [
            h("h2", { class: "text-lg font-semibold" }, "API Health Monitor"),
            h("p", { class: "text-sm text-hive-muted-foreground" }, "Monitor and manage Hive API endpoints"),
          ]),
          h("div", { class: "flex items-center gap-3", "data-testid": "toggle" }, [
            h("span", { class: "text-sm text-hive-muted-foreground" }, "Auto-check"),
            h(
              SwitchRoot,
              {
                checked: !!is_active.value,
                "onUpdate:checked": () => change_activity(),
                class: cn(
                  "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
                  is_active.value ? "justify-end bg-hive-red" : "justify-start bg-hive-muted"
                ),
              },
              {
                default: () =>
                  h(SwitchThumb, {
                    class: "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  }),
              }
            ),
          ]),
        ]),

        // Controls
        h("div", { class: "flex flex-col sm:flex-row gap-3" }, [
          h("div", { class: "relative flex-1" }, [
            h("input", {
              type: "text",
              placeholder: "Filter providers by URL...",
              value: filter.value,
              onInput: (e: Event) => {
                filter.value = (e.target as HTMLInputElement).value;
              },
              class: cn(
                "flex h-10 w-full rounded-md border border-hive-border bg-hive-card px-3 py-2 text-sm",
                "ring-offset-background placeholder:text-hive-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hive-red focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              ),
            }),
            filter.value
              ? h(
                  "button",
                  {
                    class: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-hive-muted-foreground hover:text-foreground transition-colors cursor-pointer",
                    onClick: () => {
                      filter.value = "";
                    },
                    "aria-label": "Clear filter",
                  },
                  "Clear"
                )
              : null,
          ]),
          h(
            "button",
            {
              class: cn(
                "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 cursor-pointer",
                "bg-hive-red text-white hover:bg-hive-red/90 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              ),
              onClick: () => service.evaluateAndSwitch(),
            },
            [switch_status_content]
          ),
        ]),

        // Provider List
        providers_content,

        // Add Provider Section
        h("div", { class: "pt-4 border-t border-hive-border" }, [
          h(ProviderAddition, {
            onProviderSubmit: (p: string) => service.addProvider(p),
          }),
        ]),

        // Reset Button
        h(
          "button",
          {
            class: cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 cursor-pointer",
              "text-hive-muted-foreground hover:text-foreground",
              "border border-hive-border hover:border-hive-red/50 transition-colors"
            ),
            onClick: () => service.resetProviders(),
          },
          "Reset to defaults"
        ),

        // Dialogs
        h(ValidationErrorDialog, {
          isOpened: is_validation_error_dialog_opened.value,
          validatorDetails: selected_validator.value,
          "onUpdate:isOpened": (val: boolean) => {
            is_validation_error_dialog_opened.value = val;
          },
          onClearValidationError: (provider_name: string, checker_name: string) => {
            service.clearValidationError(provider_name, checker_name);
          },
        }),

        h(ConfirmationSwitchDialog, {
          isOpened: is_confirmation_switch_dialog_opened.value,
          providerLink: pending_provider_switch.value,
          "onUpdate:isOpened": (val: boolean) => {
            is_confirmation_switch_dialog_opened.value = val;
          },
          onConfirm: handle_confirm_provider_switch,
        }),
      ]);
    };
  },
});
