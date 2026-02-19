import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,
  vite: {
    resolve: {
      conditions: ["solid", "browser", "module"],
    },
    ssr: {
      noExternal: ["@barddev/honeycomb-solid", "@kkocot/honeycomb-core"],
    },
    server: {
      port: 3037,
      host: "127.0.0.1",
    },
  },
});
