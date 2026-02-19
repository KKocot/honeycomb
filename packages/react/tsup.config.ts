import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"] },
  clean: true,
  splitting: false,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "@hiveio/wax",
    "@radix-ui/react-dialog",
    "@radix-ui/react-popover",
    "@radix-ui/react-switch",
    "lucide-react",
    "@xmldom/xmldom",
    "clsx",
    "remarkable",
    "sanitize-html",
    "tailwind-merge",
    "zod",
  ],
  noExternal: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"],
  banner: { js: '"use client";' },
});
