import type { RendererPlugin } from "./renderer-plugin";

export class InstagramResizePlugin implements RendererPlugin {
  name = "instagram-resize";

  onMount = (
    root_element: HTMLElement,
  ): (() => void) | undefined => {
    if (typeof window === "undefined") return undefined;

    let raf_id: number | null = null;
    let last_event: MessageEvent | null = null;

    const process_resize = () => {
      const event = last_event;
      last_event = null;
      raf_id = null;
      if (!event) return;
      try {
        const data =
          typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data;
        const height =
          data?.details?.height ??
          data?.height ??
          data?.params?.height;
        if (
          !height ||
          typeof height !== "number" ||
          height < 100
        )
          return;
        const iframes = root_element.querySelectorAll(
          ".instagramWrapper iframe",
        );
        iframes.forEach((iframe) => {
          if (!(iframe instanceof HTMLIFrameElement)) return;
          if (iframe.contentWindow === event.source) {
            iframe.style.height = `${height}px`;
          }
        });
      } catch {
        // Not a JSON message from Instagram, ignore
      }
    };

    const handle_resize = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.instagram.com" &&
        event.origin !== "https://instagram.com"
      )
        return;
      last_event = event;
      if (raf_id === null) {
        raf_id = requestAnimationFrame(process_resize);
      }
    };

    window.addEventListener("message", handle_resize);

    return () => {
      window.removeEventListener("message", handle_resize);
      if (raf_id !== null) cancelAnimationFrame(raf_id);
    };
  };
}
