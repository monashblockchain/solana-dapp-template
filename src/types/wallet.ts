import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { SolanaNetwork } from "@/lib/solana";

// Define wallet adapter interface
export interface WalletAdapter {
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}

// Define WalletContext state
export interface WalletContextState {
  wallet: WalletAdapter | null;
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  network: SolanaNetwork;
  balance: number | null;
  connection: Connection;
  loading: boolean;
  setNetwork: (network: SolanaNetwork) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

// Add type definition to window object for Phantom wallet
declare global {
  interface Window {
    solana?: WalletAdapter;
  }
}
