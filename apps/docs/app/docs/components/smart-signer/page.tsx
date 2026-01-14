import Link from "next/link";
import { ArrowRight, Info, Shield, Key, Smartphone, Globe, Wallet } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const CODE = {
  types: `// types/smart-signer.ts

export enum LoginType {
  keychain = "keychain",
  peakvault = "peakvault",
  hiveauth = "hiveauth",
  hivesigner = "hivesigner",
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
  username: string;
  keyType: KeyType;
}

export interface SignTransactionParams {
  username: string;
  operations: any[];
  keyType: KeyType;
}`,
  signerFactory: `// lib/signer/get-signer.ts

import { LoginType, SignerOptions } from "@/types/smart-signer";

export interface Signer {
  signChallenge(message: string): Promise<string>;
  signTransaction(operations: any[]): Promise<void>;
  destroy(): Promise<void>;
}

// Keychain Signer
class SignerKeychain implements Signer {
  private username: string;
  private keyType: string;

  constructor({ username, keyType }: SignerOptions) {
    this.username = username;
    this.keyType = keyType;
  }

  async signChallenge(message: string): Promise<string> {
    if (!window.hive_keychain) {
      throw new Error("Hive Keychain not installed");
    }

    return new Promise((resolve, reject) => {
      window.hive_keychain.requestSignBuffer(
        this.username,
        message,
        this.keyType === "active" ? "Active" : "Posting",
        (response: any) => {
          if (response.success) {
            resolve(response.result);
          } else {
            reject(new Error(response.message || "Sign failed"));
          }
        }
      );
    });
  }

  async signTransaction(operations: any[]): Promise<void> {
    if (!window.hive_keychain) {
      throw new Error("Hive Keychain not installed");
    }

    return new Promise((resolve, reject) => {
      window.hive_keychain.requestBroadcast(
        this.username,
        operations,
        this.keyType === "active" ? "Active" : "Posting",
        (response: any) => {
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
}

// PeakVault Signer
class SignerPeakVault implements Signer {
  private username: string;
  private keyType: string;

  constructor({ username, keyType }: SignerOptions) {
    this.username = username;
    this.keyType = keyType;
  }

  async signChallenge(message: string): Promise<string> {
    if (!window.peakvault) {
      throw new Error("PeakVault not installed");
    }

    return new Promise((resolve, reject) => {
      window.peakvault.requestSignBuffer(
        this.username,
        message,
        this.keyType === "active" ? "Active" : "Posting",
        (response: any) => {
          if (response.success) {
            resolve(response.result);
          } else {
            reject(new Error(response.message || "Sign failed"));
          }
        }
      );
    });
  }

  async signTransaction(operations: any[]): Promise<void> {
    if (!window.peakvault) {
      throw new Error("PeakVault not installed");
    }

    return new Promise((resolve, reject) => {
      window.peakvault.requestBroadcast(
        this.username,
        operations,
        this.keyType === "active" ? "Active" : "Posting",
        (response: any) => {
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
}

// HiveAuth Signer (simplified - requires hive-auth-client)
class SignerHiveAuth implements Signer {
  private username: string;
  private keyType: string;

  constructor({ username, keyType }: SignerOptions) {
    this.username = username;
    this.keyType = keyType;
  }

  async signChallenge(message: string): Promise<string> {
    // HiveAuth uses QR code / mobile app flow
    // Implementation requires hive-auth-client library
    throw new Error("HiveAuth signChallenge requires hive-auth-client setup");
  }

  async signTransaction(operations: any[]): Promise<void> {
    throw new Error("HiveAuth signTransaction requires hive-auth-client setup");
  }

  async destroy(): Promise<void> {}
}

// Signer Factory
const signers: Record<LoginType, new (options: SignerOptions) => Signer> = {
  [LoginType.keychain]: SignerKeychain,
  [LoginType.peakvault]: SignerPeakVault,
  [LoginType.hiveauth]: SignerHiveAuth,
  [LoginType.hivesigner]: SignerHiveAuth, // Hivesigner uses OAuth flow
};

export function getSigner(options: SignerOptions): Signer {
  const SignerClass = signers[options.loginType];
  if (!SignerClass) {
    throw new Error(\`Unsupported login type: \${options.loginType}\`);
  }
  return new SignerClass(options);
}

// Availability checks
export function hasKeychain(): boolean {
  return typeof window !== "undefined" && !!window.hive_keychain;
}

export function hasPeakVault(): boolean {
  return typeof window !== "undefined" && !!window.peakvault;
}`,
  component: `"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Key, Smartphone, Globe, Wallet, Loader2, AtSign } from "lucide-react";
import { LoginType, KeyType, SignerUser } from "@/types/smart-signer";
import { getSigner, hasKeychain, hasPeakVault } from "@/lib/signer/get-signer";

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
  checkAvailable: () => boolean;
}

const loginMethods: LoginMethod[] = [
  {
    type: LoginType.keychain,
    label: "Hive Keychain",
    icon: <Key className="h-5 w-5" />,
    description: "Browser extension (recommended)",
    checkAvailable: hasKeychain,
  },
  {
    type: LoginType.peakvault,
    label: "PeakVault",
    icon: <Wallet className="h-5 w-5" />,
    description: "PeakD browser extension",
    checkAvailable: hasPeakVault,
  },
  {
    type: LoginType.hiveauth,
    label: "HiveAuth",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Mobile app authentication",
    checkAvailable: () => true,
  },
  {
    type: LoginType.hivesigner,
    label: "Hivesigner",
    icon: <Globe className="h-5 w-5" />,
    description: "OAuth-style login",
    checkAvailable: () => true,
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
    // Check availability of each method
    setAvailability({
      [LoginType.keychain]: hasKeychain(),
      [LoginType.peakvault]: hasPeakVault(),
      [LoginType.hiveauth]: true,
      [LoginType.hivesigner]: true,
    });

    // Auto-select first available method
    const firstAvailable = loginMethods.find(
      (m) => enabledMethods.includes(m.type) && m.checkAvailable()
    );
    if (firstAvailable) {
      setValue("loginType", firstAvailable.type);
    }
  }, [enabledMethods, setValue]);

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
      const signature = await signer.signChallenge(challenge);

      const user: SignerUser = {
        username: data.username,
        loginType: data.loginType,
        keyType: data.keyType,
      };

      // Store in localStorage if remember is checked
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
          <div className="space-y-2">
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
                  <div className="flex-1">
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {!isAvailable ? "Not installed" : method.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="h-3 w-3 rounded-full bg-hive-red" />
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
  context: `"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { LoginType, KeyType, SignerUser } from "@/types/smart-signer";
import { getSigner, Signer } from "@/lib/signer/get-signer";

interface SmartSignerContextValue {
  user: SignerUser | null;
  signer: Signer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (user: SignerUser) => void;
  logout: () => void;
  signTransaction: (operations: any[]) => Promise<void>;
}

const SmartSignerContext = createContext<SmartSignerContextValue | null>(null);

export function SmartSignerProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SignerUser | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hive_user");
      if (stored) {
        const userData = JSON.parse(stored) as SignerUser;
        setUser(userData);
        setSigner(
          getSigner({
            username: userData.username,
            loginType: userData.loginType,
            keyType: userData.keyType,
          })
        );
      }
    } catch (err) {
      console.error("Failed to restore user:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((userData: SignerUser) => {
    setUser(userData);
    setSigner(
      getSigner({
        username: userData.username,
        loginType: userData.loginType,
        keyType: userData.keyType,
      })
    );
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    if (signer) {
      await signer.destroy();
    }
    setUser(null);
    setSigner(null);
    localStorage.removeItem("hive_user");
  }, [signer]);

  const signTransaction = useCallback(
    async (operations: any[]) => {
      if (!signer) {
        throw new Error("Not authenticated");
      }
      await signer.signTransaction(operations);
    },
    [signer]
  );

  return (
    <SmartSignerContext.Provider
      value={{
        user,
        signer,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        signTransaction,
      }}
    >
      {children}
    </SmartSignerContext.Provider>
  );
}

