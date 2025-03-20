"use client";

import React, { useEffect, Suspense } from "react";
import { useAccount, useConnect } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnect } from "@/components/wallet-connect";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingHero } from "@/components/landing-hero";
import { MarketsList } from "@/components/markets-list";
import { BettingInterface } from "@/components/betting-interface";
import { Dashboard } from "@/components/dashboard";
import { CreateMarket } from "@/components/create-market";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { injected, metaMask } from "wagmi/connectors";

function MainContent() {
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="markets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="markets">Active Markets</TabsTrigger>
          <TabsTrigger value="bet">Place Bet</TabsTrigger>
          <TabsTrigger value="create">Create Market</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="markets" className="space-y-4">
          <MarketsList />
        </TabsContent>
        <TabsContent value="bet" className="space-y-4">
          <BettingInterface />
        </TabsContent>
        <TabsContent value="create" className="space-y-4">
          <CreateMarket />
        </TabsContent>
        <TabsContent value="portfolio" className="space-y-4">
          <Dashboard />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();
  const { connect, isPending } = useConnect();

  const handleConnect = async () => {
    console.log("Handle connect called"); // Debug log
    try {
      await connect({
        connector: metaMask()
      });
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  if (!isConnected) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="min-h-screen bg-background">
          <motion.header
            className="border-b"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PredictX
              </h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <WalletConnect />
              </div>
            </div>
          </motion.header>
          <main>
            <LandingHero onConnect={handleConnect} />
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-background">
        <motion.header
          className="border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PredictX
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <WalletConnect />
            </div>
          </div>
        </motion.header>

        <main>
          <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading...</div>}>
            <MainContent />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-8 text-center text-red-500">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p>{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Reload
      </button>
    </div>
  );
}