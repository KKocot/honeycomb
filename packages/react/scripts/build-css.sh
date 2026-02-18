#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="dist"
CORE_STYLES="../core/src/styles.css"
CORE_THEME="../core/src/theme.css"
RENDERER_STYLES="../renderer/src/styles.css"

# base.css = CSS variables + component styles (no Tailwind utilities)
cat "$CORE_STYLES" > "$DIST_DIR/base.css"
echo "" >> "$DIST_DIR/base.css"
cat "$RENDERER_STYLES" >> "$DIST_DIR/base.css"

# styles.css = base.css + Tailwind utilities + @theme inline tokens (full bundle)
cp "$DIST_DIR/base.css" "$DIST_DIR/styles.css"
tailwindcss -i tailwind-build.css -o "$DIST_DIR/tailwind-utilities.css" --minify
echo "" >> "$DIST_DIR/styles.css"
cat "$DIST_DIR/tailwind-utilities.css" >> "$DIST_DIR/styles.css"
rm "$DIST_DIR/tailwind-utilities.css"
echo "" >> "$DIST_DIR/styles.css"
cat "$CORE_THEME" >> "$DIST_DIR/styles.css"

# theme.css = @theme inline tokens (for consumers using hive-* classes in own code)
cp "$CORE_THEME" "$DIST_DIR/theme.css"
