import { defineConfig } from "tsup";

export default defineConfig({
  entry: { "vite-plugins": "src/vite-plugins.ts" },
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: false,
  target: "esnext",
  platform: "node",
});
