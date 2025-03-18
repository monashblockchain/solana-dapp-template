import { useContext } from "react";
import { WalletContext } from "@/contexts/WalletContext";

export function useWallet() {
  return useContext(WalletContext);
}
