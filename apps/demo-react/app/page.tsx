"use client";

import {
  useHive,
  useApiEndpoint,
  useHiveStatus,
  ApiTracker,
  type ConnectionStatus,
} from "@kkocot/honeycomb-react";

export default function HomePage() {
  const { status, is_loading, error } = useHive();
  const api_endpoint = useApiEndpoint();
  const { endpoints } = useHiveStatus();

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
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-hive-red">
        Honeycomb React Demo
      </h1>

      <div className="space-y-6">
        <section className="border border-border rounded-lg p-6 bg-muted/20">
          <h2 className="text-2xl font-semibold mb-4">API Tracker</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Click the tracker to see all API endpoints and their health status.
          </p>
          <ApiTracker />
        </section>

        <section className="border border-border rounded-lg p-6 bg-muted/20">
          <h2 className="text-2xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${get_status_color(status)}`}
              title={status}
            />
            <span className="text-lg capitalize">{status}</span>
            {is_loading && <span className="text-muted-foreground text-sm">(loading...)</span>}
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        <section className="border border-border rounded-lg p-6 bg-muted/20">
          <h2 className="text-2xl font-semibold mb-4">Current Endpoint</h2>
          <p className="font-mono text-sm text-muted-foreground">
            {api_endpoint || <em>Not connected</em>}
          </p>
        </section>

        <section className="border border-border rounded-lg p-6 bg-muted/20">
          <h2 className="text-2xl font-semibold mb-4">
            All Endpoints ({endpoints.length})
          </h2>
          <div className="space-y-3">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.url}
                className="flex items-center justify-between p-3 bg-background border border-border rounded"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      endpoint.healthy ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={endpoint.healthy ? "Healthy" : "Unhealthy"}
                  />
                  <span className="font-mono text-sm">{endpoint.url}</span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {endpoint.lastCheck !== null && (
                    <span>Checked: {new Date(endpoint.lastCheck).toLocaleTimeString()}</span>
                  )}
                  {endpoint.lastError && (
                    <span className="text-red-400" title={endpoint.lastError}>
                      Error
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
