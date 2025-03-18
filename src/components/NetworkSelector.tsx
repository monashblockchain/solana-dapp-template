import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/useWallet";
import { SolanaNetwork } from "@/lib/solana";
import { ChevronDown, Globe } from "lucide-react";

const NETWORK_LABELS: Record<SolanaNetwork, string> = {
  mainnet: "Mainnet",
  devnet: "Devnet",
  testnet: "Testnet",
};

export default function NetworkSelector() {
  const { network, setNetwork } = useWallet();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-secondary/50"
        >
          <Globe className="h-3.5 w-3.5" />
          {NETWORK_LABELS[network]}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 animate-in fade-in slide-in-from-top-5"
      >
        {Object.entries(NETWORK_LABELS).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setNetwork(key as SolanaNetwork)}
            className={`cursor-pointer ${
              network === key ? "bg-secondary" : ""
            }`}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
