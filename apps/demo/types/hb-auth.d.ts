/**
 * Type declarations for @hiveio/hb-auth
 *
 * This is a stub declaration file that allows the code to compile
 * even when @hiveio/hb-auth is not installed.
 *
 * When the package is installed, its own types will take precedence.
 */

declare module "@hiveio/hb-auth" {
  export type KeyAuthorityType = "posting" | "active" | "owner";

  export interface ClientOptions {
    workerUrl?: string;
    storageType?: "indexeddb" | "localstorage";
    chainId?: string;
    node?: string;
    sessionTimeout?: number;
  }

  export interface RegisteredUser {
    username: string;
    registeredKeyTypes: KeyAuthorityType[];
    unlocked: boolean;
    loggedInKeyType?: KeyAuthorityType;
  }

  export class AuthorizationError extends Error {
    message: string;
  }

  export interface AuthStatus {
    ok: boolean;
    error?: AuthorizationError | null;
  }

  export interface AuthUser {
    username: string;
    unlocked: boolean;
    authorized: boolean;
    loggedInKeyType: KeyAuthorityType | undefined;
    registeredKeyTypes: KeyAuthorityType[];
  }

  export class OnlineClient {
    constructor(options?: ClientOptions);
    initialize(): Promise<OnlineClient>;
    getRegisteredUsers(): Promise<AuthUser[]>;
    getRegisteredUserByUsername(username: string): Promise<AuthUser | null>;
    authenticate(
      username: string,
      password: string,
      keyType: KeyAuthorityType
    ): Promise<AuthStatus>;
    register(
      username: string,
      password: string,
      wifKey: string,
      keyType: KeyAuthorityType,
      strict?: boolean
    ): Promise<AuthStatus>;
    logout(username: string): Promise<void>;
    logoutAll(): Promise<void>;
    lock(): Promise<void>;
    unlock(username: string, password: string): Promise<void>;
    sign(username: string, digest: string, keyType: KeyAuthorityType): Promise<string>;
    importKey(username: string, wifKey: string, keyType: KeyAuthorityType): Promise<string>;
    setSessionEndCallback(cb: () => Promise<void>): Promise<void>;
  }

  export class OfflineClient {
    constructor(options?: ClientOptions);
    initialize(): Promise<OfflineClient>;
  }
}
