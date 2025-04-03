"use client";

import TransferSol from "@/components/TransferSol";
import Faucet from "@/components/Faucet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Droplet } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-background via-secondary/80 to-primary/50 overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-200 dark:bg-purple-900/20 blur-3xl opacity-20" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-blue-200 dark:bg-blue-900/20 blur-3xl opacity-20" />
        </div>

        {/* Header */}
        <header className="relative w-full max-w-7xl mx-auto px-4 py-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-solana to-solana-light"></div>
            <h1 className="text-xl font-medium">Solana dApp</h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <WalletMultiButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="relative w-full max-w-5xl mx-auto px-4 py-12 z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Solana dApp Template
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A beautiful, minimalist template for building Solana applications
              with wallet integration, token transfers, and faucet access.
            </p>
          </div>

          <div className="mt-16 animate-slide-up">
            <Tabs defaultValue="transfer" className="w-full max-w-md mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50">
                <TabsTrigger
                  value="transfer"
                  className="data-[state=active]:bg-solana data-[state=active]:text-white"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Transfer
                </TabsTrigger>
                <TabsTrigger
                  value="faucet"
                  className="data-[state=active]:bg-solana data-[state=active]:text-white"
                >
                  <Droplet className="h-4 w-4 mr-2" />
                  Faucet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transfer" className="mt-0">
                <TransferSol />
              </TabsContent>

              <TabsContent value="faucet" className="mt-0">
                <Faucet />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative w-full mx-auto px-4 py-5 mt-12 bg-background/20 backdrop-blur text-center text-sm text-muted-foreground">
          <p>
            Solana dApp Template • Built with Next.js, TailwindCSS and ShadCN
          </p>
        </footer>
      </div>
    </div>
  );
}
