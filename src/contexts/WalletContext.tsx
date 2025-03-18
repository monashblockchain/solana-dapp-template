import React, { createContext, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaNetwork, DEFAULT_NETWORK, getConnection } from '@/lib/solana';
import { WalletAdapter, WalletContextState } from '@/types/wallet';
import { useWalletUtils } from '@/hooks/useWalletUtils';

// Create context with default values
export const WalletContext = createContext<WalletContextState>({
  wallet: null,
  publicKey: null,
  connected: false,
  connecting: false,
  network: DEFAULT_NETWORK,
  balance: null,
  connection: getConnection(DEFAULT_NETWORK),
  loading: false,
  setNetwork: () => {},
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [network, setNetwork] = useState<SolanaNetwork>(DEFAULT_NETWORK);
  const [connection, setConnection] = useState<Connection>(getConnection(network));

  const {
    refreshBalance: refreshBalanceUtil,
    connect: connectUtil,
    disconnect: disconnectUtil,
    loading,
    balance,
    setBalance,
    setLoading
  } = useWalletUtils();

  // Update connection when network changes
  useEffect(() => {
    setConnection(getConnection(network));
  }, [network]);

  // Check for Phantom provider and set up listeners
  useEffect(() => {
    const checkForPhantom = async () => {
      try {
        // Check if window.solana is available
        if (!window.solana) {
          return;
        }

        // Set wallet adapter to Phantom
        const adapter = window.solana;
        setWallet(adapter);

        // Check if already connected
        if (adapter.isConnected) {
          setConnected(true);
          setPublicKey(adapter.publicKey);
        }

        // Set up event listeners
        adapter.on('connect', (publicKey: PublicKey) => {
          setPublicKey(publicKey);
          setConnected(true);
          setConnecting(false);
        });

        adapter.on('disconnect', () => {
          setPublicKey(null);
          setConnected(false);
          setBalance(null);
        });

        adapter.on('accountChanged', (publicKey: PublicKey | null) => {
          setPublicKey(publicKey);
          setConnected(!!publicKey);
          setBalance(null);
          if (publicKey) {
            refreshWalletBalance();
          }
        });
      } catch (error) {
        console.error('Wallet setup error:', error);
      }
    };

    checkForPhantom();

    // Cleanup listeners
    return () => {
      if (window.solana) {
        window.solana.off('connect');
        window.solana.off('disconnect');
        window.solana.off('accountChanged');
      }
    };
  }, []);

  // Fetch balance when connected or network changes
  useEffect(() => {
    if (connected && publicKey) {
      refreshWalletBalance();
    }
  }, [connected, publicKey, connection]);

  // Wrapper function to call the utility with current state
  const refreshWalletBalance = async () => {
    await refreshBalanceUtil(publicKey, connection);
  };

  // Wrapper for connect with state updates
  const connect = async () => {
    if (connected) return;

    setConnecting(true);
    try {
      await connectUtil(wallet);
    } finally {
      setConnecting(false);
    }
  };

  // Wrapper for disconnect with state updates
  const disconnect = async () => {
    if (!wallet || !connected) return;

    try {
      await disconnectUtil(wallet);
      setPublicKey(null);
      setConnected(false);
      setBalance(null);
    } catch (error) {
      // Error is already handled in the utility
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        publicKey,
        connected,
        connecting,
        network,
        balance,
        connection,
        loading,
        setNetwork,
        connect,
        disconnect,
        refreshBalance: refreshWalletBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
