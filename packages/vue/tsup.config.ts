import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: { resolve: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"] },
    clean: false,
    splitting: false,
    sourcemap: true,
    external: [
      "vue",
      "@hiveio/wax",
      "@xmldom/xmldom",
      "clsx",
      "radix-vue",
      "remarkable",
      "sanitize-html",
      "tailwind-merge",
      "zod",
    ],
    noExternal: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"],
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
