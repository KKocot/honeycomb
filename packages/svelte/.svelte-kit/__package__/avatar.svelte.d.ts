export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export interface HiveAvatarProps {
    /** Hive username */
    username: string;
    /** Avatar size */
    size?: AvatarSize;
    /** Additional CSS classes */
    class?: string;
    /** Show ring border */
    showBorder?: boolean;
    /** Custom fallback background color */
    fallbackColor?: string;
}
declare const Avatar: import("svelte").Component<HiveAvatarProps, {}, "">;
type Avatar = ReturnType<typeof Avatar>;
export default Avatar;
//# sourceMappingURL=avatar.svelte.d.ts.map