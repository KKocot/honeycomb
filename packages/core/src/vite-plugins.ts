import type { Plugin } from "vite";

/**
 * Vite plugin that fixes WASM URL loading for @hiveio/wax.
 *
 * Required for Astro, SolidStart, Remix, and other Vite-based SSR frameworks
 * where the Vite pipeline serves .wasm files as binary instead of JavaScript
 * modules when using the ?url import suffix.
 *
 * Works with all framework integrations:
 * - Astro + React/Solid/Vue: Add to vite.plugins in astro.config.mjs
 * - SolidStart: Add to vite.plugins in app.config.ts
 * - Remix / React Router 7: Add to vite.plugins in vite.config.ts
 * - Vite SPA: Not needed (native Vite handles ?url correctly)
 *
 * Note: This plugin only affects the dev server (configureServer).
 * Production builds handle WASM differently through the framework's build pipeline.
 */
export function wasmUrlPlugin(): Plugin {
  return {
    name: "honeycomb-wasm-url-fix",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          req.url?.endsWith(".wasm?import&url") ||
          req.url?.endsWith(".wasm?url")
        ) {
          const clean_url = req.url.replace(/\?(import&url|url)$/, "");
          if (!clean_url.endsWith(".wasm")) {
            next();
            return;
          }
          const js_module = `export default "${clean_url}"`;
          res.setHeader("Content-Type", "text/javascript");
          res.end(js_module);
          return;
        }
        next();
      });
    },
  };
}
