"use client";

import { useState, useCallback, useRef } from "react";
import {
  HiveLoginResult,
  HiveAuthError,
  KeyType,
  createAuthError,
  mapErrorToAuthError,
} from "@/types/auth";

/**
 * HiveAuth authentication states
 */
export type HiveAuthState =
  | "idle"
  | "connecting"
  | "waiting_for_scan"
  | "waiting_for_approval"
  | "success"
  | "error";

/**
 * Return type for HiveAuth hook
 */
export interface UseHiveAuthReturn {
  /** Current state of the authentication flow */
  state: HiveAuthState;
  /** Whether auth is in progress */
  isAuthenticating: boolean;
  /** QR code data to display */
  qrCodeData: string | null;
  /** Current error if any */
  error: HiveAuthError | null;
  /** Start authentication flow */
  authenticate: (username: string) => Promise<HiveLoginResult>;
  /** Cancel authentication */
  cancel: () => void;
  /** Reset to idle state */
  reset: () => void;
}

// HiveAuth WebSocket configuration
const HIVEAUTH_WS_URL = "wss://hiveauth.arcange.eu";
const HIVEAUTH_APP_NAME = "hive-ui";

/**
 * Headless hook for HiveAuth (mobile QR code) authentication
 *
 * HiveAuth allows users to authenticate using the HiveAuth mobile app
 * by scanning a QR code.
 *
 * @example
 * ```tsx
 * function HiveAuthLogin() {
 *   const { state, qrCodeData, authenticate, cancel, error } = useHiveAuthAuth();
 *
 *   if (state === "waiting_for_scan" && qrCodeData) {
 *     return (
 *       <div>
 *         <QRCode value={qrCodeData} />
 *         <button onClick={cancel}>Cancel</button>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <button onClick={() => authenticate("myusername")}>
 *       Login with HiveAuth
 *     </button>
 *   );
 * }
 * ```
 */
export function useHiveAuthAuth(appName: string = HIVEAUTH_APP_NAME, keyType: KeyType = "posting"): UseHiveAuthReturn {
  const [state, setState] = useState<HiveAuthState>("idle");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [error, setError] = useState<HiveAuthError | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const resolveRef = useRef<((result: HiveLoginResult) => void) | null>(null);
  const rejectRef = useRef<((error: HiveAuthError) => void) | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    resolveRef.current = null;
    rejectRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    cleanup();
    setState("idle");
    setQrCodeData(null);
    setError(null);

    if (rejectRef.current) {
      rejectRef.current(
        createAuthError("USER_REJECTED", "Authentication cancelled by user", undefined, true)
      );
    }
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setState("idle");
    setQrCodeData(null);
    setError(null);
  }, [cleanup]);

  const authenticate = useCallback(
    async (username: string): Promise<HiveLoginResult> => {
      if (!username.trim()) {
        const err = createAuthError(
          "INVALID_USERNAME",
          "Username is required",
          undefined,
          true
        );
        setError(err);
        throw err;
      }

      setState("connecting");
      setError(null);
      setQrCodeData(null);

      return new Promise<HiveLoginResult>((resolve, reject) => {
        resolveRef.current = resolve;
        rejectRef.current = (err) => {
          setError(err);
          reject(err);
        };

        try {
          // Generate unique auth key
          const authKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const authToken = btoa(JSON.stringify({
            app: appName,
            username: username.toLowerCase(),
            key: authKey,
          }));

          // Create WebSocket connection
          const ws = new WebSocket(HIVEAUTH_WS_URL);
          wsRef.current = ws;

          const timeout = setTimeout(() => {
            if (ws.readyState !== WebSocket.CLOSED) {
              ws.close();
              rejectRef.current?.(
                createAuthError("TIMEOUT", "HiveAuth connection timed out", undefined, true)
              );
            }
          }, 120000); // 2 minute timeout

          ws.onopen = () => {
            // Send auth request
            ws.send(JSON.stringify({
              cmd: "auth_req",
              account: username.toLowerCase(),
              data: {
                app: appName,
                token: authToken,
              },
            }));

            // Generate QR code data
            const qrData = `hiveauth://auth/${authToken}`;
            setQrCodeData(qrData);
            setState("waiting_for_scan");
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);

              if (data.cmd === "auth_wait") {
                setState("waiting_for_approval");
              } else if (data.cmd === "auth_ack") {
                clearTimeout(timeout);
                cleanup();
                setState("success");

                const result: HiveLoginResult = {
                  username: username.toLowerCase(),
                  loginMethod: "hiveauth",
                  keyType,
                };

                resolveRef.current?.(result);
              } else if (data.cmd === "auth_nack" || data.error) {
                clearTimeout(timeout);
                cleanup();
                setState("error");

                rejectRef.current?.(
                  createAuthError(
                    "USER_REJECTED",
                    data.error || "Authentication rejected",
                    undefined,
                    true
                  )
                );
              }
            } catch {
              // Ignore parse errors
            }
          };

          ws.onerror = () => {
            clearTimeout(timeout);
            cleanup();
            setState("error");

            rejectRef.current?.(
              createAuthError("NETWORK_ERROR", "Failed to connect to HiveAuth", undefined, true)
            );
          };

          ws.onclose = () => {
            clearTimeout(timeout);
            // Only set error if we didn't complete successfully
            if (state !== "success" && state !== "error") {
              cleanup();
              setState("error");

              rejectRef.current?.(
                createAuthError("NETWORK_ERROR", "HiveAuth connection closed", undefined, true)
              );
            }
          };
        } catch (err) {
          cleanup();
          setState("error");

          const authError = mapErrorToAuthError(err);
          setError(authError);
          reject(authError);
        }
      });
    },
    [appName, cleanup, state, keyType]
  );

  return {
    state,
    isAuthenticating: state !== "idle" && state !== "success" && state !== "error",
    qrCodeData,
    error,
    authenticate,
    cancel,
    reset,
  };
}
