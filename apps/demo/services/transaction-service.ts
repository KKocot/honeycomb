"use client";

import type { IHiveChainInterface, ITransaction } from "@hiveio/wax";
import type { IWorkerBee } from "@hiveio/workerbee";

export interface TransactionOptions {
  observe?: boolean;
}

export interface TransactionBroadcastResult {
  transactionId: string;
}

/**
 * TransactionService - handles blockchain transaction broadcasting with optional observation
 * Similar to Denser's TransactionService pattern
 */
export class TransactionService {
  private chain: IHiveChainInterface | null = null;
  private bot: IWorkerBee<IHiveChainInterface | undefined> | null = null;
  private observedTransactionsCounter = 0;

  setChain(chain: IHiveChainInterface) {
    console.log("[TransactionService] Chain set successfully");
    this.chain = chain;
  }

  getChain(): IHiveChainInterface | null {
    return this.chain;
  }

  /**
   * Broadcast transaction without waiting for blockchain confirmation.
   * Resolves immediately after sending to API server.
   */
  async broadcastTransaction(txBuilder: ITransaction): Promise<TransactionBroadcastResult> {
    console.log("[TransactionService:broadcast] Starting simple broadcast...");

    if (!this.chain) {
      console.error("[TransactionService:broadcast] ERROR: Chain not initialized");
      throw new Error("Chain not initialized");
    }

    const transactionId = txBuilder.id;
    console.log("[TransactionService:broadcast] Transaction ID:", transactionId);
    console.log("[TransactionService:broadcast] Sending to blockchain...");

    await this.chain.broadcast(txBuilder);

    console.log("[TransactionService:broadcast] SUCCESS: Transaction sent!");
    return { transactionId };
  }

  /**
   * Broadcast transaction AND wait for it to be confirmed on blockchain.
   * Uses WorkerBee block scanner to observe when transaction is included in a block.
   */
  async broadcastAndObserveTransaction(
    txBuilder: ITransaction
  ): Promise<TransactionBroadcastResult> {
    console.log("[TransactionService:broadcastAndObserve] Starting broadcast with WorkerBee observation...");

    if (!this.chain) {
      console.error("[TransactionService:broadcastAndObserve] ERROR: Chain not initialized");
      throw new Error("Chain not initialized");
    }

    try {
      // Create WorkerBee bot if needed
      if (!this.bot) {
        console.log("[TransactionService:broadcastAndObserve] Creating WorkerBee bot...");
        const WorkerBeeModule = await import("@hiveio/workerbee");
        const WorkerBee = WorkerBeeModule.default;
        this.bot = new WorkerBee({ explicitChain: this.chain });
        console.log("[TransactionService:broadcastAndObserve] WorkerBee bot created");
      }

      // Start bot on first transaction
      if (this.observedTransactionsCounter++ === 0) {
        console.log("[TransactionService:broadcastAndObserve] Starting WorkerBee bot...");
        this.bot.start();
        console.log("[TransactionService:broadcastAndObserve] WorkerBee bot started");
      }

      const transactionId = txBuilder.id;
      console.log("[TransactionService:broadcastAndObserve] Transaction ID:", transactionId);
      console.log("[TransactionService:broadcastAndObserve] Broadcasting and waiting for block inclusion...");

      const startTime = Date.now();

      // Broadcast and wait for confirmation
      await this.bot.broadcast(txBuilder, {
        expireInMs: 10000,
      });

      const elapsed = Date.now() - startTime;
      console.log("[TransactionService:broadcastAndObserve] SUCCESS: Confirmed in", elapsed, "ms");

      // Small delay to ensure UI is ready for update
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { transactionId };
    } catch (error) {
      console.error("[TransactionService:broadcastAndObserve] ERROR:", error);
      throw error;
    } finally {
      // Stop and destroy bot when last transaction completes
      if (--this.observedTransactionsCounter === 0) {
        if (this.bot) {
          console.log("[TransactionService:broadcastAndObserve] Stopping WorkerBee bot...");
          this.bot.stop();
        }
        console.log("[TransactionService:broadcastAndObserve] Destroying WorkerBee bot");
        this.bot = null;
      }
    }
  }

  /**
   * Observe an already-broadcast transaction by polling the blockchain.
   * For Keychain/PeakVault, they handle signing+broadcasting internally,
   * so we only observe the transaction after they broadcast.
   */
  async observeTransaction(transactionId: string): Promise<void> {
    console.log("[TransactionService:observe] Starting observation for txId:", transactionId);

    // Wait for transaction to appear in a block (max 15 seconds)
    const startTime = Date.now();
    const maxWaitTime = 15000;
    let attempt = 0;

    while (Date.now() - startTime < maxWaitTime) {
      attempt++;
      const elapsed = Date.now() - startTime;
      console.log(`[TransactionService:observe] Attempt ${attempt}, elapsed: ${elapsed}ms`);

      try {
        // Check if transaction exists in blockchain using condenser_api
        const response = await fetch("https://api.openhive.network", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_transaction",
            params: [transactionId],
            id: 1,
          }),
        });

        const data = await response.json();

        // If result is not null/undefined and has transaction data, it's confirmed
        if (data.result && data.result.transaction_id) {
          console.log("[TransactionService:observe] SUCCESS: Transaction found in block!");
          console.log("[TransactionService:observe] Block num:", data.result.block_num);
          console.log("[TransactionService:observe] Total time:", Date.now() - startTime, "ms");
          return;
        }

        console.log("[TransactionService:observe] Transaction not yet in block, waiting...");
      } catch (err) {
        // Transaction not found yet, keep waiting
        console.log("[TransactionService:observe] API error (will retry):", err);
      }

      // Wait 1 second before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.error("[TransactionService:observe] TIMEOUT: Transaction not found after", maxWaitTime, "ms");
    throw new Error("Transaction not confirmed within timeout");
  }
}

// Singleton instance
export const transactionService = new TransactionService();
