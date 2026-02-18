import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  external: [
    "solid-js",
    "@hiveio/wax",
    "@xmldom/xmldom",
    "remarkable",
    "sanitize-html",
    "zod",
  ],
  noExternal: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"],
});
