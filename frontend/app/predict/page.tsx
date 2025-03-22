"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketsList } from "@/components/markets-list";
import { BettingInterface } from "@/components/betting-interface";
import { CreateMarket } from "@/components/create-market";
import { Dashboard } from "@/components/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { redirect, useSearchParams } from "next/navigation";

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
    <AnimatePresence mode="wait">
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="markets">Active Markets</TabsTrigger>
            <TabsTrigger value="bet">Place Bet</TabsTrigger>
            <TabsTrigger value="create">Create Market</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          <TabsContent value="markets" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MarketsList />
            </motion.div>
          </TabsContent>
          <TabsContent value="bet" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BettingInterface />
            </motion.div>
          </TabsContent>
          <TabsContent value="create" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CreateMarket />
            </motion.div>
          </TabsContent>
          <TabsContent value="portfolio" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Dashboard />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AnimatePresence>
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

export default function PredictPage() {
  const { isConnected } = useAccount();

  // Redirect to home page if not connected
  if (!isConnected) {
    redirect("/");
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-background">
        <main>
          <Suspense fallback={
            <div className="container mx-auto px-4 py-8 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-lg font-medium"
              >
                Loading...
              </motion.div>
            </div>
          }>
            <MainContent />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
} 