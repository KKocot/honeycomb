import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import { wasmUrlPlugin } from "@barddev/honeycomb-svelte/plugins";

export default defineConfig({
  integrations: [svelte()],
  base: "/demo/svelte-astro",
  server: {
    port: 3043,
    host: "127.0.0.1",
  },
  vite: {
    plugins: [wasmUrlPlugin()],
  },
});
