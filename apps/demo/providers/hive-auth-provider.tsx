"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  HiveAuthUser,
  HiveAuthContextValue,
  HiveAuthProviderProps,
  HiveLoginResult,
  HiveSigner,
  KeyType,
} from "@/types/auth";

// =============================================================================
// CONTEXT
// =============================================================================

const HiveAuthContext = createContext<HiveAuthContextValue | null>(null);

// Key privilege levels
const KEY_LEVELS: Record<KeyType, number> = {
  posting: 1,
  active: 2,
  owner: 3,
};

// Default storage key
const DEFAULT_STORAGE_KEY = "hive-auth-session";

// =============================================================================
// PROVIDER
// =============================================================================

/**
 * Optional provider for managing Hive authentication state
 *
 * This provider is OPTIONAL. Login components work without it.
 * Use this when you want:
 * - Automatic session persistence
 * - Centralized auth state management
 * - useHiveAuth() hook in child components
 *
 * @example
 * ```tsx
 * // With provider (recommended for full apps)
 * function App() {
 *   return (
 *     <HiveAuthProvider
 *       persistSession
 *       onLogin={(user) => analytics.track('login', user)}
 *     >
 *       <MainContent />
 *     </HiveAuthProvider>
 *   );
 * }
 *
 * // In any child component:
 * function Header() {
 *   const { user, logout } = useHiveAuth();
 *   if (!user) return <LoginButton />;
 *   return <div>@{user.username} <button onClick={logout}>Logout</button></div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Without provider (standalone components)
 * function StandalonePage() {
 *   const [user, setUser] = useState(null);
 *
 *   return (
 *     <HiveKeychainLogin
 *       onSuccess={(result) => setUser(result)}
 *       onError={(err) => console.error(err)}
 *     />
 *   );
 * }
 * ```
 */
export function HiveAuthProvider({
  children,
  persistSession = true,
  storageKey = DEFAULT_STORAGE_KEY,
  onLogin,
  onLogout,
}: HiveAuthProviderProps) {
  const [user, setUser] = useState<HiveAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signer, setSigner] = useState<HiveSigner | null>(null);

  // Load session from storage on mount
  useEffect(() => {
    if (persistSession && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as HiveLoginResult;
          if (parsed.username && parsed.loginMethod) {
            setUser({
              ...parsed,
              signer: undefined, // Signer not persisted
            });
          }
        }
      } catch {
        // Ignore parse errors
      }
    }
    setIsLoading(false);
  }, [persistSession, storageKey]);

  // Login handler
  const login = useCallback(
    (result: HiveLoginResult, newSigner?: HiveSigner) => {
      const authUser: HiveAuthUser = {
        ...result,
        signer: newSigner,
      };

      setUser(authUser);
      setSigner(newSigner || null);

      // Persist to storage (without signer)
      if (persistSession && typeof window !== "undefined") {
        try {
          const toStore: HiveLoginResult = {
            username: result.username,
            loginMethod: result.loginMethod,
            keyType: result.keyType,
            publicKey: result.publicKey,
          };
          localStorage.setItem(storageKey, JSON.stringify(toStore));
        } catch {
          // Ignore storage errors
        }
      }

      onLogin?.(authUser);
    },
    [persistSession, storageKey, onLogin]
  );

  // Logout handler
  const logout = useCallback(async () => {
    // Cleanup signer if exists
    if (signer) {
      try {
        await signer.destroy();
      } catch {
        // Ignore cleanup errors
      }
    }

    setUser(null);
    setSigner(null);

    // Remove from storage
    if (persistSession && typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore storage errors
      }
    }

    onLogout?.();
  }, [signer, persistSession, storageKey, onLogout]);

  // Get signer (throws if not available)
  const getSigner = useCallback((): HiveSigner => {
    if (!signer) {
      throw new Error(
        "No signer available. User may not be logged in or logged in without a signer."
      );
    }
    return signer;
  }, [signer]);

  // Check if user can use a key type
  const canUseKeyType = useCallback(
    (requiredKeyType: KeyType): boolean => {
      if (!user) return false;
      return KEY_LEVELS[user.keyType] >= KEY_LEVELS[requiredKeyType];
    },
    [user]
  );

  const value: HiveAuthContextValue = {
    user,
    isLoading,
    login,
    logout,
    getSigner,
    canUseKeyType,
  };

  return (
    <HiveAuthContext.Provider value={value}>
      {children}
    </HiveAuthContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook to access HiveAuthProvider context
 *
 * Must be used within HiveAuthProvider.
 * For standalone use without provider, use the individual login components
 * with their callback props.
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const { user, logout, canUseKeyType } = useHiveAuth();
 *
 *   if (!user) {
 *     return <Redirect to="/login" />;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>@{user.username}</h1>
 *       <p>Logged in via {user.loginMethod}</p>
 *       <p>Can transfer: {canUseKeyType("active") ? "Yes" : "No"}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useHiveAuth(): HiveAuthContextValue {
  const context = useContext(HiveAuthContext);
  if (!context) {
    throw new Error(
      "useHiveAuth must be used within HiveAuthProvider. " +
      "For standalone use without provider, use the login components' " +
      "callback props (onSuccess, onError) directly."
    );
  }
  return context;
}

/**
 * Hook to check if HiveAuthProvider is available
 * Useful for components that can work both with and without provider
 *
 * @example
 * ```tsx
 * function SmartLoginButton() {
 *   const hasProvider = useHiveAuthOptional();
 *   const providerContext = hasProvider ? useHiveAuth() : null;
 *   const [localUser, setLocalUser] = useState(null);
 *
 *   const handleSuccess = (result) => {
 *     if (providerContext) {
 *       providerContext.login(result);
 *     } else {
 *       setLocalUser(result);
 *     }
 *   };
 *
 *   return <HiveKeychainLogin onSuccess={handleSuccess} />;
 * }
 * ```
 */
export function useHiveAuthOptional(): HiveAuthContextValue | null {
  return useContext(HiveAuthContext);
}
