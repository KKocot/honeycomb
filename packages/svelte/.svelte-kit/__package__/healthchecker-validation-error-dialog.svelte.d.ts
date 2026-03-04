export interface ValidationErrorDialogProps {
    isOpened: boolean;
    onDialogOpenChange: (isOpened: boolean) => void;
    validatorDetails?: import("@kkocot/honeycomb-core").ValidationErrorDetails;
    clearValidationError: (providerName: string, checkerName: string) => void;
}
declare const HealthcheckerValidationErrorDialog: import("svelte").Component<ValidationErrorDialogProps, {}, "">;
type HealthcheckerValidationErrorDialog = ReturnType<typeof HealthcheckerValidationErrorDialog>;
export default HealthcheckerValidationErrorDialog;
//# sourceMappingURL=healthchecker-validation-error-dialog.svelte.d.ts.map