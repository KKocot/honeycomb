export interface RendererPlugin {
  name: string;
  preProcess?: (text: string) => string;
  postProcess?: (text: string) => string;
  onMount?: (rootElement: HTMLElement) => (() => void) | undefined;
}

export interface PluginOptions {
  plugins?: RendererPlugin[];
}
