export interface RendererLogger {
  warn: (msg: string) => void;
  error: (msg: string) => void;
}
