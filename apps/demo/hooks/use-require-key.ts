"use client";

import { useCallback, useState } from "react";
import { useHive, KeyType } from "@/contexts/hive-context";

interface UseRequireKeyOptions {
  requiredKeyType: KeyType;
  reason: string;
  allowSave?: boolean;
}

interface UseRequireKeyResult {
  /**
   * Check if user has required key and trigger escalation if needed.
   * Returns a promise that resolves to true if user has/provides key,
   * or false if user cancels.
   */
  requireKey: () => Promise<boolean>;

  /**
   * Whether an escalation dialog is currently showing
   */
  isPending: boolean;

  /**
   * Whether the user currently has access to this key type
   */
  hasAccess: boolean;
}

/**
 * Hook for components that require a specific key type.
 * Automatically handles key escalation when needed.
 *
 * @example
 * ```tsx
 * function TransferButton() {
 *   const { requireKey, isPending, hasAccess } = useRequireKey({
 *     requiredKeyType: "active",
 *     reason: "Transfer HIVE to another account",
 *   });
 *
 *   const handleTransfer = async () => {
 *     const canProceed = await requireKey();
 *     if (canProceed) {
 *       // User has active key, proceed with transfer
 *       await doTransfer();
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleTransfer} disabled={isPending}>
 *       Transfer
 *     </button>
 *   );
 * }
 * ```
 */
export function useRequireKey(options: UseRequireKeyOptions): UseRequireKeyResult {
  const { user, canUseKeyType, requestKeyEscalation } = useHive();
  const [isPending, setIsPending] = useState(false);

  const hasAccess = canUseKeyType(options.requiredKeyType);

  const requireKey = useCallback(async (): Promise<boolean> => {
    // If user is not logged in, return false
    if (!user) {
      return false;
    }

    // If user already has access to this key type, return true
    if (canUseKeyType(options.requiredKeyType)) {
      return true;
    }

    // Otherwise, request key escalation
    return new Promise<boolean>((resolve) => {
      setIsPending(true);

      requestKeyEscalation({
        requiredKeyType: options.requiredKeyType,
        reason: options.reason,
        allowSave: options.allowSave ?? true,
        onSuccess: () => {
          setIsPending(false);
          resolve(true);
        },
        onCancel: () => {
          setIsPending(false);
          resolve(false);
        },
      });
    });
  }, [user, canUseKeyType, requestKeyEscalation, options]);

  return {
    requireKey,
    isPending,
    hasAccess,
  };
}

/**
 * Key type requirements for common Hive operations
 */
export const KEY_REQUIREMENTS: Record<string, KeyType> = {
  // Posting key operations
  vote: "posting",
  comment: "posting",
  post: "posting",
  follow: "posting",
  mute: "posting",
  reblog: "posting",
  customJson: "posting",

  // Active key operations
  transfer: "active",
  powerUp: "active",
  powerDown: "active",
  delegate: "active",
  claimRewards: "active",
  convertHbd: "active",
  limitOrder: "active",
  cancelOrder: "active",
  witnessVote: "active",
  proposalVote: "active",
  recurrentTransfer: "active",

  // Owner key operations
  updateAuthority: "owner",
  changePassword: "owner",
  accountRecovery: "owner",
};

/**
 * Get the required key type for an operation
 */
export function getRequiredKeyType(operation: keyof typeof KEY_REQUIREMENTS): KeyType {
  return KEY_REQUIREMENTS[operation] || "posting";
}
