import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { parseFramework } from "@/lib/framework";

const CODE = {
  basic: {
    react: `import { HiveAvatar } from "@barddev/honeycomb-react";

function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <HiveAvatar username="barddev" size="lg" />
      <span>@barddev</span>
    </div>
  );
}`,
    solid: `import { HiveAvatar } from "@kkocot/honeycomb-solid";

function UserProfile() {
  return (
    <div class="flex items-center gap-3">
      <HiveAvatar username="barddev" size="lg" />
      <span>@barddev</span>
    </div>
  );
}`,
    vue: `<template>
  <div class="flex items-center gap-3">
    <HiveAvatar username="barddev" size="lg" />
    <span>@barddev</span>
  </div>
</template>

<script setup lang="ts">
import { HiveAvatar } from "@kkocot/honeycomb-vue";
</script>`,
  },
  sizes: {
    react: `<HiveAvatar username="barddev" size="xs" />  {/* 24px */}
<HiveAvatar username="barddev" size="sm" />  {/* 32px */}
<HiveAvatar username="barddev" size="md" />  {/* 40px */}
<HiveAvatar username="barddev" size="lg" />  {/* 48px */}
<HiveAvatar username="barddev" size="xl" />  {/* 64px */}`,
    solid: `<HiveAvatar username="barddev" size="xs" />  {/* 24px */}
<HiveAvatar username="barddev" size="sm" />  {/* 32px */}
<HiveAvatar username="barddev" size="md" />  {/* 40px */}
<HiveAvatar username="barddev" size="lg" />  {/* 48px */}
<HiveAvatar username="barddev" size="xl" />  {/* 64px */}`,
    vue: `<template>
  <HiveAvatar username="barddev" size="xs" />  <!-- 24px -->
  <HiveAvatar username="barddev" size="sm" />  <!-- 32px -->
  <HiveAvatar username="barddev" size="md" />  <!-- 40px -->
  <HiveAvatar username="barddev" size="lg" />  <!-- 48px -->
  <HiveAvatar username="barddev" size="xl" />  <!-- 64px -->
</template>`,
  },
  customStyle: {
    react: `// Custom styling with className
<HiveAvatar
  username="barddev"
  className="ring-2 ring-hive-red ring-offset-2"
/>

// With border
<HiveAvatar
  username="barddev"
  className="border-2 border-hive-red"
/>

// Overlapping avatars
<div className="flex -space-x-2">
  <HiveAvatar username="barddev" className="border-2 border-background" />
  <HiveAvatar username="blocktrades" className="border-2 border-background" />
  <HiveAvatar username="arcange" className="border-2 border-background" />
</div>`,
    solid: `// Custom styling with class
<HiveAvatar
  username="barddev"
  class="ring-2 ring-hive-red ring-offset-2"
/>

// With border
<HiveAvatar
  username="barddev"
  class="border-2 border-hive-red"
/>

// Overlapping avatars
<div class="flex -space-x-2">
  <HiveAvatar username="barddev" class="border-2 border-background" />
  <HiveAvatar username="blocktrades" class="border-2 border-background" />
  <HiveAvatar username="arcange" class="border-2 border-background" />
</div>`,
    vue: `<template>
  <!-- Custom styling with class -->
  <HiveAvatar
    username="barddev"
    class="ring-2 ring-hive-red ring-offset-2"
  />

  <!-- With border -->
  <HiveAvatar
    username="barddev"
    class="border-2 border-hive-red"
  />

  <!-- Overlapping avatars -->
  <div class="flex -space-x-2">
    <HiveAvatar username="barddev" class="border-2 border-background" />
    <HiveAvatar username="blocktrades" class="border-2 border-background" />
    <HiveAvatar username="arcange" class="border-2 border-background" />
  </div>
</template>`,
  },
};

interface PageProps {
  params: Promise<{ framework: string }>;
}

export default async function AvatarPage({ params }: PageProps) {
  const { framework: raw_framework } = await params;
  const framework = parseFramework(raw_framework);

  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HiveAvatar</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Display Hive user profile pictures with automatic fallback.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Hive Avatars</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Avatars are loaded from{" "}
              <code>images.hive.blog/u/username/avatar</code>. Falls back to
              colored initials when image fails to load.
            </p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Usage</h2>
        {framework === "react" && (
          <CodeBlock code={CODE.basic.react} language="tsx" />
        )}
        {framework === "solid" && (
          <CodeBlock code={CODE.basic.solid} language="tsx" />
        )}
        {framework === "vue" && (
          <CodeBlock code={CODE.basic.vue} language="vue" />
        )}
      </section>

      {/* Preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="rounded-lg border border-border p-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.hive.blog/u/barddev/avatar"
              alt="@barddev"
              className="h-6 w-6 rounded-full"
            />
            <img
              src="https://images.hive.blog/u/barddev/avatar"
              alt="@barddev"
              className="h-8 w-8 rounded-full"
            />
            <img
              src="https://images.hive.blog/u/barddev/avatar"
              alt="@barddev"
              className="h-10 w-10 rounded-full"
            />
            <img
              src="https://images.hive.blog/u/barddev/avatar"
              alt="@barddev"
              className="h-12 w-12 rounded-full"
            />
            <img
              src="https://images.hive.blog/u/barddev/avatar"
              alt="@barddev"
              className="h-16 w-16 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4">
                  <code>username</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">required</td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>size</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>
                    &quot;xs&quot; | &quot;sm&quot; | &quot;md&quot; |
                    &quot;lg&quot; | &quot;xl&quot;
                  </code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>&quot;md&quot;</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>className</code> / <code>class</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>showBorder</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>false</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">
                  <code>fallbackColor</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>string</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Examples</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Preset sizes</h3>
            {framework === "react" && (
              <CodeBlock code={CODE.sizes.react} language="tsx" />
            )}
            {framework === "solid" && (
              <CodeBlock code={CODE.sizes.solid} language="tsx" />
            )}
            {framework === "vue" && (
              <CodeBlock code={CODE.sizes.vue} language="vue" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Custom styling</h3>
            {framework === "react" && (
              <CodeBlock code={CODE.customStyle.react} language="tsx" />
            )}
            {framework === "solid" && (
              <CodeBlock code={CODE.customStyle.solid} language="tsx" />
            )}
            {framework === "vue" && (
              <CodeBlock code={CODE.customStyle.vue} language="vue" />
            )}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="flex items-center justify-between">
        <Link
          href={`/${framework}/api-tracker`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          API Tracker
        </Link>
        <Link
          href={`/${framework}/user-card`}
          className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
        >
          User Card
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
