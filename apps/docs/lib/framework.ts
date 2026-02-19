export const FRAMEWORKS = [
  { id: "react", label: "React", demo_base: "/demo/react-next" },
  { id: "solid", label: "Solid.js", demo_base: "/demo/solid/" },
  { id: "vue", label: "Vue 3", demo_base: "/demo/vue/" },
] as const;

export function get_demo_url(framework: Framework): string {
  const fw = FRAMEWORKS.find((f) => f.id === framework);
  return fw?.demo_base ?? "/demo/react-next";
}

export type Framework = (typeof FRAMEWORKS)[number]["id"];

const VALID_FRAMEWORKS = new Set<string>(FRAMEWORKS.map((f) => f.id));

function is_framework(value: string): value is Framework {
  return VALID_FRAMEWORKS.has(value);
}

export function parseFramework(value: unknown): Framework {
  return typeof value === "string" && is_framework(value) ? value : "react";
}
