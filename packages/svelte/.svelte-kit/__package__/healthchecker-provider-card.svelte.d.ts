export interface ProviderCardProps {
    providerLink: string;
    disabled: boolean;
    isSelected: boolean;
    isTop: boolean;
    checkerNamesList: string[];
    latency: number | null;
    score: number;
    index: number;
    failedErrorChecks: string[];
    failedValidationChecks: string[];
    isHealthCheckerActive: boolean;
    isProviderValid: boolean;
    switchToProvider: (providerLink: string | null) => void;
    deleteProvider: (provider: string) => void;
    selectValidator: (providerName: string, checkTitle: string) => void;
}
declare const HealthcheckerProviderCard: import("svelte").Component<ProviderCardProps, {}, "">;
type HealthcheckerProviderCard = ReturnType<typeof HealthcheckerProviderCard>;
export default HealthcheckerProviderCard;
//# sourceMappingURL=healthchecker-provider-card.svelte.d.ts.map