"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, Loader2, AlertCircle, Copy, Check, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoCryptoProps {
  username: string;
  className?: string;
}

export function HiveMemoCrypto({ username, className }: MemoCryptoProps) {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [message, setMessage] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [targetUser, setTargetUser] = useState("");
  const [fetchingKey, setFetchingKey] = useState(false);

  // Fetch public memo key for target user
  const fetchPublicKey = async () => {
    if (!targetUser.trim()) return;

    setFetchingKey(true);
    setError(null);
    try {
      const response = await fetch("https://api.hive.blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "condenser_api.get_accounts",
          params: [[targetUser.trim().replace("@", "")]],
          id: 1,
        }),
      });

      const data = await response.json();
      if (data.result && data.result[0]) {
        const memoKey = data.result[0].memo_key;
        setPublicKey(memoKey);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to fetch user's public key");
    } finally {
      setFetchingKey(false);
    }
  };

  const handleEncrypt = async () => {
    if (!message.trim() || !privateKey.trim() || !publicKey.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      // Dynamic import of hivecrypt (if available) or show demo
      // For demo purposes, we'll show how encryption would work
      // In production, you'd use: const hivecrypt = require('hivecrypt');

      // Simulated encryption result format
      const encryptedDemo = `#${btoa(message).substring(0, 50)}...`;

      // Show the expected format
      setResult(encryptedDemo);
      setError("Demo mode: Install 'hivecrypt' package for real encryption");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encryption failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!message.trim() || !privateKey.trim()) {
      setError("Please fill in message and private key");
      return;
    }

    if (!message.startsWith("#")) {
      setError("Encrypted memos must start with #");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      // Simulated decryption
      const decryptedDemo = "Decrypted message would appear here";
      setResult(decryptedDemo);
      setError("Demo mode: Install 'hivecrypt' package for real decryption");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed");
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Mode Toggle */}
      <div className="flex rounded-lg bg-muted p-1 mb-4">
        <button
          onClick={() => {
            setMode("encrypt");
            setError(null);
            setResult("");
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "encrypt" ? "bg-green-500 text-white shadow-sm" : "text-muted-foreground"
          )}
        >
          <Lock className="h-4 w-4" />
          Encrypt
        </button>
        <button
          onClick={() => {
            setMode("decrypt");
            setError(null);
            setResult("");
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
            mode === "decrypt" ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground"
          )}
        >
          <Unlock className="h-4 w-4" />
          Decrypt
        </button>
      </div>

      <div className="space-y-4">
        {/* Your Private Memo Key */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Your Private Memo Key
          </label>
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="5K..."
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background font-mono text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Your private memo key (starts with 5)
          </p>
        </div>

        {/* Recipient's Public Key (for encryption) */}
        {mode === "encrypt" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Recipient&apos;s Public Memo Key
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder="@username"
                className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              />
              <button
                onClick={fetchPublicKey}
                disabled={fetchingKey || !targetUser.trim()}
                className="px-3 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium disabled:opacity-50"
              >
                {fetchingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
              </button>
            </div>
            <input
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="STM..."
              className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-background font-mono text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Or enter the public memo key manually
            </p>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {mode === "encrypt" ? "Message to Encrypt" : "Encrypted Message"}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={mode === "encrypt" ? "Enter your secret message..." : "#encrypted_memo_here..."}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background resize-none"
          />
          {mode === "decrypt" && (
            <p className="mt-1 text-xs text-muted-foreground">
              Encrypted memos start with #
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-amber-500 bg-amber-500/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={mode === "encrypt" ? handleEncrypt : handleDecrypt}
          disabled={isLoading || !message.trim() || !privateKey.trim() || (mode === "encrypt" && !publicKey.trim())}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium disabled:opacity-50",
            mode === "encrypt"
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : mode === "encrypt" ? (
            <>
              <Lock className="h-5 w-5" />
              Encrypt Message
            </>
          ) : (
            <>
              <Unlock className="h-5 w-5" />
              Decrypt Message
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {mode === "encrypt" ? "Encrypted Result" : "Decrypted Message"}
              </span>
              <button
                onClick={copyResult}
                className="p-1.5 rounded hover:bg-muted"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-sm font-mono break-all">{result}</p>
          </div>
        )}

        {/* Info */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-start gap-2">
            <Key className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              {mode === "encrypt" ? (
                <p>
                  Memos starting with <code className="bg-muted px-1 rounded">#</code> are encrypted.
                  Only the recipient can decrypt with their private memo key.
                </p>
              ) : (
                <p>
                  To decrypt, you need the private memo key of the account that received the encrypted memo.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
