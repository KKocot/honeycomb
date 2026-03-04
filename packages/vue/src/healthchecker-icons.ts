import { h } from "vue";

const SVG_ATTRS = { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" };

export function icon_loader_circle(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }),
  ]);
}

export function icon_trash2(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "M3 6h18" }),
    h("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
    h("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
    h("line", { x1: 10, y1: 11, x2: 10, y2: 17 }),
    h("line", { x1: 14, y1: 11, x2: 14, y2: 17 }),
  ]);
}

export function icon_circle_check(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("circle", { cx: 12, cy: 12, r: 10 }),
    h("path", { d: "m9 12 2 2 4-4" }),
  ]);
}

export function icon_octagon_alert(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" }),
    h("line", { x1: 12, y1: 8, x2: 12, y2: 12 }),
    h("line", { x1: 12, y1: 16, x2: 12.01, y2: 16 }),
  ]);
}

export function icon_triangle_alert(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }),
    h("line", { x1: 12, y1: 9, x2: 12, y2: 13 }),
    h("line", { x1: 12, y1: 17, x2: 12.01, y2: 17 }),
  ]);
}

export function icon_clock(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("circle", { cx: 12, cy: 12, r: 10 }),
    h("polyline", { points: "12 6 12 12 16 14" }),
  ]);
}

export function icon_gauge(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "m12 14 4-4" }),
    h("path", { d: "M3.34 19a10 10 0 1 1 17.32 0" }),
  ]);
}

export function icon_plus(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "M5 12h14" }),
    h("path", { d: "M12 5v14" }),
  ]);
}

export function icon_alert_circle(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("circle", { cx: 12, cy: 12, r: 10 }),
    h("line", { x1: 12, y1: 8, x2: 12, y2: 12 }),
    h("line", { x1: 12, y1: 16, x2: 12.01, y2: 16 }),
  ]);
}

export function icon_x(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "M18 6 6 18" }),
    h("path", { d: "m6 6 12 12" }),
  ]);
}

export function icon_eraser(cls: string) {
  return h("svg", { ...SVG_ATTRS, class: cls }, [
    h("path", { d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" }),
    h("path", { d: "M22 21H7" }),
    h("path", { d: "m5 11 9 9" }),
  ]);
}
