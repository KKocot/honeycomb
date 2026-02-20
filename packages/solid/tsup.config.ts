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
  return options.map((option) => ({
    ...option,
    dts: option.dts
      ? { resolve: ["@kkocot/honeycomb-core", "@kkocot/honeycomb-renderer"] }
      : false,
  }));
});
