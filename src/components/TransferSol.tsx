import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  createTransferTransaction,
  getExplorerUrl,
  parseInputToLamports,
  TransactionError,
} from "@/lib/solana";

export default function TransferSol() {
  const { publicKey, wallet, connected, connection, network, refreshBalance } =
    useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation states
  const [recipientError, setRecipientError] = useState("");
  const [amountError, setAmountError] = useState("");

  // Validate the recipient address
  const validateRecipient = (value: string) => {
    if (!value.trim()) {
      setRecipientError("Recipient address is required");
      return false;
    }

    try {
      // Simple validation - Solana addresses are 32-44 chars
      if (value.length < 32 || value.length > 44) {
        setRecipientError("Invalid Solana address format");
        return false;
      }
      setRecipientError("");
      return true;
    } catch (error) {
      setRecipientError("Invalid Solana address");
      return false;
    }
  };

  // Validate the amount
  const validateAmount = (value: string) => {
    if (!value) {
      setAmountError("Amount is required");
      return false;
    }

    const floatValue = parseFloat(value);
    if (isNaN(floatValue)) {
      setAmountError("Amount must be a number");
      return false;
    }

    if (floatValue <= 0) {
      setAmountError("Amount must be greater than 0");
      return false;
    }

    setAmountError("");
    return true;
  };

  // Handle transfer
  const handleTransfer = async () => {
    if (!connected || !publicKey || !wallet) {
      toast.warning("Not Connected", {
        description: "Please connect your wallet first",
      });
      return;
    }

    // Validate inputs
    const isRecipientValid = validateRecipient(recipient);
    const isAmountValid = validateAmount(amount);

    if (!isRecipientValid || !isAmountValid) {
      return;
    }

    setLoading(true);

    try {
      // Convert amount to lamports
      const lamports = parseInputToLamports(amount);

      // Create transaction
      const transaction = await createTransferTransaction(
        connection,
        publicKey,
        recipient,
        lamports
      );

      // Sign transaction
      const signedTransaction = await wallet.signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      // Show success toast with explorer link
      toast.success("Transfer Successful", {
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

      // Reset form
      setRecipient("");
      setAmount("");

      // Refresh balance
      refreshBalance();
    } catch (error) {
      console.error("Transfer error:", error);

      // Show detailed error message
      let errorMessage = "Failed to complete transfer";

      if (error instanceof TransactionError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error("Transfer Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-card/50 border border-border/50 shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl">Transfer SOL</CardTitle>
        <CardDescription>Send SOL to another wallet address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="Enter Solana address"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              if (recipientError) validateRecipient(e.target.value);
            }}
            onBlur={(e) => validateRecipient(e.target.value)}
            disabled={loading || !connected}
            className={
              recipientError ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {recipientError && (
            <p className="text-xs text-red-500 mt-1">{recipientError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            step="0.000000001"
            min="0"
            placeholder="0.0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (amountError) validateAmount(e.target.value);
            }}
            onBlur={(e) => validateAmount(e.target.value)}
            disabled={loading || !connected}
            className={
              amountError ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {amountError && (
            <p className="text-xs text-red-500 mt-1">{amountError}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTransfer}
          disabled={loading || !connected || !recipient || !amount}
          className="w-full bg-solana hover:bg-solana-dark transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Send SOL</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
