<template>
  <main class="container mx-auto p-8 max-w-4xl">
    <h1 class="text-4xl font-bold mb-8 text-hive-red">
      Honeycomb Vue Demo
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
            :class="[
              'w-4 h-4 rounded-full',
              status === 'connected'
                ? 'bg-green-500'
                : status === 'error' || status === 'disconnected'
                  ? 'bg-red-500'
                  : 'bg-yellow-500',
            ]"
            :title="status"
          />
          <span class="text-lg capitalize">{{ status }}</span>
          <span v-if="isLoading" class="text-muted-foreground text-sm">(loading...)</span>
        </div>
        <div
          v-if="error"
          class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400"
        >
          <strong>Error:</strong> {{ error }}
        </div>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">Current Endpoint</h2>
        <p class="font-mono text-sm text-muted-foreground">
          {{ apiEndpoint || "Not connected" }}
        </p>
      </section>

      <section class="border border-border rounded-lg p-6 bg-muted/20">
        <h2 class="text-2xl font-semibold mb-4">
          All Endpoints ({{ endpoints.length }})
        </h2>
        <div class="space-y-3">
          <div
            v-for="endpoint in endpoints"
            :key="endpoint.url"
            class="flex items-center justify-between p-3 bg-background border border-border rounded"
          >
            <div class="flex items-center gap-3 flex-1">
              <div
                :class="[
                  'w-3 h-3 rounded-full',
                  endpoint.healthy ? 'bg-green-500' : 'bg-red-500',
                ]"
                :title="endpoint.healthy ? 'Healthy' : 'Unhealthy'"
              />
              <span class="font-mono text-sm">{{ endpoint.url }}</span>
            </div>
            <div class="flex gap-4 text-xs text-muted-foreground">
              <span v-if="endpoint.lastCheck !== null">
                Checked: {{ format_timestamp(endpoint.lastCheck) }}
              </span>
              <span
                v-if="endpoint.lastError"
                class="text-red-400"
                :title="endpoint.lastError"
              >
                Error
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ApiTracker, useHive } from "@kkocot/honeycomb-vue";

const { status, isLoading, error, apiEndpoint, endpoints } = useHive();

function format_timestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}
</script>
