export const FRAMEWORKS = [
  { id: "react", label: "React" },
  { id: "solid", label: "Solid.js" },
  { id: "vue", label: "Vue 3" },
] as const;

export type Framework = (typeof FRAMEWORKS)[number]["id"];

const VALID_FRAMEWORKS = new Set<string>(FRAMEWORKS.map((f) => f.id));

export function parseFramework(value: unknown): Framework {
  return typeof value === "string" && VALID_FRAMEWORKS.has(value)
    ? (value as Framework)
    : "react";
}
