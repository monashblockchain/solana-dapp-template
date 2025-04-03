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
import { ArrowRight, Droplet, Loader2 } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getExplorerUrl } from "@/lib/solana";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export default function Faucet() {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  // Create a new connection for the faucet
  const connection = useConnection().connection;
  const network = WalletAdapterNetwork.Devnet;

  // Properly request airdrop
  const getAirdropOnClick = async () => {
    try {
      if (!publicKey) {
        throw new Error("Wallet is not Connected");
      }
      const [latestBlockhash, signature] = await Promise.all([
        connection.getLatestBlockhash(),
        connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL),
      ]);
      const sigResult = await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );
      if (sigResult) {
        toast.success("Airdrop Successful", {
          description: (
            <a
              href={getExplorerUrl(signature)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline flex items-center"
            >
              View on Explorer <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          ),
        });
      }
    } catch (error) {
      alert("You are Rate limited for Airdrop");
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
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-card/50 border border-border/50 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">SOL Faucet</CardTitle>
          <Badge
            variant="outline"
            className="bg-solana/10 text-solana-light border-0"
          >
            {network.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>{`Request test SOL for ${network}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-4 text-center">
          <Droplet className="h-12 w-12 mx-auto mb-4 text-solana animate-pulse-soft" />
          <p className="text-sm text-muted-foreground">
            Get 1 SOL for testing your applications. Limited to one request
            every 15 seconds
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={getAirdropOnClick}
          disabled={loading || !connected}
          className="w-full bg-solana hover:bg-solana-dark transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
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
