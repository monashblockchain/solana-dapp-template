import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { formatWalletAddress } from "@/lib/solana";
import { Loader2, Wallet, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WalletButton() {
  const {
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
    balance,
    loading,
  } = useWallet();

  // If wallet is connecting, show loading state
  if (connecting) {
    return (
      <Button
        variant="outline"
        size="lg"
        className="relative overflow-hidden group animate-pulse"
        disabled
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // If wallet is connected, show wallet info
  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="relative overflow-hidden group transition-all duration-300 hover:bg-secondary"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {formatWalletAddress(publicKey.toString())}
            <span className="ml-2 px-2 py-0.5 bg-solana/10 text-solana-dark rounded-full text-xs font-medium">
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                `${balance !== null ? balance.toFixed(4) : "0"} SOL`
              )}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 animate-in fade-in slide-in-from-top-5"
        >
          <DropdownMenuItem
            onClick={() => disconnect()}
            className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default state: not connected
  return (
    <Button
      onClick={() => connect()}
      size="lg"
      className="relative overflow-hidden group transition-all duration-300 bg-solana hover:bg-solana-dark cursor-pointer"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Button>
  );
}
