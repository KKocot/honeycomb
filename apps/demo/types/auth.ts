/**
 * Hive UI Authentication Types
 *
 * These types define the contract for authentication components.
 * Components can work standalone (with callbacks) or with HiveAuthProvider.
 */

// =============================================================================
// LOGIN METHODS
// =============================================================================

/**
 * Supported login methods
 */
export type LoginMethod =
  | "keychain"    // Hive Keychain browser extension
  | "peakvault"   // PeakVault browser extension
  | "hiveauth"    // HiveAuth mobile app (QR code)
  | "hbauth"      // HB-Auth safe local storage
  | "wif";        // Direct WIF key entry (development)

/**
 * Key types for Hive blockchain operations
 */
export type KeyType = "posting" | "active" | "owner";

// =============================================================================
// LOGIN RESULT
// =============================================================================

/**
 * Successful login result returned by all login components
 */
export interface HiveLoginResult {
  /** Hive username (without @) */
  username: string;
  /** Method used to authenticate */
  loginMethod: LoginMethod;
  /** Type of key used for authentication */
  keyType: KeyType;
  /** Public key if available (for verification) */
  publicKey?: string;
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

/**
 * Typed error codes for better error handling
 */
export type HiveAuthErrorCode =
  | "EXTENSION_NOT_FOUND"     // Keychain/PeakVault not installed
  | "EXTENSION_LOCKED"        // Extension is locked
  | "USER_REJECTED"           // User cancelled the operation
  | "INVALID_USERNAME"        // Username doesn't exist on chain
  | "INVALID_KEY"             // Wrong key or invalid WIF format
  | "KEY_MISMATCH"            // Key doesn't match account
  | "NETWORK_ERROR"           // Failed to connect to blockchain
  | "TIMEOUT"                 // Operation timed out
  | "ALREADY_LOGGED_IN"       // User already authenticated (HB-Auth)
  | "UNKNOWN";                // Unknown error

/**
 * Structured error for auth operations
 */
export interface HiveAuthError {
  code: HiveAuthErrorCode;
  message: string;
  /** Original error if available */
  cause?: Error;
  /** Whether operation can be retried */
  retryable: boolean;
}

/**
 * Create a HiveAuthError from any error
 */
export function createAuthError(
  code: HiveAuthErrorCode,
  message: string,
  cause?: Error,
  retryable = false
): HiveAuthError {
  return { code, message, cause, retryable };
}

/**
 * Map common error messages to HiveAuthError
 */
export function mapErrorToAuthError(error: unknown): HiveAuthError {
  const message = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error ? error : undefined;

  // Extension not found
  if (message.includes("not found") || message.includes("not installed") || message.includes("not detected")) {
    return createAuthError("EXTENSION_NOT_FOUND", message, cause, false);
  }

  // User rejected
  if (message.includes("cancel") || message.includes("reject") || message.includes("denied")) {
    return createAuthError("USER_REJECTED", message, cause, true);
  }

  // Invalid key
  if (message.includes("invalid") && (message.includes("key") || message.includes("WIF"))) {
    return createAuthError("INVALID_KEY", message, cause, true);
  }

  // Network errors
  if (message.includes("network") || message.includes("connect") || message.includes("timeout")) {
    return createAuthError("NETWORK_ERROR", message, cause, true);
  }

  return createAuthError("UNKNOWN", message, cause, true);
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Common props for all login components
 * Components use callbacks for standalone use (no provider required)
 */
export interface HiveLoginComponentProps {
  /** Called when login succeeds */
  onSuccess: (result: HiveLoginResult) => void;
  /** Called when login fails */
  onError?: (error: HiveAuthError) => void;
  /** Called when loading state changes */
  onPending?: (isPending: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for Keychain login component
 */
export interface HiveKeychainLoginProps extends HiveLoginComponentProps {
  /** Pre-filled username */
  defaultUsername?: string;
  /** Key type to use for authentication (default: posting) */
  keyType?: KeyType;
}

/**
 * Props for PeakVault login component
 */
export interface HivePeakVaultLoginProps extends HiveLoginComponentProps {
  /** Pre-filled username */
  defaultUsername?: string;
  /** Key type to use for authentication (default: posting) */
  keyType?: KeyType;
}

/**
 * Props for HiveAuth login component
 */
export interface HiveAuthLoginProps extends HiveLoginComponentProps {
  /** Pre-filled username */
  defaultUsername?: string;
  /** App name shown in HiveAuth mobile app */
  appName?: string;
  /** Key type to use for authentication (default: posting) */
  keyType?: KeyType;
}

/**
 * Props for HB-Auth login component
 */
export interface HiveHBAuthLoginProps extends HiveLoginComponentProps {
  /** Pre-filled username */
  defaultUsername?: string;
  /** Key type to use for authentication (default: posting) */
  keyType?: KeyType;
}

/**
 * Props for WIF login component
 */
export interface HiveWIFLoginProps extends HiveLoginComponentProps {
  /** Pre-filled username */
  defaultUsername?: string;
  /** Key type to use for authentication (default: posting) */
  keyType?: KeyType;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/**
 * Return type for headless auth hooks
 */
export interface UseHiveAuthMethodReturn {
  /** Whether the auth method is available (extension installed, etc.) */
  isAvailable: boolean | null;
  /** Whether we're checking availability */
  isChecking: boolean;
  /** Whether auth is in progress */
  isAuthenticating: boolean;
  /** Current error if any */
  error: HiveAuthError | null;
  /** Perform authentication */
  authenticate: (username: string) => Promise<HiveLoginResult>;
  /** Clear error state */
  clearError: () => void;
}

// =============================================================================
// SIGNER INTERFACE
// =============================================================================

/**
 * Interface for signing operations after login
 * Each login method can provide a signer for subsequent operations
 */
export interface HiveSigner {
  /** Login method this signer belongs to */
  loginMethod: LoginMethod;
  /** Username this signer is for */
  username: string;
  /** Key type this signer can use */
  keyType: KeyType;

  /**
   * Sign a challenge/message (for login verification)
   */
  signChallenge(message: string): Promise<string>;

  /**
   * Sign and broadcast a transaction
   */
  broadcastOperations(
    operations: [string, Record<string, unknown>][]
  ): Promise<{ success: boolean; txId?: string; error?: string }>;

  /**
   * Clean up (logout from HB-Auth, etc.)
   */
  destroy(): Promise<void>;
}

// =============================================================================
// PROVIDER TYPES
// =============================================================================

/**
 * User state in HiveAuthProvider
 */
export interface HiveAuthUser extends HiveLoginResult {
  /** Signer instance for this user */
  signer?: HiveSigner;
}

/**
 * HiveAuthProvider context value
 */
export interface HiveAuthContextValue {
  /** Current authenticated user */
  user: HiveAuthUser | null;
  /** Whether auth state is loading (e.g., restoring session) */
  isLoading: boolean;
  /** Login with result from any login component */
  login: (result: HiveLoginResult, signer?: HiveSigner) => void;
  /** Logout current user */
  logout: () => Promise<void>;
  /** Get current signer (throws if not logged in) */
  getSigner: () => HiveSigner;
  /** Check if user can use a specific key type */
  canUseKeyType: (keyType: KeyType) => boolean;
}

/**
 * Props for HiveAuthProvider
 */
export interface HiveAuthProviderProps {
  children: React.ReactNode;
  /** Persist session to localStorage (default: true) */
  persistSession?: boolean;
  /** Storage key for session (default: "hive-auth-session") */
  storageKey?: string;
  /** Called when user logs in */
  onLogin?: (user: HiveAuthUser) => void;
  /** Called when user logs out */
  onLogout?: () => void;
}
