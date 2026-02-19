import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  base: "/demo/react-astro",
  server: {
    port: 3035,
    host: "127.0.0.1",
  },
});
