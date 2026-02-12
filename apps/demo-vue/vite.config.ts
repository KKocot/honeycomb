import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/demo/vue/",
  plugins: [vue()],
  server: {
    port: 3033,
    host: "127.0.0.1",
  },
});
