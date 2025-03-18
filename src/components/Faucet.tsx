import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { ArrowRight, Droplet, Loader2 } from "lucide-react";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { getExplorerUrl } from "@/lib/solana";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Faucet() {
  const { publicKey, connected, network, refreshBalance } = useWallet();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Create a new connection for the faucet
  const connection = new Connection(
    clusterApiUrl(network === "devnet" ? "devnet" : "testnet"),
    "confirmed"
  );

  // Properly request airdrop
  const requestAirdrop = async () => {
    if (!connected || !publicKey) {
      toast.error("Not Connected", {
        description: "Please connect your wallet first",
      });
      return;
    }

    setLoading(true);

    try {
      // Fixed amount for devnet/testnet - 1 SOL
      const lamports = 1 * LAMPORTS_PER_SOL;

      // Get airdrop signature
      const signature = await connection.requestAirdrop(publicKey, lamports);

      // Confirm transaction with latest blockhash
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );

      // Show success toast with explorer link
      toast.success("Airdrop Successful", {
        description: (
          <a
            href={getExplorerUrl(signature, network)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline flex items-center"
          >
            View on Explorer <ArrowRight className="ml-1 h-3 w-3" />
          </a>
        ),
      });

      // Refresh balance
      refreshBalance();

      // Set cooldown
      setCooldown(true);
      setCooldownTime(15);

      // Start cooldown timer
      const timer = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setCooldown(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Airdrop error:", error);

      let errorMessage = "Failed to request SOL from faucet";

      if (error instanceof Error) {
        // Detect rate limit errors
        if (
          error.message.includes("429") ||
          error.message.includes("rate limit")
        ) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error("Airdrop Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 dark:bg-black/80 border border-slate-200/50 dark:border-slate-800/50 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-display">SOL Faucet</CardTitle>
          <Badge
            variant="outline"
            className="bg-solana/10 text-solana-dark border-0"
          >
            {network.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>
          {network === "mainnet"
            ? "Faucet not available on mainnet"
            : `Request test SOL for ${network}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-4 text-center">
          <Droplet className="h-12 w-12 mx-auto mb-4 text-solana animate-pulse-soft" />
          <p className="text-sm text-muted-foreground">
            {network === "mainnet"
              ? "This feature is only available on devnet or testnet."
              : "Get 1 SOL for testing your applications. Limited to one request every 15 seconds."}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={requestAirdrop}
          disabled={loading || cooldown || !connected || network === "mainnet"}
          className="w-full bg-solana hover:bg-solana-dark transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : cooldown ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cooldown ({cooldownTime}s)
            </>
          ) : (
            <>
              <Droplet className="mr-2 h-4 w-4" />
              Request 1 SOL
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
