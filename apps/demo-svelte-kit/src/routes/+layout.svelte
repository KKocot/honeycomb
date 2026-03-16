<script lang="ts">
  import "../app.css";
  import "@hiveio/honeycomb-svelte/styles.css";
  import { page } from "$app/state";

  let { children } = $props();

  const is_showcase = $derived(page.url.pathname === "/showcase");
</script>

<nav
  class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur"
>
  <div class="container mx-auto px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <svg
        viewBox="0 0 256 256"
        fill="none"
        class="h-7 w-7"
        aria-hidden="true"
      >
        <polygon
          points="168,128 148,162.6 108,162.6 88,128 108,93.4 148,93.4"
          fill="#E31337"
        />
        <polygon
          points="251,128 231,162.6 191,162.6 171,128 191,93.4 231,93.4"
          fill="#E31337"
          opacity="0.35"
        />
        <polygon
          points="85,128 65,162.6 25,162.6 5,128 25,93.4 65,93.4"
          fill="#E31337"
          opacity="0.35"
        />
      </svg>
      <span class="font-bold text-lg">Honeycomb</span>
      <span class="text-xs text-muted-foreground font-medium hidden sm:inline"
        >Svelte + SvelteKit</span
      >
    </div>

    <div class="flex items-center gap-1">
      <a
        href="/"
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {!is_showcase
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
      >
        Demo
      </a>
      <a
        href="/showcase"
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {is_showcase
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
      >
        Showcase
      </a>
    </div>
  </div>
</nav>

{@render children()}
