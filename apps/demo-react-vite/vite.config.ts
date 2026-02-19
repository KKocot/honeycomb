import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/demo/react-vite/",
  plugins: [react()],
  server: {
    port: 3034,
    host: "127.0.0.1",
  },
});
