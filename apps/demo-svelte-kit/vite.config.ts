import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { wasmUrlPlugin } from "@hiveio/honeycomb-svelte/plugins";

export default defineConfig({
  plugins: [sveltekit(), wasmUrlPlugin()],
  server: {
    port: 3042,
    host: "127.0.0.1",
  },
});
