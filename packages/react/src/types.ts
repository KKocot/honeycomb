"use client";

// ============== Global Types ==============

declare global {
  interface Window {
    hive_keychain?: HiveKeychain;
    peakvault?: PeakVault;
  }
}

// ============== Keychain Types ==============

export interface HiveKeychainResponse {
  success: boolean;
  message?: string;
  result?: string;
  publicKey?: string;
}

export interface HiveKeychain {
  requestSignBuffer(
    username: string,
    message: string,
    keyType: "Posting" | "Active" | "Memo",
    callback: (response: HiveKeychainResponse) => void
  ): void;

  requestVote(
    username: string,
    permlink: string,
    author: string,
    weight: number,
    callback: (response: HiveKeychainResponse) => void
  ): void;

  requestBroadcast(
    username: string,
    operations: unknown[],
    keyType: "Posting" | "Active",
    callback: (response: HiveKeychainResponse) => void
  ): void;
}

// ============== PeakVault Types ==============

export interface PeakVaultResponse {
  success: boolean;
  message?: string;
  result?: string;
}

export interface PeakVault {
  requestSignBuffer(
    username: string,
    message: string,
    keyType: "Posting" | "Active" | "Memo",
    callback: (response: PeakVaultResponse) => void
  ): void;

  requestBroadcast(
    username: string,
    operations: unknown[],
    keyType: "Posting" | "Active",
    callback: (response: PeakVaultResponse) => void
  ): void;
}

// ============== Auth Component Types ==============

export interface LoginProps {
  /** Called when login succeeds with the username */
  onSuccess?: (username: string) => void;
  /** Called when login fails with error */
  onError?: (error: Error) => void;
  /** Additional CSS classes */
  className?: string;
}

// Export to make this a module
export {};
