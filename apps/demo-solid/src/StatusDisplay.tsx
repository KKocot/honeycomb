import { Show, For } from "solid-js";
import { useHive, ApiTracker } from "@kkocot/honeycomb-solid";
import type { ConnectionStatus, EndpointStatus } from "@kkocot/honeycomb-solid";

export default function StatusDisplay() {
  const hive_context = useHive();

  const get_status_color = (status_value: ConnectionStatus) => {
    switch (status_value) {
      case "connected":
        return "bg-green-500";
      case "connecting":
      case "reconnecting":
        return "bg-yellow-500";
      case "error":
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <main class="container mx-auto p-8 max-w-4xl">
      <h1 class="text-4xl font-bold mb-8 text-hive-red">
        Honeycomb Solid Demo
      </h1>

      <div class="space-y-6">
        <section class="border border-border rounded-lg p-6 bg-muted/20">
          <h2 class="text-2xl font-semibold mb-4">API Tracker</h2>
          <p class="text-sm text-muted-foreground mb-4">
            Click the tracker to see all API endpoints and their health status.
          </p>
          <ApiTracker />
        </section>

        <section class="border border-border rounded-lg p-6 bg-muted/20">
          <h2 class="text-2xl font-semibold mb-4">Connection Status</h2>
          <div class="flex items-center gap-3">
            <div
              class={`w-4 h-4 rounded-full ${get_status_color(hive_context.status())}`}
              title={hive_context.status()}
            />
            <span class="text-lg capitalize">{hive_context.status()}</span>
            <Show when={hive_context.isLoading()}>
              <span class="text-muted-foreground text-sm">(loading...)</span>
            </Show>
          </div>
          <Show when={hive_context.error()}>
            <div class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
              <strong>Error:</strong> {hive_context.error()}
            </div>
          </Show>
        </section>

        <section class="border border-border rounded-lg p-6 bg-muted/20">
          <h2 class="text-2xl font-semibold mb-4">Current Endpoint</h2>
          <p class="font-mono text-sm text-muted-foreground">
            {hive_context.apiEndpoint() || <em>Not connected</em>}
          </p>
        </section>

        <section class="border border-border rounded-lg p-6 bg-muted/20">
          <h2 class="text-2xl font-semibold mb-4">
            All Endpoints ({hive_context.endpoints().length})
          </h2>
          <div class="space-y-3">
            <For each={hive_context.endpoints()}>
              {(endpoint: EndpointStatus) => (
                <div class="flex items-center justify-between p-3 bg-background border border-border rounded">
                  <div class="flex items-center gap-3 flex-1">
                    <div
                      class={`w-3 h-3 rounded-full ${
                        endpoint.healthy ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={endpoint.healthy ? "Healthy" : "Unhealthy"}
                    />
                    <span class="font-mono text-sm">{endpoint.url}</span>
                  </div>
                  <div class="flex gap-4 text-xs text-muted-foreground">
                    <Show when={endpoint.lastCheck !== null}>
                      <span>Checked: {new Date(endpoint.lastCheck!).toLocaleTimeString()}</span>
                    </Show>
                    <Show when={endpoint.lastError}>
                      <span class="text-red-400" title={endpoint.lastError || ""}>
                        Error
                      </span>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>
      </div>
    </main>
  );
}
