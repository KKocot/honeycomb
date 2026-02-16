import {
  defineComponent,
  h,
  ref,
  computed,
  watch,
  nextTick,
  onUnmounted,
  type PropType,
} from "vue";
import {
  DefaultRenderer,
  build_default_options,
  DEFAULT_PLUGINS,
  type RendererOptions,
  type RendererPlugin,
} from "@kkocot/honeycomb-renderer";

export const HiveContentRenderer = defineComponent({
  name: "HiveContentRenderer",
  props: {
    body: { type: String, required: true },
    author: { type: String, default: undefined },
    permlink: { type: String, default: undefined },
    options: {
      type: Object as PropType<Partial<RendererOptions>>,
      default: undefined,
    },
    plugins: {
      type: Array as PropType<RendererPlugin[]>,
      default: () => DEFAULT_PLUGINS,
    },
    class: { type: String, default: undefined },
  },
  setup(props) {
    const container_ref = ref<HTMLDivElement | null>(null);
    let cleanups: Array<() => void> = [];

    const renderer = computed(
      () =>
        new DefaultRenderer(
          build_default_options({
            ...props.options,
            plugins: props.plugins,
          }),
        ),
    );

    const html = computed(() => {
      if (!props.body) return "";
      return renderer.value.render(props.body, {
        author: props.author,
        permlink: props.permlink,
      });
    });

    watch(
      html,
      () => {
        for (const cleanup of cleanups) {
          cleanup();
        }
        cleanups = [];

        nextTick(() => {
          const element = container_ref.value;
          if (!element) return;

          for (const plugin of props.plugins) {
            if (plugin.onMount) {
              const cleanup = plugin.onMount(element);
              if (cleanup) cleanups.push(cleanup);
            }
          }
        });
      },
      { immediate: true },
    );

    onUnmounted(() => {
      for (const cleanup of cleanups) {
        cleanup();
      }
      cleanups = [];
    });

    return () =>
      h("div", {
        ref: container_ref,
        innerHTML: html.value,
        class: props.class,
      });
  },
});

export type HiveContentRendererProps = InstanceType<
  typeof HiveContentRenderer
>["$props"];
