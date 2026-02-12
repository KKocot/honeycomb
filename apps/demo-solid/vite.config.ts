import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  base: "/demo/solid/",
  plugins: [solid()],
  server: {
    port: 3032,
    host: "127.0.0.1",
  },
});
