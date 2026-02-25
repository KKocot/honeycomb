export type BalanceCardVariant = "compact" | "default" | "expanded";
export interface BalanceCardProps {
    username: string;
    variant?: BalanceCardVariant;
    class?: string;
}
declare const BalanceCard: import("svelte").Component<BalanceCardProps, {}, "">;
type BalanceCard = ReturnType<typeof BalanceCard>;
export default BalanceCard;
//# sourceMappingURL=balance-card.svelte.d.ts.map