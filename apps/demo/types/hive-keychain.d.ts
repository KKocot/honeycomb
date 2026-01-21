// Hive Keychain browser extension types
interface KeychainResponse {
  success: boolean;
  result?: string;
  message?: string;
  error?: string;
}

interface HiveKeychain {
  requestSignBuffer: (
    username: string,
    message: string,
    keyType: "Posting" | "Active" | "Memo",
    callback: (response: KeychainResponse) => void
  ) => void;
  requestBroadcast: (
    username: string,
    operations: [string, Record<string, unknown>][],
    keyType: "Posting" | "Active",
    callback: (response: KeychainResponse) => void
  ) => void;
}

interface Window {
  hive_keychain?: HiveKeychain;
}
