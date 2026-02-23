import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  ssr: false,

  app: {
    baseURL: "/demo/vue-nuxt",
    head: {
      htmlAttrs: { lang: "en", class: "dark" },
      title: "Honeycomb Vue Nuxt Demo",
    },
  },

  css: [
    "~/assets/css/main.css",
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@hiveio/wax"],
    },
  },

  typescript: {
    strict: true,
  },
});