export function useSmartSigner() {
  const context = useContext(SmartSignerContext);
  if (!context) {
    throw new Error("useSmartSigner must be used within a SmartSignerProvider");
  }
  return context;
}`,
  basicUsage: `"use client";

import { SmartSignerLogin } from "@/components/hive/smart-signer-login";
import { SmartSignerProvider, useSmartSigner } from "@/components/hive/smart-signer-provider";
import { SignerUser } from "@/types/smart-signer";

function LoginPage() {
  const { login } = useSmartSigner();

  function handleSuccess(user: SignerUser) {
    login(user);
    // Redirect to dashboard or update UI
  }

  return (
    <SmartSignerLogin
      onSuccess={handleSuccess}
      onError={(err) => console.error(err)}
    />
  );
}

export default function App() {
  return (
    <SmartSignerProvider>
      <LoginPage />
    </SmartSignerProvider>
  );
}`,
  limitedMethods: `"use client";

import { SmartSignerLogin } from "@/components/hive/smart-signer-login";
import { LoginType, KeyType } from "@/types/smart-signer";

export function KeychainOnlyLogin() {
  return (
    <SmartSignerLogin
      enabledMethods={[LoginType.keychain]}
      defaultKeyType={KeyType.posting}
      onSuccess={(user) => console.log("Logged in:", user)}
    />
  );
}

