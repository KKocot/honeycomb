import { RendererPlugin } from "./renderer-plugin";

export class TablePlugin implements RendererPlugin {
  name = "table-plugin";

  postProcess(text: string): string {
    const table_regex = /(<table[\s\S]*?<\/table>)/g;
    return text.replace(table_regex, (match) => {
      return `<div style="overflow-x: auto; width: 100%; display: block;">${match}</div>`;
    });
  }
}
