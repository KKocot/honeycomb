#!/usr/bin/env bash
set -euo pipefail

DIST_DIR="dist"
CORE_STYLES="../core/src/styles.css"
RENDERER_STYLES="../renderer/src/styles.css"

# base.css = CSS variables + component styles (no Tailwind utilities)
cat "$CORE_STYLES" > "$DIST_DIR/base.css"
echo "" >> "$DIST_DIR/base.css"
cat "$RENDERER_STYLES" >> "$DIST_DIR/base.css"

# styles.css = base.css + Tailwind utilities (full bundle)
cp "$DIST_DIR/base.css" "$DIST_DIR/styles.css"
tailwindcss -i tailwind-build.css -o "$DIST_DIR/tailwind-utilities.css" --minify
echo "" >> "$DIST_DIR/styles.css"
cat "$DIST_DIR/tailwind-utilities.css" >> "$DIST_DIR/styles.css"
rm "$DIST_DIR/tailwind-utilities.css"
