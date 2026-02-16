import links_re from "../utils/links";
import type { AssetEmbedderOptions } from "../embedder/asset-embedder";

export class ImageProcessor {
  private options: AssetEmbedderOptions;

  public constructor(options: AssetEmbedderOptions) {
    this.options = options;
  }

  public hide_images_if_needed(
    doc: Document,
    mutate: boolean,
  ): void {
    if (mutate && this.options.hideImages) {
      for (const image of Array.from(
        doc.getElementsByTagName("img"),
      )) {
        const pre = doc.createElement("pre");
        pre.setAttribute("class", "image-url-only");
        pre.appendChild(
          doc.createTextNode(
            image.getAttribute("src") || "",
          ),
        );
        const parent = image.parentNode;
        if (parent) {
          parent.appendChild(pre);
          parent.removeChild(image);
        }
      }
    }
  }

  public proxify_images_if_needed(
    doc: Document,
    mutate: boolean,
  ): void {
    if (mutate && !this.options.hideImages) {
      this.proxify_images(doc);
    }
  }

  private proxify_images(doc: Document): void {
    if (!doc) {
      return;
    }
    Array.from(doc.getElementsByTagName("img")).forEach(
      (node) => {
        const url: string =
          node.getAttribute("src") || "";
        if (!links_re.local.test(url)) {
          node.setAttribute(
            "src",
            this.options.imageProxyFn(url),
          );
        }
      },
    );
  }
}