export function BrowserExtensionsLogin() {
  return (
    <SmartSignerLogin
      enabledMethods={[LoginType.keychain, LoginType.peakvault]}
      onSuccess={(user) => console.log("Logged in:", user)}
    />
  );
}`,
  withTransaction: `"use client";

import { useSmartSigner } from "@/components/hive/smart-signer-provider";
import { useState } from "react";

export function VoteWithSigner({ author, permlink }: { author: string; permlink: string }) {
  const { user, signTransaction, isAuthenticated } = useSmartSigner();
  const [isVoting, setIsVoting] = useState(false);

  async function handleVote() {
    if (!user || !isAuthenticated) return;

    setIsVoting(true);
    try {
      await signTransaction([
        [
          "vote",
          {
            voter: user.username,
            author,
            permlink,
            weight: 10000, // 100% upvote
          },
        ],
      ]);
      console.log("Vote successful!");
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={!isAuthenticated || isVoting}
      className="px-4 py-2 rounded bg-hive-red text-white disabled:opacity-50"
    >
      {isVoting ? "Voting..." : "Vote"}
    </button>
  );
}`,
  globalTypes: `// Add to global.d.ts

interface HiveKeychainResponse {
  success: boolean;
  message?: string;
  result?: string;
  publicKey?: string;
}

interface HiveKeychain {
  requestSignBuffer(
    username: string,
    message: string,
    keyType: "Posting" | "Active" | "Memo",
    callback: (response: HiveKeychainResponse) => void
  ): void;
  requestBroadcast(
    username: string,
    operations: any[],
    keyType: "Posting" | "Active",
    callback: (response: HiveKeychainResponse) => void
  ): void;
}

interface PeakVault {
  requestSignBuffer(
    username: string,
    message: string,
    keyType: "Posting" | "Active" | "Memo",
    callback: (response: HiveKeychainResponse) => void
  ): void;
  requestBroadcast(
    username: string,
    operations: any[],
    keyType: "Posting" | "Active",
    callback: (response: HiveKeychainResponse) => void
  ): void;
}

declare global {
  interface Window {
    hive_keychain?: HiveKeychain;
    peakvault?: PeakVault;
  }
}

export {};`,
};

export default async function SmartSignerPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Signer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Multi-method authentication supporting Keychain, PeakVault, HiveAuth, and Hivesigner.
        </p>
      </div>

      {/* Info */}
      <section className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-500">Smart Signer</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Smart Signer is a unified authentication system that supports multiple Hive
              login methods. It provides a factory pattern to create signers for different
              authentication providers, making it easy to support various user preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Methods */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Supported Methods</h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
                PeakD&apos;s browser extension for Hive
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
            <Globe className="h-5 w-5 text-hive-red mt-0.5" />
            <div>
              <p className="font-medium">Hivesigner</p>
              <p className="text-sm text-muted-foreground">
                OAuth-style web-based authentication
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Hive Username</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-3 py-2.5 pl-10 rounded-lg border border-border bg-background"
                disabled
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-hive-red bg-hive-red/5">
              <div className="p-2 rounded-lg bg-hive-red/10 text-hive-red">
                <Key className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Hive Keychain</p>
                <p className="text-sm text-muted-foreground">Browser extension (recommended)</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-hive-red" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border opacity-50">
              <div className="p-2 rounded-lg bg-muted">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">PeakVault</p>
                <p className="text-sm text-muted-foreground">Not installed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Type Definitions</h2>
        <p className="text-muted-foreground mb-4">
          First, add the type definitions for Smart Signer:
        </p>
        <CodeBlock
          filename="types/smart-signer.ts"
          code={CODE.types}
          language="typescript"
        />
      </section>

      {/* Global Types */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Global Types</h2>
        <p className="text-muted-foreground mb-4">
          Add window interface declarations for browser extensions:
        </p>
        <CodeBlock
          filename="types/global.d.ts"
          code={CODE.globalTypes}
          language="typescript"
        />
      </section>

      {/* Signer Factory */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Signer Factory</h2>
        <p className="text-muted-foreground mb-4">
          The signer factory creates the appropriate signer based on login type:
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
          A complete multi-method login form:
        </p>
        <CodeBlock
          filename="components/hive/smart-signer-login.tsx"
          code={CODE.component}
          language="typescript"
        />
      </section>

      {/* Context Provider */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Context Provider</h2>
        <p className="text-muted-foreground mb-4">
          React context for managing authentication state:
        </p>
        <CodeBlock
          filename="components/hive/smart-signer-provider.tsx"
          code={CODE.context}
          language="typescript"
        />
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left font-semibold">Prop</th>
                <th className="py-3 px-4 text-left font-semibold">Type</th>
                <th className="py-3 px-4 text-left font-semibold">Default</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code>onSuccess</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(user: SignerUser) =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Called on successful login</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>onError</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>(error: Error) =&gt; void</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-</td>
                <td className="py-3 px-4 text-muted-foreground">Called on login error</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>enabledMethods</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>LoginType[]</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground">all</td>
                <td className="py-3 px-4 text-muted-foreground">Which login methods to show</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code>defaultKeyType</code></td>
                <td className="py-3 px-4 text-muted-foreground">
                  <code>KeyType</code>
                </td>
                <td className="py-3 px-4 text-muted-foreground"><code>posting</code></td>
                <td className="py-3 px-4 text-muted-foreground">Default key type selection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Basic Usage */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <CodeBlock code={CODE.basicUsage} language="typescript" />
      </section>

      {/* Limited Methods */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Limited Methods</h2>
        <p className="text-muted-foreground mb-4">
          Show only specific authentication methods:
        </p>
        <CodeBlock code={CODE.limitedMethods} language="typescript" />
      </section>

      {/* Transaction Signing */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Transaction Signing</h2>
        <p className="text-muted-foreground mb-4">
          Use the signer to sign blockchain transactions:
        </p>
        <CodeBlock code={CODE.withTransaction} language="typescript" />
      </section>

      {/* Security */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-hive-red" />
          <h2 className="text-xl font-semibold">Security Notes</h2>
        </div>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">1.</span>
            <span>
              <strong>Browser extensions are most secure:</strong> Keychain and PeakVault
              store keys locally and never expose them to websites.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">2.</span>
            <span>
              <strong>Use posting key for most operations:</strong> Only use active key
              when absolutely necessary (transfers, power operations).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">3.</span>
            <span>
              <strong>Validate on server:</strong> For sensitive operations, verify
              signatures server-side using the Hive blockchain.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-hive-red mt-1">4.</span>
            <span>
              <strong>Session management:</strong> Consider implementing session expiry
              and automatic logout for inactive users.
            </span>
          </li>
        </ul>
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
