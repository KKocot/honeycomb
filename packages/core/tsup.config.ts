import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: false,
    splitting: false,
    sourcemap: true,
    external: ["@hiveio/wax"],
  },
  {
    entry: { "vite-plugins": "src/vite-plugins.ts" },
    outDir: "dist",
    format: ["esm"],
    dts: true,
    clean: false,
    target: "esnext",
    platform: "node",
  },
]);
