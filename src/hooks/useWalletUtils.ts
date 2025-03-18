import { useState, useCallback } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toast } from "sonner";

export function useWalletUtils() {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Function to refresh wallet balance
  const refreshBalance = useCallback(
    async (publicKey: PublicKey | null, connection: Connection) => {
      if (!publicKey || !connection) return;

      try {
        setLoading(true);
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.error("Error", {
          description: "Failed to fetch wallet balance",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Connect wallet
  const connect = useCallback(
    async (wallet: any) => {
      if (!wallet) {
        toast.error("Wallet not found", {
          description: "Please install Phantom wallet extension",
        });
        return;
      }

      try {
        await wallet.connect();
      } catch (error) {
        console.error("Connection error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("Connection Failed", {
          description: errorMessage,
        });
        throw error;
      }
    },
    [toast]
  );

  // Disconnect wallet
  const disconnect = useCallback(
    async (wallet: any) => {
      if (!wallet) return;

      try {
        await wallet.disconnect();
      } catch (error) {
        console.error("Disconnect error:", error);
        toast.error("Disconnect Failed", {
          description: "Failed to disconnect wallet",
        });
        throw error;
      }
    },
    [toast]
  );

  return {
    refreshBalance,
    connect,
    disconnect,
    loading,
    balance,
    setBalance,
    setLoading,
  };
}
