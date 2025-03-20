"use client";

import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { predictionMarketAddress, predictionMarketABI } from "./contracts";

interface Market {
  id: number;
  question: string;
  resolutionTime: bigint;
  resolved: boolean;
  winningOutcome: bigint;
  bettingAsset: string;
  outcomes?: string[];
}

interface Bet {
  user: string;
  amount: bigint;
  outcomeIndex: bigint;
  token: string;
}

export function usePredictionMarket() {
  const { address } = useAccount();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: marketCount } = useReadContract({
    address: predictionMarketAddress,
    abi: predictionMarketABI,
    functionName: "marketCount",
    query: { enabled: false }
  });

  const { writeContractAsync: createMarket } = useWriteContract();
  const { writeContractAsync: placeBet } = useWriteContract();

  // Simplified fetch markets function
  const fetchMarkets = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const dummyMarkets: Market[] = [
        {
          id: 1,
          question: "Will ETH reach $5000 in 2024?",
          resolutionTime: BigInt(1735689600), // Dec 31, 2024
          resolved: false,
          winningOutcome: BigInt(0),
          bettingAsset: "0x0000000000000000000000000000000000000000",
          outcomes: ["Yes", "No"]
        }
      ];
      setMarkets(dummyMarkets);
    } catch (error) {
      console.error("Error fetching markets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch markets on mount
  useEffect(() => {
    fetchMarkets();
  }, []);

  const handleCreateMarket = async (
    question: string,
    resolutionTime: bigint,
    bettingAsset: string
  ) => {
    try {
      await createMarket({
        address: predictionMarketAddress,
        abi: predictionMarketABI,
        functionName: "createMarket",
        args: [question, ["Yes", "No"], resolutionTime, bettingAsset]
      });
      await fetchMarkets();
    } catch (error) {
      console.error("Error creating market:", error);
      throw error;
    }
  };

  const handlePlaceBet = async (
    marketId: number,
    outcomeIndex: number,
    amount: string,
    token: string
  ) => {
    try {
      await placeBet({
        address: predictionMarketAddress,
        abi: predictionMarketABI,
        functionName: "placeBet",
        args: [BigInt(marketId), BigInt(outcomeIndex), BigInt(amount), token],
        value: token === "0x0000000000000000000000000000000000000000" ? BigInt(amount) : undefined
      });
      await fetchMarkets();
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  };

  return {
    address,
    markets,
    isLoading,
    createMarket: handleCreateMarket,
    placeBet: handlePlaceBet
  };
}