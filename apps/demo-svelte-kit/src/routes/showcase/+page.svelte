<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { HiveProvider } from "@hiveio/honeycomb-svelte";
  import HeroSection from "$lib/showcase/HeroSection.svelte";
  import AvatarSection from "$lib/showcase/AvatarSection.svelte";
  import UserCardSection from "$lib/showcase/UserCardSection.svelte";
  import BalanceCardSection from "$lib/showcase/BalanceCardSection.svelte";
  import ManabarSection from "$lib/showcase/ManabarSection.svelte";
  import PostCardSection from "$lib/showcase/PostCardSection.svelte";
  import PostListSection from "$lib/showcase/PostListSection.svelte";
  import RendererSection from "$lib/showcase/RendererSection.svelte";
  import ApiTrackerSection from "$lib/showcase/ApiTrackerSection.svelte";
  import HooksSection from "$lib/showcase/HooksSection.svelte";

  interface NavItem {
    id: string;
    label: string;
  }

  const NAV_ITEMS: readonly NavItem[] = [
    { id: "avatar", label: "Avatar" },
    { id: "user-card", label: "UserCard" },
    { id: "balance-card", label: "BalanceCard" },
    { id: "manabar", label: "Manabar" },
    { id: "post-card", label: "PostCard" },
    { id: "post-list", label: "PostList" },
    { id: "renderer", label: "Renderer" },
    { id: "api-tracker", label: "ApiTracker" },
    { id: "hooks", label: "Hooks" },
  ];

  let active_section = $state("hero");

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            active_section = entry.target.id;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    const sections = document.querySelectorAll("section[id]");
    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Showcase - Honeycomb SvelteKit</title>
</svelte:head>

{#if browser}
  <!-- Sticky section nav -->
  <nav
    class="sticky top-[65px] z-40 border-b border-border bg-background/95 backdrop-blur"
  >
    <div
      class="container mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none"
    >
      {#each NAV_ITEMS as item}
        <a
          href="#{item.id}"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap {active_section ===
          item.id
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
        >
          {item.label}
        </a>
      {/each}
    </div>
  </nav>

  <HiveProvider>
    <div class="container mx-auto px-4 space-y-16 pb-16">
      <HeroSection />
      <AvatarSection />
      <UserCardSection />
      <BalanceCardSection />
      <ManabarSection />
      <PostCardSection />
      <PostListSection />
      <RendererSection />
      <ApiTrackerSection />
      <HooksSection />
    </div>
  </HiveProvider>
{:else}
  <div class="min-h-screen bg-hive-background">
    <p class="text-center pt-20 text-hive-muted-foreground">Loading...</p>
  </div>
{/if}
