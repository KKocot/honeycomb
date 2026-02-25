export type ManabarVariant = "full" | "compact" | "ring";
export interface HiveManabarProps {
    username: string;
    variant?: ManabarVariant;
    showLabels?: boolean;
    showValues?: boolean;
    showCooldown?: boolean;
    class?: string;
}
declare const Manabar: import("svelte").Component<HiveManabarProps, {}, "">;
type Manabar = ReturnType<typeof Manabar>;
export default Manabar;
//# sourceMappingURL=manabar.svelte.d.ts.map