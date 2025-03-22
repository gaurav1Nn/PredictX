"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePredictionMarket } from "@/lib/usePredictionMarket";
import { parseEther } from "viem";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, Microscope, AlertTriangle, Info, ArrowRight, Wallet } from "lucide-react";

// Market interface with description property
interface Market {
  id: number;
  question: string;
  resolutionTime: bigint;
  resolved: boolean;
  winningOutcome: bigint;
  bettingAsset: string;
  outcomes: string[];
  description: string;
  category: string;
  source: string;
  volume: string;
  odds: {
    yes: number;
    no: number;
  };
}

// Asset icons (could be replaced with actual SVG icons)
const AssetIcons = {
  ETH: () => <span className="text-blue-500">Ξ</span>,
  USDC: () => <span className="text-green-500">$</span>,
  ZETA: () => <span className="text-purple-500">Z</span>
};

export const BettingInterface = React.memo(function BettingInterface() {
  const searchParams = useSearchParams();
  const initialMarketId = searchParams.get('marketId');
  
  const [selectedMarket, setSelectedMarket] = useState<string>(initialMarketId || "");
  const [outcomeIndex, setOutcomeIndex] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<string>("ETH");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { markets, placeBet, isLoading } = usePredictionMarket();

  // Update market selection if marketId is passed via URL
  useEffect(() => {
    if (initialMarketId && markets.length > 0) {
      // Ensure the marketId exists in the available markets
      const marketExists = markets.some(m => m.id.toString() === initialMarketId);
      if (marketExists) {
        setSelectedMarket(initialMarketId);
        
        // Also set the default asset for this market
        const selectedMarketData = markets.find(m => m.id.toString() === initialMarketId);
        if (selectedMarketData && selectedMarketData.bettingAsset) {
          setSelectedAsset(selectedMarketData.bettingAsset);
        }
      }
    }
  }, [initialMarketId, markets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarket || !outcomeIndex || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const market = markets.find((m) => m.id === parseInt(selectedMarket));
      if (!market) {
        alert("Selected market not found.");
        return;
      }

      // Use the asset chosen by the user
      const bettingAsset = selectedAsset;
      const amountInWei = parseEther(amount).toString();
      
      await placeBet(
        parseInt(selectedMarket),
        parseInt(outcomeIndex),
        amountInWei,
        bettingAsset
      );
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedMarket("");
        setOutcomeIndex("");
        setAmount("");
        setSelectedAsset("ETH");
      }, 3000);
    } catch (error) {
      console.error("Failed to place bet:", error);
      alert("Failed to place bet. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current market details
  const currentMarket = selectedMarket 
    ? markets.find(m => m.id === parseInt(selectedMarket)) 
    : null;

  if (isLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Loading markets...</p>
        </div>
      </motion.div>
    );
  }

  // Prepare the assets for selection
  const availableAssets = ["ETH", "USDC", "ZETA"];

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-100 dark:bg-green-900 p-6 rounded-lg text-center"
        >
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">Bet Placed Successfully!</h3>
          <p className="text-green-700 dark:text-green-300 mb-4">Your prediction has been recorded on the blockchain.</p>
          <p className="text-sm text-green-600 dark:text-green-400">You'll be able to see your position in your portfolio.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Place a Prediction</span>
                <Badge className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
                  Multi-Asset Betting
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <label htmlFor="market" className="block text-sm font-medium">
                    Select a Market
                  </label>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger className="h-12 border-primary/20 hover:border-primary">
                      <SelectValue placeholder="Choose a prediction market" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {markets.map((market) => (
                        <SelectItem key={market.id} value={market.id.toString()} className="py-3 hover:bg-muted/80">
                          <div className="flex flex-col">
                            <span className="font-medium">{market.question}</span>
                            <span className="text-xs text-muted-foreground mt-1">
                              Resolution: {new Date(Number(market.resolutionTime) * 1000).toLocaleDateString()}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentMarket && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-muted/30 rounded-lg border border-muted space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium">Market Details</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {currentMarket.description || currentMarket.question}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="font-medium">Category:</span>{" "}
                        <Badge variant="outline" className="text-xs">
                          {currentMarket.category}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="font-medium">Asset:</span>{" "}
                        <span>{currentMarket.bettingAsset}</span>
                      </div>
                      
                      {currentMarket.odds && (
                        <div>
                          <span className="font-medium">Current Odds:</span>{" "}
                          <span>Yes: {currentMarket.odds.yes}% / No: {currentMarket.odds.no}%</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {selectedMarket && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <label htmlFor="outcome" className="block text-sm font-medium">
                        Your Prediction
                      </label>
                      <Select value={outcomeIndex} onValueChange={setOutcomeIndex}>
                        <SelectTrigger className="h-12 border-primary/20 hover:border-primary">
                          <SelectValue placeholder="What's your prediction?" />
                        </SelectTrigger>
                        <SelectContent>
                          {markets
                            .find((m) => m.id === parseInt(selectedMarket))
                            ?.outcomes?.map((outcome: string, index: number) => (
                              <SelectItem key={index} value={index.toString()} className="py-2 hover:bg-muted/80">
                                {outcome}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label htmlFor="asset" className="block text-sm font-medium">
                      Betting Asset
                    </label>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger className="h-12 border-primary/20 hover:border-primary">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {selectedAsset && AssetIcons[selectedAsset as keyof typeof AssetIcons]?.()}
                            {selectedAsset}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableAssets.map(asset => (
                          <SelectItem key={asset} value={asset} className="py-2 hover:bg-muted/80">
                            <div className="flex items-center gap-2">
                              {AssetIcons[asset as keyof typeof AssetIcons]?.()}
                              {asset}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      No bridging needed! Bet with your preferred asset.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="amount" className="block text-sm font-medium">
                      Amount
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        step="0.01"
                        className="h-12 pl-8 border-primary/20 hover:border-primary focus-visible:ring-primary/20"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {selectedAsset && AssetIcons[selectedAsset as keyof typeof AssetIcons]?.()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="overflow-hidden rounded-lg shadow-lg"
                  >
                    <Button 
                      type="submit" 
                      disabled={!selectedMarket || !outcomeIndex || !amount || isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">Processing</span>
                          <div className="h-5 w-5 animate-spin rounded-full border-3 border-solid border-current border-r-transparent"></div>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Wallet className="h-5 w-5" />
                          <span>Place Your Bet</span>
                        </span>
                      )}
                    </Button>
                  </motion.div>
                  
                  {selectedMarket && outcomeIndex && amount && (
                    <div className="mt-4 text-sm text-center text-muted-foreground">
                      You're predicting "{markets.find(m => m.id === parseInt(selectedMarket))?.outcomes?.[parseInt(outcomeIndex)]}" 
                      on "{markets.find(m => m.id === parseInt(selectedMarket))?.question}".
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="bg-muted/20 p-4 rounded-lg border border-muted">
            <h3 className="text-sm font-medium mb-2">How Multi-Asset Betting Works</h3>
            <p className="text-sm text-muted-foreground">
              Thanks to ZetaChain's cross-chain interoperability, you can place bets using ETH, USDC, ZETA, and more without manually bridging your assets.
              The system automatically handles the conversion, making your betting experience seamless across multiple blockchains.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});