/**
 * HB-Auth Singleton Service
 *
 * Based on denser's implementation - ensures only ONE OnlineClient instance
 * is created and shared across the entire application.
 *
 * This prevents issues where:
 * - Registering a key in login component
 * - Then signing in useBroadcast with a NEW client
 * - Results in "key not found" or "wrong password" errors
 */

import type { OnlineClient, ClientOptions, AuthUser, AuthStatus, KeyAuthorityType } from "@hiveio/hb-auth";

// Alias KeyType to match the library's KeyAuthorityType
export type KeyType = KeyAuthorityType;

// Module-level singleton state
let onlineClientPromise: Promise<OnlineClient> | undefined = undefined;
let onlineClient: OnlineClient | undefined = undefined;
let initializationError: Error | null = null;

const DEFAULT_OPTIONS: ClientOptions = {
  workerUrl: "/auth/worker.js",
  node: "https://api.openhive.network",
  chainId: "beeab0de00000000000000000000000000000000000000000000000000000000",
};

/**
 * Initialize and get the singleton OnlineClient instance.
 * Safe to call multiple times - returns the same promise/instance.
 */
export async function getOnlineClient(options?: Partial<ClientOptions>): Promise<OnlineClient> {
  // If we already have a client, return it
  if (onlineClient) {
    console.log("[HBAuth Service] Returning existing client instance");
    return onlineClient;
  }

  // If initialization is in progress, wait for it
  if (onlineClientPromise) {
    console.log("[HBAuth Service] Waiting for existing initialization...");
    return onlineClientPromise;
  }

  // If previous initialization failed, throw that error
  if (initializationError) {
    console.log("[HBAuth Service] Previous initialization failed, rethrowing error");
    throw initializationError;
  }

  // Start new initialization
  console.log("[HBAuth Service] Creating singleton OnlineClient...");

  onlineClientPromise = (async () => {
    try {
      const { OnlineClient } = await import("@hiveio/hb-auth");

      const clientOptions: ClientOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
      };

      console.log("[HBAuth Service] Initializing with options:", {
        workerUrl: clientOptions.workerUrl,
        node: clientOptions.node,
      });

      const client = new OnlineClient(clientOptions);
      await client.initialize();

      onlineClient = client;
      console.log("[HBAuth Service] OnlineClient initialized successfully");

      return client;
    } catch (error) {
      // Store error and clear promise so we can retry
      initializationError = error instanceof Error ? error : new Error(String(error));
      onlineClientPromise = undefined;
      console.error("[HBAuth Service] Initialization failed:", initializationError.message);
      throw initializationError;
    }
  })();

  return onlineClientPromise;
}

/**
 * Check if user has registered keys stored locally.
 */
export async function getRegisteredUser(username: string): Promise<AuthUser | null> {
  const normalizedUsername = username.toLowerCase().trim();
  console.log(`[HBAuth Service] Checking registered user: ${normalizedUsername}`);

  try {
    const client = await getOnlineClient();
    const result = await client.getRegisteredUserByUsername(normalizedUsername);
    const registeredTypes = result?.registeredKeyTypes;

    if (registeredTypes && registeredTypes.length > 0) {
      console.log(`[HBAuth Service] Found registered keys for ${normalizedUsername}:`, registeredTypes);
      return result;
    }

    console.log(`[HBAuth Service] No registered keys for ${normalizedUsername}`);
    return null;
  } catch (error) {
    console.error(`[HBAuth Service] Error checking user ${normalizedUsername}:`, error);
    return null;
  }
}

/**
 * Check if user has a specific key type registered.
 */
export async function hasKeyType(username: string, keyType: KeyType): Promise<boolean> {
  const user = await getRegisteredUser(username);
  const hasKey = user?.registeredKeyTypes?.includes(keyType) ?? false;
  console.log(`[HBAuth Service] User ${username} has ${keyType} key: ${hasKey}`);
  return hasKey;
}

/**
 * Register a new key for the user.
 */
export async function registerKey(
  username: string,
  password: string,
  privateKey: string,
  keyType: KeyType
): Promise<AuthStatus> {
  const normalizedUsername = username.toLowerCase().trim();
  console.log(`[HBAuth Service] Registering ${keyType} key for ${normalizedUsername}...`);

  const client = await getOnlineClient();
  const result = await client.register(normalizedUsername, password, privateKey, keyType);

  console.log(`[HBAuth Service] Registration result for ${normalizedUsername}:`, result.ok ? "SUCCESS" : "FAILED");
  if (!result.ok) {
    console.error(`[HBAuth Service] Registration error:`, result.error);
  }

  return result;
}

/**
 * Authenticate (unlock) user's stored key.
 */
export async function authenticate(
  username: string,
  password: string,
  keyType: KeyType
): Promise<AuthStatus> {
  const normalizedUsername = username.toLowerCase().trim();
  console.log(`[HBAuth Service] Authenticating ${normalizedUsername} with ${keyType} key...`);

  const client = await getOnlineClient();
  const result = await client.authenticate(normalizedUsername, password, keyType);

  console.log(`[HBAuth Service] Authentication result for ${normalizedUsername}:`, result.ok ? "SUCCESS" : "FAILED");
  if (!result.ok) {
    console.error(`[HBAuth Service] Authentication error:`, result.error);
  }

  return result;
}

/**
 * Check if user is authenticated and ready to sign.
 * Returns true if user is unlocked and can sign without password.
 * Returns false if user needs to authenticate first.
 * Throws if user is not registered at all.
 */
export async function checkAuth(username: string, keyType: KeyType): Promise<boolean> {
  const normalizedUsername = username.toLowerCase().trim();
  console.log(`[HBAuth Service] checkAuth for ${normalizedUsername} with ${keyType} key...`);

  const client = await getOnlineClient();
  const auth = await client.getRegisteredUserByUsername(normalizedUsername);

  console.log(`[HBAuth Service] checkAuth - auth object:`, JSON.stringify(auth, null, 2));

  if (!auth) {
    const message = `Auth for user ${normalizedUsername} not found. Hint: add ${keyType} key to safe storage.`;
    console.error(`[HBAuth Service] ${message}`);
    throw new Error(message);
  }

  if (auth.unlocked) {
    console.log(`[HBAuth Service] User ${normalizedUsername} is UNLOCKED, ready to sign`);
    return true;
  } else {
    console.log(`[HBAuth Service] User ${normalizedUsername} is LOCKED, needs password to unlock`);
    return false;
  }
}

/**
 * Sign a digest with user's key.
 */
export async function signDigest(
  username: string,
  digest: string,
  keyType: KeyType
): Promise<string> {
  const normalizedUsername = username.toLowerCase().trim();
  console.log(`[HBAuth Service] Signing digest for ${normalizedUsername} with ${keyType} key...`);

  const client = await getOnlineClient();
  const signature = await client.sign(normalizedUsername, digest, keyType);

  console.log(`[HBAuth Service] Signature obtained for ${normalizedUsername}`);
  return signature;
}

/**
 * Get the raw client instance (for advanced use cases).
 * Prefer using the helper functions above.
 */
export async function getRawClient(): Promise<OnlineClient> {
  return getOnlineClient();
}

/**
 * Reset the singleton (for testing or error recovery).
 * Forces a new client to be created on next getOnlineClient() call.
 */
export function resetClient(): void {
  console.log("[HBAuth Service] Resetting client instance");
  onlineClient = undefined;
  onlineClientPromise = undefined;
  initializationError = null;
}
