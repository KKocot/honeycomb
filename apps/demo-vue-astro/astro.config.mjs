import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { wasmUrlPlugin } from "@hiveio/honeycomb-vue/plugins";

export default defineConfig({
  integrations: [vue()],
  base: "/demo/vue-astro",
  server: {
    port: 3039,
    host: "127.0.0.1",
  },
  vite: {
    plugins: [tailwindcss(), wasmUrlPlugin()],
  },
});
