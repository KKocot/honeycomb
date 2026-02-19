import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"] },
  clean: true,
  splitting: false,
  sourcemap: true,
  external: [
    "solid-js",
    "@hiveio/wax",
    "@kobalte/core",
    "@xmldom/xmldom",
    "clsx",
    "remarkable",
    "sanitize-html",
    "tailwind-merge",
    "zod",
  ],
  noExternal: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"],
});
