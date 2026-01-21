"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useHive } from "@/contexts/hive-context";
import { useToast } from "@/components/ui/toast";
import { transactionService } from "@/services/transaction-service";

export type BroadcastOperation = [string, Record<string, unknown>];

export interface BroadcastResult {
  success: boolean;
  txId?: string;
  error?: string;
}

export interface UseBroadcastOptions {
  keyType?: "posting" | "active";
  /** If true, wait for transaction to be confirmed on blockchain using WorkerBee */
  observe?: boolean;
}

export interface UseBroadcastReturn {
  broadcast: (operations: BroadcastOperation[]) => Promise<BroadcastResult>;
  isLoading: boolean;
  error: string | null;
  // For WIF login: need to show WIF key dialog
  needsWifKey: boolean;
  setWifKey: (wif: string) => void;
  confirmWithWifKey: () => Promise<BroadcastResult>;
  cancelWifKeyPrompt: () => void;
  // For HB-Auth: need to show password dialog
  needsHBAuthPassword: boolean;
  setHBAuthPassword: (password: string) => void;
  confirmWithHBAuthPassword: () => Promise<BroadcastResult>;
  cancelHBAuthPasswordPrompt: () => void;
}

export function useBroadcast(options: UseBroadcastOptions = {}): UseBroadcastReturn {
  const { user, chain } = useHive();
  const toast = useToast();
  const { keyType = "posting", observe = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsWifKey, setNeedsWifKey] = useState(false);
  const [wifKey, setWifKey] = useState("");
  const [needsHBAuthPassword, setNeedsHBAuthPassword] = useState(false);
  const [hbAuthPassword, setHBAuthPassword] = useState("");
  const [pendingOperations, setPendingOperations] = useState<BroadcastOperation[] | null>(null);
  const resolvePromiseRef = useRef<((result: BroadcastResult) => void) | null>(null);

  // Initialize TransactionService with chain
  useEffect(() => {
    if (chain) {
      transactionService.setChain(chain);
      console.log("[useBroadcast] TransactionService initialized with chain");
    }
  }, [chain]);

  const broadcastViaKeychain = useCallback(
    async (operations: BroadcastOperation[], shouldObserve: boolean): Promise<BroadcastResult> => {
      console.log("[useBroadcast:Keychain] Step 1: Checking Keychain availability...");

      if (!window.hive_keychain) {
        console.error("[useBroadcast:Keychain] ERROR: Hive Keychain not available");
        toast.error("Keychain not found", "Please install Hive Keychain extension");
        return { success: false, error: "Hive Keychain not available" };
      }

      console.log("[useBroadcast:Keychain] Step 2: Keychain found, requesting signature...");
      console.log("[useBroadcast:Keychain] Operations:", JSON.stringify(operations, null, 2));
      console.log("[useBroadcast:Keychain] User:", user!.username, "KeyType:", keyType);
      toast.info("Step 1: Signing...", "Please approve in Hive Keychain");

      return new Promise((resolve) => {
        window.hive_keychain!.requestBroadcast(
          user!.username,
          operations,
          keyType === "active" ? "Active" : "Posting",
          async (response) => {
            console.log("[useBroadcast:Keychain] Step 3: Keychain response received:", response);

            if (response.success) {
              const txId = response.result;
              console.log("[useBroadcast:Keychain] Step 4: Broadcast SUCCESS! txId:", txId);
              toast.success("Step 2: Broadcast OK!", `Transaction ID: ${txId?.slice(0, 12)}...`);

              if (shouldObserve && txId) {
                console.log("[useBroadcast:Keychain] Step 5: Starting blockchain observation...");
                toast.info("Step 3: Observing...", "Waiting for block confirmation (up to 15s)...");

                try {
                  const startTime = Date.now();
                  await transactionService.observeTransaction(txId);
                  const elapsed = Date.now() - startTime;

                  console.log("[useBroadcast:Keychain] Step 6: CONFIRMED in block! Elapsed:", elapsed, "ms");
                  toast.success("Step 4: Confirmed!", `Transaction included in block (${(elapsed/1000).toFixed(1)}s)`);
                  resolve({ success: true, txId });
                } catch (err) {
                  console.error("[useBroadcast:Keychain] Step 6: Observation TIMEOUT:", err);
                  toast.warning("Confirmation timeout", "Transaction broadcast but not yet confirmed. Check explorer.");
                  resolve({ success: true, txId, error: "Broadcast succeeded but confirmation timed out" });
                }
              } else {
                console.log("[useBroadcast:Keychain] Step 5: Skipping observation (observe=false)");
                toast.success("Broadcast complete!", "Transaction sent (no observation)");
                resolve({ success: true, txId });
              }
            } else {
              const errorMsg = response.message || response.error || "Broadcast failed";
              console.error("[useBroadcast:Keychain] Step 3: Broadcast FAILED:", errorMsg);
              console.error("[useBroadcast:Keychain] Full response:", response);
              toast.error("Broadcast failed", errorMsg);
              resolve({ success: false, error: errorMsg });
            }
          }
        );
      });
    },
    [user, keyType, toast]
  );

  const broadcastViaPeakVault = useCallback(
    async (operations: BroadcastOperation[], shouldObserve: boolean): Promise<BroadcastResult> => {
      console.log("[useBroadcast:PeakVault] Step 1: Checking PeakVault availability...");

      const peakvault = (window as unknown as { peakvault?: typeof window.hive_keychain }).peakvault;
      if (!peakvault) {
        console.error("[useBroadcast:PeakVault] ERROR: PeakVault not available");
        toast.error("PeakVault not found", "Please install PeakVault extension");
        return { success: false, error: "PeakVault not available" };
      }

      console.log("[useBroadcast:PeakVault] Step 2: PeakVault found, requesting signature...");
      console.log("[useBroadcast:PeakVault] Operations:", JSON.stringify(operations, null, 2));
      toast.info("Step 1: Signing...", "Please approve in PeakVault");

      return new Promise((resolve) => {
        if ('requestBroadcast' in peakvault) {
          (peakvault as typeof window.hive_keychain)!.requestBroadcast(
            user!.username,
            operations,
            keyType === "active" ? "Active" : "Posting",
            async (response) => {
              console.log("[useBroadcast:PeakVault] Step 3: PeakVault response received:", response);

              if (response.success) {
                const txId = response.result;
                console.log("[useBroadcast:PeakVault] Step 4: Broadcast SUCCESS! txId:", txId);
                toast.success("Step 2: Broadcast OK!", `Transaction ID: ${txId?.slice(0, 12)}...`);

                if (shouldObserve && txId) {
                  console.log("[useBroadcast:PeakVault] Step 5: Starting blockchain observation...");
                  toast.info("Step 3: Observing...", "Waiting for block confirmation (up to 15s)...");

                  try {
                    const startTime = Date.now();
                    await transactionService.observeTransaction(txId);
                    const elapsed = Date.now() - startTime;

                    console.log("[useBroadcast:PeakVault] Step 6: CONFIRMED in block! Elapsed:", elapsed, "ms");
                    toast.success("Step 4: Confirmed!", `Transaction included in block (${(elapsed/1000).toFixed(1)}s)`);
                    resolve({ success: true, txId });
                  } catch (err) {
                    console.error("[useBroadcast:PeakVault] Step 6: Observation TIMEOUT:", err);
                    toast.warning("Confirmation timeout", "Transaction broadcast but not yet confirmed. Check explorer.");
                    resolve({ success: true, txId, error: "Broadcast succeeded but confirmation timed out" });
                  }
                } else {
                  console.log("[useBroadcast:PeakVault] Step 5: Skipping observation (observe=false)");
                  toast.success("Broadcast complete!", "Transaction sent (no observation)");
                  resolve({ success: true, txId });
                }
              } else {
                const errorMsg = response.message || response.error || "Broadcast failed";
                console.error("[useBroadcast:PeakVault] Step 3: Broadcast FAILED:", errorMsg);
                toast.error("Broadcast failed", errorMsg);
                resolve({ success: false, error: errorMsg });
              }
            }
          );
        } else {
          console.error("[useBroadcast:PeakVault] ERROR: requestBroadcast not supported");
          resolve({ success: false, error: "PeakVault broadcast not supported" });
        }
      });
    },
    [user, keyType, toast]
  );

  // Broadcast using HB-Auth - uses stored encrypted key with password unlock
  const broadcastViaHBAuth = useCallback(
    async (operations: BroadcastOperation[], password: string, shouldObserve: boolean): Promise<BroadcastResult> => {
      console.log("[useBroadcast:HBAuth] Step 1: Checking chain and initializing HB-Auth...");

      if (!chain) {
        console.error("[useBroadcast:HBAuth] ERROR: Hive chain not initialized");
        toast.error("Chain error", "Hive chain not initialized");
        return { success: false, error: "Hive chain not initialized" };
      }

      if (!user) {
        console.error("[useBroadcast:HBAuth] ERROR: User not logged in");
        return { success: false, error: "User not logged in" };
      }

      console.log("[useBroadcast:HBAuth] Step 2: Initializing HB-Auth client...");
      toast.info("Step 1: Unlocking...", "Unlocking your stored key...");

      try {
        // Dynamic import of @hiveio/hb-auth
        const { OnlineClient } = await import("@hiveio/hb-auth");

        const client = new OnlineClient({
          workerUrl: "/auth/worker.js",
          node: "https://api.openhive.network",
          chainId: "beeab0de00000000000000000000000000000000000000000000000000000000",
        });
        await client.initialize();
        console.log("[useBroadcast:HBAuth] Step 3: HB-Auth client ready");

        // Authenticate/unlock with password
        console.log("[useBroadcast:HBAuth] Step 4: Authenticating with password...");
        const authResult = await client.authenticate(user.username.toLowerCase(), password, keyType);

        if (!authResult.ok) {
          console.error("[useBroadcast:HBAuth] Step 4: Authentication FAILED");
          toast.error("Wrong password", "Failed to unlock your key. Check your password.");
          return { success: false, error: "Wrong password" };
        }
        console.log("[useBroadcast:HBAuth] Step 4: Authentication successful");
        toast.success("Step 2: Unlocked!", "Key unlocked successfully");

        // Create transaction with wax
        console.log("[useBroadcast:HBAuth] Step 5: Creating transaction...");
        toast.info("Step 3: Creating tx...", "Building transaction...");
        const tx = await chain.createTransaction();

        // Add operations to transaction
        for (const [opType, opData] of operations) {
          const waxOp: Record<string, unknown> = {};
          waxOp[opType] = opData;
          tx.pushOperation(waxOp);
          console.log("[useBroadcast:HBAuth] Added operation:", opType);
        }

        // Get the digest to sign
        console.log("[useBroadcast:HBAuth] Step 6: Getting transaction digest...");
        const digest = tx.sigDigest;
        console.log("[useBroadcast:HBAuth] Digest:", digest);

        // Sign with HB-Auth
        console.log("[useBroadcast:HBAuth] Step 7: Signing with HB-Auth...");
        toast.info("Step 4: Signing...", "Signing transaction...");
        const signature = await client.sign(user.username.toLowerCase(), digest, keyType);
        console.log("[useBroadcast:HBAuth] Signature:", signature.slice(0, 20) + "...");

        // Add signature to transaction using wax's transaction builder
        // Wax transaction has signatures property that can be manipulated
        const txWithSig = tx as unknown as { signatures: string[] };
        if (Array.isArray(txWithSig.signatures)) {
          txWithSig.signatures.push(signature);
          console.log("[useBroadcast:HBAuth] Signature added to transaction");
        } else {
          console.log("[useBroadcast:HBAuth] Warning: Could not find signatures array, attempting direct injection");
          (tx as unknown as { signatures: string[] }).signatures = [signature];
        }

        const transactionId = tx.id;
        console.log("[useBroadcast:HBAuth] Step 8: Transaction signed! txId:", transactionId);
        toast.success("Step 5: Signed!", `Transaction ID: ${transactionId.slice(0, 12)}...`);

        if (shouldObserve) {
          console.log("[useBroadcast:HBAuth] Step 9: Broadcasting with WorkerBee observation...");
          toast.info("Step 6: Broadcasting...", "Sending to blockchain...");

          try {
            const startTime = Date.now();
            await transactionService.broadcastAndObserveTransaction(tx);
            const elapsed = Date.now() - startTime;

            console.log("[useBroadcast:HBAuth] Step 10: CONFIRMED in block! Elapsed:", elapsed, "ms");
            toast.success("Step 7: Confirmed!", `Transaction included in block (${(elapsed/1000).toFixed(1)}s)`);
            return { success: true, txId: transactionId };
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Broadcast failed";
            console.error("[useBroadcast:HBAuth] Step 10: Broadcast FAILED:", errorMsg);
            toast.error("Broadcast failed", errorMsg);
            return { success: false, error: errorMsg };
          }
        } else {
          console.log("[useBroadcast:HBAuth] Step 9: Broadcasting without observation...");
          toast.info("Step 6: Broadcasting...", "Sending to blockchain...");

          await transactionService.broadcastTransaction(tx);
          console.log("[useBroadcast:HBAuth] Step 10: Broadcast complete (no observation)");
          toast.success("Broadcast complete!", "Transaction sent successfully");
          return { success: true, txId: transactionId };
        }
      } catch (err) {
        console.error("[useBroadcast:HBAuth] ERROR:", err);
        const errorMessage = err instanceof Error ? err.message : "Broadcast failed";
        toast.error("Transaction error", errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [chain, user, keyType, toast]
  );

  // Broadcast using WIF key directly with @hiveio/wax and optionally observe with WorkerBee
  const broadcastViaWif = useCallback(
    async (operations: BroadcastOperation[], privateKey: string, shouldObserve: boolean): Promise<BroadcastResult> => {
      console.log("[useBroadcast:WIF] Step 1: Checking chain and key...");

      if (!chain) {
        console.error("[useBroadcast:WIF] ERROR: Hive chain not initialized");
        toast.error("Chain error", "Hive chain not initialized");
        return { success: false, error: "Hive chain not initialized" };
      }

      if (!privateKey || !privateKey.startsWith("5") || privateKey.length !== 51) {
        console.error("[useBroadcast:WIF] ERROR: Invalid WIF key format");
        toast.error("Invalid key", "WIF key must start with '5' and be 51 characters");
        return { success: false, error: "Invalid WIF key format" };
      }

      console.log("[useBroadcast:WIF] Step 2: Creating transaction...");
      console.log("[useBroadcast:WIF] Operations:", JSON.stringify(operations, null, 2));
      toast.info("Step 1: Creating tx...", "Building transaction...");

      try {
        // Create transaction with wax
        const tx = await chain.createTransaction();
        console.log("[useBroadcast:WIF] Step 3: Transaction created, adding operations...");

        // Convert operations to wax format and push them
        for (const [opType, opData] of operations) {
          const waxOp: Record<string, unknown> = {};
          waxOp[opType] = opData;
          tx.pushOperation(waxOp);
          console.log("[useBroadcast:WIF] Added operation:", opType);
        }

        console.log("[useBroadcast:WIF] Step 4: Importing key and signing...");
        toast.info("Step 2: Signing...", "Signing with provided key...");

        // Import key and sign using beekeeper
        const beekeeperModule = await import("@hiveio/beekeeper");
        const bk = await beekeeperModule.default();

        const session = bk.createSession("broadcast-session");
        const { wallet } = await session.createWallet("temp-wallet");
        const publicKey = await wallet.importKey(privateKey);
        console.log("[useBroadcast:WIF] Key imported, public key:", publicKey);

        // Sign the transaction
        tx.sign(wallet, publicKey);
        const transactionId = tx.id;
        console.log("[useBroadcast:WIF] Step 5: Transaction signed! txId:", transactionId);
        toast.success("Step 3: Signed!", `Transaction ID: ${transactionId.slice(0, 12)}...`);

        if (shouldObserve) {
          console.log("[useBroadcast:WIF] Step 6: Broadcasting with WorkerBee observation...");
          toast.info("Step 4: Broadcasting...", "Sending to blockchain...");

          try {
            const startTime = Date.now();
            await transactionService.broadcastAndObserveTransaction(tx);
            const elapsed = Date.now() - startTime;

            console.log("[useBroadcast:WIF] Step 7: CONFIRMED in block! Elapsed:", elapsed, "ms");
            toast.success("Step 5: Confirmed!", `Transaction included in block (${(elapsed/1000).toFixed(1)}s)`);
            session.close();
            return { success: true, txId: transactionId };
          } catch (err) {
            session.close();
            const errorMsg = err instanceof Error ? err.message : "Broadcast failed";
            console.error("[useBroadcast:WIF] Step 7: Broadcast FAILED:", errorMsg);
            toast.error("Broadcast failed", errorMsg);
            return { success: false, error: errorMsg };
          }
        } else {
          console.log("[useBroadcast:WIF] Step 6: Broadcasting without observation...");
          toast.info("Step 4: Broadcasting...", "Sending to blockchain...");

          await transactionService.broadcastTransaction(tx);
          console.log("[useBroadcast:WIF] Step 7: Broadcast complete (no observation)");
          toast.success("Broadcast complete!", "Transaction sent successfully");
          session.close();
          return { success: true, txId: transactionId };
        }
      } catch (err) {
        console.error("[useBroadcast:WIF] ERROR:", err);
        const errorMessage = err instanceof Error ? err.message : "Broadcast failed";
        toast.error("Transaction error", errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [chain, toast]
  );

  const broadcast = useCallback(
    async (operations: BroadcastOperation[]): Promise<BroadcastResult> => {
      console.log("========================================");
      console.log("[useBroadcast] BROADCAST INITIATED");
      console.log("========================================");

      if (!user) {
        console.error("[useBroadcast] ERROR: Not logged in");
        toast.error("Not logged in", "Please log in first");
        return { success: false, error: "Not logged in" };
      }

      console.log("[useBroadcast] User:", user.username);
      console.log("[useBroadcast] Login method:", user.loginMethod);
      console.log("[useBroadcast] Observe mode:", observe);
      console.log("[useBroadcast] Key type:", keyType);
      console.log("[useBroadcast] Operations count:", operations.length);

      setIsLoading(true);
      setError(null);

      try {
        let result: BroadcastResult;
        const method = user.loginMethod.toLowerCase();

        console.log("[useBroadcast] Routing to method:", method);

        if (method === "keychain") {
          result = await broadcastViaKeychain(operations, observe);
        } else if (method === "peakvault") {
          result = await broadcastViaPeakVault(operations, observe);
        } else if (method === "hb-auth" || method === "hbauth") {
          console.log("[useBroadcast] HB-Auth: Prompting for password to unlock stored key...");
          // Don't show toast - the component will show HBAuthPasswordDialog instead
          setPendingOperations(operations);
          setNeedsHBAuthPassword(true);
          setIsLoading(false);

          return new Promise((resolve) => {
            resolvePromiseRef.current = resolve;
          });
        } else if (method === "wif") {
          console.log("[useBroadcast] WIF: Prompting for private key via dialog...");
          // Don't show toast - the component will show WifKeyDialog instead
          setPendingOperations(operations);
          setNeedsWifKey(true);
          setIsLoading(false);

          return new Promise((resolve) => {
            resolvePromiseRef.current = resolve;
          });
        } else if (method === "hiveauth") {
          console.error("[useBroadcast] ERROR: HiveAuth not implemented");
          toast.error("Not supported", "HiveAuth signing not implemented yet");
          result = { success: false, error: "HiveAuth transaction signing not implemented. Please use Keychain or provide WIF key." };
        } else {
          console.error("[useBroadcast] ERROR: Unknown login method:", user.loginMethod);
          toast.error("Unknown method", `Login method '${user.loginMethod}' not supported`);
          result = { success: false, error: `Unknown login method: ${user.loginMethod}` };
        }

        console.log("========================================");
        console.log("[useBroadcast] BROADCAST RESULT:", result.success ? "SUCCESS" : "FAILED");
        console.log("[useBroadcast] Transaction ID:", result.txId || "N/A");
        console.log("[useBroadcast] Error:", result.error || "None");
        console.log("========================================");

        if (!result.success && result.error) {
          setError(result.error);
        }

        return result;
      } finally {
        if (!needsWifKey && !needsHBAuthPassword) {
          setIsLoading(false);
        }
      }
    },
    [user, broadcastViaKeychain, broadcastViaPeakVault, needsWifKey, needsHBAuthPassword, observe, keyType, toast]
  );

  const confirmWithWifKey = useCallback(async (): Promise<BroadcastResult> => {
    if (!pendingOperations || !wifKey) {
      const result = { success: false, error: "No pending operations or WIF key" };
      if (resolvePromiseRef.current) resolvePromiseRef.current(result);
      return result;
    }

    setIsLoading(true);
    setError(null);

    const result = await broadcastViaWif(pendingOperations, wifKey, observe);

    // Clean up
    setNeedsWifKey(false);
    setWifKey("");
    setPendingOperations(null);
    setIsLoading(false);

    if (!result.success && result.error) {
      setError(result.error);
    }

    if (resolvePromiseRef.current) {
      resolvePromiseRef.current(result);
      resolvePromiseRef.current = null;
    }

    return result;
  }, [pendingOperations, wifKey, broadcastViaWif, observe]);

  const cancelWifKeyPrompt = useCallback(() => {
    setNeedsWifKey(false);
    setWifKey("");
    setPendingOperations(null);
    setIsLoading(false);

    if (resolvePromiseRef.current) {
      resolvePromiseRef.current({ success: false, error: "Cancelled by user" });
      resolvePromiseRef.current = null;
    }
  }, []);

  // HB-Auth password confirmation
  const confirmWithHBAuthPassword = useCallback(async (): Promise<BroadcastResult> => {
    if (!pendingOperations || !hbAuthPassword) {
      const result = { success: false, error: "No pending operations or password" };
      if (resolvePromiseRef.current) resolvePromiseRef.current(result);
      return result;
    }

    setIsLoading(true);
    setError(null);

    const result = await broadcastViaHBAuth(pendingOperations, hbAuthPassword, observe);

    // Clean up
    setNeedsHBAuthPassword(false);
    setHBAuthPassword("");
    setPendingOperations(null);
    setIsLoading(false);

    if (!result.success && result.error) {
      setError(result.error);
    }

    if (resolvePromiseRef.current) {
      resolvePromiseRef.current(result);
      resolvePromiseRef.current = null;
    }

    return result;
  }, [pendingOperations, hbAuthPassword, broadcastViaHBAuth, observe]);

  const cancelHBAuthPasswordPrompt = useCallback(() => {
    setNeedsHBAuthPassword(false);
    setHBAuthPassword("");
    setPendingOperations(null);
    setIsLoading(false);

    if (resolvePromiseRef.current) {
      resolvePromiseRef.current({ success: false, error: "Cancelled by user" });
      resolvePromiseRef.current = null;
    }
  }, []);

  return {
    broadcast,
    isLoading,
    error,
    needsWifKey,
    setWifKey,
    confirmWithWifKey,
    cancelWifKeyPrompt,
    needsHBAuthPassword,
    setHBAuthPassword,
    confirmWithHBAuthPassword,
    cancelHBAuthPasswordPrompt,
  };
}
