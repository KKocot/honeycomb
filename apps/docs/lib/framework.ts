export const FRAMEWORKS = [
  {
    id: "react",
    label: "React",
    demo_base: "/demo/react-next/",
    npm_package: "@hiveio/honeycomb-react",
  },
  {
    id: "solid",
    label: "Solid.js",
    demo_base: "/demo/solid-vite/",
    npm_package: "@hiveio/honeycomb-solid",
  },
  {
    id: "vue",
    label: "Vue 3",
    demo_base: "/demo/vue-vite/",
    npm_package: "@hiveio/honeycomb-vue",
  },
  {
    id: "svelte",
    label: "Svelte 5",
    demo_base: "/demo/svelte-vite/",
    npm_package: "@hiveio/honeycomb-svelte",
  },
] as const;

export function get_demo_url(framework: Framework): string {
  const fw = FRAMEWORKS.find((f) => f.id === framework);
  return fw?.demo_base ?? "/demo/react-next/";
}

export function get_npm_url(framework: Framework): string {
  const fw = FRAMEWORKS.find((f) => f.id === framework);
  const pkg = fw?.npm_package ?? "@hiveio/honeycomb-react";
  return `https://www.npmjs.com/package/${pkg}`;
}

export type Framework = (typeof FRAMEWORKS)[number]["id"];

const VALID_FRAMEWORKS = new Set<string>(FRAMEWORKS.map((f) => f.id));

function is_framework(value: string): value is Framework {
  return VALID_FRAMEWORKS.has(value);
}

export function parseFramework(value: unknown): Framework {
  return typeof value === "string" && is_framework(value) ? value : "react";
}
