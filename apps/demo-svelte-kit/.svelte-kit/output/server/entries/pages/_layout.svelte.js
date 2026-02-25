import { a as attr_class, s as stringify, d as derived } from "../../chunks/index.js";
import { p as page } from "../../chunks/index2.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    const is_showcase = derived(() => page.url.pathname === "/showcase");
    $$renderer2.push(`<nav class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur"><div class="container mx-auto px-4 py-3 flex items-center justify-between"><div class="flex items-center gap-3"><svg viewBox="0 0 256 256" fill="none" class="h-7 w-7" aria-hidden="true"><polygon points="168,128 148,162.6 108,162.6 88,128 108,93.4 148,93.4" fill="#E31337"></polygon><polygon points="251,128 231,162.6 191,162.6 171,128 191,93.4 231,93.4" fill="#E31337" opacity="0.35"></polygon><polygon points="85,128 65,162.6 25,162.6 5,128 25,93.4 65,93.4" fill="#E31337" opacity="0.35"></polygon></svg> <span class="font-bold text-lg">Honeycomb</span> <span class="text-xs text-muted-foreground font-medium hidden sm:inline">Svelte + SvelteKit</span></div> <div class="flex items-center gap-1"><a href="/"${attr_class(`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${stringify(!is_showcase() ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted")}`)}>Demo</a> <a href="/showcase"${attr_class(`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${stringify(is_showcase() ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted")}`)}>Showcase</a></div></div></nav> `);
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
