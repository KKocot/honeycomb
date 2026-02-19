import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    port: 3036,
    host: "127.0.0.1",
  },
});
