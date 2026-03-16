import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import { wasmUrlPlugin } from "@hiveio/honeycomb-solid/plugins";

export default defineConfig({
  integrations: [solidJs()],
  base: "/demo/solid-astro",
  server: {
    port: 3038,
    host: "127.0.0.1",
  },
  vite: {
    plugins: [wasmUrlPlugin()],
  },
});
