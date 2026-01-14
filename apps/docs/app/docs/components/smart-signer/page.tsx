import Link from "next/link";
import { ArrowRight, Info, Shield, Key, Smartphone, Globe, Wallet, HardDrive, Lock, FileKey } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  types: `// types/smart-signer.ts

export enum LoginType {
  keychain = "keychain",
  peakvault = "peakvault",
  hiveauth = "hiveauth",
  hivesigner = "hivesigner",
  hbauth = "hbauth",      // Safe Storage - encrypted local wallet
  metamask = "metamask",  // MetaMask with Hive Snap
  google = "google",      // Google Drive wallet backup
  wif = "wif",            // Direct WIF key entry
}

export enum KeyType {
  posting = "posting",
  active = "active",
}

export interface SignerUser {
  username: string;
  loginType: LoginType;
  keyType: KeyType;
  publicKey?: string;
}

export interface SignerOptions {
  username: string;
  loginType: LoginType;
  keyType: KeyType;
}

export interface SignChallengeParams {
  message: string;
  password?: string;
}

export interface SignTransactionParams {
  operations: any[];
  keyType?: KeyType;
}`,
  signerInterface: `// lib/signer/signer.ts

import { LoginType, KeyType, SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

export interface SignerOptions {
  username: string;
  loginType: LoginType;
  keyType: KeyType;
}

/**
 * Abstract base class for all signers.
 * Each signer implementation handles a specific authentication method.
 */
export abstract class Signer {
  protected username: string;
  protected loginType: LoginType;
  protected keyType: KeyType;

  constructor({ username, loginType, keyType }: SignerOptions) {
    this.username = username;
    this.loginType = loginType;
    this.keyType = keyType;
  }

  /**
   * Signs a challenge message with the user's private key.
   * Used for authentication verification.
   */
  abstract signChallenge(params: SignChallengeParams): Promise<string>;

  /**
   * Signs and broadcasts a transaction to the Hive blockchain.
   */
  abstract signTransaction(params: SignTransactionParams): Promise<void>;

  /**
   * Cleans up resources (logout, clear storage, etc.)
   */
  abstract destroy(): Promise<void>;
}`,
  signerKeychain: `// lib/signer/signer-keychain.ts

import { Signer, SignerOptions } from "./signer";
import { SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

declare global {
  interface Window {
    hive_keychain?: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: "Posting" | "Active" | "Memo",
        callback: (response: any) => void
      ) => void;
      requestBroadcast: (
        username: string,
        operations: any[],
        keyType: "Posting" | "Active",
        callback: (response: any) => void
      ) => void;
    };
  }
}

export function hasKeychain(): boolean {
  return typeof window !== "undefined" &&
    !!window.hive_keychain?.requestSignBuffer &&
    !!window.hive_keychain?.requestBroadcast;
}

export class SignerKeychain extends Signer {
  constructor(options: SignerOptions) {
    super(options);
  }

  async signChallenge({ message }: SignChallengeParams): Promise<string> {
    if (!window.hive_keychain) {
      throw new Error("Hive Keychain not installed");
    }

    return new Promise((resolve, reject) => {
      window.hive_keychain!.requestSignBuffer(
        this.username,
        message,
        this.keyType === "active" ? "Active" : "Posting",
        (response) => {
          if (response.success) {
            resolve(response.result);
          } else {
            reject(new Error(response.message || "Keychain sign failed"));
          }
        }
      );
    });
  }

  async signTransaction({ operations }: SignTransactionParams): Promise<void> {
    if (!window.hive_keychain) {
      throw new Error("Hive Keychain not installed");
    }

    return new Promise((resolve, reject) => {
      window.hive_keychain!.requestBroadcast(
        this.username,
        operations,
        this.keyType === "active" ? "Active" : "Posting",
        (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.message || "Broadcast failed"));
          }
        }
      );
    });
  }

  async destroy(): Promise<void> {
    // Keychain doesn't require cleanup
  }
}`,
  signerPeakVault: `// lib/signer/signer-peakvault.ts

import { Signer, SignerOptions } from "./signer";
import { SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

declare global {
  interface Window {
    peakvault?: {
      requestSignBuffer: (
        username: string,
        message: string,
        keyType: "Posting" | "Active" | "Memo",
        callback: (response: any) => void
      ) => void;
      requestBroadcast: (
        username: string,
        operations: any[],
        keyType: "Posting" | "Active",
        callback: (response: any) => void
      ) => void;
    };
  }
}

export function hasPeakVault(): boolean {
  return typeof window !== "undefined" && !!window.peakvault;
}

export class SignerPeakVault extends Signer {
  constructor(options: SignerOptions) {
    super(options);
  }

  async signChallenge({ message }: SignChallengeParams): Promise<string> {
    if (!window.peakvault) {
      throw new Error("PeakVault not installed");
    }

    return new Promise((resolve, reject) => {
      window.peakvault!.requestSignBuffer(
        this.username,
        message,
        this.keyType === "active" ? "Active" : "Posting",
        (response) => {
          if (response.success) {
            resolve(response.result);
          } else {
            reject(new Error(response.message || "PeakVault sign failed"));
          }
        }
      );
    });
  }

  async signTransaction({ operations }: SignTransactionParams): Promise<void> {
    if (!window.peakvault) {
      throw new Error("PeakVault not installed");
    }

    return new Promise((resolve, reject) => {
      window.peakvault!.requestBroadcast(
        this.username,
        operations,
        this.keyType === "active" ? "Active" : "Posting",
        (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.message || "Broadcast failed"));
          }
        }
      );
    });
  }

  async destroy(): Promise<void> {}
}`,
  signerHiveAuth: `// lib/signer/signer-hiveauth.ts
// Requires: npm install hive-auth-client

import { Signer, SignerOptions } from "./signer";
import { SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

// HiveAuth uses QR code / mobile app authentication
// See: https://hiveauth.com/

interface HiveAuthData {
  username: string;
  token: string;
  expire: number;
  key: string;
}

const STORAGE_KEY = "hiveAuthData";

export class SignerHiveAuth extends Signer {
  private hiveAuthData: HiveAuthData | null = null;

  constructor(options: SignerOptions) {
    super(options);
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.hiveAuthData = JSON.parse(data);
      }
    } catch {
      // Invalid data
    }
  }

  private saveToStorage(data: HiveAuthData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    this.hiveAuthData = data;
  }

  async signChallenge({ message }: SignChallengeParams): Promise<string> {
    // HiveAuth requires the hive-auth-client library
    // This is a simplified example - full implementation needs:
    // 1. Initialize HiveAuth client
    // 2. Generate QR code for user to scan
    // 3. Wait for mobile app confirmation
    // 4. Receive signature

    throw new Error(
      "HiveAuth requires hive-auth-client setup. " +
      "Install with: npm install hive-auth-client"
    );

    // Example with hive-auth-client:
    // const HiveAuth = require('hive-auth-client');
    // const auth = new HiveAuth({ ... });
    // return auth.challenge(this.username, message, this.keyType);
  }

  async signTransaction({ operations }: SignTransactionParams): Promise<void> {
    throw new Error("HiveAuth signTransaction requires hive-auth-client setup");
  }

  async destroy(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    this.hiveAuthData = null;
  }
}`,
  signerHBAuth: `// lib/signer/signer-hbauth.ts
// Safe Storage - encrypted local wallet using @hiveio/hb-auth
// Requires: npm install @hiveio/hb-auth

import { Signer, SignerOptions } from "./signer";
import { SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

// HB-Auth provides encrypted key storage in browser
// Keys are protected by a user-chosen password
// See: https://gitlab.syncad.com/hive/hb-auth

interface HBAuthClient {
  authenticate(username: string, password: string, keyType: string): Promise<{ ok: boolean }>;
  sign(username: string, digest: string, keyType: string): Promise<string>;
  logout(username: string): Promise<void>;
  getRegisteredUsers(): Promise<any[]>;
}

// Note: This requires @hiveio/hb-auth worker to be set up
// The worker handles encryption/decryption in a separate thread

export class SignerHBAuth extends Signer {
  private client: HBAuthClient | null = null;
  private passwordPromise: Promise<string> | null = null;

  constructor(options: SignerOptions) {
    super(options);
  }

  private async getClient(): Promise<HBAuthClient> {
    if (!this.client) {
      // Initialize HB-Auth client
      // This requires setting up the hb-auth worker
      throw new Error(
        "HB-Auth requires @hiveio/hb-auth setup. " +
        "See: https://gitlab.syncad.com/hive/hb-auth"
      );
    }
    return this.client;
  }

  async signChallenge({ message, password }: SignChallengeParams): Promise<string> {
    const client = await this.getClient();

    // Hash the message
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Authenticate if password provided
    if (password) {
      const authStatus = await client.authenticate(
        this.username,
        password,
        this.keyType
      );
      if (!authStatus.ok) {
        throw new Error("Authentication failed");
      }
    }

    // Sign the digest
    return client.sign(this.username, hashHex, this.keyType);
  }

  async signTransaction({ operations }: SignTransactionParams): Promise<void> {
    // HB-Auth transaction signing requires @hiveio/wax integration
    throw new Error("HB-Auth signTransaction requires full setup");
  }

  async destroy(): Promise<void> {
    if (this.client) {
      await this.client.logout(this.username);
    }
  }
}`,
  signerMetaMask: `// lib/signer/signer-metamask.ts
// MetaMask with Hive Snap
// Requires: npm install @hiveio/wax-signers-metamask

import { Signer, SignerOptions } from "./signer";
import { SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

// MetaMask Hive Snap allows using MetaMask for Hive authentication
// See: https://snaps.metamask.io/

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export async function hasMetaMask(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum?.isMetaMask) {
    return false;
  }
  // Check if MetaMask is available and has Snap support
  try {
    await window.ethereum.request({ method: "wallet_getSnaps" });
    return true;
  } catch {
    return false;
  }
}

export class SignerMetaMask extends Signer {
  private snapInstalled = false;

  constructor(options: SignerOptions) {
    super(options);
  }

  private async ensureSnapInstalled(): Promise<void> {
    if (this.snapInstalled) return;

    // Install Hive Snap if not present
    // The actual snap ID would come from @hiveio/wax-signers-metamask
    throw new Error(
      "MetaMask Hive Snap requires @hiveio/wax-signers-metamask. " +
      "Install with: npm install @hiveio/wax-signers-metamask"
    );
  }

  async signChallenge({ message }: SignChallengeParams): Promise<string> {
    if (!window.ethereum?.isMetaMask) {
      throw new Error("MetaMask not installed");
    }

    await this.ensureSnapInstalled();

    // With @hiveio/wax-signers-metamask:
    // const provider = await MetaMaskProvider.for(0, this.keyType);
    // return provider.encryptData(message, this.username);

    throw new Error("MetaMask signing requires @hiveio/wax-signers-metamask");
  }

  async signTransaction({ operations }: SignTransactionParams): Promise<void> {
    throw new Error("MetaMask transaction signing requires full setup");
  }

  async destroy(): Promise<void> {}
}`,
  signerGoogleDrive: `// lib/signer/signer-google-drive.ts
// Google Drive wallet backup
// Requires: npm install @hiveio/wax-signers-external

import { Signer, SignerOptions } from "./signer";
import { SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

// Google Drive signer stores encrypted keys in Google Drive
// This provides cloud backup while keeping keys encrypted
// See: https://gitlab.syncad.com/hive/wax/-/tree/develop/examples/ts/signers-external

const REFRESH_TOKEN_KEY = "google_refresh_token";
const PASSWORD_KEY = "gdrive_signer_password";

export function hasGoogleDrive(): boolean {
  // Check if Google Drive client ID is configured
  return !!process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
}

export class SignerGoogleDrive extends Signer {
  private accessToken: string | null = null;
  private walletPassword: string | null = null;

  constructor(options: SignerOptions) {
    super(options);
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    // Check for saved refresh token
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      // Exchange refresh token for access token via your backend
      const response = await fetch("/api/google-drive/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.accessToken;
        return this.accessToken;
      }
    }

    // Initiate OAuth flow
    throw new Error(
      "Google Drive authentication requires OAuth setup. " +
      "Configure NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID"
    );
  }

  async signChallenge({ message, password }: SignChallengeParams): Promise<string> {
    // Google Drive signer requires:
    // 1. OAuth access token
    // 2. Wallet file in Google Drive
    // 3. Password to decrypt wallet

    throw new Error(
      "Google Drive signing requires @hiveio/wax-signers-external. " +
      "Install with: npm install @hiveio/wax-signers-external"
    );
  }

  async signTransaction({ operations }: SignTransactionParams): Promise<void> {
    throw new Error("Google Drive transaction signing requires full setup");
  }

  async destroy(): Promise<void> {
    this.accessToken = null;
    this.walletPassword = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PASSWORD_KEY);
  }
}`,
  signerWif: `// lib/signer/signer-wif.ts
// Direct WIF (Wallet Import Format) key entry
// WARNING: Less secure - key is handled directly by the app

import { Signer, SignerOptions } from "./signer";
import { SignChallengeParams, SignTransactionParams } from "@/types/smart-signer";

// WIF signer allows direct private key entry
// Keys can optionally be stored in localStorage (encrypted recommended)
// This method is less secure than browser extensions

export class SignerWif extends Signer {
  private storedWif: string | null = null;

  constructor(options: SignerOptions) {
    super(options);
    this.loadStoredKey();
  }

  private get storageKey(): string {
    return \`wif.\${this.username}@\${this.keyType}\`;
  }

  private loadStoredKey(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.storedWif = JSON.parse(stored);
      }
    } catch {
      // Invalid stored data
    }
  }

  async signChallenge({ message, password }: SignChallengeParams): Promise<string> {
    const wif = password || this.storedWif;

    if (!wif) {
      throw new Error("No WIF key provided. Pass password parameter or store key first.");
    }

    // WIF signing requires @hiveio/wax or similar library
    // to convert WIF to private key and sign

    throw new Error(
      "WIF signing requires @hiveio/wax for cryptographic operations. " +
      "Consider using Keychain or PeakVault for better security."
    );

    // Example with @hiveio/wax:
    // const wax = await createHiveChain();
    // const signature = await wax.signDigest(digest, wif);
    // return signature;
  }

  async signTransaction({ operations }: SignTransactionParams): Promise<void> {
    throw new Error("WIF transaction signing requires @hiveio/wax setup");
  }

  async storeKey(wif: string): Promise<void> {
    // WARNING: Storing WIF in localStorage is not recommended
    // Consider using HB-Auth (Safe Storage) instead
    localStorage.setItem(this.storageKey, JSON.stringify(wif));
    this.storedWif = wif;
  }

  async destroy(): Promise<void> {
    localStorage.removeItem(this.storageKey);
    this.storedWif = null;
  }
}`,
  signerFactory: `// lib/signer/get-signer.ts

import { LoginType, SignerOptions } from "@/types/smart-signer";
import { Signer } from "./signer";
import { SignerKeychain, hasKeychain } from "./signer-keychain";
import { SignerPeakVault, hasPeakVault } from "./signer-peakvault";
import { SignerHiveAuth } from "./signer-hiveauth";
import { SignerHBAuth } from "./signer-hbauth";
import { SignerMetaMask, hasMetaMask } from "./signer-metamask";
import { SignerGoogleDrive, hasGoogleDrive } from "./signer-google-drive";
import { SignerWif } from "./signer-wif";

// Registry of all available signers
const signers: Record<LoginType, new (options: SignerOptions) => Signer> = {
  [LoginType.keychain]: SignerKeychain,
  [LoginType.peakvault]: SignerPeakVault,
  [LoginType.hiveauth]: SignerHiveAuth,
  [LoginType.hivesigner]: SignerHiveAuth, // Hivesigner uses OAuth redirect
  [LoginType.hbauth]: SignerHBAuth,
  [LoginType.metamask]: SignerMetaMask,
  [LoginType.google]: SignerGoogleDrive,
  [LoginType.wif]: SignerWif,
};

/**
 * Creates a signer instance for the given login type.
 *
 * @param options - Signer configuration
 * @returns Signer instance
 */
export function getSigner(options: SignerOptions): Signer {
  const SignerClass = signers[options.loginType];
  if (!SignerClass) {
    throw new Error(\`Unsupported login type: \${options.loginType}\`);
  }
  return new SignerClass(options);
}

/**
 * Check availability of each authentication method.
 * Some methods require browser extensions or configuration.
 */
export async function checkAvailability(): Promise<Record<LoginType, boolean>> {
  const metamaskAvailable = await hasMetaMask().catch(() => false);

  return {
    [LoginType.keychain]: hasKeychain(),
    [LoginType.peakvault]: hasPeakVault(),
    [LoginType.hiveauth]: true, // Always available (mobile app)
    [LoginType.hivesigner]: true, // Always available (web OAuth)
    [LoginType.hbauth]: true, // Always available (requires setup)
    [LoginType.metamask]: metamaskAvailable,
    [LoginType.google]: hasGoogleDrive(),
    [LoginType.wif]: true, // Always available (not recommended)
  };
}

// Re-export availability checks
export { hasKeychain, hasPeakVault, hasMetaMask, hasGoogleDrive };`,
  component: `"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Key, Smartphone, Globe, Wallet, HardDrive,
  Lock, FileKey, Loader2, AtSign, AlertTriangle
} from "lucide-react";
import { LoginType, KeyType, SignerUser } from "@/types/smart-signer";
import { getSigner, checkAvailability } from "@/lib/signer/get-signer";

const loginFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(16, "Username must be at most 16 characters")
    .regex(/^[a-z][a-z0-9.-]*$/, "Invalid username format"),
  loginType: z.nativeEnum(LoginType),
  keyType: z.nativeEnum(KeyType),
  remember: z.boolean(),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

interface SmartSignerLoginProps {
  onSuccess?: (user: SignerUser) => void;
  onError?: (error: Error) => void;
  enabledMethods?: LoginType[];
  defaultKeyType?: KeyType;
  className?: string;
}

interface LoginMethod {
  type: LoginType;
  label: string;
  icon: React.ReactNode;
  description: string;
  warning?: string;
}

const loginMethods: LoginMethod[] = [
  {
    type: LoginType.keychain,
    label: "Hive Keychain",
    icon: <Key className="h-5 w-5" />,
    description: "Browser extension (recommended)",
  },
  {
    type: LoginType.peakvault,
    label: "PeakVault",
    icon: <Wallet className="h-5 w-5" />,
    description: "PeakD browser extension",
  },
  {
    type: LoginType.hbauth,
    label: "Safe Storage",
    icon: <Lock className="h-5 w-5" />,
    description: "Encrypted local wallet (HB-Auth)",
  },
  {
    type: LoginType.hiveauth,
    label: "HiveAuth",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Mobile app authentication",
  },
  {
    type: LoginType.metamask,
    label: "MetaMask",
    icon: <HardDrive className="h-5 w-5" />,
    description: "Ethereum wallet with Hive Snap",
  },
  {
    type: LoginType.google,
    label: "Google Drive",
    icon: <Globe className="h-5 w-5" />,
    description: "Cloud-backed encrypted wallet",
  },
  {
    type: LoginType.hivesigner,
    label: "Hivesigner",
    icon: <Globe className="h-5 w-5" />,
    description: "OAuth-style web login",
  },
  {
    type: LoginType.wif,
    label: "Private Key (WIF)",
    icon: <FileKey className="h-5 w-5" />,
    description: "Direct key entry",
    warning: "Less secure - use only if necessary",
  },
];

export function SmartSignerLogin({
  onSuccess,
  onError,
  enabledMethods = Object.values(LoginType),
  defaultKeyType = KeyType.posting,
  className = "",
}: SmartSignerLoginProps) {
  const [availability, setAvailability] = useState<Record<LoginType, boolean>>({
    [LoginType.keychain]: false,
    [LoginType.peakvault]: false,
    [LoginType.hiveauth]: true,
    [LoginType.hivesigner]: true,
    [LoginType.hbauth]: true,
    [LoginType.metamask]: false,
    [LoginType.google]: false,
    [LoginType.wif]: true,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      loginType: LoginType.keychain,
      keyType: defaultKeyType,
      remember: false,
    },
  });

  const selectedMethod = watch("loginType");

  useEffect(() => {
    checkAvailability().then(setAvailability);
  }, []);

  useEffect(() => {
    // Auto-select first available method
    const firstAvailable = loginMethods.find(
      (m) => enabledMethods.includes(m.type) && availability[m.type]
    );
    if (firstAvailable) {
      setValue("loginType", firstAvailable.type);
    }
  }, [availability, enabledMethods, setValue]);

  async function onSubmit(data: LoginFormData) {
    try {
      // Handle Hivesigner redirect
      if (data.loginType === LoginType.hivesigner) {
        const clientId = process.env.NEXT_PUBLIC_HIVESIGNER_CLIENT_ID || "your-app";
        const redirectUri = encodeURIComponent(window.location.origin + "/auth/callback");
        window.location.href = \`https://hivesigner.com/oauth2/authorize?client_id=\${clientId}&redirect_uri=\${redirectUri}&scope=login,vote,comment\`;
        return;
      }

      const signer = getSigner({
        username: data.username,
        loginType: data.loginType,
        keyType: data.keyType,
      });

      // Sign a challenge to verify ownership
      const challenge = \`Login to app at \${Date.now()}\`;
      await signer.signChallenge({ message: challenge });

      const user: SignerUser = {
        username: data.username,
        loginType: data.loginType,
        keyType: data.keyType,
      };

      if (data.remember) {
        localStorage.setItem("hive_user", JSON.stringify(user));
      }

      onSuccess?.(user);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      onError?.(error);
    }
  }

  const filteredMethods = loginMethods.filter((m) =>
    enabledMethods.includes(m.type)
  );

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username Input */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1.5">
            Hive Username
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Enter your username"
              className="w-full px-3 py-2.5 pl-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"
            />
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Login Method Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Login Method
          </label>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {filteredMethods.map((method) => {
              const isAvailable = availability[method.type];
              const isSelected = selectedMethod === method.type;

              return (
                <label
                  key={method.type}
                  className={\`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors \${
                    isSelected
                      ? "border-hive-red bg-hive-red/5"
                      : "border-border hover:border-muted-foreground/50"
                  } \${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}\`}
                >
                  <input
                    type="radio"
                    value={method.type}
                    disabled={!isAvailable}
                    {...register("loginType")}
                    className="sr-only"
                  />
                  <div className={\`p-2 rounded-lg \${isSelected ? "bg-hive-red/10 text-hive-red" : "bg-muted"}\`}>
                    {method.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {!isAvailable ? "Not available" : method.description}
                    </p>
                    {method.warning && isAvailable && (
                      <p className="text-xs text-yellow-600 flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="h-3 w-3" />
                        {method.warning}
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <div className="h-3 w-3 rounded-full bg-hive-red shrink-0" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Key Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Key Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={KeyType.posting}
                {...register("keyType")}
                className="accent-hive-red"
              />
              <span className="text-sm">Posting Key</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={KeyType.active}
                {...register("keyType")}
                className="accent-hive-red"
              />
              <span className="text-sm">Active Key</span>
            </label>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            {...register("remember")}
            className="h-4 w-4 rounded border-border accent-hive-red"
          />
          <label htmlFor="remember" className="text-sm">
            Keep me logged in
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-hive-red text-white font-medium transition-colors hover:bg-hive-red/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}`,
  basicUsage: `"use client";

import { SmartSignerLogin } from "@/components/hive/smart-signer-login";
import { SignerUser, LoginType } from "@/types/smart-signer";

export function LoginPage() {
  function handleSuccess(user: SignerUser) {
    console.log("Logged in:", user);
    // Redirect or update state
  }

  function handleError(error: Error) {
    console.error("Login failed:", error.message);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login to App</h1>
      <SmartSignerLogin
        onSuccess={handleSuccess}
        onError={handleError}
        // Show all methods except WIF for better security
        enabledMethods={[
          LoginType.keychain,
          LoginType.peakvault,
          LoginType.hbauth,
          LoginType.hiveauth,
          LoginType.metamask,
          LoginType.google,
          LoginType.hivesigner,
        ]}
      />
    </div>
  );
}`,
  secureOnly: `"use client";

import { SmartSignerLogin } from "@/components/hive/smart-signer-login";
import { LoginType } from "@/types/smart-signer";

// Only show the most secure authentication methods
export function SecureLogin() {
  return (
    <SmartSignerLogin
      enabledMethods={[
        LoginType.keychain,
        LoginType.peakvault,
        LoginType.hbauth,
      ]}
      onSuccess={(user) => console.log("Logged in:", user)}
    />
  );
}`,
};

