import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// Custom error types for better error handling
export class SolanaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SolanaError";
  }
}

export class WalletError extends SolanaError {
  constructor(message: string) {
    super(`Wallet Error: ${message}`);
    this.name = "WalletError";
  }
}

export class TransactionError extends SolanaError {
  constructor(message: string) {
    super(`Transaction Error: ${message}`);
    this.name = "TransactionError";
  }
}

// Network constants
export const SOLANA_NETWORKS = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
} as const;

export type SolanaNetwork = keyof typeof SOLANA_NETWORKS;

// Default to devnet for development
export const DEFAULT_NETWORK: SolanaNetwork = "devnet";

// Get connection to Solana network
export const getConnection = (
  network: SolanaNetwork = DEFAULT_NETWORK
): Connection => {
  return new Connection(SOLANA_NETWORKS[network], "confirmed");
};

// Format SOL with proper decimal places
export const formatSolAmount = (lamports: number): string => {
  const sol = lamports / LAMPORTS_PER_SOL;
  return sol.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  });
};

// Parse SOL input to lamports
export const parseInputToLamports = (input: string): number => {
  const solAmount = parseFloat(input);
  if (isNaN(solAmount)) {
    throw new Error("Invalid SOL amount");
  }
  return Math.floor(solAmount * LAMPORTS_PER_SOL);
};

// Format wallet address for display (truncate middle)
export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Get explorer URL for a transaction or address
export const getExplorerUrl = (
  signature: string,
  network: SolanaNetwork = DEFAULT_NETWORK,
  type: "tx" | "address" = "tx"
): string => {
  const baseUrl = "https://explorer.solana.com";
  const networkParam = network === "mainnet" ? "" : `?cluster=${network}`;

  return `${baseUrl}/${type}/${signature}${networkParam}`;
};

// Check if the browser has the Phantom wallet or similar wallet extensions
export const checkForWallets = (): boolean => {
  return !!(typeof window !== "undefined" && window.solana);
};

// Create a SOL transfer transaction
export const createTransferTransaction = async (
  connection: Connection,
  fromPubkey: PublicKey,
  toPubkeyStr: string,
  lamports: number
): Promise<Transaction> => {
  try {
    // Validate recipient address
    let toPubkey: PublicKey;
    try {
      toPubkey = new PublicKey(toPubkeyStr);
    } catch (error) {
      throw new TransactionError("Invalid recipient address");
    }

    // Validate amount
    if (lamports <= 0) {
      throw new TransactionError("Amount must be greater than 0");
    }

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  } catch (error) {
    if (error instanceof TransactionError) {
      throw error;
    }
    throw new TransactionError(
      error instanceof Error ? error.message : "Failed to create transaction"
    );
  }
};
