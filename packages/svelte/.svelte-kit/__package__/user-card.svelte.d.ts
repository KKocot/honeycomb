export type UserCardVariant = "compact" | "default" | "expanded";
export interface UserCardProps {
    /** Hive username */
    username: string;
    /** Card display style */
    variant?: UserCardVariant;
    /** Show post count and balances */
    showStats?: boolean;
    /** Additional CSS classes */
    class?: string;
}
declare const UserCard: import("svelte").Component<UserCardProps, {}, "">;
type UserCard = ReturnType<typeof UserCard>;
export default UserCard;
//# sourceMappingURL=user-card.svelte.d.ts.map