export default async function SmartSignerPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Signer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Multi-method authentication supporting 8 different Hive login methods.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Smart Signer</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on the <code>@hive/smart-signer</code> package from the Denser project.
              Provides a unified interface for multiple authentication methods, allowing
              users to choose their preferred way to sign transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Methods */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Supported Methods (8)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Key className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">Hive Keychain</p>
              <p className="text-sm text-muted-foreground">
                Browser extension - most secure, recommended
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Wallet className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">PeakVault</p>
              <p className="text-sm text-muted-foreground">
                PeakD&apos;s browser extension
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Lock className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">Safe Storage (HB-Auth)</p>
              <p className="text-sm text-muted-foreground">
                Encrypted local wallet with password
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Smartphone className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">HiveAuth</p>
              <p className="text-sm text-muted-foreground">
                Mobile app authentication via QR code
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <HardDrive className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">MetaMask</p>
              <p className="text-sm text-muted-foreground">
                Ethereum wallet with Hive Snap
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Globe className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">Google Drive</p>
              <p className="text-sm text-muted-foreground">
                Cloud-backed encrypted wallet
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Globe className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">Hivesigner</p>
              <p className="text-sm text-muted-foreground">
                OAuth-style web-based authentication
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <FileKey className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium">WIF (Private Key)</p>
              <p className="text-sm text-muted-foreground">
                Direct key entry - less secure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Ranking */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Security Ranking</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">1</span>
            <span><strong>Keychain / PeakVault</strong> - Keys never leave the extension</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">2</span>
            <span><strong>HB-Auth (Safe Storage)</strong> - Encrypted local storage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">3</span>
            <span><strong>HiveAuth</strong> - Keys stay on mobile device</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">4</span>
            <span><strong>MetaMask</strong> - Secured by MetaMask Snap</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">5</span>
            <span><strong>Google Drive</strong> - Encrypted but cloud-stored</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">6</span>
            <span><strong>Hivesigner</strong> - OAuth tokens can be revoked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">7</span>
            <span><strong>WIF</strong> - Direct key handling, use sparingly</span>
          </div>
        </div>
      </section>

      {/* Type Definitions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Type Definitions</h2>
        <CodeBlock
          filename="types/smart-signer.ts"
          code={CODE.types}
          language="typescript"
        />
      </section>

      {/* Signer Interface */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Signer Base Class</h2>
        <p className="text-muted-foreground mb-4">
          All signers extend this abstract base class:
        </p>
        <CodeBlock
          filename="lib/signer/signer.ts"
          code={CODE.signerInterface}
          language="typescript"
        />
      </section>

      {/* Keychain Signer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Keychain Signer</h2>
        <CodeBlock
          filename="lib/signer/signer-keychain.ts"
          code={CODE.signerKeychain}
          language="typescript"
        />
      </section>

      {/* PeakVault Signer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">PeakVault Signer</h2>
        <CodeBlock
          filename="lib/signer/signer-peakvault.ts"
          code={CODE.signerPeakVault}
          language="typescript"
        />
      </section>

      {/* HB-Auth Signer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Safe Storage (HB-Auth) Signer</h2>
        <p className="text-muted-foreground mb-4">
          Encrypted local wallet using the <code>@hiveio/hb-auth</code> library:
        </p>
        <CodeBlock
          filename="lib/signer/signer-hbauth.ts"
          code={CODE.signerHBAuth}
          language="typescript"
        />
      </section>

      {/* HiveAuth Signer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">HiveAuth Signer</h2>
        <p className="text-muted-foreground mb-4">
          Mobile app authentication via QR code:
        </p>
        <CodeBlock
          filename="lib/signer/signer-hiveauth.ts"
          code={CODE.signerHiveAuth}
          language="typescript"
        />
      </section>

      {/* MetaMask Signer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">MetaMask Signer</h2>
        <p className="text-muted-foreground mb-4">
          Using MetaMask with the Hive Snap:
        </p>
        <CodeBlock
          filename="lib/signer/signer-metamask.ts"
          code={CODE.signerMetaMask}
          language="typescript"
        />
      </section>

      {/* Google Drive Signer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Google Drive Signer</h2>
        <p className="text-muted-foreground mb-4">
          Cloud-backed encrypted wallet:
        </p>
        <CodeBlock
          filename="lib/signer/signer-google-drive.ts"
          code={CODE.signerGoogleDrive}
          language="typescript"
        />
      </section>

      {/* WIF Signer */}
      <section>
        <h2 className="text-xl font-semibold mb-4">WIF Signer</h2>
        <p className="text-muted-foreground mb-4">
          Direct private key entry (use with caution):
        </p>
        <CodeBlock
          filename="lib/signer/signer-wif.ts"
          code={CODE.signerWif}
          language="typescript"
        />
      </section>

      {/* Signer Factory */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Signer Factory</h2>
        <p className="text-muted-foreground mb-4">
          Creates the appropriate signer based on login type:
        </p>
        <CodeBlock
          filename="lib/signer/get-signer.ts"
          code={CODE.signerFactory}
          language="typescript"
        />
      </section>

      {/* Login Component */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Login Component</h2>
        <p className="text-muted-foreground mb-4">
          Complete multi-method login form:
        </p>
        <CodeBlock
          filename="components/hive/smart-signer-login.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Secure Only */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Secure Methods Only</h2>
        <p className="text-muted-foreground mb-4">
          For maximum security, only show browser extension and local wallet methods:
        </p>
        <CodeBlock code={CODE.secureOnly} language="typescript" />
      </section>

      {/* Dependencies */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Optional Dependencies</h2>
        <p className="text-muted-foreground mb-4">
          Some signers require additional libraries:
        </p>
        <div className="space-y-2 font-mono text-sm">
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground"># HB-Auth (Safe Storage)</span><br />
            npm install @hiveio/hb-auth
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground"># HiveAuth</span><br />
            npm install hive-auth-client
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground"># MetaMask Snap</span><br />
            npm install @hiveio/wax-signers-metamask
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground"># Google Drive</span><br />
            npm install @hiveio/wax-signers-external
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground"># Keychain / PeakVault (optional, for advanced features)</span><br />
            npm install @hiveio/wax-signers-keychain @hiveio/wax-signers-peakvault
          </div>
        </div>
      </section>

      {/* Related */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Related</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/docs/components/keychain-login"
            className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
          >
            Keychain Login
          </Link>
          <Link
            href="/docs/components/hivesigner-login"
            className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
          >
            Hivesigner Login
          </Link>
          <Link
            href="/docs/hooks/use-hive-auth"
            className="inline-flex items-center gap-2 rounded-lg bg-hive-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hive-red/90"
          >
            useHiveAuth Hook
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}
