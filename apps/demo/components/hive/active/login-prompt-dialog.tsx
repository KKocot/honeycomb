"use client";

import { useState } from "react";
import {
  Key,
  Wallet,
  Smartphone,
  Lock,
  FileKey,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HiveKeychainLogin } from "./keychain-login";
import { HivePeakVaultLogin } from "./peakvault-login";
import { HiveAuthLogin } from "./hiveauth-login";
import { HiveHBAuthLogin } from "./hbauth-login";
import { HiveWIFLogin } from "./wif-login";
import { useHive } from "@/contexts/hive-context";
import type { HiveLoginResult } from "@/types/auth";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: string;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

type LoginMethod = "keychain" | "peakvault" | "hiveauth" | "hbauth" | "wif" | null;

const loginMethods = [
  {
    id: "hbauth" as const,
    name: "HB-Auth",
    description: "Safe Storage",
    icon: Lock,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "keychain" as const,
    name: "Keychain",
    description: "Browser extension",
    icon: Key,
    color: "text-hive-red",
    bg: "bg-hive-red/10",
  },
  {
    id: "peakvault" as const,
    name: "PeakVault",
    description: "PeakD extension",
    icon: Wallet,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "hiveauth" as const,
    name: "HiveAuth",
    description: "Mobile QR code",
    icon: Smartphone,
    color: "text-hive-red",
    bg: "bg-hive-red/10",
  },
  {
    id: "wif" as const,
    name: "WIF",
    description: "Direct Key (Dev only)",
    icon: FileKey,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export function LoginPromptDialog({
  open,
  onOpenChange,
  action = "perform this action",
  onSuccess,
  title,
  description,
}: LoginPromptDialogProps) {
  const { login } = useHive();
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>(null);

  const handleSuccess = (result: HiveLoginResult) => {
    login(result);
    onOpenChange(false);
    setSelectedMethod(null);
    onSuccess?.();
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedMethod(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {selectedMethod ? "Login" : (title || "Login Required")}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!selectedMethod ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {description || `You need to login to ${action}. Choose a login method:`}
            </p>

            <div className="space-y-2">
              {loginMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", method.bg)}>
                      <method.icon className={cn("h-5 w-5", method.color)} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={handleBack}
              className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to methods
            </button>

            <div className="space-y-4">
              {selectedMethod === "keychain" && (
                <HiveKeychainLogin
                  onSuccess={handleSuccess}
                  onError={(e) => console.error(e)}
                />
              )}
              {selectedMethod === "peakvault" && (
                <HivePeakVaultLogin
                  onSuccess={handleSuccess}
                  onError={(e) => console.error(e)}
                />
              )}
              {selectedMethod === "hiveauth" && (
                <HiveAuthLogin
                  onSuccess={handleSuccess}
                  onError={(e) => console.error(e)}
                />
              )}
              {selectedMethod === "hbauth" && (
                <HiveHBAuthLogin
                  onSuccess={handleSuccess}
                  onError={(e) => console.error(e)}
                />
              )}
              {selectedMethod === "wif" && (
                <HiveWIFLogin
                  onSuccess={handleSuccess}
                  onError={(e) => console.error(e)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
