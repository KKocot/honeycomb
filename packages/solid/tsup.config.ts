import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

const preset_options: preset.PresetOptions = {
  entries: [{ entry: "src/index.tsx" }],
  drop_console: true,
};

// writePackageJson is intentionally skipped — it overwrites CSS sub-path exports
// (./styles.css, ./base.css, ./theme.css). Exports are maintained manually in package.json.
export default defineConfig((config) => {
  const watching = !!config.watch;
  const parsed = preset.parsePresetOptions(preset_options, watching);
  const options = preset.generateTsupOptions(parsed);

  const solid_builds = options.map((option) => ({
    ...option,
    dts: option.dts
      ? { resolve: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"] }
      : false,
  }));

  // Separate build for vite-plugins (re-export from core, no JSX, no solid preset)
  const plugins_build = {
    entry: { "vite-plugins": "src/vite-plugins.ts" },
    outDir: "dist",
    format: "esm" as const,
    dts: true as const,
    clean: false,
    target: "esnext" as const,
    platform: "node" as const,
  };

  return [...solid_builds, plugins_build];
});
