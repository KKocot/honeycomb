import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "/demo/svelte-vite/",
  plugins: [svelte()],
  server: {
    port: 3041,
    host: "127.0.0.1",
  },
});
