export const FRAMEWORKS = [
  { id: "react", label: "React", demo_port: 3031, demo_base: "/demo/react" },
  { id: "solid", label: "Solid.js", demo_port: 3032, demo_base: "/demo/solid/" },
  { id: "vue", label: "Vue 3", demo_port: 3033, demo_base: "/demo/vue/" },
] as const;

export function get_demo_url(framework: Framework): string {
  const fw = FRAMEWORKS.find((f) => f.id === framework);
  const port = fw?.demo_port ?? 3031;
  const base = fw?.demo_base ?? "/demo/react";
  return `http://127.0.0.1:${String(port)}${base}`;
}

export type Framework = (typeof FRAMEWORKS)[number]["id"];

const VALID_FRAMEWORKS = new Set<string>(FRAMEWORKS.map((f) => f.id));

function is_framework(value: string): value is Framework {
  return VALID_FRAMEWORKS.has(value);
}

export function parseFramework(value: unknown): Framework {
  return typeof value === "string" && is_framework(value) ? value : "react";
}
