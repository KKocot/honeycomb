import { defineConfig } from "@solidjs/start/config";
import { wasmUrlPlugin } from "@hiveio/honeycomb-solid/plugins";

export default defineConfig({
  ssr: true,
  vite: {
    plugins: [wasmUrlPlugin()],
    resolve: {
      conditions: ["solid", "browser", "module"],
    },
    ssr: {
      noExternal: ["@hiveio/honeycomb-solid"],
    },
    optimizeDeps: {
      exclude: ["@hiveio/wax"],
    },
  },
});
