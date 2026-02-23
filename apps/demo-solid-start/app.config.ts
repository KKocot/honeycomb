import { defineConfig } from "@solidjs/start/config";
import { wasmUrlPlugin } from "@barddev/honeycomb-solid/plugins";

export default defineConfig({
  ssr: true,
  vite: {
    plugins: [wasmUrlPlugin()],
    resolve: {
      conditions: ["solid", "browser", "module"],
    },
    ssr: {
      noExternal: ["@barddev/honeycomb-solid"],
    },
    optimizeDeps: {
      exclude: ["@hiveio/wax"],
    },
  },
});
