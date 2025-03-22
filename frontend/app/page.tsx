"use client";

import React, { useEffect, Suspense, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnect } from "@/components/wallet-connect";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingHero } from "@/components/landing-hero";
import { MarketsList } from "@/components/markets-list";
import { BettingInterface } from "@/components/betting-interface";
import { Dashboard } from "@/components/dashboard";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { injected, metaMask } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function MainContent() {
  // Get the tab from URL parameters
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'markets';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Update activeTab when searchParams change
  useEffect(() => {
    const newTab = searchParams.get('tab');
    if (newTab) {
      setActiveTab(newTab);
    }
  }, [searchParams]);
  
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="markets" 
            onClick={() => {
              window.history.pushState({}, '', '/?tab=markets');
            }}
          >
            Active Markets
          </TabsTrigger>
          <TabsTrigger 
            value="bet"
            onClick={() => {
              window.history.pushState({}, '', '/?tab=bet');
            }}
          >
            Place Bet
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio"
            onClick={() => {
              window.history.pushState({}, '', '/?tab=portfolio');
            }}
          >
            Portfolio
          </TabsTrigger>
        </TabsList>
        <TabsContent value="markets" className="space-y-4">
          <MarketsList />
        </TabsContent>
        <TabsContent value="bet" className="space-y-4">
          <BettingInterface />
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const showLanding = searchParams.get('showLanding');
  
  // Add a state to track if user clicked "Start Predicting"
  const [startedPredicting, setStartedPredicting] = useState(false);
  
  const handleConnect = async () => {
    console.log("Handle connect called"); // Debug log
    try {
      // Track if we're already connected before attempting to connect
      const wasConnected = isConnected;
      
      // Set startedPredicting to true to indicate user wants to go to markets
      setStartedPredicting(true);
      
      await connect({
        connector: metaMask()
      });
      
      // Small delay to ensure connection state is updated
      setTimeout(() => {
        // Only redirect if user clicked Start Predicting
        if (startedPredicting && ((!wasConnected && isConnected) || wasConnected)) {
          router.push("/predict?tab=markets");
        }
      }, 500);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Show landing page if not connected, not started predicting, or showLanding is set
  if (!isConnected || !startedPredicting || showLanding === 'true') {
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href={{
                    pathname: '/',
                    query: { showLanding: 'true' }
                  }} 
                  className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                >
                  PredictX
                </Link>
              </motion.div>
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href={{
                  pathname: '/',
                  query: { showLanding: 'true' }
                }} 
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                PredictX
              </Link>
            </motion.div>
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/predict?tab=markets">
                  <Button
                    className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                  >
                    Go to Predictions
                  </Button>
                </Link>
              </motion.div>
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