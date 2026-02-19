import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
  integrations: [solidJs()],
  base: "/demo/solid-astro",
  server: {
    port: 3038,
    host: "127.0.0.1",
  },
});
